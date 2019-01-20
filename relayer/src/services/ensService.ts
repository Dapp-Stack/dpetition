import { utils, ethers } from 'ethers';
import JsonRpcService from './jsonRpcService';

export default class EnsService {
  private ensContract: ethers.Contract;
  private resolverContract: ethers.Contract;

  constructor(jsonRpcService: JsonRpcService) {    
    this.ensContract = jsonRpcService.contracts.ENSRegistry[0]
    this.resolverContract = jsonRpcService.contracts.PublicResolver[0];
  }

  public async argsFor(ensName: string) {
    const [label, domain] = this.get2ndLevelDomainForm(ensName);
    const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
    const node = utils.namehash(ensName);
    const registrarAddress = await this.findRegistrar(domain);
    const resolverAddress = this.resolverContract.address;
    return [hashLabel, ensName, node, this.ensContract.address, registrarAddress, resolverAddress];
  }

  private async findRegistrar(domain: string) {
    const node = utils.namehash(domain);
    return await this.ensContract.owner(node);
  }

  private get2ndLevelDomainForm(ensName: string) {
    const labels = ensName.split('.');
    const {length} = labels;
    const label = labels.slice(0, length - 2).join('.');
    const domain = labels.slice(length - 2, length).join('.');
    return [label, domain];
  }
}