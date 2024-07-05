import { useWatchContractEvent } from 'wagmi'
import nftMarketplaceAbi from "@/constants/NftMarketplace.json"

export default function Contract() {
  useWatchContractEvent({
    address: '0xc236519289ad7d62780503d521CDb69931Ac2479',
    abi: nftMarketplaceAbi,
    eventName: 'ItemListed',
    onLogs(logs) {
      console.log('New logs: ItemListed', logs)
    },
  })

  return <div>Contract</div>
}