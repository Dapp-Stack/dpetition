import axios from 'axios';
import { waitForTransactionReceipt } from '@dpetition/lib';
import { Module, ActionTree, MutationTree } from 'vuex';
import { ethers } from 'ethers';

import { apiUrl } from '../../config';
import { RootState, IdentityState } from '../../types';
import { TransactionReceipt } from 'ethers/providers';
import { usernameToEns } from '../../services/ensService';

export const defaultState: IdentityState = {
  address: '',
  identityAddress: '',
  tokenBalance: 0,
  privateKey: '',
  ensName: '',
};

export const actions: ActionTree<IdentityState, RootState> = {
  destroy({ commit }) {
    commit('identityDestroySuccess');
  },
  async create({ commit, rootState }, payload: string) {
    try {
      const privateKey = ethers.Wallet.createRandom().privateKey;
      const wallet = new ethers.Wallet(privateKey);
      const address = wallet.address;
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
      commit('identityCreateSuccess', { privateKey, ensName, address: wallet.address });
      if (transaction.hash) {
        const receipt = await waitForTransactionReceipt(rootState.provider, transaction.hash);
        commit('identityCreateReceipt', receipt);
      }
    } catch (error) {
      commit('identityCreateError', error);
    }
  },
  async fetchBalance({ commit, state, rootState }) {
    const token = rootState.contracts.ERC20Mintable[0];
    const hexBalance = await token.balanceOf(state.identityAddress);
    const balance = parseInt(hexBalance, 10);
    commit('identitySetBalance', {balance});
  },
};

export const mutations: MutationTree<IdentityState> = {
  identityDestroySuccess(state) {
    state.privateKey = '';
    state.address = '';
    state.identityAddress = '';
    state.ensName = '';
    state.tokenBalance = 0;
  },
  identityCreateSuccess(state, payload: { privateKey: string,
                                          address: string,
                                          ensName: string }) {
    state.privateKey = payload.privateKey;
    state.address = payload.address;
    state.ensName = payload.ensName;
  },
  identityCreateReceipt(state, payload: TransactionReceipt) {
    state.identityAddress = payload.contractAddress || '';
  },
  identitySetBalance(state, payload: {balance: number}) {
    state.tokenBalance = payload.balance;
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
