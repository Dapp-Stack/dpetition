import { Module, ActionTree, MutationTree } from 'vuex';
import { Petition } from '@dpetition/lib';
import { RootState, PetitionState } from '../../types';
import { buildPetition } from '../../services/petitionService';

export const defaultState: PetitionState = {
  list: [],
};

export const actions: ActionTree<PetitionState, RootState> = {
  async fetch({ commit, rootState }) {
    const contract = rootState.contracts.Petition[0];
    const lengthHex = await contract.length();
    const length = parseInt(lengthHex, 10);

    const promises = Array(length).fill(0).map(async (_, i) => {
      const data = await contract.petitions(i);
      data.unshift(i);
      return buildPetition(data);
    });
    const petitions: Petition[] = await Promise.all(promises);
    commit('updatePetitions', petitions);
  },

  async listen({ commit, rootState }) {
    const contract = rootState.contracts.Petition[0];
    contract.on('PetitionCreated', (...args: any[]) => {
      const petition = buildPetition(args);
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
