// Contains the DBClient class that connects to MongoDB and manages Mongo operations
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const dbUser = process.env.DB_USERNAME
const dbPassword = process.env.DB_PASSWORD
const dbName = process.env.DB_DATABASE
const dbHost = 'cluster01.oqci0pb.mongodb.net';

const uri = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}`;

class DBClient {
  constructor() {
    this.client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.connection = this.client.connect().then(() => {
      console.log('Connected to MongoDB Atlas');
      return this.client.db(dbName);
    }).catch(err => {
      console.error('Error connecting to MongoDB Atlas:', err);
      process.exit(1); // Exit process on connection failure
    });
  }

  isAlive() {
    return this.client && this.client.isConnected();
  }

  async nbUsers() {
    try {
      const db = await this.connection;
      const collection = db.collection('users');
      const count = await collection.countDocuments({});
      return count;
    } catch (error) {
      console.error('Error counting users:', error);
      return 0;
    }
  }

  async nbFiles() {
    try {
      const db = await this.connection;
      const collection = db.collection('files');
      const count = await collection.countDocuments({});
      return count;
    } catch (error) {
      console.error('Error counting files:', error);
      return 0;
    }
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
