import { ethers } from 'ethers';
import { IdentityState, RootState } from '../types';
import { Petition, calculateHash, Message } from '@dpetition/lib';
import { BigNumber } from 'ethers/utils';

export const buildData = async (state: IdentityState, rootState: RootState, petition: Petition) => {
  const params = [petition.title, petition.description, petition.expireOn, petition.deposit];
  const wallet = new ethers.Wallet(state.privateKey, rootState.provider);
  const contract = new ethers.Contract(state.identityAddress, '', wallet);
  const nonce =  await contract.lastNonce();

  const message: Message =  {
    to: rootState.contracts.Controller[0].address,
    from: state.identityAddress,
    value: new BigNumber(0),
    data: rootState.contracts.Controller[0].interface.functions.create.encode(params),
    gasToken: rootState.contracts.PetitionToken[0].address,
    operationType: '',
    gasLimit: new BigNumber(1),
    gasPrice: new BigNumber(1),
    chainId: rootState.network.chainId,
    nonce,
  };
  const messageHash = calculateHash(message);
  const signature = wallet.signMessage(ethers.utils.arrayify(messageHash));

  return {...message, signature};
};
