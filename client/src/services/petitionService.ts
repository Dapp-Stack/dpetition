import { Petition } from '@dpetition/lib';
import { RootState } from '../types';
import { get } from './ipfsService';

export const buildPetition = async (data: string[], rootState: RootState): Petition => {
  const description = await get(rootState.ipfsClient, data[2]);
  return {
    address: data[0] as string,
    title: data[1] as string,
    description,
    expireOn: new Date(parseInt(data[3], 10)),
    deposit: Math.round(parseInt(data[4], 10)),
  };
};
