import * as ethers from 'ethers';
import StorageService from './storageService';
import JsonRpcService from './jsonRpcService';
import tracker from '../../tracker.json';
import { Tracker } from '../types';

export default class PetitionService {
  private contract: ethers.Contract;

  constructor(private storageService: StorageService, private jsonRpcService: JsonRpcService) {
    this.contract = this.jsonRpcService.contracts.Petition[0];
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
