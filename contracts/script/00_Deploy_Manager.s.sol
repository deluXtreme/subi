// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {console2} from "forge-std/Script.sol";
import {ScriptUtils} from "script/Utils.sol";
import {SubscriptionManager} from "src/SubscriptionManager.sol";

// With verification:
/*
    forge script script/00_Deploy_Manager.s.sol \
    --rpc-url gnosis \
    --private-key $PRIVATE_KEY \
    --verify --etherscan-api-key $ETHERSCAN_API_KEY \
    --broadcast -vvvv
*/

contract DeployMasterCopy is ScriptUtils {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(pk);

        address manager = address(new SubscriptionManager());

        console2.log("SubscriptionManager deployed to:", manager);
        _writeDeploymentAddress(manager, ".subscriptionManager");

        vm.stopBroadcast();
    }
}
