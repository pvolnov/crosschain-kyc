# Crosschain KYC 

### Overview:
The provided smart contracts facilitate a bridge between Polygon and any other blockchain. This bridge is designed to enable KYC (Know Your Customer) verification status to be shared across chains.


## Demo

Url: https://cross-chain-kyc.h4n.app/

<video width="720" height="480" controls>
  <source src="kyc-demo.mp4" type="video/mp4">
</video>



## Endpoints

KYC Proxy

- Polygon (testnet):
    - adress `0xeA155E0145ff4b240b65601aC55E3d7Ed8878c4E`

KYC Client

- Optimism (testnet): 
    - adress `0xc3765f58a10c5636de7628ad434a08f34f2d0fdc`
    - chain id: 10132
- Base (testnet): 
    - adress `0xd8425b5d9d5f0a4dd1db58bed2da8070bdc931fa`
    - chain id: 10160


### Key Components:
KYCProxy contarct (For Polygon side)
KYCClient contarct (For Base/Optimism side)

### 1. KYCProxy (For Polygon side):
This contract serves as the KYC registry for users. When a user's KYC verification status is received from the Base network, it is stored within this contract.

Functions:

`_nonblockingLzReceive(...):` - processes the incoming KYC verification data from Base.

`lzReceive(...):` - callable and ensures that only authorized LayerZero endpoints can submit KYC verification data.

`hasValidToken(...):` - allows external contracts or Dapps to check if a given address has a valid KYC token.

### 2. KYCClient (For Base side):
This contract facilitates the sending of KYC verification data to the Polygon network.

Functions:

`setReceiverByChain(...):` - allows the contract owner to set or change the recipient contract address for each chain.

`sendKYCtoChain(...):` - users call this function to send their KYC status from Polygon to any chain. Before doing so, the contract checks if the user has a valid KYC token on Polygon network.

### How to Use:

Sharing KYC Status to Base:

Users with a valid KYC token on Polygon should interact with the `KYCProxy` contract.
Call the `sendKYCtoChain(destChainId)` function, specifying the destination chain's ID (in this case, Base's ID).
If the user has a valid KYC token, their address will be sent to Base network and recorded in the KYCClient contract there.

### Interact with the KYCClient contract on Base (KYC DAO Interface).

```solidity
pragma solidity ^0.8.0;

/**
* @title An interface for checking whether an address has a valid kycNFT token
*/
interface IKycValidity {
/// @dev Check whether a given address has a valid kycNFT token
/// @param _addr Address to check for tokens
/// @return valid Whether the address has a valid token
    function hasValidToken(address _addr) external view returns (bool valid);
}
```

Call the `hasValidToken(address)` function, passing the address you wish to check.
The function will return true if the address has a valid KYC token and false otherwise.

## Security

The contact code and KYCProxy addresses are not changeable. Verification of KYC client is possible only after verification on the original network. This allows to use the contract made during the hackathon in production in any projects. 

**KYC proof on KYC Client on any chain guarantees that the user has passed it.**