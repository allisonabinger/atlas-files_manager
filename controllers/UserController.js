// Contains the UsersController class for user management.

const sha1 = require('sha1');
const { dbClient } = require('../utils/db');
const { redisClient } = require('../utils/redis');

class UsersController {

    // Posts a new user, accessed by the route POST /user
    static async postNew(req, res) {
        // get and check email and password from request body
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Missing email' });
        }
        if (!password) {
            return res.status(400).json({ error: 'Missing password' });
        }
        
        // calls dbClient to check if user already exists
        const foundUser = await dbClient.findUserByEmail(email);
        if (foundUser) {
            return res.status(400).json({ error: 'Already exist' });
        }

        const hashedPassword = sha1(password);
        // creates a new user with dbClient
        const newUser = await dbClient.createUser(email, hashedPassword);

        // returns the new user's ID and email.
        return res.status(201).json({
            id: newUser._id.toString(),
            email: newUser.email
        });
    }

    // Uses token to check if the user is connected, uses GET /users/me
    static async getMe(req, res) {
        // checks for valid token in request
        const token = req.headers['x-token'];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // get userId by using redis authentication for token
        const userId = await redisClient.get(`auth_${token}`);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // uses dbClient to find user based on userId
        const user = await dbClient.findUserById(userId);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // returns the user's Id and email
        return res.status(200).json({ id: user._id, email: user.email });
    }
}

module.exports = UsersController;
