import axios from 'axios';
import { waitForTransactionReceipt } from '@dpetition/lib';
import { Module, ActionTree, MutationTree } from 'vuex';
import { ethers } from 'ethers';

import { apiUrl } from '../../config';
import { RootState, IdentityState } from '../../types';
import { usernameToEns } from '../../services/ensService';
import { updateBalances } from '../../services/balanceService';

export const defaultState: IdentityState = {
  address: '',
  ensName: '',
  balances: {},
};

export const actions: ActionTree<IdentityState, RootState> = {
  destroy({ commit }) {
    commit('clean');
  },
  async create({ commit, rootState }, payload: string) {
    const address = rootState.wallet.local.address;
    const ensName = usernameToEns(payload);
    const response = await axios({
      url: `${apiUrl}/identity`,
      method: 'post',
      data: {
        ensName,
        address,
      },
    });

    const transaction: ethers.utils.Transaction = response && response.data;
    commit('setIdentity', { ensName });
    if (!transaction.hash) {
      return;
    }
    const receipt = await waitForTransactionReceipt(rootState.provider, transaction.hash);
    if (!receipt.contractAddress) {
      return;
    }
    commit('setAddress', { address: receipt.contractAddress });
    await updateBalances(commit, rootState, receipt.contractAddress);
  },
  async fetchBalances({ commit, state, rootState }) {
    await updateBalances(commit, rootState, state.address);
  },
};

export const mutations: MutationTree<IdentityState> = {
  clean(state) {
    state.address = '';
    state.balances = {};
    state.ensName = '';
  },
  setIdentity(state, payload: { ensName: string }) {
    state.ensName = payload.ensName;
  },
  setAddress(state, payload: { address: string }) {
    state.address = payload.address;
  },
  updateBalance(state, payload: { name: string, value: string }) {
    state.balances[payload.name] = payload.value;
  },
};

const namespaced: boolean = true;

const identity: Module<IdentityState, RootState> = {
  namespaced,
  state: defaultState,
  actions,
  mutations,
};

export default identity;
