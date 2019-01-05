import * as ethers from 'ethers';
import StorageService from './storageService';
import tracker from '../../tracker.json';
import { Tracker } from '../types';

const jsonRpcUrl = process.env.JSON_RPC_URL || 'http://localhost:8545';

export default class PetitionService {
  private provider: ethers.providers.JsonRpcProvider;
  private network!: ethers.utils.Network;
  private contract!: ethers.Contract;

  constructor(private storageService: StorageService) {
    this.provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl);
  }

  async initialize() {
    this.network = await this.provider.getNetwork()
    const contracts = (tracker as Tracker)[this.network.chainId];
    if(!contracts) {
      throw new Error("Contracts not deployed on this network")
    }

    Object.keys(contracts).forEach((address) => {
      if (contracts[address].name === 'Petition') {
        this.contract = new ethers.Contract(address, contracts[address].abi, this.provider);
      }
    })

    if(!this.contract) {
      throw new Error("Contract Petition not deployed on this network")
    }
  }

  public async all() {
    const length = await this.contract.length();
    const promises = [...Array(length.toNumber())].map((_, i) => this.contract.petitions(i));
    return await Promise.all(promises)
  }

  public async findById(id: string) {
    const petitions = await this.all();
    return petitions.find((petition) => petition.id === id);
  }
}
