import { utils, Contract, providers } from "ethers";
import { Tracker, Contracts } from "./types";

export const loadContracts = (network: utils.Network, tracker: Tracker, provider: providers.JsonRpcProvider) => {
  const contracts = tracker[network.chainId];
  if(!contracts) {
    throw new Error("Contracts not deployed on this network")
  }
  return Object.keys(contracts).reduce((acc: Contracts, address) => {
    const { name, abi } = contracts[address]
    const contract = new Contract(address, abi, provider);
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push(contract);
    return acc;
  }, {});
}