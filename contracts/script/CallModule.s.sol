// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {TypeDefinitions} from "lib/circles-contracts-v2/src/hub/TypeDefinitions.sol";
import {SubscriptionModule} from "src/SubscriptionModule.sol";

// forge script --chain gnosis script/CallModule.s.sol:CallModuleScript --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast -vvvv
contract CallModuleScript is Script {
    SubscriptionModule internal module = SubscriptionModule(0x01E65042f8CE628f07bba35c97883825e7B97c2f);

    function run() public {
        vm.startBroadcast();

        uint256 subId = 1;

        address[] memory flowVertices = new address[](2);
        flowVertices[0] = 0x6B69683C8897e3d18e74B1Ba117b49f80423Da5d;
        flowVertices[1] = 0xcF6Dc192dc292D5F2789DA2DB02D6dD4f41f4214;

        TypeDefinitions.FlowEdge[] memory flow = new TypeDefinitions.FlowEdge[](1);
        flow[0] = TypeDefinitions.FlowEdge({streamSinkId: 1, amount: 1000000000000});

        TypeDefinitions.Stream[] memory streams = new TypeDefinitions.Stream[](1);
        uint16[] memory edgeIds = new uint16[](1);
        edgeIds[0] = 0;

        streams[0] = TypeDefinitions.Stream({sourceCoordinate: 0, flowEdgeIds: edgeIds, data: ""});

        bytes memory packedCoordinates = hex"000000000001";

        module.redeemPayment(subId, flowVertices, flow, streams, packedCoordinates);

        vm.stopBroadcast();
    }
}
