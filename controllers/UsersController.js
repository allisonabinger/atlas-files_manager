const sha1 = require('sha1');
const dbClient = require('../utils/db');
const { redisClient } = require('../utils/redis');


class UsersController {

    //handles creation of new user
    static async postNew(req, res) {
        const { email, password } = req.body;

        // validates the email
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

        //Hashing the password
        const hashedPassword = sha1(password);//produces a 160-bit (20-byte) hash value

        //Saves user to the database
        const result = await dbClient.createUser(email, hashedPassword);

        //Returns new user email and id
        return res.status(201).json({ email: result.ops[0].email, id: newUser.insertedId });
    }

    static async getMe(req, res) {
        // retrieves token from request headers
        const token = req.headers['x-token'];

        // Checks for token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // grabs redis key using token
        const key = `auth_${token}`;
        // gets the user id linked to the redis token
        const userId = await dbClient.get(key);

        // checks for user id
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // obtains user info from database using user id
        const user = await dbClient.findUserById(userId);

        // checks if user exists
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // returns the user email and id
        return res.status(200).json({ id: user._id, email: user.email });
    }
}

module.exports = UsersController;
