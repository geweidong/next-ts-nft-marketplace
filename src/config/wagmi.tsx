import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';

// const projectId = '6e88be130a6faf39624ef90ed5794405';

export const config = createConfig({
  chains: [sepolia],
  connectors: [],
  transports: {
    [sepolia.id]: http(),
  },
  ssr: true,
});
