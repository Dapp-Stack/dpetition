import * as ipfsClient from 'ipfs-api';

const ipfsHost = process.env.IPFS_HOST || 'localhost';
const ipfsPort = process.env.IPFS_PORT || '5001';

export const connect = async () => {
  return new ipfsClient( ipfsHost, ipfsPort);
};

export const add = async (api: any, data: string) => {
  const content = api.types.Buffer.from(data);
  const results = await api.add(content);
  return results[0].hash;
};

export const get = (ipfs: any, hash: string) => {
  return new Promise<string>((resolve, reject) => {
    ipfs.get(hash, (err: Error, files: Array<{content: string}>) => {
      if (err) {
        return reject(err);
      }
      resolve(files[0].content.toString());
    });
  });
};
