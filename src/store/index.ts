import { create } from 'zustand'

interface GlobalState {
  isWeb3Enabled: boolean
  walletAddress: string
  setWeb3Enabled: (isWeb3Enabled: boolean) => void
  setWalletAddress: (walletAddress: string) => void
}

export const useZustandStore = create<GlobalState>()((set) => ({
  isWeb3Enabled: false,
  walletAddress: "",
  setWeb3Enabled: (isWeb3Enabled: boolean) => set({ isWeb3Enabled }),
  setWalletAddress: (walletAddress: string) => set({ walletAddress }),
}))