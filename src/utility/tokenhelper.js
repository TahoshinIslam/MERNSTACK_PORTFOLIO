const jwt = require("jsonwebtoken");

// Validate expire time - must be number (seconds) or valid string format
const validateExpireTime = (value) => {
  if (!value) return "1d";
  // Check if it's a valid number
  if (!isNaN(value) && !isNaN(parseFloat(value))) return parseFloat(value);
  // Check if it's a valid string timespan (e.g., "1h", "2d", "7d")
  const timespanRegex = /^\d+[smhdw]$/;
  if (timespanRegex.test(value)) return value;
  // Invalid format, return default
  return "1d";
};

exports.EncodeToken = (email, _id) => {
  let key = process.env.JWT_KEY;
  let expire = validateExpireTime(process.env.JWT_Expire_Time);
  let payload = { email, _id };

  return jwt.sign(payload, key, { expiresIn: expire });
};

exports.decodeToken = (token) => {
  try {
    let key = process.env.JWT_KEY;
    let decode = jwt.verify(token, key);
    return decode;
  } catch (error) {
    return null;
  }
};
