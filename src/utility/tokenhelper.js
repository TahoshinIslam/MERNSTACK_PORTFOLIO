const jwt = require("jsonwebtoken");

exports.EncodeToken = (email, _id) => {
  const secret = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error("JWT secret is not configured");
  }

  return jwt.sign(
    { email, _id },
    secret,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
};
