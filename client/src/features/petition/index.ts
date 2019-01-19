import axios from 'axios';
import { Module, ActionTree, MutationTree } from 'vuex';
import { apiUrl } from '../../config';
import { RootState, PetitionState, Petition } from '../../types';

export const defaultState: PetitionState = {
  list: [],
  createError: false,
  fetchError: false,
};

export const actions: ActionTree<PetitionState, RootState> = {
  create({ commit }, payload: Petition) {
    axios({
      url: `${apiUrl}/identity/execution`,
    }).then((response) => {
      commit('petitionsCreated', payload);
    }, (error) => {
      commit('petitionsNotCreated');
    });
  },
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
  petitionsCreated(state, payload: Petition) {
    state.list.push(payload);
    state.createError = false;
  },
  petitionsNotCreated(state) {
    state.createError = true;
  },
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
