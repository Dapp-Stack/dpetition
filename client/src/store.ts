import axios from 'axios';
import Vue from 'vue';
import Vuex, { StoreOptions, MutationTree, ActionTree } from 'vuex';
import createPersistedState from 'vuex-persistedstate'
import { Network } from 'ethers/utils';
import { Tracker, loadContracts } from '@dpetition/lib';

import Authorisation from './features/authorisation';
import Ens from './features/ens';
import Identity from './features/identity';
import Petition from './features/petition';

import { apiUrl, provider } from './config';
import { RootState } from './types';
import { JsonRpcProvider } from 'ethers/providers';

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
  chainId: -1
};

const defaultState: RootState = {
  network: NULL_NETWORK,
  contracts: {},
};

const mutations: MutationTree<RootState> = {
  setRootState(state, { network, contracts, provider }) {
    state.network = network;
    state.contracts = contracts;
    state.provider = provider;
  },
};

const actions: ActionTree<RootState, RootState> = {
  async init({ commit }) {
    try {
      const response = await axios({ url: `${apiUrl}/config` })
      const payload: Network = response && response.data;
      const network = await provider.getNetwork();

      if (network.chainId !== payload.chainId) {
        throw new Error("Network do not correspond between client and api");
      }
      const contracts = loadContracts(network, window.tracker, provider);

      commit('setRootState', { provider, network, contracts });
    } catch(error) {
      commit('setRootState', { provider: undefined, network: NULL_NETWORK, contract: {} });
    }
  },
};

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
  plugins: [createPersistedState()],
};

export default new Vuex.Store<RootState>(store);
