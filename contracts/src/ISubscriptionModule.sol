// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface ISubscriptionModule {
    function owner() external view returns (address);

    function subscribeV2(address recipient, uint256 amount, uint256 frequency) external returns (uint256);
}
