const dotEnv = require("dotenv");
dotEnv.config();
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require("./backend/src/routes/api");
const app = new express();

app.use(cookieParser());
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(mongoSanitize());

app.use(hpp());
app.use(express.json({ limit: "10mb", extended: true }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

let option = {
  autoIndex: true,
  serverSelectionTimeoutMS: 50000,
};

mongoose
  .connect(process.env.MONGODB_URI, option)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });

let limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  skip: (req) => {
    return (
      req.path === "/api/v1/register" ||
      req.path === "/api/v1/login" ||
      req.path === "/api/v1/user"
    );
  },
});
app.use(limiter);

//api end point tag

// Add this line
app.get("/", (req, res) => {
  res.json({ status: "success", message: "API is running!" });
});

app.use("/api/v1", router);

// Serve frontend static files in production
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static(path.join(__dirname, "Frontend", "dist")));

  // SPA fallback — send index.html for any non-API route
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "Frontend", "dist", "index.html"));
  });
}

module.exports = app;
