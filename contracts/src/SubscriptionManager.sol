// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ISubscriptionModule} from "src/ISubscriptionModule.sol";
import {EnumerableSetLib} from "@solady/src/utils/EnumerableSetLib.sol";

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

    /*//////////////////////////////////////////////////////////////
                   USER-FACING NON-CONSTANT FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function enableModule(address module) external {
        require(msg.sender == ISubscriptionModule(module).owner());
        modules[msg.sender] = module;
        allModules.add(module);
    }

    function subscribe(address recipient, uint256 amount, uint256 frequency) external {
        address module = modules[msg.sender];
        require(msg.sender == ISubscriptionModule(module).owner());

        uint256 subId = ISubscriptionModule(module).subscribeV2(recipient, amount, frequency);

        emit SubscriptionCreated(subId, module, msg.sender, recipient, amount, frequency);
    }

    /*//////////////////////////////////////////////////////////////
                     USER-FACING CONSTANT FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function getAllModules() external view returns (address[] memory) {
        return allModules.values();
    }
}
