import { Contract } from 'ethers';
import { JsonRpcProvider } from 'ethers/providers';
import { Network } from 'ethers/utils';

export interface Petition {
  title: string;
  description: string;
}

export interface Contracts {
  [name: string]: Contract;
}

export interface RootState {
  contracts: Contracts;
  petitions: { [title: string]: Petition };
  network: null | Network;
  provider: null | JsonRpcProvider;
}
