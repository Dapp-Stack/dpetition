import axios from 'axios';
import { Module, ActionTree, MutationTree } from 'vuex';
import { apiUrl, ensSuffix } from '../../config';
import { RootState, IdentityState } from '../../types';
import { ethers } from 'ethers';

export const defaultState: IdentityState = {
  loading: false,
  address: '',
  privateKey: '',
  ensName: '',
  transaction: null,
  error: null,
};

export const actions: ActionTree<IdentityState, RootState> = {
  get({ commit }) {
    const privateKey = localStorage.getItem('privateKey');
    const ensName = localStorage.getItem('ensName');

    if (!privateKey || !ensName) {
      return;
    }
    const wallet = new ethers.Wallet(privateKey);
    commit('identityRetrieved', { privateKey, ensName, address: wallet.address });
  },
  destroy({ commit }) {
    localStorage.removeItem('privateKey');
    commit('identityDestroyed');
  },
  create({ commit }, payload) {
    commit('identityLoading');
    const privateKey = ethers.Wallet.createRandom().privateKey;
    const wallet = new ethers.Wallet(privateKey);
    const managementKey = wallet.address;
    const ensName = `${payload.username}.${ensSuffix}`;
    axios({
      url: `${apiUrl}/identity`,
      method: 'post',
      data: {
        ensName,
        managementKey,
      },
    }).then((response) => {
      const transaction: ethers.utils.Transaction = response && response.data;
      localStorage.setItem('privateKey', privateKey);
      localStorage.setItem('ensName', ensName);
      commit('identityCreated', { transaction, privateKey, ensName, address: wallet.address });
    }, (error) => {
      commit('identityNotCreated', error);
    });
  },
};

export const mutations: MutationTree<IdentityState> = {
  identityRetrieved(state, payload: { privateKey: string, address: string, ensName: string }) {
    state.privateKey = payload.privateKey;
    state.address = payload.address;
    state.ensName = payload.ensName;
  },
  identityDestroyed(state) {
    state.privateKey = '';
    state.address = '';
    state.ensName = '';
  },
  identityLoading(state) {
    state.transaction = null;
    state.error = null;
    state.loading = true;
  },
  identityCreated(state, payload: { transaction: ethers.utils.Transaction, privateKey: string, address: string, ensName: string }) {
    state.transaction = payload.transaction;
    state.privateKey = payload.privateKey;
    state.address = payload.address;
    state.ensName = payload.ensName;
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
