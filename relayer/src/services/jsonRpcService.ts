import * as ethers from 'ethers';
import tracker from '../../tracker.json';
import { Tracker } from '../types';

const jsonRpcUrl = process.env.JSON_RPC_URL || 'http://localhost:8545';
const privateKey = process.env.PRIVATE_KEY || '';

export default class JsonRpcService {
  public provider: ethers.providers.JsonRpcProvider;
  public wallet: ethers.Wallet;
  public network!: ethers.utils.Network;
  public contracts!: { [name: string]: ethers.Contract[] };

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
  }

  async initialize() {
    this.network = await this.provider.getNetwork()
    const contracts = (tracker as Tracker)[this.network.chainId];
    if(!contracts) {
      throw new Error("Contracts not deployed on this network")
    }

    Object.keys(contracts).forEach((address) => {
      const contract = new ethers.Contract(address, contracts[address].abi, this.provider);
        this.contracts[contracts[address].name].push(contract)
    });
  }
}
