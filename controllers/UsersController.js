const sha1 = require('sha1');
const dbClient = require('../utils/db');


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

        const foundUser = await dbClient.getUserByEmail(email);
        if (foundUser) {
            return res.status(400).json({ error: 'Already exist' });
        }

        //Hashing the password
        const hashedPassword = sha1(password);

        //Saves user to the database
        const result = await dbClient.createUser(email, hashedPassword);

        //Returns new user email and id
        return res.status(201).json({ email: result.ops[0].email, id: newUser.insertedId });
    }
}

module.exports = UsersController;
