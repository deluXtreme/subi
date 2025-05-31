// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {LibBytes} from "lib/solady/src/utils/LibBytes.sol";

library ByteSlice {
    using LibBytes for bytes;

    function toInt(bytes memory data, uint256 start, uint256 end) internal pure returns (uint256 result) {
        bytes memory slice = data.slice(start, end);
        for (uint256 i = 0; i < slice.length; i++) {
            result = (result << 8) | uint8(slice[i]);
        }
    }
}
