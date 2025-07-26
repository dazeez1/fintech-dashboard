// tests/auth.test.js

const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('Auth Routes', () => {
  beforeEach(async () => {
    await User.deleteMany({ username: 'testuser' });
    await User.create({ username: 'testuser', password: '123456' });
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: '123456' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.username).toBe('testuser');
  });

  it('should fail login with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'wrongpass' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });
});




/*
// tests/auth.test.js

const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

describe("Auth API", () => {
  let testUser;
  let authToken;

  beforeEach(async () => {
    // Clear any existing users
    await User.deleteMany({});

    // Create a test user
    testUser = await User.create({
      username: "testuser",
      password: "pass1234",
      role: "user",
    });
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "newuser",
        password: "newpass123",
        role: "user",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("username", "newuser");
      expect(res.body).toHaveProperty("role", "user");
      expect(res.body).toHaveProperty("token");
      expect(res.body).not.toHaveProperty("password");
    });

    it("should fail registration with duplicate username", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
        password: "pass1234",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Username already taken");
    });

    it("should fail registration with missing credentials", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ username: "newuser" });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Username and password required"
      );
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully with correct credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "testuser", password: "pass1234" });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("username", "testuser");
      expect(res.body).toHaveProperty("role", "user");
      expect(res.body).toHaveProperty("token");
      expect(res.body).not.toHaveProperty("password");

      // Store token for other tests
      authToken = res.body.token;
    });

    it("should fail login with wrong password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "testuser", password: "wrongpass" });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Invalid credentials");
    });

    it("should fail login with non-existent username", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "nonexistent", password: "pass1234" });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Invalid credentials");
    });

    it("should fail login with missing credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "testuser" });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Invalid credentials");
    });
  });
});

*/