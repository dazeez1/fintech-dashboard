// tests/setup.js

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create({
     binary: {

        systemBinary: path.resolve(__dirname, '../mongodb-bin/bin/mongod.exe'), // adjust path as needed
    
     /*
      version: '7.0.14',
      downloadDir: './mongodb-binaries',
      systemBinary: undefined, // do not use a globally installed one
      skipMD5: true, // skip checksum to avoid errors

     
      version: process.env.MONGOMS_VERSION || '7.0.14',
      downloadDir: process.env.MONGOMS_DOWNLOAD_DIR || './mongodb-binaries',
      */
    },    
  });

  const uri = mongo.getUri();

  await mongoose.connect(uri);
},  300000);  //5 minutes


afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }

  if (mongo) {
    await mongo.stop();
  }
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (let key in collections) {
    await collections[key].deleteMany({});
  }
});





