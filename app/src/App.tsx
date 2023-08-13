import { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { KycDaoIframeClient } from "@kycdao/widget";
import { Contract, ethers } from "ethers";
import { toast } from "react-toastify";
import { merge } from "lodash";

import { ABI, Chain, configs, contracts, switchChain } from "./chain";
import { Button, Container, KYCLogo, Header, Panel } from "./styled";

import kycLogo from "./assets/kyc.svg";
import baseLogo from "./assets/base.svg";
import layerzeroLogo from "./assets/layerzero.svg";
import kycTextLogo from "./assets/kyc-text.svg";
import verifiedLogo from "./assets/verified.svg";
import { getPolygonBalances } from "./covalent";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const initialState: { account: string | null; kyc: Record<Chain, boolean> } = {
  account: null,
  kyc: {
    [Chain.BASE]: false,
    [Chain.OPTIMISM]: false,
    [Chain.POLYGON]: false,
  },
};

const iframeClient = new KycDaoIframeClient({
  parent: "#kyc-widget",
  iframeOptions: {
    url: "https://sdk.kycdao.xyz/iframe.html",
    messageTargetOrigin: window.origin,
  },
  config: {
    demoMode: true,
    enabledBlockchainNetworks: ["PolygonMumbai"],
    enabledVerificationTypes: ["KYC"],
    evmProvider: "ethereum",
    baseUrl: "https://staging.kycdao.xyz",
  },
});

function App() {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const [wallet, setWallet] = useState(initialState);

  useEffect(() => {
    const fetch = async () => {
      if (wallet.account == null) return;

      getPolygonBalances("0x8bfD164094aC262a51A895a99C25290a4B4E148E").then(console.log);

      const chains = [Chain.POLYGON, Chain.OPTIMISM, Chain.BASE];
      for (const chain of chains) {
        try {
          const provider = new ethers.JsonRpcProvider(configs[chain].rpcUrls[0]);
          const contract = new Contract(contracts[chain], ABI, provider);
          const hasKYC = await contract.hasValidToken(wallet.account);
          setWallet((state) => merge({}, state, { kyc: { [chain]: hasKYC } }));
        } catch (e) {
          console.log(e);
        }
      }

      if (process.env.NODE_ENV === "development") {
        setWallet((state) => merge({}, state, { kyc: { [Chain.POLYGON]: true } }));
      }
    };

    fetch();
  }, [wallet.account]);

  useEffect(() => {
    const refreshAccounts = async (accounts: any) => {
      if (!accounts.length) return setWallet(initialState);
      updateWallet(accounts);
    };

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      setHasProvider(Boolean(provider));

      if (provider) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        window.ethereum.on("accountsChanged", refreshAccounts);
        refreshAccounts(accounts);
      }
    };

    getProvider();
    return () => {
      window.ethereum?.removeListener("accountsChanged", refreshAccounts);
    };
  }, []);

  const updateWallet = async (accounts: string[]) => {
    setWallet(merge({}, initialState, { account: accounts[0] }));
  };

  const handleConnect = async () => {
    let accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    updateWallet(accounts);
  };

  const handleClaimKYC = async (chain: Chain) => {
    try {
      if (!wallet.account) return;
      if (wallet.kyc[chain]) {
        toast("KYC already claimed for this chain");
        return;
      }

      if (chain === Chain.POLYGON) {
        iframeClient.open();
        return;
      }

      if (!wallet.account) return;
      await switchChain(Chain.POLYGON);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(wallet.account);
      const contract = new Contract("0x7ad3ffe0401C44607dF9dEdEe14314C3c92C359F", ABI, signer);
      const options = { value: ethers.parseEther("0.2") };

      const executing = await contract.sendKYCtoChain(Chain.OPTIMISM ? 10132 : 10160, options);
      await toast.promise(executing.wait(), {
        error: "Transaction failed",
        pending: "Transaction in progress, please wait...",
        success: "Transaction completed!",
      });

      const waitKYC = async (): Promise<boolean> => {
        await wait(3000);
        const provider = new ethers.JsonRpcProvider(configs[chain].rpcUrls[0]);
        const contract = new Contract(contracts[chain], ABI, provider);
        const hasKYC = await contract.hasValidToken(wallet.account);
        if (!hasKYC) return await waitKYC();

        setWallet((state) => merge({}, state, { kyc: { [chain]: true } }));
        return true;
      };

      await toast.promise(waitKYC(), {
        error: "Transaction failed",
        pending: "Wait while LayerZero processes the transaction...",
        success: `KYC in ${chain} has been claimed!`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container>
      <div style={{ padding: 64, flex: 1 }}>
        <div style={{ width: "100%", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <KYCLogo src={kycLogo} alt="kyc-logo" />
          <img style={{ height: 48 }} src={kycTextLogo} alt="kyc-text-logo" />

          <img style={{ height: 64, marginLeft: 32 }} src={baseLogo} alt="base-logo" />
        </div>

        <Header style={{ fontSize: 32, marginTop: 64 }}>Cross-chain KYC DAO</Header>
        <Header>Pass ones use anywhere</Header>

        <div style={{ display: "flex", gap: 16, marginTop: 32, flexWrap: "wrap" }}>
          {hasProvider && !wallet.account && <Button onClick={handleConnect}>Connect wallet</Button>}

          {!hasProvider && <Button onClick={handleConnect}>Install Metamask</Button>}

          {wallet.account && (
            <Button onClick={() => handleClaimKYC(Chain.POLYGON)} $verified={wallet.kyc[Chain.POLYGON]}>
              {wallet.kyc[Chain.POLYGON] ? <img src={verifiedLogo} alt="verified" /> : "Get"} Polygon KYC
            </Button>
          )}

          {wallet.account && wallet.kyc[Chain.POLYGON] && (
            <>
              <Button onClick={() => handleClaimKYC(Chain.OPTIMISM)} $verified={wallet.kyc[Chain.OPTIMISM]}>
                {wallet.kyc[Chain.OPTIMISM] ? <img src={verifiedLogo} alt="verified" /> : "Get"} Optimism KYC
              </Button>
              <Button onClick={() => handleClaimKYC(Chain.BASE)} $verified={wallet.kyc[Chain.BASE]}>
                {wallet.kyc[Chain.BASE] ? <img src={verifiedLogo} alt="verified" /> : "Get"} Base KYC
              </Button>
            </>
          )}
        </div>
      </div>

      <Panel>
        <div style={{ paddingRight: 64 }}>
          {wallet.account && (
            <h3 style={{ color: "#fff", lineBreak: "anywhere" }}>
              Hello
              <br />
              {wallet.account}
            </h3>
          )}
        </div>

        <img style={{ height: 200, position: "fixed", bottom: -16, right: 48 }} src={layerzeroLogo} alt="layer" />
      </Panel>
    </Container>
  );
}

export default App;
