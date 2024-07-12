// Contains the class RedisClient to manage Redis server connections and operations
import redis from 'redis';
import { promisify } from 'util';


class RedisClient {
    // constructor creates client and declare async binds
    constructor() {
        this.client = redis.createClient();

        this.client.on('connect', () => {
            console.log('Redis client connected');
        })

        this.client.on('error', (err) => {
            console.error(`Redis Client Error: ${err}`);
            this.connected = false;
        });

        this.client.on('ready', () => {
            console.log('Redis client is ready to use');
            this.connected = true;
        });

        this.client.on('end', () => {
            console.log('Redis client disconnected');
            this.connected = false;
          });

        // binds promisified version of get, set, and del
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setAsync = promisify(this.client.set).bind(this.client);
        this.delAsync = promisify(this.client.del).bind(this.client);
    }
    
    isAlive() {
        // returns true when connected, false if not
        return this.client.connected;
    }

    async get(key) {
        return await this.getAsync(key);
    }

    async set(key, value, duration) {
        await this.setAsync(key, value, duration);
    }

    async del(key) {
        await this.delAsync(key);
    }
}

const redisClient = new RedisClient();
export default redisClient;
