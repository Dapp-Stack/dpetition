import { ethers } from 'ethers';
import { Petition, calculateHash, Message } from '@dpetition/lib';
import { BigNumber } from 'ethers/utils';
import { IdentityState, RootState } from '../types';

// tslint:disable-next-line
import identityJson from  "../../contracts/Identity/Identity.sol/Identity.json";

export const buildData = async (state: IdentityState, rootState: RootState, petition: Petition) => {
  const params = [petition.title, petition.description, petition.expireOn.getTime(), petition.deposit];
  console.dir(params)
  const wallet = new ethers.Wallet(state.privateKey, rootState.provider);
  const contract = new ethers.Contract(state.identityAddress, identityJson.abi, wallet);
  const nonce = await contract.lastNonce();

  contract.on("*", (event) => {
    console.dir(event)
  });

  const message: Message =  {
    to: rootState.contracts.Controller[0].address,
    from: state.identityAddress,
    value: new BigNumber(0),
    data: rootState.contracts.Controller[0].interface.functions.create.encode(params),
    gasToken: rootState.contracts.PetitionToken[0].address,
    operationType: '0',
    gasLimit: new BigNumber(1000000),
    gasPrice: new BigNumber(1000000000),
    chainId: rootState.network.chainId,
    nonce,
  };
  debugger
  const messageHash = calculateHash(message);
  const signature = await wallet.signMessage(ethers.utils.arrayify(messageHash));
  return {...message, signature};
};
