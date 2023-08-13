const express = require("express");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routes/userRoutes");
const menuItemRouter = require("./routes/menuItemRoutes");
const app = express();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 mins
  max: 150, // limit each IP to 150 requests per windowMs
  message: "Too many requests",
});

app.use(limiter);

app.use(
  cors({
    origin: process.env.REACT_APP_URL,
  })
);
app.use(express.json());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against site script xss (e.g. removes HTML code from data)
app.use(xss());

// Basic security headers
app.use(helmet());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/menuItems", menuItemRouter);
module.exports = app;
