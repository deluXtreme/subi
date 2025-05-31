// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {SubscriptionModule} from "src/SubscriptionModule.sol";
import {SubscriptionManager} from "src/SubscriptionManager.sol";
import {ByteSlice} from "src/libraries/ByteSlice.sol";
import {TypeDefinitions} from "@circles/src/hub/TypeDefinitions.sol";

contract ExposedSubscriptionModule is SubscriptionModule {
    constructor(address _owner, address _avatar, address _target) SubscriptionModule(_owner, _avatar, _target) {}

    function extractRecipient(bytes calldata coordinates, address[] calldata flowVertices)
        external
        pure
        returns (address)
    {
        return _extractRecipient(coordinates, flowVertices);
    }
}

contract SubscriptionModuleTest is Test {
    using ByteSlice for bytes;

    SubscriptionManager public manager;
    ExposedSubscriptionModule public subscriptionModule;
    address public owner;
    address public avatar;
    address public target;
    address public recipient;

    function setUp() public {
        owner = makeAddr("owner");
        avatar = makeAddr("avatar");
        target = makeAddr("target");
        recipient = 0xcF6Dc192dc292D5F2789DA2DB02D6dD4f41f4214;

        manager = new SubscriptionManager();

        vm.startPrank(address(owner));
        subscriptionModule = new ExposedSubscriptionModule(owner, avatar, target);
        manager.registerModule(address(subscriptionModule));
        // manager.subscribe(recipient, 1e12, 3600);
        vm.stopPrank();
    }

    function test_Subscribe() external {
        // TODO: Fails because of constant Manager contract.
        vm.startPrank(address(owner));
        manager.subscribe(recipient, 1e12, 3600);
    }

    function testExtractRecipient() public view {
        // Setup test data
        address[] memory flowVertices = new address[](2);
        flowVertices[0] = 0x6B69683C8897e3d18e74B1Ba117b49f80423Da5d;
        flowVertices[1] = 0xcF6Dc192dc292D5F2789DA2DB02D6dD4f41f4214;

        bytes memory packedCoordinates = hex"000000000001";
        assertEq(
            subscriptionModule.extractRecipient(packedCoordinates, flowVertices),
            recipient,
            "Recipient address mismatch"
        );
    }
}
