const sha1 = require('sha1');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');
const { v4: uuidv4 } = require('uuid');


class AuthController {

    // signs in a user and generates a token
    static async getConnect(req, res) {
        const authHeader = req.headers.authorization;

        // This line checks if Authorization header is present and begins with Basic
        if(!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // decodes the credentialss
        const encodedCredentials = authHeader.split(' ')[1];
        const decodedCredentials = buffer.from(encodedCredentials, 'base64').toString('ascii');
        const [decodedEmail, decodedPassword] = decodedCredentials.split(':');

        // Hashes the password
        const hashedPassword = sha1(decodedPassword);

        // finds database user by email
        const user = await dbClient.getUserEmail(decodedEmail);

        // checks if user exists and password
        if(!user || user.password !== hashedPassword) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // generating random string
        const token = uuidv4();
        const key = `auth_${token}`;

        //stores the key to redis with expiration
        await redisClient.set(key, user._id.toString(), 86400);//seconds in a day

        // Returns random generted token to the client
        return res.status(200).json({ token }); // 
    }

    // this method signs out the user
    static async getDisconnect(req, res) {
        // retrieves token from request headers
        const token = req.header['x-token'];

        // checks for token
        if (!token) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        // creates redis key using the token
        const key =  `auth_${token}`;
        // gets user id using the token from redis
        const userId = await redisClient.get(key);

        // checks if user id exists
        if (!userId) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        // deletes the token from redis
        await redisClient.del(key);
        // returns no content response
        return res.status(204).send();
    }      
}

module.exports = AuthController;
