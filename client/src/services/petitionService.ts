import { Petition } from '@dpetition/lib';

export const buildPetition = (data: string[]): Petition => {
  return {
    id: parseInt(data[0], 10),
    title: data[1] as string,
    description: data[2] as string,
    expireOn: new Date(parseInt(data[3], 10)),
    deposit: Math.round(parseInt(data[4], 10)),
  };
};
