import { utils } from 'ethers';

export const addressToBytes32 = (address: string) => utils.padZeros(utils.arrayify(address), 32);
