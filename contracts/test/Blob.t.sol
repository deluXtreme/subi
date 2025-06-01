// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {SubscriptionModule} from "src/SubscriptionModule.sol";
import {SubscriptionManager} from "src/SubscriptionManager.sol";
import {ByteSlice} from "src/libraries/ByteSlice.sol";
import {TypeDefinitions} from "@circles/src/hub/TypeDefinitions.sol";
import {ByteSlice} from "src/libraries/ByteSlice.sol";

contract Blob is Test {
    using ByteSlice for bytes;

    address internal constant MANAGER = 0x27c2a11AA3E2237fDE4aE782cC36eBBB49d26c57;
    address internal constant module = 0xB01A77928f5F01f416944CD60dD1605Dd8AB24B3;

    SubscriptionManager internal manager = SubscriptionManager(MANAGER);

    function testBlob() external {
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

        bytes memory x = abi.encodeCall(
            SubscriptionManager.redeemPayment, (module, subId, flowVertices, flow, streams, packedCoordinates)
        );

        address r = _extractRecipient(packedCoordinates, flowVertices);
        assertEq(r, 0xeDe0C2E70E8e2d54609c1BdF79595506B6F623FE);

        assertEq(_extractAmount(flow), 1000000000000);

        emit log_bytes(x);
    }

    function _extractRecipient(bytes memory coordinates, address[] memory flowVertices)
        internal
        pure
        returns (address)
    {
        uint256 length = coordinates.length;
        return flowVertices[coordinates.toInt(length - 2, length)];
    }

    function _extractAmount(TypeDefinitions.FlowEdge[] memory flow) internal pure returns (uint256 amount) {
        for (uint256 i = 0; i < flow.length; i++) {
            if (flow[i].streamSinkId == 1) {
                amount += flow[i].amount;
            }
        }
    }
}
