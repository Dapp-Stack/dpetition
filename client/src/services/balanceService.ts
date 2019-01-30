import { Commit } from 'vuex';
import { RootState } from '../types';

export const updateBalances = async (commit: Commit, rootState: RootState, address: string) => {
  const wei = await getWeiBalance(rootState, address);
  commit('updateBalance', {name: 'WEI', value: wei});

  const ppt = await getPPTBalance(rootState, address);
  commit('updateBalance', {name: 'PPT', value: ppt});
};

export const getPPTBalance = async (rootState: RootState, address: string) => {
  const token = rootState.contracts.ERC20Mintable[0];
  return await token.balanceOf(address);
};

export const getWeiBalance = async (rootState: RootState, address: string) => {
  return await rootState.provider.getBalance(address);
};

