const { ethers } = require('ethers');

const ALCHEMY_SEPOLIA_URL =
  "https://eth-sepolia.g.alchemy.com/v2/US9xf82FaAce6WVC1g3JIe91VCyepErb";
const wallet_address = "0xaAe8b076c5E84505420FA51799Bb4d6Eba241ecC";

const wallet_privite_key = 'xxxxxx';

async function main() {
  const providerSepolia = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);
  const wallet = new ethers.Wallet(wallet_privite_key, providerSepolia)

  const address = await wallet.getAddress()
  console.log('address:', address)
  const txCount = await providerSepolia.getTransactionCount(wallet)
  // or const txCount = await providerSepolia.getTransactionCount(wallet_address)
  console.log(`钱包1发送交易次数: ${txCount}`)
  // 钱包1发送交易次数: 206
}

async function eventListener() {
  const providerSepolia = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);
  // USDT的合约地址
  const contractAddress = '0xc236519289ad7d62780503d521CDb69931Ac2479'
  // 构建USDT的Transfer的ABI
  const abi = [
    "event ItemListed(address indexed seller,address indexed nftAddress,uint256 indexed tokenId,uint256 price)"
  ];
  // 生成USDT合约对象
  const contract = new ethers.Contract(contractAddress, abi, providerSepolia);

  // 只监听一次
  console.log("\n1. 利用contract.once()，监听一次ItemListed事件");
  contract.once('ItemListed', (seller, nftAddress, tokenId, price)=>{
    // 打印结果
    console.log({seller, nftAddress, tokenId, price})
  })
}

async function utils() {
  const res = ethers.formatUnits(121212121n, 'gwei')

  const oneGwei = ethers.getBigInt("1000000000"); // 从十进制字符串生成
  console.log(oneGwei)
  console.log(ethers.getBigInt("0x3b9aca00")) // 从hex字符串生成
  console.log(ethers.getBigInt(1000000000)) // 从数字生成
  // 不能从js最大的安全整数之外的数字生成BigNumber，下面代码会报错
  // ethers.getBigInt(Number.MAX_SAFE_INTEGER);
  console.log("js中最大安全整数：", Number.MAX_SAFE_INTEGER)
}

main();

eventListener();

utils();