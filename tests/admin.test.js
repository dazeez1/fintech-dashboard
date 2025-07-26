// tests/admin.test.js

const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'myf_in_te_ch_2025s_ec+ret';

describe('Admin Tests', () => {
  let adminUser;
  let regularUser;
  let adminToken;
  let userToken;

  beforeEach(async () => {
    await User.deleteMany({ username: { $in: ['adminuser', 'regularuser'] } });
    adminUser = await User.create({ 
      username: 'adminuser', 
      password: 'minushere',
      role: 'admin',
      balance: 10000
    });
    regularUser = await User.create({ 
      username: 'regularuser', 
      password: 'minushere',
      role: 'user',
      balance: 5000
    });
    adminToken = jwt.sign(
      { id: adminUser._id, role: adminUser.role }, 
      process.env.JWT_SECRET
    );
    userToken = jwt.sign(
      { id: regularUser._id, role: regularUser.role }, 
      process.env.JWT_SECRET
    );
  });

  it('should allow admin to access admin routes', async () => {
    const response = await request(app)
      .get('/api/test/admin-only')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Welcome Admin!');
  });

  it('should not allow regular user to access admin routes', async () => {
    const response = await request(app)
      .get('/api/test/admin-only')
      .set('Authorization', `Bearer ${userToken}`);
    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Forbidden: Insufficient role permission');
  });
});




/*
// tests/ admin.test.js

const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

describe("Admin API", () => {
  let adminUser;
  let regularUser;
  let adminToken;
  let userToken;

  beforeEach(async () => {
    // Clear existing data
    await User.deleteMany({});

    // Create admin user
    adminUser = await User.create({
      username: "adminuser",
      password: "adminpass123",
      role: "admin",
      balance: 100000,
    });

    // Create regular user
    regularUser = await User.create({
      username: "regularuser",
      password: "userpass123",
      role: "user",
      balance: 5000,
    });

    // Login admin to get token
    const adminLoginRes = await request(app)
      .post("/api/auth/login")
      .send({ username: "adminuser", password: "adminpass123" });
    adminToken = adminLoginRes.body.token;

    // Login regular user to get token
    const userLoginRes = await request(app)
      .post("/api/auth/login")
      .send({ username: "regularuser", password: "userpass123" });
    userToken = userLoginRes.body.token;
  });

  describe("GET /api/test/admin-only (Admin Only Route)", () => {
    it("should allow admin access to admin-only endpoint", async () => {
      const res = await request(app)
        .get("/api/test/admin-only")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Welcome Admin!");
    });

    it("should deny regular user access to admin-only endpoint", async () => {
      const res = await request(app)
        .get("/api/test/admin-only")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty(
        "message",
        "Forbidden: Insufficient role permission"
      );
    });

    it("should deny access without authentication", async () => {
      const res = await request(app).get("/api/test/admin-only");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Not Authorized, No token");
    });

    it("should deny access with invalid token", async () => {
      const res = await request(app)
        .get("/api/test/admin-only")
        .set("Authorization", "Bearer invalidtoken");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty(
        "message",
        "Not Authorized, token failed"
      );
    });

    it("should deny access with malformed authorization header", async () => {
      const res = await request(app)
        .get("/api/test/admin-only")
        .set("Authorization", "InvalidFormat token");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Not Authorized, No token");
    });
  });

  describe("User Registration with Admin Role", () => {
    it("should allow admin user creation during registration", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "newadmin",
        password: "newadminpass",
        role: "admin",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("username", "newadmin");
      expect(res.body).toHaveProperty("role", "admin");
      expect(res.body).toHaveProperty("token");

      // Verify user was created with admin role
      const newAdmin = await User.findOne({ username: "newadmin" });
      expect(newAdmin.role).toBe("admin");
    });

    it("should create user with default role when role not specified", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "defaultuser",
        password: "defaultpass",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("username", "defaultuser");
      expect(res.body).toHaveProperty("role", "user");
      expect(res.body).toHaveProperty("token");

      // Verify user was created with default user role
      const newUser = await User.findOne({ username: "defaultuser" });
      expect(newUser.role).toBe("user");
    });

    it("should create user with user role when non-admin role specified", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "regularnew",
        password: "regularpass",
        role: "user",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("username", "regularnew");
      expect(res.body).toHaveProperty("role", "user");
      expect(res.body).toHaveProperty("token");

      // Verify user was created with user role
      const newUser = await User.findOne({ username: "regularnew" });
      expect(newUser.role).toBe("user");
    });
  });

  describe("Role-Based Access Control", () => {
    it("should verify admin user has admin role in token", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "adminuser", password: "adminpass123" });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("role", "admin");
      expect(res.body).toHaveProperty("token");

      // Verify the token contains admin role
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
      expect(decoded.role).toBe("admin");
    });

    it("should verify regular user has user role in token", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "regularuser", password: "userpass123" });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("role", "user");
      expect(res.body).toHaveProperty("token");

      // Verify the token contains user role
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
      expect(decoded.role).toBe("user");
    });
  });
});
 */