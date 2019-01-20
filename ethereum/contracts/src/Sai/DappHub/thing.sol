pragma solidity >=0.4.23;

import "./auth.sol";
import "./note.sol";
import "./math.sol";

contract DSThing is DSAuth, DSNote, DSMath {
    function S(string memory s) internal pure returns (bytes4) {
        return bytes4(keccak256(abi.encodePacked(s)));
    }

}