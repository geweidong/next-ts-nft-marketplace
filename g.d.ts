interface Window {
  ethereum?: any;
  ethers?: any;
}
interface INftItem {
  price: ethers.BigNumberish
  nftAddress: `0x${string}`
  tokenId: string
  seller: string
}
interface INftCommonFunctionProps {
  isOpen?: boolean
  onOpenChange: (isOpen: boolean) => void;
  tokenId: string
  marketplaceAddress: `0x${string}`
  nftAddress: `0x${string}`
  fetchNfts: () => void
  price: ethers.BigNumberish
}