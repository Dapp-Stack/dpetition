import axios from 'axios';
import { Module, ActionTree, MutationTree } from 'vuex';
import { apiUrl, ensSuffix } from '../../config';
import { RootState, IdentityState, Petition } from '../../types';
import { ethers } from 'ethers';
import { TransactionReceipt } from 'ethers/providers';
import { createPetitionBody } from '@/services/petitionService';
import { waitForTransactionReceipt } from '@/services/ethereumService';

export const defaultState: IdentityState = {
  loading: false,
  address: '',
  identityAddress: '',
  privateKey: '',
  ensName: '',
  transaction: null,
  error: null,
};

export const actions: ActionTree<IdentityState, RootState> = {
  execute({ commit, state }, payload: Petition) {
    const data = createPetitionBody(state, payload)
    axios({
      url: `${apiUrl}/identity/execution`,
      method: 'POST',
      data
    }).then((response) => {
      commit('identityExecuteSucceed');
    }).catch((error) => {
      commit('identityExecuteError');
    });
  },
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
    }).then(async (response) => {
      const transaction: ethers.utils.Transaction = response && response.data;
      localStorage.setItem('privateKey', privateKey);
      localStorage.setItem('ensName', ensName);
      commit('identityCreated', { transaction, privateKey, ensName, address: wallet.address });

      if (transaction.hash) {
        const receipt = await waitForTransactionReceipt(transaction.hash);
        commit('identityReceipt', receipt);
      }
    }).catch((error) => {
      commit('identityNotCreated', error);
    });
  },
};

export const mutations: MutationTree<IdentityState> = {
  identityReceipt(state, payload: TransactionReceipt) {
    state.identityAddress = payload.contractAddress || '';
  }, 
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
  identityCreated(state,
                  payload: {
                    transaction: ethers.utils.Transaction,
                    privateKey: string,
                    address: string,
                    ensName: string }) {
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
