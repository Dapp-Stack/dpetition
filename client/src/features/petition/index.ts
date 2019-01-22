import { Module, ActionTree, MutationTree } from 'vuex';
import { Petition } from '@dpetition/lib';
import { RootState, PetitionState } from '../../types';

export const defaultState: PetitionState = {
  list: [],
};

export const actions: ActionTree<PetitionState, RootState> = {
  async fetch({ commit, rootState }) {
    const contract = rootState.contracts.Petition[0];
    const lengthHex = await contract.length();
    const length = parseInt(lengthHex, 10)

    const promises = Array(length).fill(0).map(async(_, i) => {
      const data = await contract.petitions(i)
      return {
        title: data[0] as string,
        description: data[1] as string,
        expireOn: new Date(parseInt(data[2])),
        deposit: Math.round(parseInt(data[4]))
      }
    })
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
