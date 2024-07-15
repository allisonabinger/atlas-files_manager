const { dbClient} = require('../utils/db');
const { redisClient } = require('../utils/redis');



class AppController {

    // app controller implementation
    static async getStatus(req, res) {
        try {
            const dbAlive = await dbClient.isAlive();
            const redisAlive = await redisClient.isAlive();
            res.status(200).json({ redis: redisAlive, db: dbAlive });
        } catch (err) {
            console.error('Error checking DB and Redis status: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    static async getStats(req, res) => {
        try{
            const usersCount = await dbClient.nbUsers();
            const filesCount = await dbClient.nbFiles();
            res.status(200).json({ users: usersCount, files: filesCount });
        } catch (err) {
            console.error('Error getting collection stats: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
module.exports = AppController;
