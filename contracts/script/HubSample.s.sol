// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {IHubV2} from "lib/circles-contracts-v2/src/hub/IHub.sol";
import {TypeDefinitions} from "lib/circles-contracts-v2/src/hub/TypeDefinitions.sol";

// forge script --chain gnosis script/Hub.s.sol:HubScript --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast -vvvv
contract HubScript is Script {
    IHubV2 internal hub = IHubV2(0xc12C1E50ABB450d6205Ea2C3Fa861b3B834d13e8);

    function run() public {
        vm.startBroadcast();

        address[] memory flowVertices = new address[](4);
        flowVertices[0] = 0x6B69683C8897e3d18e74B1Ba117b49f80423Da5d; //ben
        flowVertices[1] = 0xcF6Dc192dc292D5F2789DA2DB02D6dD4f41f4214; //franco
        flowVertices[2] = 0xdECd4A499CbD605970016F7428758bA97c6a7dF3;
        flowVertices[3] = 0xeDe0C2E70E8e2d54609c1BdF79595506B6F623FE; //adam

        TypeDefinitions.FlowEdge[] memory flow = new TypeDefinitions.FlowEdge[](5);
        flow[0] = TypeDefinitions.FlowEdge({streamSinkId: 1, amount: 1000000000000000000});
        flow[1] = TypeDefinitions.FlowEdge({streamSinkId: 1, amount: 162720542000000000000});
        flow[2] = TypeDefinitions.FlowEdge({streamSinkId: 1, amount: 47750078000000000000});
        flow[3] = TypeDefinitions.FlowEdge({streamSinkId: 0, amount: 1581871000000000000});
        flow[4] = TypeDefinitions.FlowEdge({streamSinkId: 1, amount: 1581871000000000000});

        TypeDefinitions.Stream[] memory streams = new TypeDefinitions.Stream[](1);
        uint16[] memory edgeIds = new uint16[](4);
        edgeIds[0] = 0;
        edgeIds[1] = 1;
        edgeIds[2] = 2;
        edgeIds[3] = 4;
        streams[0] = TypeDefinitions.Stream({sourceCoordinate: 3, flowEdgeIds: edgeIds, data: ""});

        bytes memory packedCoordinates = hex"000000030001000300030001000100030001000200030000000000000001";

        hub.operateFlowMatrix(flowVertices, flow, streams, packedCoordinates);

        vm.stopBroadcast();
    }
}
