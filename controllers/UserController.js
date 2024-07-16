const sha1 = require('sha1');
const { dbClient } = require('../utils/db');
const { redisClient } = require('../utils/redis');

class UsersController {
    static async postNew(req, res) {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Missing email' });
        }
        if (!password) {
            return res.status(400).json({ error: 'Missing password' });
        }

        const foundUser = await dbClient.findUserByEmail(email);
        if (foundUser) {
            return res.status(400).json({ error: 'Already exist' });
        }

        const hashedPassword = sha1(password);
        const newUser = await dbClient.createUser(email, hashedPassword);

        return res.status(201).json({
            id: newUser._id.toString(),
            email: newUser.email
        });
    }

    static async getMe(req, res) {
        const token = req.headers['x-token'];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = await redisClient.get(`auth_${token}`);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await dbClient.findUserById(userId);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        return res.status(200).json({ id: user._id, email: user.email });
    }
}

module.exports = UsersController;
