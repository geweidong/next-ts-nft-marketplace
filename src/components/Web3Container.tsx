import { useCallback, useEffect, useState, useRef } from "react";
import NftList from "@/components/NftList";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import { type BaseError, useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import nftMarketplaceAbi from "@/constants/NftMarketplace.json"
import networkMapping from "@/constants/networkMapping.json";
import { Button } from "@nextui-org/button";
import { sepolia } from 'wagmi/chains';
import { toast } from "react-toastify";
import { ethers } from "ethers";

const netWorkChainId = sepolia.id;

const nftMarketPlaceAddress = networkMapping[netWorkChainId].NftMarketplace[0] as `0x${string}`
const basicNftAddress = networkMapping[netWorkChainId].BasicNft[0]

export default function Web3Container() {
  const toastId = useRef<any>(null);
  const { error: withdrawProceedsError, data: withdrawProceedsHash, writeContract } = useWriteContract()
  const { address: walletAddress } = useAccount();
  const balanceData = useReadContract({
    abi: nftMarketplaceAbi,
    address: nftMarketPlaceAddress,
    functionName: 'getProceeds',
    args: [walletAddress],
  })

  const withdraw = useCallback(async () => {
    writeContract({
      chainId: sepolia.id,
      address: nftMarketPlaceAddress,
      abi: nftMarketplaceAbi,
      functionName: 'withdrawProceeds',
    })
  }, [writeContract])
  const notify = useCallback(() => toastId.current = toast(`Please waiting the trasaction...\n Trasaction hash: ${withdrawProceedsHash}`, { autoClose: false }), [withdrawProceedsHash]);
  const updateToastSuccess = () => toast.update(toastId.current, { render: 'DONE', type: 'success', autoClose: 1000 });
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: withdrawProceedsHash })

  useEffect(() => {
    if (isConfirming) {
        notify();
    }
    if (isConfirmed) {
        updateToastSuccess();
        balanceData.refetch();
    }
    if (withdrawProceedsError) {
      console.log(withdrawProceedsError)
      toast.error((withdrawProceedsError as BaseError).shortMessage || withdrawProceedsError.message)
    }
}, [balanceData, isConfirmed, isConfirming, notify, withdrawProceedsError])

  return (
    <div>
      <NftList
        nftMarketPlaceAddress={nftMarketPlaceAddress as `0x${string}`}
        nftAddress={basicNftAddress as `0x${string}`}
      />
      {/* <div className="flex mt-3">
        <Card>
          <CardBody>
            <p>My current balance：</p>
            <p>{ethers.formatUnits(balanceData.data as bigint || 0, "ether")} ETH</p>
            <Button color="default" variant="light" onPress={withdraw}>
              Withdraw
            </Button>
          </CardBody>
        </Card>
      </div> */}
    </div>
  )
}