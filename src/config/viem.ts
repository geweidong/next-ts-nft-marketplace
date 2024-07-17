import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
 
export const account = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
 
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
})
