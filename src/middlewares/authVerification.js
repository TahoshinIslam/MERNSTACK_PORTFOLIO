const { decodeToken } = require("../utility/tokenhelper");

module.exports = (req, res, next) => {
  try {
    let token = req.cookies["token"];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    let decoded = decodeToken(token);

    if (decoded === null) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    } else {
      req.headers.email = decoded.email;
      req.headers._id = decoded._id;
      next();
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication error: " + error.message,
    });
  }
};
