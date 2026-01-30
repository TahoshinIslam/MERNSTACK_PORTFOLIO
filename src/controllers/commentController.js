const commentModel = require("../models/commentModel");
//! COMMENT CREATE

exports.createComment = async (req, res) => {
  try {
    let { blogID, name, email, comment } = req.body;

    let data = await commentModel.create({
      blogID,
      name,
      email,
      comment,
    });
    res.status(201).json({
      success: true,
      message: "COMMENT Created Successfully",
      data,
    });
    console.log(blogID, name, email, comment);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something Went Wrong",
    });
  }
};
//! COMMENT GET ALL COMMENTS
exports.allComment = async (req, res) => {
  try {
    let data = await commentModel.find();
    res.status(201).json({
      success: true,
      message: " ALL Comment Get Successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something Went Wrong",
    });
  }
};
//! COMMENT SINGLE DATA GET
exports.singleComment = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await commentModel.findById(id);
    res.status(201).json({
      success: true,
      message: " Comment Data Get Successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something Went Wrong",
    });
  }
};
//! COMMENT SINGLE DATA UPDATE
exports.updateComment = async (req, res) => {
  try {
    let { id } = req.params;
    let { blogID, name, email, comment } = req.body;
    let data = await commentModel.findByIdAndUpdate(
      id,
      { blogID, name, email, comment },
      { new: true },
    );
    res.status(201).json({
      success: true,
      message: " Comment UPDATED Successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something Went Wrong",
    });
  }
};
//! COMMENT SINGLE DATA DELETE
exports.deleteComment = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await commentModel.findByIdAndDelete(id);
    res.status(201).json({
      success: true,
      message: " Comment Data DELETED Successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something Went Wrong",
    });
  }
};
