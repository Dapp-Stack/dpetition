import {ethers, utils, ContractFactory} from 'ethers';
import { addressToBytes32 } from '@dpetition/lib';

import Identity from '../../contracts/Identity/Identity.sol/Identity.json';
import JsonRpcService from './jsonRpcService.js';
import EnsService from './ensService.js';
import AuthorisationService from './authorisationService.js';

const defaultDeployOptions = {
  gasLimit: utils.bigNumberify(3500000),
  gasPrice: utils.bigNumberify(9000000000)
};

export default class IdentityService {
  private petitionToken: ethers.Contract;
  private bytecode: string;
  private abi: any;

  constructor(private jsonRpcService: JsonRpcService,
              private ensService: EnsService,
              private authorisationService: AuthorisationService) {
    this.abi = Identity.abi;
    this.bytecode = `0x${Identity.bytecode}`;
    this.petitionToken = jsonRpcService.contracts.PetitionToken[0];
  }

  async create(address: string, ensName: string, overrideOptions = {}) {
    const key = addressToBytes32(address);
    const ensArgs = await this.ensService.argsFor(ensName);
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
    if (!await this.hasEnoughToken(message.from, message.gasLimit)) { 
      throw new Error('Not enough tokens');
    }

    const transaction = this.buildTransaction(message);
    const { wallet, provider } = this.jsonRpcService;
    // const estimateGas = await provider.estimateGas({...transaction, from: wallet.address});
    // if (!utils.bigNumberify(message.gasLimit).gte(estimateGas)) {
    //   throw new Error('Not enough Gas');
    // }

    if (message.to === message.from && this.isAddKeyCall(message.data)) {
      const key = this.getKeyFromData(message.data);
      this.authorisationService.removeRequest(message.from, key);
      return await wallet.sendTransaction(transaction);
    } else if (message.to === message.from && this.isAddKeysCall(message.data)) {
      return await wallet.sendTransaction(transaction);
    }

    const contract = new ethers.Contract(message.from, Identity.abi, wallet);
    console.dir("MESSAGE")
    console.dir([
      message.to,
      0,
      message.data,
      0,
      1000000000,
      message.gasToken,
      1000000,
      0,
      message.signature
    ])
    // address to,
    //     uint256 value,
    //     bytes memory data,
    //     uint nonce,
    //     uint gasPrice,
    //     address gasToken,
    //     uint gasLimit,
    //     OperationType operationType,
    //     bytes memory signatures
    return await contract.executeSigned(
      message.to,
      0,
      message.data,
      0,
      1000000000,
      message.gasToken,
      1000000,
      0,
      message.signature
    )
    
    // return await this.jsonRpcService.wallet.sendTransaction(transaction);
  }

  private buildTransaction(message: any) {
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
    
    return {
      ...defaultDeployOptions,
      value: utils.parseEther('0'),
      to: message.from,
      data
    };
  }

  private isAddKeyCall(data: string) {
    const addKeySighash = new utils.Interface(Identity.abi).functions.addKey.sighash;
    return addKeySighash === data.slice(0, addKeySighash.length);
  };
  
  private isAddKeysCall(data: string) {
    const addKeysSighash = new utils.Interface(Identity.abi).functions.addKeys.sighash;
    return addKeysSighash === data.slice(0, addKeysSighash.length);
  };

  private getKeyFromData(data: string) {
    const codec = new utils.AbiCoder();
    const addKeySighash = new utils.Interface(Identity.abi).functions.addKey.sighash;
    const [address] = (codec.decode(['bytes32', 'uint256', 'uint256'], data.replace(addKeySighash.slice(2), '')));
    return utils.hexlify(utils.stripZeros(address));
  };

  private async hasEnoughToken(identityAddress: string, gasLimit: ethers.utils.BigNumber) {
    const identityTokenBalance = await this.petitionToken.balanceOf(identityAddress);
    return true
    return identityTokenBalance.gte(utils.bigNumberify(gasLimit));
  };
  
}