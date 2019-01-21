import { Module, ActionTree, MutationTree } from 'vuex';
import { Petition } from '@dpetition/lib';
import { RootState, PetitionState } from '../../types';
import { ethers } from 'ethers';

export const defaultState: PetitionState = {
  list: [],
};

export const actions: ActionTree<PetitionState, RootState> = {
  async fetch({ commit, rootState }) {
    const contract = rootState.contracts.Petition[0];
    const length = await contract.length();
    debugger
    const promises = [];
    for (let i = 0; i++; i < parseInt(length, 10)) {
      promises.push(contract.petitions(i));
    }
    const petitions: Petition[] = await Promise.all(promises);
    commit('updatePetitions', petitions);
  },
};

export const mutations: MutationTree<PetitionState> = {
  updatePetitions(state, payload: Petition[]) {
    state.list = payload;
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
