import { Petition } from '@dpetition/lib';

export const buildPetition = (data: string[]): Petition => {
  return {
    address: data[0] as string,
    title: data[1] as string,
    description: data[2] as string,
    expireOn: new Date(parseInt(data[3], 10)),
    deposit: Math.round(parseInt(data[4], 10)),
  };
};
