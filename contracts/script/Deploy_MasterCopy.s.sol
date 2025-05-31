// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {console2} from "forge-std/Script.sol";
import {ScriptUtils} from "script/Utils.sol";
import {SubscriptionModule} from "src/SubscriptionModule.sol";

interface ISingletonFactory {
    function deploy(bytes memory, bytes32) external returns (address payable createdContract);
}

// With verification:
/*
    forge script script/Deploy_MasterCopy.s.sol \
    --rpc-url gnosis \
    --private-key $PRIVATE_KEY \
    --verify --etherscan-api-key $ETHERSCAN_API_KEY \
    --broadcast -vvvv
*/

contract DeployMasterCopy is ScriptUtils {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");

        bytes memory creationCode = type(SubscriptionModule).creationCode;
        bytes memory constructorArgs = abi.encode(vm.addr(pk), ZERO_ADDRESS, ZERO_ADDRESS);
        bytes memory initCode = abi.encodePacked(creationCode, constructorArgs);

        bytes32 salt = keccak256(abi.encodePacked("SubscriptionModuleV1"));

        vm.startBroadcast(pk);

        ISingletonFactory factory = ISingletonFactory(SINGLETON_FACTORY);
        address subscriptionModuleMasterCopy = factory.deploy(initCode, salt);

        console2.log("SubscriptionModule MasterCopy deployed to:", subscriptionModuleMasterCopy);
        _writeDeploymentAddress(subscriptionModuleMasterCopy, ".subscriptionModuleMasterCopy");

        vm.stopBroadcast();
    }
}
