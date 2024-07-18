// Contains the AuthController class to manage authentication for users
const sha1 = require('sha1');
const { redisClient } = require('../utils/redis');
const { dbClient } = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

class AuthController {
    // connects the user based on credentials provided to provid and auth token stored in redis
    static async getConnect(req, res) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const encodedCredentials = authHeader.split(' ')[1];
        const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('ascii');
        const [email, password] = decodedCredentials.split(':');

        const hashedPassword = sha1(password);
        const user = await dbClient.findUserByEmail(email);
        if (!user || user.password !== hashedPassword) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const token = uuidv4();
        const key = `auth_${token}`;
        await redisClient.set(key, user._id.toString(), 86400);

        return res.status(200).json({ token });
    }

    // disconnects user and removes the auth token in redis
    static async getDisconnect(req, res) {
        const token = req.headers['x-token'];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = await redisClient.get(`auth_${token}`);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        await redisClient.del(`auth_${token}`);
        return res.status(204).json({});
    }
}

module.exports = AuthController;
