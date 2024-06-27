import Header from "@/components/Header"
import NftList from "@/components/NftList";
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
              isConnected ? <NftList /> : <div>Not Connected</div>
            }
          </>
        )
      }
    </main>
  );
}
