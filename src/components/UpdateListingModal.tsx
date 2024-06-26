import { useEffect, useState } from "react"
import { ethers } from "ethers"
import Image from "next/image"
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalHeader, ModalContent, ModalFooter } from "@nextui-org/modal";
import { toast } from "react-toastify";

export interface UpdateListingModalProps {
    isOpen?: boolean
    onOpenChange: (isOpen: boolean) => void;
    tokenId: string
    marketplaceAddress: string
    nftAddress: string
}

export const UpdateListingModal = ({
    isOpen,
    tokenId,
    marketplaceAddress,
    nftAddress,
    onOpenChange,
}: UpdateListingModalProps) => {
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState("0")

    const handleUpdateListingSuccess = async (tx: any) => {
        await tx.wait(1)
        toast.success("listing updated")
        setPriceToUpdateListingWith("0")
    }

    // const { runContractFunction: updateListing } = useWeb3Contract({
    //     abi: nftMarketplaceAbi,
    //     contractAddress: marketplaceAddress,
    //     functionName: "updateListing",
    //     params: {
    //         nftAddress: nftAddress,
    //         tokenId: tokenId,
    //         newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
    //     },
    // })

    return (
        <Modal
            onOpenChange={onOpenChange}
            isOpen={isOpen}
            id="regular"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">NFT Details</ModalHeader>
                        <ModalBody>
                            <Input
                                label="Update listing price in L1 Currency (ETH)"
                                name="New listing price"
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setPriceToUpdateListingWith(event.target.value)
                                }}
                                type="number"
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="default" variant="light" onPress={onClose}>
                                Leave it
                            </Button>
                            <Button color="primary" onPress={() => {
                                onClose()
                                // updateListing({
                                //     onError: (error) => {
                                //         console.log(error)
                                //     },
                                //     onSuccess: handleUpdateListingSuccess,
                                // })
                            }}>
                                OK
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>

        </Modal>
    )
}
