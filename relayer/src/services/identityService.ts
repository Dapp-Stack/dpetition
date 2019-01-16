import {ethers, utils, ContractFactory} from 'ethers';

import IERC20 from '../../contracts/IERC20.sol/IERC20.json';
import Identity from '../../contracts/Identity.sol/Identity.json';
import JsonRpcService from './jsonRpcService.js';
import EnsService from './ensService.js';
import AuthorisationService from './authorisationService.js';

const defaultDeployOptions = {
  gasLimit: utils.bigNumberify(3500000),
  gasPrice: utils.bigNumberify(9000000000)
};

const ether = '0x0000000000000000000000000000000000000000';

export default class IdentityService {
  private bytecode: string;
  private abi: any;

  constructor(private jsonRpcService: JsonRpcService,
              private ensService: EnsService,
              private authorisationService: AuthorisationService) {
    this.abi = Identity.abi;
    this.bytecode = `0x${Identity.bytecode}`;
  }

  async create(managementKey: string, ensName: string, overrideOptions = {}) {
    const key = this.addressToBytes32(managementKey);
    const ensArgs = await this.ensService.argsFor(ensName);
    console.dir(ensArgs)
    if (!ensArgs) {
      throw new Error('domain not existing / not universal ID compatible');
    }
    
    const args = [key, ...ensArgs];
    const deployTransaction = {
      ...defaultDeployOptions,
      ...overrideOptions,
      ...new ContractFactory(this.abi, this.bytecode).getDeployTransaction(...args)
    };
    return await this.jsonRpcService.wallet.sendTransaction(deployTransaction);
  }

  async executeSigned(message: any) {
    if (await this.hasEnoughToken(message.gasToken, message.from, message.gasLimit)) {
      const data = new utils.Interface(Identity.abi).functions.executeSigned.encode([
        message.to,
        message.value,
        message.data,
        message.nonce,
        message.gasPrice,
        message.gasToken,
        message.gasLimit,
        message.operationType,
        message.signature
      ]);
      const transaction = {
        ...defaultDeployOptions,
        value: utils.parseEther('0'),
        to: message.from,
        data
      };
      const estimateGas = await this.jsonRpcService.provider.estimateGas({...transaction, from: this.jsonRpcService.wallet.address});
      if (utils.bigNumberify(message.gasLimit).gte(estimateGas)) {
        if (message.to === message.from && this.isAddKeyCall(message.data)) {
          const key = this.getKeyFromData(message.data);
          this.authorisationService.removeRequest(message.from, key);
          const sentTransaction = await this.jsonRpcService.wallet.sendTransaction(transaction);
          return sentTransaction;
        } else if (message.to === message.from && this.isAddKeysCall(message.data)) {
          const sentTransaction = await this.jsonRpcService.wallet.sendTransaction(transaction);
          return sentTransaction;
        }
        return await this.jsonRpcService.wallet.sendTransaction(transaction);
      }
    }
    throw new Error('Not enough tokens');
  }

  private isAddKeyCall(data: string) {
    const addKeySighash = new utils.Interface(Identity.abi).functions.addKey.sighash;
    return addKeySighash === data.slice(0, addKeySighash.length);
  };
  

  private isAddKeysCall(data: string) {
    const addKeysSighash = new utils.Interface(Identity.abi).functions.addKeys.sighash;
    return addKeysSighash === data.slice(0, addKeysSighash.length);
  };

  private addressToBytes32 = (address: string) => utils.padZeros(utils.arrayify(address), 32);

  private getKeyFromData(data: string) {
    const codec = new utils.AbiCoder();
    const addKeySighash = new utils.Interface(Identity.abi).functions.addKey.sighash;
    const [address] = (codec.decode(['bytes32', 'uint256', 'uint256'], data.replace(addKeySighash.slice(2), '')));
    return utils.hexlify(utils.stripZeros(address));
  };

  private async hasEnoughToken(gasToken: string, identityAddress: string, gasLimit: ethers.utils.BigNumber) {
    const erc20Bytecode = '0x6080604052600436106100b95763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416630';
    if (gasToken === ether) {
      throw new Error('Ether refunds are not yet supported');
    } else if ((await this.jsonRpcService.provider.getCode(gasToken)).slice(2, 111) !== erc20Bytecode.slice(2, 111)) {
      throw new Error('Address isn`t token');
    } else {
      const token = new ethers.Contract(gasToken, IERC20.abi, this.jsonRpcService.provider);
      const identityTokenBalance = await token.balanceOf(identityAddress);
      return identityTokenBalance.gte(utils.bigNumberify(gasLimit));
    }
  };
  
}