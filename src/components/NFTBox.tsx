import Image from "next/image";
import { ethers } from "ethers";
import { truncateStr } from "@/utils";
import { useState, useEffect, useCallback } from "react";
import nftAbi from "../constants/BasicNft.json";
import { useEvmRunContractFunction } from "@moralisweb3/next";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { UpdateListingModal } from "./UpdateListingModal";
import { useDisclosure } from "@nextui-org/modal";
import { useAccount } from "wagmi";
import { BuyNft } from './BuyNft';

export default function NFTBox({
    price,
    nftAddress,
    tokenId,
    marketplaceAddress,
    seller,
    fetchNfts,
}: {
    price: ethers.BigNumberish
    nftAddress: string
    tokenId: string
    marketplaceAddress: `0x${string}`
    seller?: string
    fetchNfts: () => void
}) {
    const { isConnected, address: walletAddress } = useAccount();
    const { isOpen: isUpdataOpen, onOpen: onOpenUpdate, onOpenChange: onOpenChangeUpdate} = useDisclosure();
    const { isOpen: isBuyOpen, onOpen: onOpenBuy, onOpenChange: onOpenChangeBuy } = useDisclosure();

    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")

    const { fetch: fetchContractFunction } = useEvmRunContractFunction()

    const updateUI = useCallback(async function () {
        const tokenURI = await fetchContractFunction({
            abi: nftAbi,
            address: nftAddress,
            chain: "0xaa36a7",
            functionName: "tokenURI",
            params: {
                tokenId: tokenId,
            },
        })

        if (tokenURI) {
            const fetchRes = await fetch(tokenURI);
            const tokenURIResponse = await (fetchRes).json()
            const imageURI = tokenURIResponse.image
            setImageURI(imageURI)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }, [fetchContractFunction, nftAddress, tokenId])

    useEffect(() => {
        if (isConnected) {
            updateUI()
        }
    }, [isConnected, updateUI])

    const isOwnedByUser = seller?.toLowerCase() === walletAddress?.toLowerCase() || seller === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)
    
    

    const handleCardClick = useCallback(() => {
        isOwnedByUser
            ? onOpenUpdate()
            : onOpenBuy()
    }, [isOwnedByUser, onOpenBuy, onOpenUpdate])

    return (
        <div>
            <UpdateListingModal
                isOpen={isUpdataOpen}
                onOpenChange={onOpenChangeUpdate}
                tokenId={tokenId}
                marketplaceAddress={marketplaceAddress}
                nftAddress={nftAddress}
                fetchNfts={fetchNfts}
            />
            <BuyNft
                price={price}
                fetchNfts={fetchNfts}
                nftAddress={nftAddress}
                marketplaceAddress={marketplaceAddress}
                tokenId={tokenId}
                isOpen={isBuyOpen}
                onOpenChange={onOpenChangeBuy}
            />
            <div>
                {imageURI && (
                    <div onClick={handleCardClick} className="cursor-pointer mb-2">
                        <Card className="py-4">
                            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                <p className="text-tiny uppercase font-bold">{tokenName}</p>
                                <small className="text-default-500">{tokenDescription}</small>
                            </CardHeader>
                            <CardBody className="overflow-visible py-2">
                                <div className="p-2">
                                    <div className="flex flex-col gap-2 items-center">
                                        <div>#{tokenId}</div>
                                        <div className="italic text-sm">
                                            Owned by {formattedSellerAddress}
                                        </div>
                                        <Image
                                            alt="NFT Image"
                                            unoptimized
                                            loader={() => imageURI}
                                            src={imageURI}
                                            height="200"
                                            width="200"
                                        />
                                        <div className="font-bold">
                                            {ethers.formatUnits(price, "ether")} ETH
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}
