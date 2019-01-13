import { ethers } from 'ethers';

export interface Petition {
  title: string;
  description: string;
}

export interface PetitionState {
  list: Petition[];
  error: boolean;
}

export interface EnsState {
  address: string;
}

export interface RootState {
  apiAvailable: boolean;
  network: ethers.utils.Network | null;
  contracts: { [name: string]: ethers.Contract[] };
}
