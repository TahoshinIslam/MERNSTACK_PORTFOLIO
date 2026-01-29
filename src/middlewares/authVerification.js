const { decodeToken } = require("../utility/tokenhelper");

module.exports = (req, res, next) => {
  let token;

  // Best practice: Support both Authorization header and cookies
  // Check Authorization header first (for Postman/API clients)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    // Fall back to cookie (for browser clients)
    token = req.cookies["token"];
  }

  let decoded = decodeToken(token);

  if (decoded === null) {
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  } else {
    req.headers.email = decoded.email;
    req.headers._id = decoded._id;
    next();
  }
};
