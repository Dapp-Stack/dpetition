import { ethers } from 'ethers';

export const apiUrl = process.env.API_URL || 'http://localhost:3000';
export const jsonRpcUrl = process.env.JSON_RPC_URL || 'http://localhost:8545';
export const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl);
export const ensSuffix = 'petition.eth';
