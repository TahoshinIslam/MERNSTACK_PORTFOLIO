const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { EncodeToken } = require("../utility/tokenhelper");

//! CREATE USER (kept for seeding/internal use; route is disabled publicly)
exports.register = async (req, res) => {
  try {
    let { email, password, name } = req.body;

    let result = await userModel.create({
      email,
      password, // Pass plain password - model will hash it automatically
      name: name || "",
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

    let isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      let token = EncodeToken(user.email, user._id);
      let option = {
        maxAge: process.env.Cookie_Expire_Time || 86400000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "lax",
        path: "/",
      };

      res.cookie("token", token, option);
      res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          name: user.name || "",
          title: user.title || "",
          picture: user.picture || "",
          bio: user.bio || "",
          location: user.location || "",
          phone: user.phone || "",
          socials: user.socials || {},
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
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
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

//! USER UPDATE — handles email/password AND profile fields (name, title, picture, bio)
exports.update = async (req, res) => {
  try {
    let { email, password, name, title, picture, bio, location, phone, socials } = req.body;
    let userId = req.headers._id;
    let updatedData = {};

    if (typeof email === "string" && email) updatedData.email = email;
    if (typeof name === "string") updatedData.name = name;
    if (typeof title === "string") updatedData.title = title;
    if (typeof picture === "string") updatedData.picture = picture;
    if (typeof bio === "string") updatedData.bio = bio;
    if (typeof location === "string") updatedData.location = location;
    if (typeof phone === "string") updatedData.phone = phone;
    if (socials && typeof socials === "object" && !Array.isArray(socials)) {
      // Strip empty strings so the social bar only shows filled entries
      const clean = {};
      for (const [k, v] of Object.entries(socials)) {
        if (typeof v === "string" && v.trim()) clean[k] = v.trim();
      }
      updatedData.socials = clean;
    }

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updated = await userModel.findByIdAndUpdate(userId, updatedData, {
      new: true,
      projection: { password: 0 },
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something Went Wrong",
    });
  }
};

//! PUBLIC PROFILE — owner's name/title/picture/bio for the public site
exports.profile = async (req, res) => {
  try {
    // Personal portfolio assumption: a single admin user.
    // Return the most recently created one.
    const u = await userModel
      .findOne({}, { password: 0, email: 0 })
      .sort({ createdAt: 1 })
      .lean();
    res.status(200).json({
      success: true,
      data: u || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something Went Wrong",
    });
  }
};

//! FILE UPLOAD — returns a public-facing URL for the uploaded file
exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file received" });
    }
    const url = `/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: req.file,
      url,
      filename: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something Went Wrong",
    });
  }
};

//! MULTIPLE FILE UPLOAD
exports.uploadMany = async (req, res) => {
  try {
    if (!req.files || !req.files.length) {
      return res
        .status(400)
        .json({ success: false, message: "No files received" });
    }
    const urls = req.files.map((f) => `/uploads/${f.filename}`);
    res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      urls,
      files: req.files,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something Went Wrong",
    });
  }
};
