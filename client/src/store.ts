import axios from 'axios';
import Vue from 'vue';
import Vuex, { StoreOptions, MutationTree, ActionTree } from 'vuex';
import { Network } from 'ethers/utils';
import VuexPersist from 'vuex-persist';
import { Tracker, loadContracts } from '@dpetition/lib';

import Authorisation from './features/authorisation';
import Ens from './features/ens';
import Identity from './features/identity';
import Petition from './features/petition';

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
  provider,
  ipfsClient: null
};

const mutations: MutationTree<RootState> = {
  setRootState(state, payload) {
    state.network = payload.network;
    state.contracts = payload.contracts;
    state.provider = payload.provider;
    state.ipfsClient = payload.ipfsClient;
    state.ready = true;
  },
};

const actions: ActionTree<RootState, RootState> = {
  async init({ commit }) {
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
    } catch (error) {
      commit('setRootState', { ipfsClient: null, network: NULL_NETWORK, contract: {} });
    }
  },
};

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage,
  reducer: (state) => (
    {...state, ready: null}
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
  },
  plugins: [vuexLocalStorage.plugin],
};

export default new Vuex.Store<RootState>(store);
