const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { EncodeToken } = require("../utility/tokenhelper");

//! CREATE USER
exports.register = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Password will be automatically hashed by the model's pre-save hook
    // Do NOT hash manually here to avoid double hashing
    let result = await userModel.create({
      email,
      password, // Pass plain password - model will hash it automatically
    });

    return res.status(201).json({
      success: true,
      message: "User Created Successfully",
      result,
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
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email",
      });
    }

    //! password isMatch
    let isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      let token = EncodeToken(user.email, user._id);
      let option = {
        maxAge: process.env.Cookie_Expire_Time || 86400000,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      };

      //! set cookie
      res.cookie("token", token, option);
      res.status(200).json({
        success: true,
        message: "Login successful",
        token: token, // Return token in body for API clients like Postman
        user: {
          id: user._id,
          email: user.email,
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something Went Wrong",
    });
  }
};

//! GET USER
exports.user = async (req, res) => {
  try {
    let email = req.headers.email;
    let matchStage = {
      $match: { email: email },
    };

    let project = {
      $project: {
        password: 0,
      },
    };
    let result = await userModel.aggregate([matchStage, project]);

    res.status(200).json({
      success: true,
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
//! USER LOGOUT
exports.logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something Went Wrong",
    });
  }
};

//!USER UPDATE
exports.update = async (req, res) => {
  try {
    let { email, password } = req.body;
    let userId = req.headers._id;
    let updatedData = { email };

    if (password) {
      let hashPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashPassword;
    }
    console.log(updatedData);

    // update user
    await userModel.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something Went Wrong",
    });
  }
};

//! DELETE USER
