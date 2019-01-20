import { utils } from "ethers";
import { Message } from "./types";

export const calculateHash = (message: Message) => {
  const dataHash = utils.solidityKeccak256(['bytes'], [message.data]);
  return utils.solidityKeccak256(
    ['address', 'address', 'uint256', 'bytes32', 'uint256', 'uint', 'address', 'uint', 'uint'],
    [
      message.from,
      message.to,
      message.value,
      dataHash,
      message.nonce, 
      message.gasPrice,
      message.gasToken,
      message.gasLimit,
      message.operationType
    ]
  );
};