import { Module, ActionTree, MutationTree } from 'vuex';
import { RootState, WalletState } from '../../types';
import { ethers } from 'ethers';
import { waitForTransactionReceipt } from '@dpetition/lib';

export const defaultState: WalletState = {
  main: undefined,
  weiBalance: 0,
  pptBalance: 0,
};

const getBalances = async (rootState: RootState, wallet: ethers.Wallet) => {
  const pptBalance = parseInt(await rootState.contracts.ERC20Mintable[0].balanceOf(wallet.address), 10);
  const balance = await rootState.provider.getBalance(wallet.address);
  const weiBalance = parseInt(balance.toString(), 10);

  return {weiBalance, pptBalance};
};

export const actions: ActionTree<WalletState, RootState> = {
  async build({ commit, rootState }, payload: { privateKey?: string, mnemonic?: string}) {
    let wallet: ethers.Wallet | null;
    if (payload.privateKey) {
      wallet = new ethers.Wallet(payload.privateKey, rootState.provider);
    } else if (payload.mnemonic) {
      wallet = ethers.Wallet.fromMnemonic(payload.mnemonic);
    } else {
      wallet = null;
    }

    if (wallet) {
      wallet.connect(rootState.provider);
      commit('addWallet', { wallet });

      const balances = await getBalances(rootState, wallet);

      commit('updateBalances', balances);
    }
  },
  async buyPetitionToken({ commit, state, rootState }, payload: { recipient: string, value: number }) {
    if (!state.main) {
      return;
    }
    const overrides = { value: ethers.utils.parseEther(payload.value.toString()) };

    const crowdsale = (rootState.contracts.MintedCrowdsale[0]).connect(state.main);
    const transaction: ethers.utils.Transaction = await crowdsale.buyTokens(payload.recipient, overrides);
    if (transaction.hash) {
      await waitForTransactionReceipt(rootState.provider, transaction.hash);
    }

    const balances = await getBalances(rootState, state.main);

    commit('updateBalances', balances);
  },
  async transferPetitionToken({ commit, state, rootState }, payload: {address: string, value: number}) {
    if (!state.main) {
      return;
    }
    const token = rootState.contracts.ERC20Mintable[0].connect(state.main);
    const transaction: ethers.utils.Transaction = await token.transfer(payload.address, payload.value);
    if (transaction.hash) {
      await waitForTransactionReceipt(rootState.provider, transaction.hash);
    }
    commit('transferPetitionTokenSuccess');

    const balances = await getBalances(rootState, state.main);

    commit('updateBalances', balances);
  },
};

export const mutations: MutationTree<WalletState> = {
  addWallet(state, payload: { wallet: ethers.Wallet }) {
    state.main = payload.wallet;
  },
  updateBalances(state, payload) {
    state.pptBalance = payload.pptBalance;
    state.weiBalance = payload.weiBalance;
  },
};

const namespaced: boolean = true;

const profile: Module<WalletState, RootState> = {
  namespaced,
  state: defaultState,
  actions,
  mutations,
};

export default profile;
