import { useCallback, useEffect, useRef } from "react"
import { Button } from "@nextui-org/button";
import { Modal, ModalHeader, ModalContent, ModalFooter } from "@nextui-org/modal";
import nftMarketplaceAbi from "@/constants/NftMarketplace.json"
import {
    type BaseError,
    useWaitForTransactionReceipt,
    useWriteContract,
} from 'wagmi';
import { toast } from "react-toastify";
import { sepolia } from "viem/chains";

export const BuyNft = ({
    isOpen,
    tokenId,
    marketplaceAddress,
    nftAddress,
    onOpenChange,
    fetchNfts,
    price,
}: INftCommonFunctionProps) => {
    const toastId = useRef<any>(null);

    const { error: transactionError, data: hash, writeContract } = useWriteContract()

    const notify = () => toastId.current = toast(`Please waiting the trasaction...\n Trasaction hash: ${hash}`, { autoClose: false });

    const updateToastSuccess = () => toast.update(toastId.current, { render: 'DONE', type: 'success', autoClose: 1000 });

    const buyItem = useCallback((onClose: () => void) => {
      writeContract({
        chainId: sepolia.id,
        address: marketplaceAddress,
        abi: nftMarketplaceAbi,
        functionName: 'buyItem',
        args: [price, nftAddress, tokenId],
      })
      onClose();
  }, [marketplaceAddress, price, nftAddress, tokenId, writeContract])

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
            fetchNfts();
        }
        if (transactionError) {
          console.log(transactionError)
          toast.error((transactionError as BaseError).shortMessage || transactionError.message)
        }
    }, [isConfirmed, fetchNfts, isConfirming, transactionError])

    return (
        <Modal
            onOpenChange={onOpenChange}
            isOpen={isOpen}
            id="regular"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Are you sure to buy this NFT?</ModalHeader>
                        <ModalFooter>
                            <Button color="default" variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={() => buyItem(onClose)}>
                                Buy
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>

        </Modal>
    )
}
