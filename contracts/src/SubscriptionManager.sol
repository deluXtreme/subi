// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ISubscriptionModule} from "src/ISubscriptionModule.sol";
import {EnumerableSetLib} from "@solady/src/utils/EnumerableSetLib.sol";
import {TypeDefinitions} from "@circles/src/hub/TypeDefinitions.sol";

contract SubscriptionManager {
    /*//////////////////////////////////////////////////////////////
                               LIBRARIES
    //////////////////////////////////////////////////////////////*/

    using EnumerableSetLib for EnumerableSetLib.AddressSet;

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    mapping(address user => address module) public modules;

    EnumerableSetLib.AddressSet internal allModules;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event SubscriptionCreated(
        uint256 indexed subId,
        address indexed module,
        address indexed subscriber,
        address recipient,
        uint256 amount,
        uint256 frequency
    );

    event Redeemed(uint256 indexed subId, address indexed module, uint256 indexed nextRedeemAt);

    /*//////////////////////////////////////////////////////////////
                   USER-FACING NON-CONSTANT FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function registerModule(address module) external {
        require(msg.sender == ISubscriptionModule(module).owner());
        modules[msg.sender] = module;
        allModules.add(module);
    }

    function subscribe(address recipient, uint256 amount, uint256 frequency) external {
        address module = modules[msg.sender];
        require(msg.sender == ISubscriptionModule(module).owner());

        uint256 subId = ISubscriptionModule(module).subscribe(recipient, amount, frequency);

        emit SubscriptionCreated(subId, module, msg.sender, recipient, amount, frequency);
    }

    function redeemPayment(
        address module,
        uint256 subId,
        address[] calldata flowVertices,
        TypeDefinitions.FlowEdge[] calldata flow,
        TypeDefinitions.Stream[] calldata streams,
        bytes calldata packedCoordinates
    ) external {
        uint256 nextRedeemAt =
            ISubscriptionModule(module).redeemPayment(subId, flowVertices, flow, streams, packedCoordinates);
        emit Redeemed(subId, module, nextRedeemAt);
    }

    /*//////////////////////////////////////////////////////////////
                     USER-FACING CONSTANT FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function getAllModules() external view returns (address[] memory) {
        return allModules.values();
    }
}
