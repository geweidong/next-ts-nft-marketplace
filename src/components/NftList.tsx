import { useCallback, useEffect, useState } from "react";
import { useEvmRunContractFunction } from "@moralisweb3/next";
import networkMapping from "@/constants/networkMapping.json";
import nftMarketplaceAbi from "@/constants/NftMarketplace.json"
import { sepolia } from 'wagmi/chains';
import NFTBox from "./NFTBox";

const netWorkChainId = sepolia.id;

export default function NftList() {
  const { fetch, isFetching } = useEvmRunContractFunction();
  const [listedNfts, setNftList] = useState<INftItem[]>([]);

  const nftMarketPlaceAddress = networkMapping[netWorkChainId].NftMarketplace[0]
  const basicNftAddress = networkMapping[netWorkChainId].BasicNft[0]

  const fetchNfts = useCallback(async () => {

    const response = await fetch({
      address: nftMarketPlaceAddress,
      chain: "0xaa36a7",
      abi: nftMarketplaceAbi,
      functionName: 'getListing',
      params: {
        nftAddress: basicNftAddress,
        tokenId: '0',
      },
    });
    const [price, seller] = response as unknown as any[]
    if (price > 0) {
      setNftList([{
        price,
        nftAddress: basicNftAddress,
        tokenId: '0',
        seller,
      }])
    }
  }, [basicNftAddress, fetch, nftMarketPlaceAddress])

  useEffect(() => {
    fetchNfts()
  }, [fetchNfts])

  return isFetching ? (
    <div>Loading...</div>
  ) : (
    <>
      <div className="p-3 flex flex-col justify-center">
        <span>NFT address: {basicNftAddress}</span>
        <span>MarketPlace address: {nftMarketPlaceAddress}</span>
      </div>
      {
        listedNfts.map((nft: INftItem) => {
          const { price, nftAddress, tokenId, seller } = nft;
          return (
            <NFTBox
              marketplaceAddress={nftMarketPlaceAddress as `0x${string}`}
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
