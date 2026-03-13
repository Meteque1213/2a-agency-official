// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SentinelNotary {
    address public admin;

    event Notarized(string indexed brand, string docHash, uint256 timestamp);

    constructor() {
        admin = msg.sender;
    }

    // Cette fonction grave le hash dans la blockchain Base
    function notarize(string memory _brand, string memory _docHash) public {
        require(msg.sender == admin, "Only Sentinel can notarize");
        emit Notarized(_brand, _docHash, block.timestamp);
    }
}