import * as React from 'react'
import { type BaseError, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { createPublicClient, http, parseEther } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
 
const client = createPublicClient({
  chain: sepolia,
  transport: http(),
})

/**
 发现问题：isConfirming一直是true，没有转化为isConfirmed
 解决问题：更换成alchemy 的 RPC 就好了
 */
export function SendTransaction() {
  const {
    data: hash,
    error,
    isPending,
    sendTransaction,
  } = useSendTransaction();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const to = formData.get('address') as `0x${string}`
    const value = formData.get('value') as string
    sendTransaction({ to, value: parseEther(value) })
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })
  
  React.useEffect(() => {
    async function run() {
      const blockNumber = await client.getBlockNumber() 
      console.log({ blockNumber })
    }
    run();

    console.log(parseEther('0.001233'), "parseEther('0.001233')")
  }, [])

  return (
    <form onSubmit={submit}>
      <div>
        <label htmlFor="to" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">to: </label>
        <input
          type="text" id="to" name="address"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="0xA0Cf…251e" required />
      </div>
      <div>
        <label htmlFor="from" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">value: </label>
        <input
          type="text" id="from" name="value"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="0.05" required />
      </div>
      <button 
        disabled={isPending}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="submit">
          {isPending ? 'Confirming...' : 'Send'}
        </button>
      {hash && <div>Transaction Hash: {hash}</div>}

      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}

      {error && (
        <div className='mt-2 text-xs text-red-600 dark:text-red-400'>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </form>
  )
}