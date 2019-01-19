import axios from 'axios';
import { Module, ActionTree, MutationTree } from 'vuex';
import { apiUrl } from '../../config';
import { RootState, PetitionState, Petition } from '../../types';

export const defaultState: PetitionState = {
  list: [],
  fetchError: false,
};

export const actions: ActionTree<PetitionState, RootState> = {
  fetch({ commit }) {
    axios({
      url: `${apiUrl}/petitions`,
    }).then((response) => {
      const payload: Petition[] = response && response.data;
      commit('petitionsLoaded', payload);
    }, (error) => {
      commit('petitionsError');
    });
  },
};

export const mutations: MutationTree<PetitionState> = {
  petitionsLoaded(state, payload: Petition[]) {
    state.fetchError = false;
    state.list = payload;
  },
  petitionsError(state) {
    state.fetchError = true;
    state.list = [];
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
