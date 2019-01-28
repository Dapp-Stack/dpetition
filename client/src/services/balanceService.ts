import { RootState } from '../types';

export const getPPTBalance = async (rootState: RootState, address: string) => {
  const token = rootState.contracts.ERC20Mintable[0];
  return await token.balanceOf(address);
};

export const getWeiBalance = async (rootState: RootState, address: string) => {
  return await rootState.provider.getBalance(address);
};

