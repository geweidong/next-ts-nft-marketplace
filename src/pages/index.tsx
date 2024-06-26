import Header from "@/components/Header"
import NftList from "@/components/NftList";
import { useZustandStore } from "@/store";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const isWeb3Enabled = useZustandStore(state => state.isWeb3Enabled);

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
    >
      <Header />
      {
        isWeb3Enabled && <NftList />
      }
    </main>
  );
}
