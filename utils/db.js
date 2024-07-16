// Contains the DBClient class that connects to MongoDB and manages Mongo operations
const { MongoClient, ObjectId } = require('mongodb');
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

      if (result.insertedId) {
        // console.log('Inserted user:', result.ops[0]);
        return result.ops[0];
      } else {
        console.error('No user inserted. Result:', result)
        throw new Error('failed to insert user')
      }
    //   console.log('Inserted user:', result.ops[0]);
    //   return result;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }
    // async createUser(email, password) {
    //     try {
    //     // Mock user insertion logic for testing
    //     console.log('Mock inserting user:', { email, password });
    //     const mockUser = { email, insertedId: 'mockId', password: 'hashedPassword' }; // Mock response
    //     return mockUser;
    //     } catch (error) {
    //     console.error('Error creating user:', error);
    //     throw error;
    //     }
    // }


  // method to find a user by email
  async findUserByEmail(email) {
    try {
      const db = await this.connection;
      const collection = db.collection('users');
      const user = await collection.findOne({ email });
      return user;
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

  // Method to create a file doc in database
  async createFile(fileDoc) {
    try {
      const db = await this.connection;
      const collection = db.collection('files');
      const result = await collection.insertOne(fileDoc);
      return result.ops[0];
    } catch (error) {
      console.error('Error creating file:', error);
      return null;
      }
  }

  // Method for finding file by its id
  async findFileById(id) {
    try {
      const db = await this.connection;
      const collection = db.collection('files');
      return await collection.findOne({ _id: ObjectId(id) });
    } catch (error) {
      console.error('Error finding file by ID:', error);
      return null;
    }
  }
}

const dbClient = new DBClient();
module.exports = { dbClient };
