const sha1 = require('sha1');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');


class AuthController {

    // 
    static async getConnect(req, res) {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Basic ')) {
          return res.status(401).json({ error: 'Unauthorized' });

          const encodedCredentials = authHeader.split(' ')[1];

          const decodedCredentials = buffer.from(encodedCredentials, 'base64').toString('ascii');

          const [decodedEmail, decodedPassword] = decodedCredentials.split(':');

          const hashedPassword = sha1(decodedPassword);

          const user = await dbClient.getUserEmail(decodedEmail);

          if(!user || user.password !== hashedPassword) {
              return res.status(401).json({ error: 'Unauthorized' });
          }
        }
    }
}