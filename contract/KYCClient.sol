// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
    LayerZero Optimism Goerli
      lzChainId:10132 lzEndpoint:0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1
      contract: 0x22063bC54243d5cc0B66269C0d15449C95e8eA6c
    LayerZero Goerli
      lzChainId:10121 lzEndpoint:0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23
      contract: 0xb8C2e35437295315244c2c747b7D18f0749011fA
*/

contract KYCClient {
    mapping(address => bool) public kycAccs;    

    function _nonblockingLzReceive(uint16, bytes memory, uint64, bytes memory _payload) internal {
       address data = abi.decode(_payload, (address));
       kycAccs[data] = true;
    }

    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function lzReceive(uint16 _srcChainId, bytes calldata _srcAddress, uint64 _nonce, bytes calldata _payload) public virtual {
        // lzReceive must be called by the endpoint for security
        require(_msgSender() == address(0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1), "LzApp: invalid endpoint caller");

        // bytes memory trustedRemote = trustedRemoteLookup[_srcChainId];
        // if will still block the message pathway from (srcChainId, srcAddress). should not receive message from untrusted remote.
        // require(_srcAddress.length == trustedRemote.length && trustedRemote.length > 0 && keccak256(_srcAddress) == keccak256(trustedRemote), "LzApp: invalid source sending contract");

        _nonblockingLzReceive(_srcChainId, _srcAddress, _nonce, _payload);
    }

    function hasValidToken(address _addr) external view returns (bool valid) {
      return kycAccs[_addr];
    }

}

