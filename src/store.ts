import Vue from 'vue';
import Vuex, { StoreOptions, MutationTree, ActionTree, GetterTree } from 'vuex';
import * as ethers from 'ethers';
import { JsonRpcProvider } from 'ethers/providers';
import { EventFragment, FunctionFragment } from 'ethers/utils';

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
  contracts: {},
  petitions: {},
  provider: null,
  network: null,
};

const mutations: MutationTree<RootState> = {
  setContracts(state, { contracts }) {
    state.contracts = contracts;
  },
  setProvider(state, { provider }) {
    state.provider = provider;
  },
  setNetwork(state, { network }) {
    state.network = network;
  },
};

const actions: ActionTree<RootState, RootState> = {
  async init({ commit }) {
    let provider: JsonRpcProvider | null = null;
    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
    } else if (window.web3) {
      provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
    }
    if (!provider) {
      return;
    }
    commit('setProvider', { provider });
    const network = await provider.getNetwork();
    commit('setNetwork', { network });

    const contractsDetails = window.tracker[network.chainId];

    if (!contractsDetails) {
      return;
    }

    const contracts = Object.keys(contractsDetails).reduce((acc: { [name: string]: ethers.Contract }, address) => {
      const details = window.tracker[network.chainId][address];
      acc[details.name] = new ethers.Contract(address, details.abi, provider as JsonRpcProvider);
      return acc;
    }, {});

    commit('setContracts', { contracts });
  },
};

const getters: GetterTree<RootState, RootState> = {
  contractsDeployed: (state: RootState) => {
    return Object.keys(state.contracts).length > 0;
  },
};

const store: StoreOptions<RootState> = {
  state: defaultState,
  mutations,
  actions,
  getters,
};

export default new Vuex.Store<RootState>(store);
