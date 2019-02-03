import { ethers, utils } from "ethers";

export interface Tracker {
  [chainId: string]: {
    [address: string]: {
      name: string;
      abi: Array<any>;
    }
  }
}

export interface Petition {
  address?: string;
  title: string;
  description: string;
  expireOn: Date;
  signers: string[];
}

export interface Contracts {
  [name: string]: ethers.Contract[];
};

export interface Message extends utils.Transaction {
  gasToken: string;
  operationType: string;
}