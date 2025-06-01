// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {TypeDefinitions} from "lib/circles-contracts-v2/src/hub/TypeDefinitions.sol";
import {SubscriptionManager} from "src/SubscriptionManager.sol";

// forge script --chain gnosis script/CallModule.s.sol:CallModuleScript --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast -vvvv
contract CallModuleScript is Script {
    address internal constant MANAGER = 0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834;
    address internal constant module = 0x245468176597dFb5eFf9f751018BdBf3B5ae858C;

    SubscriptionManager internal manager = SubscriptionManager(MANAGER);

    function run() public {
        vm.startBroadcast();

        uint256 subId = 0;

        address[] memory flowVertices = new address[](2);
        flowVertices[0] = 0x6B69683C8897e3d18e74B1Ba117b49f80423Da5d;
        flowVertices[1] = 0xeDe0C2E70E8e2d54609c1BdF79595506B6F623FE;

        TypeDefinitions.FlowEdge[] memory flow = new TypeDefinitions.FlowEdge[](1);
        flow[0] = TypeDefinitions.FlowEdge({streamSinkId: 1, amount: 1000000000000});

        TypeDefinitions.Stream[] memory streams = new TypeDefinitions.Stream[](1);
        uint16[] memory edgeIds = new uint16[](1);
        edgeIds[0] = 0;

        streams[0] = TypeDefinitions.Stream({sourceCoordinate: 0, flowEdgeIds: edgeIds, data: ""});

        bytes memory packedCoordinates = hex"000000000001";

        manager.redeemPayment(module, subId, flowVertices, flow, streams, packedCoordinates);

        vm.stopBroadcast();
    }
}
