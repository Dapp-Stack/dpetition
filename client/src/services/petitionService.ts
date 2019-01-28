import { ethers } from 'ethers';
import { Petition, calculateHash, Message } from '@dpetition/lib';
import { IdentityState, RootState } from '../types';
import { BigNumber } from 'ethers/utils';
import { get, add } from './ipfsService';

import identityJson from '../../contracts/Identity/Identity.sol/Identity.json';

export const buildPetition = async (data: string[], rootState: RootState): Promise<Petition> => {
  const description = await get(rootState.ipfsClient, data[2]);
  return {
    address: data[0] as string,
    title: data[1] as string,
    description,
    expireOn: new Date(parseInt(data[3], 10)),
    deposit: Math.round(parseInt(data[4], 10)),
  };
};

export const buildCreateInput = async (rootState: RootState, petition: Petition) => {
  const descriptionHash = await add(rootState.ipfsClient, petition.description);
  const params = [petition.title, descriptionHash, petition.expireOn.getTime(), petition.deposit];
  const wallet = new ethers.Wallet(rootState.identity.privateKey, rootState.provider);
  const contract = new ethers.Contract(rootState.identity.identityAddress, identityJson.abi, wallet);
  const nonce = await contract.lastNonce();

  const message: Message =  {
    to: rootState.contracts.Controller[0].address,
    from: rootState.identity.identityAddress,
    value: new BigNumber(0),
    data: rootState.contracts.Controller[0].interface.functions.create.encode(params),
    gasToken: rootState.contracts.ERC20Mintable[0].address,
    operationType: '0',
    gasLimit: new BigNumber(5000000),
    gasPrice: new BigNumber(1000000000),
    chainId: rootState.network.chainId,
    nonce,
  };

  const messageHash = calculateHash(message);
  const signature = await wallet.signMessage(ethers.utils.arrayify(messageHash));
  return {...message, signature};
};

