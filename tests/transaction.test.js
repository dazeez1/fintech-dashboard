//tests/transaction.test.js

const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const jwt = require('jsonwebtoken');


describe('Transaction Routes', () => {
	let token, userId;

	beforeEach(async () => {
	const user = await User.create({ username: 'payme', password: '123456', balance: 1000 });
	userId = user._id;
	token = jwt.sign({ id: userId, role: user.role}, process.env.JWT_SECRET);
	});

	it('should credit user account', async () => {
	const res = await request(app)
	.post('/api/transactions')
	.set('Authorization', `Bearer ${token}`)
	.send({ type: 'credit', amount: 200, transact: 'deposit' }); 

	expect(res.statusCode).toBe(201);
	expect(res.body.transaction.type).toBe('credit');
	expect(res.body.transaction.amount).toBe(200);
	});

	it('should not allow debit more than balance', async () => {
		const res = await request(app)
		.post('/api/transactions')
		.set('Authorization', `Bearer ${token}`)
		.send({ type: 'debit', amount: 2000, transact: 'withdrawal' });

	});
});






// echo \"Error: no test specified\" && exit 1




/* 
// tests/transaction.test.js

const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Transaction = require("../models/Transactions");

describe("Transaction API", () => {
  let testUser;
  let authToken;

  beforeEach(async () => {
    // Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});

    // Create a test user with initial balance
    testUser = await User.create({
      username: "transactionuser",
      password: "pass1234",
      role: "user",
      balance: 10000,
    });

    // Login to get auth token
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ username: "transactionuser", password: "pass1234" });

    authToken = loginRes.body.token;
  });

  describe("POST /api/transactions (Make Transaction)", () => {
    it("should make a successful credit transaction", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          type: "credit",
          amount: 1000,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "Transaction Successful");
      expect(res.body).toHaveProperty("transaction");
      expect(res.body.transaction).toHaveProperty("type", "credit");
      expect(res.body.transaction).toHaveProperty("amount", 1000);
      expect(res.body.transaction).toHaveProperty("balanceAfter", 11000);
      expect(res.body.transaction).toHaveProperty("user");

      // Verify user balance was updated
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.balance).toBe(11000);
    });

    it("should make a successful debit transaction", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          type: "debit",
          amount: 500,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "Transaction Successful");
      expect(res.body).toHaveProperty("transaction");
      expect(res.body.transaction).toHaveProperty("type", "debit");
      expect(res.body.transaction).toHaveProperty("amount", 500);
      expect(res.body.transaction).toHaveProperty("balanceAfter", 9500);
      expect(res.body.transaction).toHaveProperty("user");

      // Verify user balance was updated
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.balance).toBe(9500);
    });

    it("should fail debit transaction with insufficient balance", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          type: "debit",
          amount: 15000,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Insufficient Balance");

      // Verify user balance was not changed
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.balance).toBe(10000);
    });

    it("should fail transaction with invalid type", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          type: "invalid",
          amount: 1000,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid Transaction Type");
    });

    it("should fail transaction with invalid amount (string)", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          type: "credit",
          amount: "invalid",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Amount must be a positive number"
      );
    });

    it("should fail transaction with zero amount", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          type: "credit",
          amount: 0,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Amount must be a positive number"
      );
    });

    it("should fail transaction with negative amount", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          type: "credit",
          amount: -100,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Amount must be a positive number"
      );
    });

    it("should fail transaction without authentication", async () => {
      const res = await request(app).post("/api/transactions").send({
        type: "credit",
        amount: 1000,
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Not Authorized, No token");
    });

    it("should fail transaction with invalid token", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set("Authorization", "Bearer invalidtoken")
        .send({
          type: "credit",
          amount: 1000,
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty(
        "message",
        "Not Authorized, token failed"
      );
    });

    it("should fail transaction with missing amount", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          type: "credit",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Amount must be a positive number"
      );
    });

    it("should fail transaction with missing type", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          amount: 1000,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid Transaction Type");
    });
  });
});

*/