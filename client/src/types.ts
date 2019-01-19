import { ethers } from 'ethers';

export interface Petition {
  title: string;
  description: string;
  expireOn: Date;
  deposit: number;
}

export interface PetitionState {
  list: Petition[];
  fetchError: boolean;
  createError: boolean;
}

export interface EnsState {
  address?: string;
  loading: boolean;
  notFound: boolean;
}

export interface IdentityState {
  loading: boolean;
  address: string;
  privateKey: string;
  ensName: string;
  transaction: ethers.utils.Transaction | null;
  error: Error | null;
}

export interface RootState {
  apiAvailable: boolean;
  network: ethers.utils.Network | null;
  contracts: { [name: string]: ethers.Contract[] };
}
