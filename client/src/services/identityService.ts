import { ethers } from 'ethers';
import { Petition, calculateHash, Message } from '@dpetition/lib';
import { BigNumber } from 'ethers/utils';
import { IdentityState, RootState } from '../types';
import identityJson from  "../../contracts/Identity/Identity.sol/Identity.json";

export const buildData = async (state: IdentityState, rootState: RootState, petition: Petition) => {
  debugger
  const params = [petition.title, petition.description, petition.expireOn.getTime(), petition.deposit];
  debugger
  const wallet = new ethers.Wallet(state.privateKey, rootState.provider);
  debugger
  const contract = new ethers.Contract(state.identityAddress, identityJson.abi, wallet);
  debugger
  debugger
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
    nonce: 0
  };
  debugger
  const messageHash = calculateHash(message);
  debugger
  const signature = wallet.signMessage(ethers.utils.arrayify(messageHash));
  debugger
  return {...message, signature};
};
