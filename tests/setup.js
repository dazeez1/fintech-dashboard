// tests/setup.js

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create({
    version: '7.0.14',
    downloadDir: './mongodb-binaries',
    skipMD5: true, // skip checksum to avoid errors
  });

  const uri = mongo.getUri();
  console.log('Test MongoDB URI:', uri);

  await mongoose.connect(uri);
}, 60000); // 1 minute timeout


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





