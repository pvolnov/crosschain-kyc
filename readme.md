# KYC Bridge between Polygon and Base

### Overview:
The provided smart contracts facilitate a bridge between the Polygon network and another network referred to as "Base". This bridge is designed to enable KYC (Know Your Customer) verification status to be shared across chains.


## Demo

[]

### Key Components:
KYCProxy (For Polygon side)
KYCClient (For Base side)

### 1. KYCProxy (For Polygon side):
This contract serves as the KYC registry for users. When a user's KYC verification status is received from the Base network, it is stored within this contract.

Functions:

`_nonblockingLzReceive(...):` This function is internal and processes the incoming KYC verification data from Base.

`lzReceive(...):` This function is externally callable and ensures that only authorized endpoints can submit KYC verification data.

`hasValidToken(...):` This function allows external contracts or Dapps to check if a given address has a valid KYC token.

### 2. KYCClient (For Base side):
This contract facilitates the sending of KYC verification data to the Polygon network.

Functions:

`constructor(...):` Sets the initial values for the LayerZero endpoint and the KYC validity checker.

`setReceiverByChain(...):` Allows the contract owner to set or change the recipient contract address for each chain.

`sendKYCtoChain(...):` Users call this function to send their KYC status to Polygon. Before doing so, the contract checks if the user has a valid KYC token on the Base network.

### How to Use:

Sharing KYC Status to Base:

Users with a valid KYC token on Polygon should interact with the KYCProxy contract.
Call the `sendKYCtoChain(destChainId)` function, specifying the destination chain's ID (in this case, Polygon's ID).
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

### KYC Token Verification:

 Before a user can send their KYC status to Base, the Polygon contract verifies that the user indeed has a valid KYC token. This helps ensure the authenticity and integrity of KYC data being sent to Base.

