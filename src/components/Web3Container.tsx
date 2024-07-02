import { useCallback, useEffect, useState } from "react";
import NftList from "@/components/NftList";
import { Button } from "@nextui-org/button";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import nftMarketplaceAbi from "@/constants/NftMarketplace.json"
import networkMapping from "@/constants/networkMapping.json";
import { useEvmRunContractFunction } from "@moralisweb3/next";
import { sepolia } from 'wagmi/chains';
import { useAccount } from "wagmi";
import { ethers } from "ethers";

const netWorkChainId = sepolia.id;

const nftMarketPlaceAddress = networkMapping[netWorkChainId].NftMarketplace[0]
const basicNftAddress = networkMapping[netWorkChainId].BasicNft[0]

export default function Web3Container() {
  const { address: walletAddress } = useAccount();
  const [balance, setBalance] = useState('0')

  const { fetch } = useEvmRunContractFunction();
  const withdraw = useCallback(async () => {
    const proceeds = await fetch({
      abi: nftMarketplaceAbi,
      address: nftMarketPlaceAddress,
      chain: "0xaa36a7",
      functionName: "getProceeds",
      params: {
        seller: walletAddress,
      },
    })

    console.log(proceeds, 'proceeds---proceeds', )
  }, [fetch, walletAddress])

  useEffect(() => {
    const getBalance = async () => {
      const balance = await fetch({
        abi: nftMarketplaceAbi,
        address: nftMarketPlaceAddress,
        chain: "0xaa36a7",
        functionName: "getProceeds",
        params: {
          seller: walletAddress,
        },
      })

      setBalance(ethers.formatUnits(balance!, "ether"))
    }

    getBalance()
  }, [fetch, walletAddress])

  return (
    <div>
      <NftList
        nftMarketPlaceAddress={nftMarketPlaceAddress as `0x${string}`}
        nftAddress={basicNftAddress as `0x${string}`}
      />
      <div className="flex mt-3">
        <Card>
          <CardBody>
            <p>My current balance：</p>
            <p>{balance} ETH</p>

            {/* <Button onClick={withdraw}>withdraw</Button> */}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}