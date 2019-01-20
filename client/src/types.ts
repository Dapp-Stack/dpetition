import { ethers } from 'ethers';

export interface PetitionState {
  list: Petition[];
}

export interface EnsState {
  address: string;
}

export interface IdentityState {
  address: string;
  identityAddress: string;
  privateKey: string;
  ensName: string;
  executeSuccess: null | boolean,
  createSuccess: null | boolean
}

export interface RootState {
  apiAvailable: boolean;
  network: ethers.utils.Network;
  contracts: Contracts;
}
