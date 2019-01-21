import { Module, ActionTree, MutationTree } from 'vuex';
import { RootState, EnsState } from '../../types';
import { utils, ethers } from 'ethers';
import { usernameToEns } from '../..//services/ensService';

export const defaultState: EnsState = {
  address: ethers.constants.AddressZero,
};

export const actions: ActionTree<EnsState, RootState> = {
  async find({ commit, rootState }, payload: string) {
    const ensName = usernameToEns(payload);
    const node = utils.namehash(ensName);
    const address = await rootState.contracts.PublicResolver[0].addr(node);
    commit('updateAddress', address);
  },
};


export const mutations: MutationTree<EnsState> = {
  updateAddress(state, payload: string) {
    state.address = payload;
  },
};

const namespaced: boolean = true;

const profile: Module<EnsState, RootState> = {
  namespaced,
  state: defaultState,
  actions,
  mutations,
};

export default profile;
