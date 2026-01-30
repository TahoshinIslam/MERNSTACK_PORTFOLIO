const experienceModel = require("../models/experienceModel");
//! EXPERIENCE CREATE

exports.createExperience = async (req, res) => {
  try {
    let { title, company, description, time } = req.body;
    let userId = req.headers._id;

    let data = await experienceModel.create({
      userId,
      title,
      company,
      description,
      time,
    });
    res.status(201).json({
      success: true,
      message: "Experience Created Successfully",
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
//! EXPERIENCE GET ALL
exports.allExperience = async (req, res) => {
  try {
    let data = await experienceModel.find();
    res.status(201).json({
      success: true,
      message: " ALL Experience Data Get Successfully",
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
//! EXPERIENCE SINGLE DATA GET
exports.singleExperience = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await experienceModel.findById(id);
    res.status(201).json({
      success: true,
      message: " ALL Experience Data Get Successfully",
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

//! EXPERIENCE SINGLE DATA UPDATE
exports.updateExperience = async (req, res) => {
  try {
    let { id } = req.params;
    let { title, company, description, time } = req.body;
    let data = await experienceModel.findByIdAndUpdate(
      id,
      { title, company, description, time },
      { new: true },
    );
    res.status(201).json({
      success: true,
      message: " Experience Data UPDATE Successfully",
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
//! EXPERIENCE SINGLE DATA DELETE
exports.deleteExperience = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await experienceModel.findByIdAndDelete(id);
    res.status(201).json({
      success: true,
      message: " Experience Data DELETED Successfully",
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

const educationModel = require("../models/educationModel");
