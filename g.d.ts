interface Window {
  ethereum?: any;
  ethers?: any;
}
interface INftItem {
  price: string
  nftAddress: string
  tokenId: string
  seller: string
}
interface INftCommonFunctionProps {
  isOpen?: boolean
  onOpenChange: (isOpen: boolean) => void;
  tokenId: string
  marketplaceAddress: `0x${string}`
  nftAddress: string
  fetchNfts: () => void
  price: ethers.BigNumberish
}