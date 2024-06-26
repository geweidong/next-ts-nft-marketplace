import { truncateStr } from "@/utils";
import { useZustandStore } from "@/store"
import { useCallback, useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";

export default function ConnectButton() {
  const [account, setAccount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const setWalletAddress = useZustandStore(state => state.setWalletAddress);
  const setWeb3Enabled = useZustandStore(state => state.setWeb3Enabled);

  const connectWallet = useCallback(async () => {
    const provider = await detectEthereumProvider();

    if (provider && provider === window.ethereum) {
      try {
        // @ts-ignore
        const accounts = await provider.request({
          method: "eth_requestAccounts"
        })
        setAccount(truncateStr(accounts[0], 10));
        // set zustand store
        setWalletAddress(accounts[0]);
        setWeb3Enabled(true);
        setErrorMessage('');
      } catch (error: any) {
        setWeb3Enabled(false);
        setErrorMessage(error.message);
      }
    } else {
      setErrorMessage('MetaMask not detected. Please install MetaMask and try again.');
    }
  }, [setWalletAddress, setWeb3Enabled]);

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  return (
    <div>
      <button onClick={connectWallet} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {account ? `Connected: ${account}` : 'Connect MetaMask'}
      </button>
    </div>
  )
}