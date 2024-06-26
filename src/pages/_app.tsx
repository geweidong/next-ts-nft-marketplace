import { useEffect } from "react";
import Head from "next/head"
import { ToastContainer } from 'react-toastify'
import type { AppProps } from "next/app";
import {NextUIProvider} from "@nextui-org/react";
import 'react-toastify/dist/ReactToastify.css';
import "@/styles/globals.css";

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
                <Component {...pageProps} />
            </NextUIProvider>
        </div>
    )
}

export default MyApp
