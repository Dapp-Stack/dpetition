import { providers } from "ethers";

export const waitForTransactionReceipt = async (provider: providers.JsonRpcProvider, transactionHash: string, tick = 1000) => {
  let receipt = await provider.getTransactionReceipt(transactionHash);
  do {
    receipt = await provider.getTransactionReceipt(transactionHash);
    await sleep(tick);
  } while (!receipt || !receipt.blockHash);
  return receipt;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));