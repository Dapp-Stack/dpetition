import { Module, ActionTree, MutationTree } from 'vuex';
import { ethers } from 'ethers';
import { BigNumber } from 'ethers/utils';
import { waitForTransactionReceipt } from '@dpetition/lib';

import { RootState, WalletState } from '../../types';
import { buildWallet } from '../../services/walletService';
import { updateBalances } from '../../services/balanceService';

export const defaultState: WalletState = {
  local: {
    address: '',
    privateKey: '',
  },
  remote: {
    privateKey: '',
    mnemonic: '',
    address: '',
    balances: {},
  },
};

export const actions: ActionTree<WalletState, RootState> = {
  destroy({ commit }) {
    commit('clean');
  },
  generateLocal({ commit, rootState, state }) {
    if (state.local.address && state.local.privateKey) {
      return;
    }

    const privateKey = ethers.Wallet.createRandom().privateKey;
    const localWallet = buildWallet(rootState.provider, privateKey);
    commit('setLocal', { privateKey, address: localWallet.address });
  },
  async generateRemote({ commit, rootState }, payload: { privateKey?: string, mnemonic?: string}) {
    const { privateKey, mnemonic } = payload;
    const remoteWallet = buildWallet(rootState.provider, privateKey, mnemonic);
    commit('setRemote', { privateKey, mnemonic, address: remoteWallet.address });

    await updateBalances(commit, rootState, remoteWallet.address);
  },
  async buyPetitionToken({ commit, state, rootState }, value: number) {
    const overrides = { value: ethers.utils.parseEther(value.toString()) };
    const remoteWallet = buildWallet(rootState.provider, state.remote.privateKey, state.remote.mnemonic);
    const crowdsale = (rootState.contracts.MintedCrowdsale[0]).connect(remoteWallet);

    const transaction: ethers.utils.Transaction = await crowdsale.buyTokens(rootState.identity.address, overrides);
    if (!transaction.hash) {
      return;
    }
    await waitForTransactionReceipt(rootState.provider, transaction.hash);
    await updateBalances(commit, rootState, remoteWallet.address);
  },
};

export const mutations: MutationTree<WalletState> = {
  setLocal(state, payload) {
    state.local = payload;
  },
  setRemote(state, payload) {
    state.remote = payload;
  },
  updateBalance(state, payload: { name: string, value: number }) {
    state.remote.balances[payload.name] = payload.value;
  },
  clean(state) {
    state.local = {
      address: '',
      privateKey: '',
    };
    state.remote = {
      privateKey: '',
      mnemonic: '',
      address: '',
      balances: {},
    };
  },
};

const namespaced: boolean = true;

const wallet: Module<WalletState, RootState> = {
  namespaced,
  state: defaultState,
  actions,
  mutations,
};

export default wallet;
