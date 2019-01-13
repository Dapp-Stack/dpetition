import axios from 'axios';
import { Module, ActionTree, MutationTree } from 'vuex';
import { apiUrl } from '../../config';
import { RootState, EnsState } from '../../types';

export const defaultState: EnsState = {
  address: '',
  loading: false,
};

export const actions: ActionTree<EnsState, RootState> = {
  find({ commit }, payload) {
    commit('ensLoading');
    axios({
      url: `${apiUrl}/ens/${payload.username}`,
    }).then((response) => {
      const address: string = response && response.data;
      commit('ensAddressFound', address);
    }, () => {
      commit('ensAddressNotFound');
    });
  },
};

export const mutations: MutationTree<EnsState> = {
  ensLoading(state) {
    state.loading = true;
  },
  ensAddressFound(state, payload: string) {
    state.address = payload;
    state.loading = false;
  },
  ensAddressNotFound(state) {
    state.address = '';
    state.loading = false;
  },
};

const namespaced: boolean = true;

const profile: Module<EnsState, RootState> = {
  namespaced,
  state: defaultState,
  actions,
  mutations,
};

export default profile;
