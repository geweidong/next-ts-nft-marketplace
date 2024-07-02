import { useCallback, useEffect, useState, useRef } from "react"
import { ethers } from "ethers"
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalHeader, ModalContent, ModalFooter } from "@nextui-org/modal";
import nftMarketplaceAbi from "@/constants/NftMarketplace.json"
import {
    type BaseError,
    useWaitForTransactionReceipt,
    useWriteContract,
} from 'wagmi';
import { toast } from "react-toastify";
import { sepolia } from "viem/chains";

export const UpdateListingModal = ({
    isOpen,
    tokenId,
    marketplaceAddress,
    nftAddress,
    onOpenChange,
    fetchNfts,
}: Omit<INftCommonFunctionProps, 'price'>) => {
    const toastId = useRef<any>(null);
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState("0")

    const { error: transactionError, data: hash, writeContract } = useWriteContract()

    const notify = useCallback(() => toastId.current = toast(`Please waiting the trasaction...\n Trasaction hash: ${hash}`, { autoClose: false }), [hash]);

    const updateToastSuccess = () => toast.update(toastId.current, { render: 'DONE', type: 'success', autoClose: 1000 });

    const updateListing = useCallback(async (cb: () => void) => {
        writeContract({
            chainId: sepolia.id,
            address: marketplaceAddress,
            abi: nftMarketplaceAbi,
            functionName: 'updateListing',
            args: [nftAddress, tokenId, ethers.parseEther(priceToUpdateListingWith)]
        })
        cb();
    }, [marketplaceAddress, nftAddress, priceToUpdateListingWith, tokenId, writeContract])

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    useEffect(() => {
        if (isConfirming) {
            notify();
        }
        if (isConfirmed) {
            updateToastSuccess();

            setPriceToUpdateListingWith("0")
            fetchNfts();
        }
        if (transactionError) {
            toast.error((transactionError as BaseError).shortMessage || transactionError.message)
        }
    }, [isConfirmed, fetchNfts, isConfirming, transactionError, notify])

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
                            <Button color="primary" onPress={() => updateListing(onClose)}>
                                OK
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>

        </Modal>
    )
}
