import { useEffect } from "react";
import Head from "next/head"
import { ToastContainer } from 'react-toastify'
import type { AppProps } from "next/app";
import {NextUIProvider} from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { hashFn } from "@wagmi/core/query";
import { config } from '../config/wagmi';
import { ConnectKitProvider } from 'connectkit';
import 'react-toastify/dist/ReactToastify.css';
import "@/styles/globals.css";
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
          queryKeyHashFn: hashFn,
        },
      },
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="NFT Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ToastContainer />
            <NextUIProvider>
                <WagmiProvider config={config}>
                    <QueryClientProvider client={queryClient}>
                        <ConnectKitProvider>
                            <Component {...pageProps} />
                        </ConnectKitProvider>
                    </QueryClientProvider>
                </WagmiProvider>
            </NextUIProvider>
        </div>
    )
}

export default MyApp
