import axios from 'axios';
import Vue from 'vue';
import Vuex, { StoreOptions, MutationTree, ActionTree } from 'vuex';
import { EventFragment, FunctionFragment } from 'ethers/utils';

import Authorisation from './features/authorisation';
import Ens from './features/ens';
import Identity from './features/identity';
import Petition from './features/petition';

import { apiUrl } from './config';
import { RootState } from './types';

Vue.use(Vuex);

declare global {
  interface Window {
    web3?: any;
    ethereum?: any;
    tracker: {
      [chainId: number]: {
        [address: string]: {
          name: string;
          abi: Array<EventFragment | FunctionFragment>;
        };
      };
    };
  }
}

const defaultState: RootState = {
  network: null,
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
    axios({
      url: `${apiUrl}/config`,
    }).then((response) => {
      const payload: RootState = response && response.data;
      commit('setRootState', { ...payload, apiAvailable: true });
    }, (error) => {
      commit('setRootState', { network: null, contract: {}, apiAvailable: false });
    });
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
