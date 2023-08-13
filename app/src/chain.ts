export enum Chain {
  POLYGON = "POLYGON",
  BASE = "BASE",
  OPTIMISM = "OPTIMISM",
}

export const contracts: Record<Chain, string> = {
  [Chain.POLYGON]: "0x205E10d3c4C87E26eB66B1B270b71b7708494dB9",
  [Chain.OPTIMISM]: "0x364610e08a7A8c7c5727F2De4247B742f1aE5216",
  [Chain.BASE]: "0x624b5A7fF59F54B1a7b10d59B5100b1Cd92EE6a8",
};

export const ABI = [
  "function sendKYCtoChain(uint16 destChainId) payable",
  "function hasValidToken(address _addr) view returns (bool)",
];

export const configs = {
  [Chain.POLYGON]: {
    chainId: "0x13881",
    chainName: "Polygon Testnet Mumbai",
    rpcUrls: ["https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78"],
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
  },
  [Chain.OPTIMISM]: {
    chainId: "0x1a4",
    chainName: "Optimism Goerli",
    rpcUrls: ["https://goerli.optimism.io"],
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://goerli-explorer.optimism.io"],
  },
  [Chain.BASE]: {
    chainId: "0x14a33",
    chainName: "Base Goerli Testnet",
    rpcUrls: ["https://goerli.base.org"],
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://goerli-explorer.base.io"],
  },
};

export const switchChain = async (chain: Chain) => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: configs[chain].chainId }],
    });
  } catch (switchError: any) {
    if (switchError?.code !== 4902) throw switchError;
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [configs[chain]],
    });
  }

  return contracts[chain];
};
