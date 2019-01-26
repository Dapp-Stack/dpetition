import * as ipfsClient from 'ipfs-http-client';

const ipfsHost = process.env.IPFS_HOST || '127.0.0.1';
const ipfsPort = process.env.IPFS_PORT || '5001';
const ipfsProtocol = process.env.IPFS_PROTOCOL || 'http';

export const connect = async () => {
  return ipfsClient({ host: ipfsHost, port: ipfsPort, protocol: ipfsProtocol });
};

export const add = async (ipfsClient: any, data: string) => {
  // const content = ipfsClient.types.Buffer.from(data);
  // const results = await ipfsClient.add(content);
  // return results[0].hash;
  return 'hash';
};

export const get = (ipfsClient: any, hash: string) => {
  return new Promise<string>((resolve, reject) => {
    ipfsClient.get(hash, (err: Error, files: Array<{content: string}>) => {
      if (err) {
        return reject(err);
      }
      resolve(files[0].content.toString());
    });
  });
};
