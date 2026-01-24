const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

//! create user
exports.register = async (req, res) => {
  try {
    let { email, password } = req.body;

    let result = await userModel.create({ email, password });

    return res.status(200).json({
      success: true,
      message: "User Created Successfully",
      result: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something Went Wrong",
    });
  }
};

//! USER LOGIN
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email",
      });
    }

    // PASSWORD MATCH
    let isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      let token = "EncodeToken(user.email, user._id).toString()";

      res.status(200).json({
        success: true,
        message: "Login successful",
        user: user,
        token: token,
      });
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something Went Wrong",
    });
  }
};
