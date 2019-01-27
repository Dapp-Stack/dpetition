import { Module, ActionTree, MutationTree } from 'vuex';
import { Petition } from '@dpetition/lib';
import { RootState, PetitionState } from '../../types';
import { buildPetition } from '../../services/petitionService';
import petitionJson from '../../../contracts/Petition/Petition.sol/Petition.json';
import { ethers } from 'ethers';

export const defaultState: PetitionState = {
  list: [],
};

export const actions: ActionTree<PetitionState, RootState> = {
  async fetch({ commit, rootState }) {
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

  async listen({ commit, rootState }) {
    const contract = rootState.contracts.Controller[0];
    contract.on('PetitionCreated', async (...args: any[]) => {
      const petition = await buildPetition(args, rootState);
      commit('addPetition', petition);
    });
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
