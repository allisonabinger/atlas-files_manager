// Contains the class RedisClient to manage Redis server connections and operations
// such as checking the connection status, getting, setting, and deleting values in
// the Redis server.  
const redis = require('redis');
const { promisify } = require('util');


class RedisClient {
    // initializes a redis client to connect to redis server
    constructor() {
        // Creates a new redis client
        this.client = redis.createClient({
            host: '127.0.0.1',
            port: 6379
        });

        this.client.on('error', (error) => {
          console.error('Redis client not connecting to the server: ${error.message}');
        });

        this.client.on('connect', () => {
            console.log('Redis client is connected to the server');
        })

        // promisifies the redis client methods
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setAsync = promisify(this.client.set).bind(this.client);
        this.delAsync = promisify(this.client.del).bind(this.client);
    }

    // checks if the redis client is connected to the redis server
    isAlive() {
        return this.client.connected;
    }

    //Asynchronously gets the value from redis by the key
    async get(key) {
        try {
          return await this.getAsync(key);
        } catch (error) {
            console.error('Error getting value for key "${key}":', error);
            throw error;
        }
    }

    // Asynchronously sets a value in redis with expiration
    async set(key, value, duration) {
        try {
            await this.setAsync(key, value, 'EX', duration);
            console.log('Key ${key} is set with expiration of ${duration} in seconds');
        } catch (error) {
            console.error('Error setting the key ${key}: ${error.message}');
        }
    }

    //Asynchronously deletes a value from redis by key
    async del(key) {
        try {
            await this.delAsync(key);
            console.log('Key ${key} is deleted');
        } catch (error) {
            console.error('Error deleting key ${key}: ${error.message}');
        }
    }
}

// creates an instance of RedisClient
const redisClient = new RedisClient();
// Exports the instance
module.exports = redisClient;
