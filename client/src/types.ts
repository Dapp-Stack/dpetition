import { ethers } from 'ethers';
import { Contracts, Petition } from '@dpetition/lib';

export interface Balances {
  [currency: string]: string;
}

export interface PetitionState {
  list: Petition[];
}

export interface EnsState {
  address: string;
}

export interface IdentityState {
  address: string;
  ensName: string;
  balances: Balances;
}

export interface WalletState {
  local: {
    address: string,
    privateKey: string,
  };
  remote: {
    address: string;
    privateKey: string;
    mnemonic: string;
    balances: Balances;
  };
}

export interface RootState {
  network: ethers.utils.Network;
  contracts: Contracts;
  provider: ethers.providers.JsonRpcProvider;
  ipfsClient: any;
  ready: boolean;
  ethUsdPrice: number;
  ens: EnsState;
  identity: IdentityState;
  wallet: WalletState;
  petition: PetitionState;
}
