const { ethers } = require("ethers");

const ALCHEMY_SEPOLIA_URL =
  "https://eth-sepolia.g.alchemy.com/v2/xxx";
const wallet_address = "0xaAe8b076c5E84505420FA51799Bb4d6Eba241ecC";

async function main() {
  const providerSepolia = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);

  const balanceSepolia = await providerSepolia.getBalance(wallet_address);
  console.log("1. 查询Sepolia测试网的ETH余额");
  console.log(
    `Sepolia ETH Balance of vitalik: ${ethers.formatEther(balanceSepolia)} ETH`
  );

  console.log("\n2. 查询provider连接到了哪条链");
  const network = await providerSepolia.getNetwork();
  console.log(`getNetwork: `, network.toJSON()); // { name: 'sepolia', chainId: '11155111' }

  // 3. 查询区块高度
  console.log("\n3. 查询区块高度");
  const blockNumber = await providerSepolia.getBlockNumber();
  console.log(blockNumber);

  console.log("\n4. 查询钱包历史交易次数");
  const txCount = await providerSepolia.getTransactionCount(wallet_address);
  console.log(txCount);

  console.log("\n5. 查询当前建议的gas设置")
  const feeData = await providerSepolia.getFeeData();
  console.log(feeData);

  console.log("\n6. 查询区块信息")
  const block = await providerSepolia.getBlock(6268095);
  console.log(block);
}

main();
