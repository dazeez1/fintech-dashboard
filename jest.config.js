// jest.config.js

module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["./tests/setup.js"],
  testTimeout: 10000,
  setupFiles: ["<rootDir>/tests/jest.setup.js"],
};
