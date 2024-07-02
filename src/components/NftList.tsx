import { useCallback, useEffect, useState } from "react";
import { useEvmRunContractFunction } from "@moralisweb3/next";
import nftMarketplaceAbi from "@/constants/NftMarketplace.json"
import NFTBox from "./NFTBox";

export default function NftList({
  nftMarketPlaceAddress,
  nftAddress,
}: {
  nftMarketPlaceAddress: `0x${string}`
  nftAddress: `0x${string}`
}) {
  const { fetch, isFetching } = useEvmRunContractFunction();
  const [listedNfts, setNftList] = useState<INftItem[]>([]);

  const fetchNfts = useCallback(async () => {

    const response = await fetch({
      address: nftMarketPlaceAddress,
      chain: "0xaa36a7",
      abi: nftMarketplaceAbi,
      functionName: 'getListing',
      params: {
        nftAddress: nftAddress,
        tokenId: '0',
      },
    });
    const [price, seller] = response as unknown as any[]
    if (price > 0) {
      setNftList([{
        price,
        nftAddress: nftAddress,
        tokenId: '0',
        seller,
      }])
    }
  }, [nftAddress, fetch, nftMarketPlaceAddress])

  useEffect(() => {
    fetchNfts()
  }, [fetchNfts])

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
