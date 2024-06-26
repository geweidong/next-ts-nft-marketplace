import Image from "next/image";
import { ethers } from "ethers";
import { truncateStr } from "@/utils";
import { toast } from "react-toastify";
import { useZustandStore } from "@/store";
import { useState, useEffect, useCallback } from "react";
import nftAbi from "../constants/BasicNft.json";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import { useEvmRunContractFunction } from "@moralisweb3/next";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { UpdateListingModal } from "./UpdateListingModal";
import { useDisclosure } from "@nextui-org/modal";

export default function NFTBox({
    price,
    nftAddress,
    tokenId,
    marketplaceAddress,
    seller,
}: {
    price: ethers.BigNumberish
    nftAddress: string
    tokenId: string
    marketplaceAddress: string
    seller?: string
}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [showModal, setShowModal] = useState(false)
    const { walletAddress, isWeb3Enabled } = useZustandStore((state) => ({
        walletAddress: state.walletAddress,
        isWeb3Enabled: state.isWeb3Enabled,
    }));
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
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const fetchRes = await fetch(requestURL);
            const tokenURIResponse = await (fetchRes).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }, [fetchContractFunction, nftAddress, tokenId])

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled, updateUI])

    const isOwnedByUser = seller?.toLowerCase() === walletAddress.toLowerCase() || seller === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)
    
    const buyItem = useCallback(() => {
        return fetchContractFunction({
            abi: nftMarketplaceAbi,
            address: marketplaceAddress,
            functionName: "buyItem",
            params: {
                buyItem: price,
                nftAddress: nftAddress,
                tokenId: tokenId,
            },
        })
    }, [fetchContractFunction, marketplaceAddress, nftAddress, price, tokenId])

    const handleCardClick = useCallback(() => {
        isOwnedByUser
            ? onOpen()
            : buyItem()
    }, [buyItem, isOwnedByUser, onOpen])

    // const handleBuyItemSuccess = async (tx) => {
    //     await tx.wait(1)
    //     toast.success("Item bought!")
    // }

    return (
        <div>
            <UpdateListingModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                tokenId={tokenId}
                marketplaceAddress={marketplaceAddress}
                nftAddress={nftAddress}
            />
            <div>
                {imageURI ? (
                    <div onClick={handleCardClick} className="cursor-pointer">
                        <Card className="py-4">
                            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                <p className="text-tiny uppercase font-bold">{tokenName}</p>
                                <small className="text-default-500">{tokenDescription}</small>
                            </CardHeader>
                            <CardBody className="overflow-visible py-2">
                                <div className="p-2">
                                    <div className="flex flex-col items-end gap-2">
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
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    )
}
