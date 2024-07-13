// Contains the DBClient class that connects to MongoDB and manages Mongo operations
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const { createTestScheduler } = require('jest');
const { SYSTEM_USER_COLLECTION } = require('mongodb/lib/db');

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

//method to create a new user in the db
  async createUser(email, password) {
    try {
      const db = await this.connection;
      const collection = db.collection('users');
      const result = await collection.insertOne({ email, password });
      console.log('Inserted user:', result.ops[0]);
      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  // method to find a user by email
  async findUserByEmail(email) {
    try {
      const db = await this.connection;
      const collection = db.collection('users');
      return await collection.findOne({ email });
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  //method finds user by id
  async findUserById(id) {
    try {
      const db = await this.connection;
      const collection = db.collection('users');
      return await collection.findOne({ _id: ObjectId(id) });
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }
}

const dbClient = new DBClient();
module.exports = { dbClient };
