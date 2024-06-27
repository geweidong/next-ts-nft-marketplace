import { useEffect } from "react";
import Head from "next/head"
import { ToastContainer } from 'react-toastify'
import type { AppProps } from "next/app";
import {NextUIProvider} from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '../config/wagmi';
import 'react-toastify/dist/ReactToastify.css';
import "@/styles/globals.css";
const queryClient = new QueryClient();
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
                        <Component {...pageProps} />
                    </QueryClientProvider>
                </WagmiProvider>
            </NextUIProvider>
        </div>
    )
}

export default MyApp
