import * as ethers from 'ethers';
import tracker from '../../tracker.json';
import { loadContracts } from "@dpetition/lib/contracts";
import { Contracts } from "@dpetition/lib/types";

const jsonRpcUrl = process.env.JSON_RPC_URL || 'http://localhost:8545';
const privateKey = process.env.PRIVATE_KEY || '';

export default class JsonRpcService {
  public provider: ethers.providers.JsonRpcProvider;
  public wallet: ethers.Wallet;
  public network!: ethers.utils.Network;
  public contracts: Contracts = {};

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
  }

  async initialize() {
    this.network = await this.provider.getNetwork()
    this.contracts = loadContracts(this.network, tracker, this.provider) 
  }
}
