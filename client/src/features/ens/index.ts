import axios from 'axios';
import { Module, ActionTree, MutationTree } from 'vuex';
import { apiUrl } from '../../config';
import { RootState, EnsState } from '../../types';

export const defaultState: EnsState = {
  address: '',
};

export const actions: ActionTree<EnsState, RootState> = {
  find({ commit }, payload) {
    axios({
      url: `${apiUrl}/ens/${payload.username}`,
    }).then((response) => {
      const address: string = response && response.data;
      commit('ensAddressFound', address);
    }, (error) => {
      commit('ensAddressNotFound');
    });
  },
};

export const mutations: MutationTree<EnsState> = {
  ensAddressFound(state, payload: string) {
    state.address = payload;
  },
  ensAddressNotFound(state) {
    state.address = '';
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
