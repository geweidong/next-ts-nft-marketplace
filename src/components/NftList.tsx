import { useCallback, useEffect, useState } from "react";
import { useEvmRunContractFunction } from "@moralisweb3/next";
import networkMapping from "@/constants/networkMapping.json";
import nftMarketplaceAbi from "@/constants/NftMarketplace.json"
import NFTBox from "./NFTBox";

const nftAddress = '0xE00588241f2696C101a3834B721BD0b9e40A7d00';
const netWorkChainId = '11155111';

export default function NftList() {
  const { fetch, isFetching } = useEvmRunContractFunction();
  const [listedNfts, setNftList] = useState<INftItem[]>([]);

  const nftMarketPlaceAddress = networkMapping[netWorkChainId].NftMarketplace[0]

  const fetchNfts = useCallback(async () => {

    const response = await fetch({
      address: nftMarketPlaceAddress,
      chain: "0xaa36a7",
      abi: nftMarketplaceAbi,
      functionName: 'getListing',
      params: {
        nftAddress,
        tokenId: '0',
      },
    });
    const [price, seller] = response as unknown as any[]
    setNftList([{
      price,
      nftAddress,
      tokenId: '0',
      seller,
    }])
  }, [fetch, nftMarketPlaceAddress])

  useEffect(() => {
    fetchNfts()
  }, [fetchNfts])

  return isFetching ? (
    <div>Loading...</div>
  ) : (
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
        />
      )
    })
  )
}
