import axios from 'axios';
import { Module, ActionTree, MutationTree } from 'vuex';
import { apiUrl } from '../../config';
import { RootState, IdentityState } from '../../types';
import { ethers } from 'ethers';
import { TransactionReceipt } from 'ethers/providers';
import { createPetitionBody } from '@/services/petitionService';
import { waitForTransactionReceipt } from '@/services/ethereumService';
import { usernameToEns } from '@/services/ensService';

export const defaultState: IdentityState = {
  address: '',
  identityAddress: '',
  privateKey: '',
  ensName: '',
  executeSuccess: null,
  createSuccess: null
};

export const actions: ActionTree<IdentityState, RootState> = {
  async execute({ commit, state }, payload: Petition) {
    try {
      const data = builData(state, payload)
      await axios({
        url: `${apiUrl}/identity/execution`,
        method: 'POST',
        data
      })
      commit('identityExecuteSuccess');
    } catch(error) {
      commit('identityExecuteError');
    }
  },
  fetch({ commit }) {
    const privateKey = localStorage.getItem('privateKey');
    const ensName = localStorage.getItem('ensName');
    const identityAddress = localStorage.getItem('identityAddress');

    if (!privateKey || !ensName || !identityAddress) {
      return;
    }
    const wallet = new ethers.Wallet(privateKey);
    commit('identityFetchSuccess', { privateKey, ensName, identityAddress, address: wallet.address });
  },
  destroy({ commit }) {
    localStorage.removeItem('privateKey');
    localStorage.removeItem('ensName');
    localStorage.removeItem('identityAddress');
    commit('identityDestroySuccess');
  },
  async create({ commit }, payload: string) {
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
      })
      
      const transaction: ethers.utils.Transaction = response && response.data;
      localStorage.setItem('privateKey', privateKey);
      localStorage.setItem('ensName', ensName);
      
      commit('identityCreateSuccess', { privateKey, ensName, address: wallet.address });

      if (transaction.hash) {
        const receipt = await waitForTransactionReceipt(transaction.hash);
        commit('identityCreateReceipt', receipt);
      }
    } catch(error) {
      commit('identityCreateError', error);
    }
  },
};

export const mutations: MutationTree<IdentityState> = {
  identityExecuteSuccess(state) {
    state.executeSuccess = true;
  },
  identityExecuteError(state) {
    state.executeSuccess = false;
  },
  identityFetchSuccess(state, payload: { privateKey: string, address: string, identityAddress: string, ensName: string }) {
    state.privateKey = payload.privateKey;
    state.address = payload.address;
    state.identityAddress = payload.identityAddress;
    state.ensName = payload.ensName;
  },
  identityDestroySuccess(state) {
    state.privateKey = '';
    state.address = '';
    state.identityAddress = '';
    state.ensName = '';
  },
  identityCreateSuccess(state,
                  payload: {
                    privateKey: string,
                    address: string,
                    ensName: string }) {
    state.privateKey = payload.privateKey;
    state.address = payload.address;
    state.ensName = payload.ensName;
    state.createSuccess = true;
  },
  identityCreateReceipt(state, payload: { receipt: TransactionReceipt }) {
    state.identityAddress = payload.receipt.contractAddress || '';
  },
  identityCreateError(state) {
    state.createSuccess = false
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
