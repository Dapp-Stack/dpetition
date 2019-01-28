import axios from 'axios';
import { Module, ActionTree, MutationTree } from 'vuex';
import { waitForTransactionReceipt, extractTransactionEvents, Petition } from '@dpetition/lib';
import { ethers } from 'ethers';

import { apiUrl } from '../../config';
import { RootState, PetitionState } from '../../types';
import { buildPetition, buildCreateInput } from '../../services/petitionService';
import petitionJson from '../../../contracts/Petition/Petition.sol/Petition.json';

export const defaultState: PetitionState = {
  list: [],
};

export const actions: ActionTree<PetitionState, RootState> = {
  async create({ commit, state, rootState }, payload: Petition) {
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
    const petition = await buildPetition(Object.values(txEvents.PetitionCreated), rootState);
    commit('addPetition', petition);
  },
  async list({ commit, rootState }) {
    const controller = rootState.contracts.Controller[0];
    const addresses: string[] = await controller.getAddresses();

    const promises = addresses.map(async (address) => {
      const petition = new ethers.Contract(address, petitionJson.abi, rootState.provider);
      const data = await petition.get();
      return await buildPetition(data, rootState);
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
};

const namespaced: boolean = true;

const profile: Module<PetitionState, RootState> = {
  namespaced,
  state: defaultState,
  actions,
  mutations,
};

export default profile;
