// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Enum} from "lib/safe-smart-account/contracts/common/Enum.sol";
import {Module} from "lib/zodiac/contracts/core/Module.sol";
import {IAvatar} from "lib/zodiac/contracts/interfaces/IAvatar.sol";
import {TypeDefinitions} from "lib/circles-contracts-v2/src/hub/TypeDefinitions.sol";
import {IHubV2} from "lib/circles-contracts-v2/src/hub/IHub.sol";
import {ByteSlice} from "src/libraries/ByteSlice.sol";

contract SubscriptionModule is Module {
    using ByteSlice for bytes;

    struct Subscription {
        address recipient;
        uint256 amount;
        uint256 lastRedeemed;
        uint256 frequency;
    }

    address public constant HUB_ADDRESS = 0xc12C1E50ABB450d6205Ea2C3Fa861b3B834d13e8;

    uint256 public subscriptionCounter;
    mapping(uint256 => Subscription) public subscriptions;

    event SubscriptionCreated(address indexed recipient, uint256 indexed subId, uint256 amount, uint256 frequency);
    event Redeemed(uint256 indexed subId, address indexed recipient, uint256 amount);

    error NotRedeemable();
    /// @notice Thrown when the transaction cannot execute
    error CannotExec();
    error InvalidRecipient();
    error InvalidAmount();

    constructor(address _owner, address _avatar, address _target) {
        bytes memory initParams = abi.encode(_owner, _avatar, _target);
        setUp(initParams);
    }

    function setUp(bytes memory initParams) public override initializer {
        (address _owner, address _avatar, address _target) = abi.decode(initParams, (address, address, address));

        __Ownable_init(msg.sender);

        setAvatar(_avatar);
        setTarget(_target);

        transferOwnership(_owner);
    }

    function subscribe(address recipient, uint256 amount, uint256 frequency) external onlyOwner {
        subscriptionCounter++;
        // Initial lastRedeemed is 0 so first payment is immediately redeemable.
        subscriptions[subscriptionCounter] = Subscription(recipient, amount, 0, frequency);
        emit SubscriptionCreated(recipient, subscriptionCounter, amount, frequency);
    }

    function _extractRecipient(bytes calldata coordinates, address[] calldata flowVertices)
        internal
        pure
        returns (address)
    {
        uint256 length = coordinates.length;
        return flowVertices[coordinates.toInt(length - 2, length - 1)];
    }

    function _extractAmount(TypeDefinitions.FlowEdge[] calldata flow) internal pure returns (uint256 amount) {
        for (uint256 i = 0; i < flow.length; i++) {
            if (flow[i].streamSinkId == 1) {
                amount += flow[i].amount;
            }
        }
    }

    // TODO: Might be more convenient to redeem by recipient.
    function redeemPayment(
        uint256 subId,
        address[] calldata flowVertices,
        TypeDefinitions.FlowEdge[] calldata flow,
        TypeDefinitions.Stream[] calldata streams,
        bytes calldata packedCoordinates
    ) external {
        Subscription memory sub = subscriptions[subId];
        if (sub.lastRedeemed + sub.frequency > block.timestamp) {
            revert NotRedeemable();
        }

        if (_extractRecipient(packedCoordinates, flowVertices) != sub.recipient) {
            revert InvalidRecipient();
        }
        // Exact amount of the subscription must be redeemed.
        if (_extractAmount(flow) != sub.amount) {
            revert InvalidAmount();
        }

        sub.lastRedeemed = block.timestamp;
        subscriptions[subId] = sub;

        require(
            exec(
                HUB_ADDRESS,
                0,
                abi.encodeWithSelector(
                    IHubV2.operateFlowMatrix.selector, flowVertices, flow, streams, packedCoordinates
                ),
                Enum.Operation.DelegateCall
            ),
            CannotExec()
        );
        emit Redeemed(subId, sub.recipient, sub.amount);
    }

    /// @notice Executes the transaction from module with the guard checks
    function exec(address to, uint256 value, bytes memory data, Enum.Operation operation)
        internal
        override
        returns (bool)
    {
        (bytes memory txData,,) = abi.decode(data, (bytes, address, address));

        return IAvatar(target).execTransactionFromModule(to, value, txData, operation);
    }
}
