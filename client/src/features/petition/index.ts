import axios from 'axios';
import { Module, ActionTree, MutationTree } from 'vuex';
import { waitForTransactionReceipt, extractTransactionEvents, Petition } from '@dpetition/lib';
import { ethers } from 'ethers';

import { apiUrl } from '../../config';
import { RootState, PetitionState } from '../../types';
import { buildPetition, buildCreateInput, buildSignInput } from '../../services/petitionService';
import petitionJson from '../../../contracts/Petition/Petition.sol/Petition.json';

export const defaultState: PetitionState = {
  list: [],
};

export const actions: ActionTree<PetitionState, RootState> = {
  async create({ commit, rootState }, payload: Petition) {
    const data = await buildCreateInput(rootState, payload);
    const response = await axios({
      url: `${apiUrl}/identity/execution`,
      method: 'POST',
      data,
    });
    const transaction: ethers.utils.Transaction = response && response.data;
    if (!transaction.hash) {
      return;
    }
    const receipt = await waitForTransactionReceipt(rootState.provider, transaction.hash);
    const txEvents = extractTransactionEvents(receipt, rootState.contracts.Controller[0]);
    if (!txEvents.PetitionCreated) {
      return;
    }
    const result = await buildPetition(Object.values(txEvents.PetitionCreated), [], rootState);
    commit('addPetition', result);
  },
  async sign({ commit, rootState }, payload: Petition) {
    if (!payload.address) {
      return;
    }
    const data = await buildSignInput(rootState, payload);
    const response = await axios({
      url: `${apiUrl}/identity/execution`,
      method: 'POST',
      data,
    });
    const transaction: ethers.utils.Transaction = response && response.data;
    if (!transaction.hash) {
      return;
    }
    const receipt = await waitForTransactionReceipt(rootState.provider, transaction.hash);
    const contract = new ethers.Contract(payload.address, petitionJson.abi, rootState.provider);
    const txEvents = extractTransactionEvents(receipt, contract);
    if (!txEvents.PetitionSigned) {
      return;
    }
    commit('signPetition', {address: payload.address, signer: txEvents.PetitionSigned[0]});
  },
  async list({ commit, rootState }) {
    const controller = rootState.contracts.Controller[0];
    const addresses: string[] = await controller.getAddresses();

    const promises = addresses.map(async (address) => {
      const contract = new ethers.Contract(address, petitionJson.abi, rootState.provider);
      const data = await contract.get();
      const signers = await contract.getSigners();
      return await buildPetition(data, signers, rootState);
    });
    const petitions: Petition[] = await Promise.all(promises);
    commit('updatePetitions', petitions);
  },
};

export const mutations: MutationTree<PetitionState> = {
  updatePetitions(state, payload: Petition[]) {
    state.list = payload;
  },
  addPetition(state, payload: Petition) {
    state.list.push(payload);
  },
  signPetition(state, payload: { address: string, signer: string}) {
    const petition = state.list.find((p) => p.address === payload.address);
    if (!petition) {
      return;
    }
    petition.signers.push(payload.signer);
  },
};

const namespaced: boolean = true;

const petition: Module<PetitionState, RootState> = {
  namespaced,
  state: defaultState,
  actions,
  mutations,
};

export default petition;
