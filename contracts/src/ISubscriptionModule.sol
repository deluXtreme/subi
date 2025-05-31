// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {TypeDefinitions} from "@circles/src/hub/TypeDefinitions.sol";

interface ISubscriptionModule {
    function owner() external view returns (address);

    function subscribe(address recipient, uint256 amount, uint256 frequency) external returns (uint256);

    function redeemPayment(
        uint256 subId,
        address[] calldata flowVertices,
        TypeDefinitions.FlowEdge[] calldata flow,
        TypeDefinitions.Stream[] calldata streams,
        bytes calldata packedCoordinates
    ) external returns (uint256);
}
