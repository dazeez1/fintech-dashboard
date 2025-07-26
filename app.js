//app.js
const express = require("express");
const app = express();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const xss = require("xss");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const testRoute = require("./routes/testRoute");
const dashboardRoutes = require("./routes/dashboardRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const errorHandler = require("./middleware/errorHandler");
const adminRoutes = require("./routes/adminRoutes");
const { swaggerUi, swaggerSpec } = require("./swagger");
const profileRoutes = require("./routes/profileRoutes");

// Load environment variables
dotenv.config();
console.log("Mongo URI:", process.env.MONGO_URI);

// Connect DB first
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Security Headers
app.use(helmet());

// Limit repeated requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    for (let key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }

  if (req.params && typeof req.params === "object") {
    for (let key in req.params) {
      if (typeof req.params[key] === "string") {
        req.params[key] = xss(req.params[key]);
      }
    }
  }

  // ⚠️ Skip req.query to avoid "only a getter" error

  next();
});

// CORS configuration
const allowedOrigins = ["http://localhost:5001", "http://127.0.0.1:5500"]; // frontend url

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// public static
app.use(express.static("public"));
app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res, path, stat) => {
      res.set("Access-Control-Allow-Origin", "*");
    },
  })
); //serve static uploads

//app route
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoute);
app.use("/api/dashboard", dashboardRoutes); //use /dashboard/
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);

// Swagger docs route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handler (keep last)
app.use(errorHandler);

module.exports = app;

/*

// on;y allow frontend from a specific domain
const allowedOrigins = ['http://localhost:3000']; //frontend url

app.use(cors({
  oring: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); 
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


// CORS configuration
const allowedOrigins = ['http://localhost:3000']; // frontend url

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); 
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// public static
app.use(express.static('public'));



*/
