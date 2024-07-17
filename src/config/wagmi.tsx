import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { getDefaultConfig } from "connectkit";
import { injected, metaMask, safe } from 'wagmi/connectors'

export const config = createConfig(
  getDefaultConfig({
    chains: [sepolia],
    connectors: [
      injected(),
      metaMask(),
      safe(),
    ],
    transports: {
      [sepolia.id]: http("https://eth-sepolia.g.alchemy.com/v2/US9xf82FaAce6WVC1g3JIe91VCyepErb"),
    },
    appName: "Your App Name",
    appDescription: "Your App Description",
    appUrl: "https://xxx.co",
    appIcon: "https://xxx.co/logo.png",
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    ssr: true,
  })
);
