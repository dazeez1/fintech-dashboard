// tests/jest.setup.js
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-jest';
process.env.MONGO_URI = 'mongodb://localhost:27017/test'; 