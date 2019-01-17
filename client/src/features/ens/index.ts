import axios from 'axios';
import { Module, ActionTree, MutationTree } from 'vuex';
import { apiUrl, ensSuffix } from '../../config';
import { RootState, EnsState } from '../../types';

export const defaultState: EnsState = {
  address: '',
  notFound: false,
  loading: false,
};

export const actions: ActionTree<EnsState, RootState> = {
  find({ commit }, payload) {
    commit('ensLoading');
    axios({
      url: `${apiUrl}/ens/${payload.username}.${ensSuffix}`,
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
    state.notFound = false;
    state.address = undefined;
  },
  ensAddressFound(state, payload: { address: string}) {
    state.address = payload.address;
    state.notFound = false;
    state.loading = false;
  },
  ensAddressNotFound(state) {
    state.address = '';
    state.notFound = true;
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
