const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");
const router = require("./backend/src/routes/api");

const app = express();

app.set("trust proxy", 1);

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
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), { maxAge: "7d" }),
);
app.use(
  "/api/v1/get-file",
  express.static(path.join(__dirname, "uploads"), { maxAge: "7d" }),
);

mongoose
  .connect(process.env.MONGODB_URI, {
    autoIndex: true,
    serverSelectionTimeoutMS: 50000,
  })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.error("Database connection failed", err);
    process.exit(1);
  });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  skip: (req) =>
    req.path === "/api/v1/register" ||
    req.path === "/api/v1/login" ||
    req.path === "/api/v1/user",
});
app.use(limiter);

app.use("/api/v1", router);

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "Frontend", "dist");
  app.use(express.static(distPath));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({ status: "success", message: "API is running!" });
  });
}

module.exports = app;
