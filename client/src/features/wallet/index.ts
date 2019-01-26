import { Module, ActionTree, MutationTree } from 'vuex';
import { RootState, WalletState } from '../../types';
import { ethers } from 'ethers';
import { waitForTransactionReceipt } from '@dpetition/lib';

export const defaultState: WalletState = {
  main: undefined,
};

export const actions: ActionTree<WalletState, RootState> = {
  async build({ commit, rootState }, payload: { privateKey?: string, mnemonic?: string}) {
    let wallet : ethers.Wallet | null;
    if (payload.privateKey) {
      wallet = new ethers.Wallet(payload.privateKey);
    } else if (payload.mnemonic) {
      wallet = ethers.Wallet.fromMnemonic(payload.mnemonic)
    } else {
      wallet = null;
    }
    
    if (wallet) {
      wallet.connect(rootState.provider)
      commit('addWallet', wallet)
    }
  },
  async transfer({ commit, state, rootState }, payload: {address: string, value: number}) {
    if (!state.main) {
      return
    }
    const token = rootState.contracts.PetitionToken[0];
    token.connect(state.main);
    const transaction: ethers.utils.Transaction = await token.transfer(payload.address, payload.value);
    if (transaction.hash) {
      await waitForTransactionReceipt(rootState.provider, transaction.hash);
    }
    commit('walletTransferSuccess');
  }
};

export const mutations: MutationTree<WalletState> = {
  addWallet(state, payload: ethers.Wallet) {
    state.main = payload;
  }
};

const namespaced: boolean = true;

const profile: Module<WalletState, RootState> = {
  namespaced,
  state: defaultState,
  actions,
  mutations,
};

export default profile;
