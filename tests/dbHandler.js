// tests/db-handler.js

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = new MongoMemoryServer();

class DbHandler {
    connect = async () => {
       const uri = await mongod.getConnectionString();
   
       const mongooseOpts = {
           useNewUrlParser: true,
           autoReconnect: true,
           reconnectTries: Number.MAX_VALUE,
           reconnectInterval: 1000
       };
   
       await mongoose.connect(uri, mongooseOpts);
   }
   
   closeDatabase = async () => {
       await mongoose.connection.dropDatabase();
       await mongoose.connection.close();
       await mongod.stop();
   }

   clearDatabase = async () => {
       const collections = mongoose.connection.collections;
   
       for (const key in collections) {
           const collection = collections[key];
           await collection.deleteMany();
       }
   } 
}

export default DbHandler;