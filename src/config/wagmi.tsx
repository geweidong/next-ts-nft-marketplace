import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { getDefaultConfig } from "connectkit";
import { injected, metaMask, safe } from 'wagmi/connectors'

export const config = createConfig(
  getDefaultConfig({
    chains: [sepolia],
    connectors: [
      injected(),
      metaMask({
        dappMetadata: {
          name: "Your App Name",
          url: "https://xxx.co",
        }
      }),
      safe(),
    ],
    transports: {
      [sepolia.id]: http(process.env.SEPOLIA_RPC_URL),
    },
    appName: "Your App Name",
    appDescription: "Your App Description",
    appUrl: "https://xxx.co",
    appIcon: "https://xxx.co/logo.png",
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    ssr: true,
  })
);
