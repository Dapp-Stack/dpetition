import { ethers } from 'ethers';
import { Petition, IdentityState } from '../types';
import { getContracts, provider } from './ethereumService';

export const createPetitionBody = async (state: IdentityState, petition: Petition) => {
  const contracts = await getContracts();
  const params = [petition.title, petition.description, petition.expireOn, petition.deposit];
  const wallet = new ethers.Wallet(state.privateKey, provider);
  const contract = new ethers.Contract(state.identityAddress, '', wallet);
  const nonce =  await contract.lastNonce();

  const message =  {
    to: contracts.Controller[0].address,
    from: state.identityAddress,
    value: 0,
    data: contracts.Controller[0].interface.functions.create.encode(params),
    gasToken: contracts.Token[0].address,
    nonce
  };
  const messageHash = calculateMessageHash(message);
  const signature = wallet.signMessage(ethers.utils.arrayify(messageHash));

  return {...message, signature};
};