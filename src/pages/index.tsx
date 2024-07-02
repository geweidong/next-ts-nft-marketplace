import Header from "@/components/Header"
import Web3Container from "@/components/Web3Container";
import { Inter } from "next/font/google";
import { useAccount } from 'wagmi';
import { useIsMounted } from '@/hooks';

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { isConnected } = useAccount();
  const isMounted = useIsMounted();

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
    >
      {
        isMounted && (
          <>
            <Header />
            {
              isConnected ? <Web3Container /> : <div>Not Connected</div>
            }
          </>
        )
      }
    </main>
  );
}
