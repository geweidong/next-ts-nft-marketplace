import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react' 
import { parseEther, formatEther } from 'viem'
import { config } from '@/config/wagmi'
import { queryClient } from '@/pages/_app'
import { ConnectKitButton } from "connectkit";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName, useBlockNumber, useBalance, useBlock } from 'wagmi'
import Image from 'next/image';
import { SendTransaction } from './sendTransaction';
import { account, publicClient } from '@/config/viem';
import Contract from './contract';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts'

function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  return (
    <div>
      {ensAvatar && <Image alt="ENS Avatar" src={ensAvatar} />}
      {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
      <button className="btn"
      onClick={() => disconnect()}>Disconnect</button>
    </div>
  )
}

export default function App() {
  const { isConnected } = useAccount();
  const { address } = useAccount()
  const { data: blockNumber } = useBlockNumber({ watch: true })
  const { data: balance, queryKey } = useBalance({
    address,
  })

  // 获取区块信息
  const { data: block } = useBlock({ blockNumber })
  
  useEffect(() => {
    // 每次区块变化时，重新获取余额，此处代码演示了如何使用invalidateQueries来刷新数据
    queryClient.invalidateQueries({ queryKey })
  }, [blockNumber])

  const runSign = async () => {

    try {
      const privateKey = generatePrivateKey()
      const account = privateKeyToAccount(privateKey);
      const signature = await account.signMessage({
        message: 'hello world',
      })
      const valid = await publicClient.verifyMessage({
        address: account.address,
        message: 'hello world',
        signature,
      })
      console.log({account, valid}, 'verifyMessage')
    } catch(err) {
      console.log(err, 'err')
    }
  }

  useEffect(() => {
    async function run() {
      const chainId = await publicClient.getChainId() 
      const data = await publicClient.call({ 
        account,
        data: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      })
    }
    run();
  }, [])

  return <div>
    <h1>学习wagmi：</h1>
    <br />
    balance余额：
    {balance && <span>{formatEther(balance?.value!)}</span>}
    <ConnectKitButton />
    {isConnected && (
      <>
        <Account />
        <SendTransaction />
        <Contract />
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={runSign}>签名</button>
      </>
    )}
  </div>
}