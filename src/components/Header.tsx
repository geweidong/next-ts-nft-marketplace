import { ConnectKitButton } from 'connectkit';

export default function Header() {
    
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl">NFT Marketplace</h1>
            <div className="flex flex-row items-center ml-[200px]">
                <ConnectKitButton />
            </div>
        </nav>
    )
}
