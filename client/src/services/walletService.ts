import { ethers } from 'ethers';

export const buildWallet = (provider: ethers.providers.JsonRpcProvider, privateKey?: string, mnemonic?: string) => {
  let wallet: ethers.Wallet | null;
  if (privateKey) {
    wallet = new ethers.Wallet(privateKey, provider);
  } else if (mnemonic) {
    wallet = ethers.Wallet.fromMnemonic(mnemonic);
  } else {
    wallet = null;
  }

  if (!wallet) {
    throw new Error('private key or mnemonic are required');
  }
  wallet.connect(provider);
  return wallet;
};
