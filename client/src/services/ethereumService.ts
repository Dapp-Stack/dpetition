import { ethers } from 'ethers';
import { Tracker } from '../types';

const jsonRpcUrl = process.env.JSON_RPC_URL || 'http://localhost:8545';
export const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl);

declare global {
  interface Window { 
    tracker: Tracker;
  }
}

interface Contracts {
  [name: string]: ethers.Contract[];
};

export const getContracts = async (): Promise<Contracts> => {
  const network = await provider.getNetwork();
  const contracts = window.tracker[network.chainId];
  if(!contracts) {
    throw new Error("Contracts not deployed on this network")
  }
  return Object.keys(contracts).reduce((acc: Contracts, address) => {
    const { name, abi } = contracts[address]
    const contract = new ethers.Contract(address, abi, provider);
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push(contract);
    return acc;
  }, {});
}

export const waitForTransactionReceipt = async (transactionHash: string, tick = 1000) => {
  let receipt = await provider.getTransactionReceipt(transactionHash);
  do {
    receipt = await provider.getTransactionReceipt(transactionHash);
    await sleep(tick);
  } while (!receipt || !receipt.blockHash);
  return receipt;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
