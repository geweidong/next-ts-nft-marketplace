import { useCallback, useEffect, useState } from "react";
import { useEvmRunContractFunction } from "@moralisweb3/next";
import nftMarketplaceAbi from "@/constants/NftMarketplace.json"
import { useSupabaseHooksEventListeners } from "@/hooks";
import { createClient } from "@/supabase/client";
import NFTBox from "./NFTBox";

export default function NftList({
  nftMarketPlaceAddress,
  nftAddress,
}: {
  nftMarketPlaceAddress: `0x${string}`
  nftAddress: `0x${string}`
}) {
  const [isFetching, setIsFetching] = useState(true);
  const supabase = createClient();
  const [listedNfts, setNftList] = useState<INftItem[]>([]);

  const fetchNfts = useCallback(async () => {
    const { data, error } = await supabase.from('nft-marketplace').select('*')
    const nftList = data?.map((item: any) => {
      return {
        price: BigInt(item.price),
        nftAddress: item.nftAddress,
        tokenId: item.tokenId,
        seller: item.seller,
      }
    })
    setIsFetching(false)
    setNftList(nftList!)
  }, [supabase])

  useEffect(() => {
    fetchNfts()
  }, [fetchNfts])

  useSupabaseHooksEventListeners({
    nftMarketPlaceAddress,
    fetchNfts,
  })

  return isFetching ? (
    <div>Loading...</div>
  ) : (
    <>
      <div className="p-3 flex flex-col justify-center">
        <span>NFT address: {nftAddress}</span>
        <span>MarketPlace address: {nftMarketPlaceAddress}</span>
      </div>
      {
        listedNfts.map((nft: INftItem) => {
          const { price, nftAddress, tokenId, seller } = nft;
          return (
            <NFTBox
              marketplaceAddress={nftMarketPlaceAddress}
              price={price}
              nftAddress={nftAddress}
              tokenId={tokenId}
              seller={seller}
              key={`${nftAddress}${tokenId}`}
              fetchNfts={fetchNfts}
            />
          )
        })
      }
    </>
  )
}
