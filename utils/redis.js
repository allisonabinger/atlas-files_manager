// Contains the class RedisClient to manage Redis server connections and operations
import { createClient } from "redis";

class RedisClient {
    // constructor creates client and declare async binds
    constructor() {
        this.client = createClient();

        this.client.on('error', (err) => {
            console.error(`Redis Client Error: ${err}`);
        });

        this.client.on('end', () => {
            console.log('Redis client disconnected');
          });

        this.client.connected = true;
    }
    
    isAlive() {
        return this.client.connected;
    }

    async get(key) {
        return new Promise((res, rej) => {
            this.client.get(key, (err, reply) => {
                if (err) {
                    rej(err);
                } else {
                    res(reply);
                }
            });
        });
    }

    async set(key, value, durationSeconds) {
        return new Promise((res, rej) => {
            this.client.set(key, value, 'EX', durationSeconds, (err, reply) => {
                if (err) {
                    rej(err);
                } else {
                    res(reply);
                }
            });
        });
    }

    async del(key) {
        return new Promise((res, rej) => {
            this.client.del(key, (err, reply) => {
                if (err) {
                    rej(err);
                } else {
                    res(reply);
                }
            });
        });
    }
}

const redisClient = new RedisClient();

module.exports = redisClient;
