import { useEffect, useState } from 'react'
import nftMarketplaceAbi from "@/constants/NftMarketplace.json"
import { createClient } from "@/supabase/client";
import { useWatchContractEvent } from 'wagmi'

export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted;
}

export function useSupabaseHooksEventListeners({
  nftMarketPlaceAddress,
  fetchNfts,
}: {
  nftMarketPlaceAddress: `0x${string}`
  fetchNfts: () => void
}): void {
  const supabase = createClient();
  useWatchContractEvent({
    address: nftMarketPlaceAddress,
    abi: nftMarketplaceAbi,
    eventName: 'ItemListed',
    async onLogs(logs: any) {
      console.log('事件ItemListed监听!', logs)
      const { seller, price, nftAddress, tokenId } = logs[0].args
      // 插入数据库
      const { data, error} = await supabase.from('nft-marketplace').insert({
        seller,
        price: price.toString(),
        nftAddress,
        tokenId: tokenId.toString(),
      })
      if (error) {
        console.log(error, 'supabase insert error!')
      } else {
        fetchNfts()
      }
    },
  })

  useWatchContractEvent({
    address: nftMarketPlaceAddress,
    abi: nftMarketplaceAbi,
    eventName: 'ItemUpdateListed',
    async onLogs(logs: any) {
      console.log('事件ItemUpdateListed监听!', logs)
      const { seller, price, nftAddress, tokenId } = logs[0].args
      // 插入数据库
      const { data, error} = await supabase.from('nft-marketplace').update({
        price: price.toString(),
      }).eq('nftAddress', nftAddress).eq('tokenId', tokenId.toString())
      if (error) {
        console.log(error, 'supabase update error!')
      } else {
        fetchNfts()
      }
    },
  })

  useWatchContractEvent({
    address: nftMarketPlaceAddress,
    abi: nftMarketplaceAbi,
    eventName: 'ItemCanceled',
    async onLogs(logs: any) {
      console.log('事件ItemCanceled监听!', logs)
      const { seller, price, nftAddress, tokenId } = logs[0].args
      // 插入数据库
      const { data, error} = await supabase.from('nft-marketplace').delete().eq('nftAddress', nftAddress).eq('tokenId', tokenId.toString())
      if (error) {
        console.log(error, 'supabase delete error!')
      } else {
        fetchNfts()
      }
    },
  })
}