const serviceModel = require("../models/serviceModel");
//! SERVICE CREATE

exports.createService = async (req, res) => {
  try {
    let { title, img, description } = req.body;

    let data = await serviceModel.create({
      title,
      img,
      description,
    });
    res.status(201).json({
      success: true,
      message: "SERVICE Created Successfully",
      data,
    });
    console.log(title, img, description);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something Went Wrong",
    });
  }
};
//! SERVICE GET ALL
exports.allService = async (req, res) => {
  try {
    let data = await serviceModel.find();
    res.status(201).json({
      success: true,
      message: " ALL SERVICE Data Get Successfully",
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
//! SERVICE SINGLE DATA GET
exports.singleService = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await serviceModel.findById(id);
    res.status(201).json({
      success: true,
      message: " ALL SERVICE Data Get Successfully",
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
//! SERVICE SINGLE DATA UPDATE
exports.updateService = async (req, res) => {
  try {
    let { id } = req.params;
    let { title, img, description } = req.body;
    let data = await serviceModel.findByIdAndUpdate(
      id,
      { title, img, description },
      { new: true },
    );
    res.status(201).json({
      success: true,
      message: " SERVICE Data UPDATED Successfully",
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
//! SERVICE SINGLE DATA DELETE
exports.deleteService = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await serviceModel.findByIdAndDelete(id);
    res.status(201).json({
      success: true,
      message: " SERVICE Data DELETED Successfully",
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
