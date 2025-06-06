// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {ByteSlice} from "src/libraries/ByteSlice.sol";

contract ByteSliceTest is Test {
    using ByteSlice for bytes;

    function testToIntSingleByte() public pure {
        bytes memory data = hex"01";
        uint256 result = data.toInt(0, 1);
        assertEq(result, 1);
    }

    function testToIntTwoBytes() public pure {
        bytes memory data = hex"0102";
        uint256 result = data.toInt(0, 2);
        assertEq(result, 0x0102);
    }

    function testMaxU16() public pure {
        bytes memory data = hex"ffffff";
        uint256 result = data.toInt(1, 3);
        assertEq(result, 0xffff);
    }

    function testToIntThreeBytes() public pure {
        bytes memory data = hex"010203";
        uint256 result = data.toInt(0, 3);
        assertEq(result, 0x010203);
    }

    function testToIntMiddleSlice() public pure {
        bytes memory data = hex"0102030405";
        uint256 result = data.toInt(1, 4);
        assertEq(result, 0x020304);
    }

    function testToIntMaxValue() public pure {
        bytes memory data = hex"ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
        uint256 result = data.toInt(0, 32);
        assertEq(result, type(uint256).max);
    }

    function testToIntZero() public pure {
        bytes memory data = hex"000000";
        uint256 result = data.toInt(0, 3);
        assertEq(result, 0);
    }

    function testToIntWithOffset() public pure {
        bytes memory data = hex"deadbeef";
        uint256 result = data.toInt(2, 4);
        assertEq(result, 0xbeef);
    }
}
