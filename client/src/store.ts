import axios from 'axios';
import Vue from 'vue';
import Vuex, { StoreOptions, MutationTree, ActionTree } from 'vuex';
import { Network } from 'ethers/utils';
import cc from 'cryptocompare';
import VuexPersist from 'vuex-persist';
import { Tracker, loadContracts } from '@dpetition/lib';

import Authorisation from './features/authorisation';
import Ens, { defaultState as ensDefaultState } from './features/ens';
import Identity, { defaultState as identityDefaultState } from './features/identity';
import Petition, { defaultState as petitionDefaultState } from './features/petition';
import Wallet, { defaultState as walletDefaultState } from './features/wallet';

import { apiUrl, provider } from './config';
import { RootState } from './types';
import { connect } from './services/ipfsService';

Vue.use(Vuex);

declare global {
  interface Window {
    web3?: any;
    ethereum?: any;
    tracker: Tracker;
  }
}

const NULL_NETWORK = {
  name: '',
  chainId: -1,
};

const defaultState: RootState = {
  network: NULL_NETWORK,
  contracts: {},
  ready: false,
  ethUsdPrice: 0,
  provider,
  ipfsClient: null,
  identity: identityDefaultState,
  ens: ensDefaultState,
  petition: petitionDefaultState,
  wallet: walletDefaultState,
};

const mutations: MutationTree<RootState> = {
  setRootState(state, payload) {
    state.network = payload.network;
    state.contracts = payload.contracts;
    state.ipfsClient = payload.ipfsClient;
    state.ready = true;
  },
  updateEthUsdPrice(state, payload) {
    state.ethUsdPrice = payload;
  },
};

const actions: ActionTree<RootState, RootState> = {
  async fetchPrice({ commit }) {
    const price = await cc.price('ETH', ['USD']);
    commit('updateEthUsdPrice', price.USD);
  },
  initPriceRoutine({ dispatch }) {
    setInterval(() => {
      dispatch('fetchPrice');
    }, 30000);
  },
  async init({ commit, dispatch }) {
    try {
      const ipfsClient = await connect();
      const response = await axios({ url: `${apiUrl}/config` });
      const payload: Network = response && response.data;
      const network = await provider.getNetwork();

      if (network.chainId !== payload.chainId) {
        throw new Error('Network do not correspond between client and api');
      }

      const contracts = loadContracts(network, window.tracker, provider);
      commit('setRootState', { ipfsClient, network, contracts });
      dispatch('identity/fetchBalances', {}, { root: true });
      dispatch('fetchPrice');
      dispatch('initPriceRoutine');
    } catch (error) {
      commit('setRootState', { ipfsClient: null, network: NULL_NETWORK, contract: {} });
    }
  },
};

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage,
  reducer: (state: RootState) => (
    {...state, ready: null, wallet: { ...state.wallet, remote: {}}}
  ),
});

const store: StoreOptions<RootState> = {
  state: defaultState,
  actions,
  mutations,
  modules: {
    ens: Ens,
    identity: Identity,
    authorisation: Authorisation,
    petition: Petition,
    wallet: Wallet,
  },
  plugins: [vuexLocalStorage.plugin],
};

export default new Vuex.Store<RootState>(store);
