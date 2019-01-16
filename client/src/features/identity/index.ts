import axios from 'axios';
import { Module, ActionTree, MutationTree } from 'vuex';
import { apiUrl } from '../../config';
import { RootState, IdentityState } from '../../types';
import { ethers } from 'ethers';

export const defaultState: IdentityState = {
  loading: false,
  transaction: null,
  error: null,
};

export const actions: ActionTree<IdentityState, RootState> = {
  create({ commit }, payload) {
    commit('identityLoading');
    const privateKey = ethers.Wallet.createRandom().privateKey;
    const wallet = new ethers.Wallet(privateKey);
    const managementKey = wallet.address;
    axios({
      url: `${apiUrl}/identity`,
      method: 'post',
      data: {
        ensName: payload.username,
        managementKey,
      },
    }).then((response) => {
      const transaction: ethers.utils.Transaction = response && response.data;
      commit('identityCreated', transaction);
    }, (error) => {
      commit('identityNotCreated', error);
    });
  },
};

export const mutations: MutationTree<IdentityState> = {
  identityLoading(state) {
    state.transaction = null;
    state.error = null;
    state.loading = true;
  },
  identityCreated(state, payload: { transaction: ethers.utils.Transaction }) {
    state.transaction = payload.transaction;
    state.error = null;
    state.loading = false;
  },
  identityNotCreated(state, payload: { error: Error }) {
    state.transaction = null;
    state.error = payload.error;
    state.loading = false;
  },
};

const namespaced: boolean = true;

const profile: Module<IdentityState, RootState> = {
  namespaced,
  state: defaultState,
  actions,
  mutations,
};

export default profile;
