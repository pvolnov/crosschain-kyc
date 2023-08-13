// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ILayerZeroEndpoint.sol";
import "./IKycValidity.sol";

/*
    LayerZero Optimism Goerli
      lzChainId:10132 lzEndpoint:0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1
      contract: 0x22063bC54243d5cc0B66269C0d15449C95e8eA6c
    LayerZero Goerli
      lzChainId:10121 lzEndpoint:0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23
      contract: 0xb8C2e35437295315244c2c747b7D18f0749011fA
    Mumbai (Polygon Testnet)
      chainId: 10109
      endpoint: 0xf69186dfBa60DdB133E91E9A4B5673624293d8F8

    Polygon	Mainnet	KYC	0x205E10d3c4C87E26eB66B1B270b71b7708494dB9
    Polygon	Mumbai	KYC	0x205E10d3c4C87E26eB66B1B270b71b7708494dB9
*/

contract KYCProxy {
    mapping(uint16 => bytes) public chainToKycContract;    
    ILayerZeroEndpoint public immutable lzEndpoint;
    IKycValidity public immutable kycValidity;

    address owner;

    event KYCClaimed(address voter, uint16 destChainId);
    
    constructor(address _endpoint, address _kycEndpoint) {
      lzEndpoint = ILayerZeroEndpoint(_endpoint);
      kycValidity = IKycValidity(_kycEndpoint);
      owner = msg.sender;
    }

    function setReceiverByChain(uint16 destChainId, address endpoint) public {
        // require(msg.sender==owner);
        chainToKycContract[destChainId] =  abi.encodePacked(endpoint, address(this));
    }

    function sendKYCtoChain(uint16 destChainId) public payable {
        require(kycValidity.hasValidToken(msg.sender), "You must have a valid KYC token to use this contract");
        bytes memory _payload = abi.encode(msg.sender);
        lzEndpoint.send{value: msg.value}(destChainId, chainToKycContract[destChainId], _payload, payable(msg.sender), address(0x0), bytes(""));
        emit KYCClaimed(msg.sender, destChainId);
    }
}

