const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotEnv = require("dotenv");
const router = require("./router"); // <-- fix path
dotEnv.config();
const app = new express();

app.use(cookieParser());
populate.use(helmet());

app.use(cors());
app.use(mongoSanitize());
app.use(hpp());
app.use(mongoSanitize());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb" }));

let url =
  "mongodb+srv://tahoshin:H6ADalicCAwDm0TL@tahomernstack-cluster-2.vrdaw99.mongodb.net/";
let option = {
  user: process.env.DB_USER,
  user: process.env.DB_PASSWORD,
  autoIndex: true,
  serverSelectionTimeoutMS: 50000,
};

mongoose
  .connect(url)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });

let limiter = rateLimit({ windowsMs: 15 * 60 * 1000, limit: 100 });
app.use(limiter);

//api end point tag

app.use("/api/v1", router);

module.exports = app;
