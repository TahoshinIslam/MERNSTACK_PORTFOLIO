const educationModel = require("../models/educationModel");
//! EDUCATION CREATE

exports.createEducation = async (req, res) => {
  try {
    let { title, institute, description, time } = req.body;

    let data = await educationModel.create({
      title,
      institute,
      description,
      time,
    });
    res.status(201).json({
      success: true,
      message: "Education Created Successfully",
      data,
    });
    console.log(title, description, time);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something Went Wrong",
    });
  }
};
//! EDUCATION GET ALL
exports.allEducation = async (req, res) => {
  try {
    let data = await educationModel.find();
    res.status(201).json({
      success: true,
      message: " ALL Education Data Get Successfully",
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
//! EDUCATION SINGLE DATA GET
exports.singleEducation = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await educationModel.findById(id);
    res.status(201).json({
      success: true,
      message: " Education Data Get Successfully",
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

//! EDUCATION SINGLE DATA UPDATE
exports.updateEducation = async (req, res) => {
  try {
    let { id } = req.params;
    let { title, company, description, time } = req.body;
    let data = await educationModel.findByIdAndUpdate(
      id,
      { title, company, description, time },
      { new: true },
    );
    res.status(201).json({
      success: true,
      message: " Education Data UPDATED Successfully",
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
//! EDUCATION SINGLE DATA DELETE
exports.deleteEducation = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await educationModel.findByIdAndDelete(id);
    res.status(201).json({
      success: true,
      message: " Education Data DELETED Successfully",
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
