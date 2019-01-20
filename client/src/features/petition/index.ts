import { Module, ActionTree, MutationTree } from 'vuex';
import { RootState, PetitionState } from '../../types';

export const defaultState: PetitionState = {
  list: [],
};

export const actions: ActionTree<PetitionState, RootState> = {
  async fetch({ commit, rootState }) {
    const contract = rootState.contracts.Petition
    const promises = []
    const length = await contract.length();

    for(let i=0; i++; i < length) {
      promises.push(contract.petitions(i));
    }
    const petitions: Petition[] = await Promise.all(promises);
    commit('updatePetitions', petitions);
  },
};

export const mutations: MutationTree<PetitionState> = {
  updatePetitions(state, payload: Petition[]) {
    state.list = payload;
  }
};

const namespaced: boolean = true;

const profile: Module<PetitionState, RootState> = {
  namespaced,
  state: defaultState,
  actions,
  mutations,
};

export default profile;
