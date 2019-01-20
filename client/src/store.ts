import axios from 'axios';
import Vue from 'vue';
import Vuex, { StoreOptions, MutationTree, ActionTree } from 'vuex';
import { Network } from 'ethers/utils';

import Authorisation from './features/authorisation';
import Ens from './features/ens';
import Identity from './features/identity';
import Petition from './features/petition';

import { apiUrl, provider } from './config';
import { RootState } from './types';

Vue.use(Vuex);

declare global {
  interface Window {
    web3?: any;
    ethereum?: any;
    tracker: Tracker;
  }
}

const defaultState: RootState = {
  network: {
    name: '',
    chainId: -1
  },
  contracts: {},
  apiAvailable: true,
};

const mutations: MutationTree<RootState> = {
  setRootState(state, { network, contracts, apiAvailable }) {
    state.network = network;
    state.contracts = contracts;
    state.apiAvailable = true;
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

      commit('setRootState', { ...payload, contracts, apiAvailable: true });
    } catch(error) {
      commit('setRootState', { network: null, contract: {}, apiAvailable: false });
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
};

export default new Vuex.Store<RootState>(store);
