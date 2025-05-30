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
        uint256 nextRedeemable;
    }

    uint256 public subscriptionCounter;
    mapping(uint256 => Subscription) public subscriptions;

    event SubscriptionCreated(address indexed recipient, uint256 indexed subId);
    event Redeemed(uint256 indexed subId);

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
        // Initial last & next redeemable are 0 (so first payment is immediately redeemable)
        subscriptions[subscriptionCounter] = Subscription(recipient, amount, 0, 0);
        emit SubscriptionCreated(recipient, subscriptionCounter);
    }

    function redeemPayment(uint256 subId) external {
        // TODO:
        // 1. Retrieve subscription
        // 2. check redeemable
        // 3. exec amount
        // 4. emit Redeemd
        emit Redeemed(subId);
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
