import { TransactionReceipt } from 'ethers/providers';
import { ethers } from 'ethers';

export const extractTransactionEvents = (receipt: TransactionReceipt, contract: ethers.Contract) => {
  const txEvents: { [eventName: string]: string[] } = {};

  if (!receipt.logs) {
    return txEvents;
  }

  receipt.logs.forEach((log) => {
    Object.values(contract.interface.events).forEach((description) => {
      if (description.topic === log.topics[0]) {
        txEvents[description.name] = description.decode(log.data);
      }
    });
  });

  return txEvents;
};
