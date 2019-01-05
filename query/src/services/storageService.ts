import redis from 'redis';

export default class StorageService {
  private client: redis.RedisClient;
  private connected: boolean = false;

  constructor() {
    this.client = redis.createClient();
    this.client.on('connect', () => {
      this.connected = true;
    });

    this.client.on('error', (err) => {
      this.connected = false;
    });
  }

  public get(key: string) {
    return new Promise<any>((resolve, reject) => {
      this.client.get(key, (error, result) => {
        if (error) {
          reject(error)
        }
        resolve(result);
      });
    });
  }

  public set(key: string) {
    
  }
}