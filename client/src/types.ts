import { ethers } from 'ethers';
import { Contracts, Petition } from '@dpetition/lib';

export interface PetitionState {
  list: Petition[];
}

export interface EnsState {
  address: string;
}

export interface IdentityState {
  address: string;
  identityAddress: string;
  tokenBalance: 0;
  privateKey: string;
  ensName: string;
  executeSuccess: null | boolean;
  createSuccess: null | boolean;
}

export interface WalletState {
  main?: ethers.Wallet;
}

export interface RootState {
  network: ethers.utils.Network;
  contracts: Contracts;
  provider: ethers.providers.JsonRpcProvider;
  ipfsClient: any;
  ready: boolean;
}
