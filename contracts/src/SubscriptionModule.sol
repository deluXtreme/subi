// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Enum} from "lib/safe-smart-account/contracts/common/Enum.sol";
import {Module} from "lib/zodiac/contracts/core/Module.sol";
import {Guardable} from "lib/zodiac/contracts/guard/Guardable.sol";
import {IAvatar} from "lib/zodiac/contracts/interfaces/IAvatar.sol";
import {IGuard} from "lib/zodiac/contracts/interfaces/IGuard.sol";

contract SubscriptionModule is Module, Guardable {
    struct Subscription {
        address recipient;
        uint256 amount;
        uint256 lastRedeemed;
        uint256 frequency;
    }

    uint256 public subscriptionCounter;
    mapping(uint256 => Subscription) public subscriptions;

    event SubscriptionCreated(address indexed recipient, uint256 indexed subId, uint256 amount, uint256 frequency);
    event Redeemed(uint256 indexed subId, address indexed recipient, uint256 amount);

    error NotRedeemable();
    /// @notice Thrown when the transaction cannot execute
    error CannotExec();

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

    // TODO: Might be more convenient to redeem by recipient.
    function redeemPayment(uint256 subId) external {
        Subscription memory sub = subscriptions[subId];
        if (sub.lastRedeemed + sub.frequency > block.timestamp) {
            revert NotRedeemable();
        }
        sub.lastRedeemed = block.timestamp;
        subscriptions[subId] = sub;
        // TODO: This Transaction only Sends ETH. We need to send Circles!
        require(exec(sub.recipient, sub.amount, "", Enum.Operation.DelegateCall), CannotExec());
        emit Redeemed(subId, sub.recipient, sub.amount);
    }

    /// @notice Executes the transaction from module with the guard checks
    function exec(address to, uint256 value, bytes memory data, Enum.Operation operation)
        internal
        override
        returns (bool)
    {
        IGuard(guard).checkTransaction(to, value, data, operation, 0, 0, 0, address(0), payable(0), "", msg.sender);

        (bytes memory txData,,) = abi.decode(data, (bytes, address, address));

        return IAvatar(target).execTransactionFromModule(to, value, txData, operation);
    }
}
