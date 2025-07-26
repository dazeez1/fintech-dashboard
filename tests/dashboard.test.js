// tests/dashboard.test.js

const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

describe('Dashboard Routes', () => {
  let token;

  beforeEach(async () => {
    await User.deleteMany({ username: 'dashuser' });
    const user = await User.create({ username: 'dashuser', password: '123456' });
    token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  });

  it('should return dashboard summary', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('username', 'dashuser');
    expect(res.body).toHaveProperty('balance');
  });

   it('should block dashboard without token', async () => {
    const res = await request(app).get('/api/dashboard');
    expect(res.statusCode).toBe(401);
  });
   
});



/*
// tests/dashboard.test.js

const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Transaction = require("../models/Transactions");

describe("Dashboard API", () => {
  let testUser;
  let authToken;

  beforeEach(async () => {
    // Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});

    // Create a test user
    testUser = await User.create({
      username: "dashboarduser",
      password: "pass1234",
      role: "user",
      balance: 50000,
    });

    // Login to get auth token
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ username: "dashboarduser", password: "pass1234" });

    authToken = loginRes.body.token;
  });

  describe("GET /api/dashboard (Protected Route)", () => {
    it("should access dashboard with valid token", async () => {
      const res = await request(app)
        .get("/api/dashboard")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("username", "dashboarduser");
      expect(res.body).toHaveProperty("role", "user");
      expect(res.body).toHaveProperty("balance");
      expect(res.body).toHaveProperty("totalTransaction");
    });

    it("should fail to access dashboard without token", async () => {
      const res = await request(app).get("/api/dashboard");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Not Authorized, No token");
    });

    it("should fail to access dashboard with invalid token", async () => {
      const res = await request(app)
        .get("/api/dashboard")
        .set("Authorization", "Bearer invalidtoken");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty(
        "message",
        "Not Authorized, token failed"
      );
    });

    it("should fail to access dashboard with malformed authorization header", async () => {
      const res = await request(app)
        .get("/api/dashboard")
        .set("Authorization", "InvalidFormat token");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Not Authorized, No token");
    });
  });

  describe("GET /api/transactions (User Transactions)", () => {
    beforeEach(async () => {
      // Create some test transactions
      await Transaction.create([
        {
          user: testUser._id,
          type: "credit",
          amount: 1000,
          balanceAfter: 51000,
          timestamp: new Date(),
        },
        {
          user: testUser._id,
          type: "debit",
          amount: 500,
          balanceAfter: 50500,
          timestamp: new Date(),
        },
      ]);
    });

    it("should get user transactions with valid token", async () => {
      const res = await request(app)
        .get("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty("user");
      expect(res.body[0]).toHaveProperty("type");
      expect(res.body[0]).toHaveProperty("amount");
      expect(res.body[0]).toHaveProperty("balanceAfter");
    });

    it("should fail to get transactions without token", async () => {
      const res = await request(app).get("/api/transactions");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Not Authorized, No token");
    });
  });
});
 
 */