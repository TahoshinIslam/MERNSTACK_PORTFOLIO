const portfolioModel = require("../models/portfolioModel");
//! Portfolio CREATE

exports.createPortfolio = async (req, res) => {
  try {
    let { title, img, images, link, category } = req.body;

    let data = await portfolioModel.create({
      title,
      img,
      images: Array.isArray(images) ? images : [],
      link,
      category,
    });
    res.status(201).json({
      success: true,
      message: "Portfolio Created Successfully",
      data,
    });
    console.log(title, img, link, category);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something Went Wrong",
    });
  }
};
//! Portfolio GET ALL
exports.allPortfolio = async (req, res) => {
  try {
    let data = await portfolioModel.find();
    res.status(201).json({
      success: true,
      message: " ALL Portfolio Data Get Successfully",
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
//! Portfolio SINGLE DATA GET
exports.singlePortfolio = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await portfolioModel.findById(id);
    res.status(201).json({
      success: true,
      message: " ALL Portfolio Data Get Successfully",
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
//! Portfolio SINGLE DATA UPDATE
exports.updatePortfolio = async (req, res) => {
  try {
    let { id } = req.params;
    let { title, img, images, link, category } = req.body;
    let payload = { title, img, link, category };
    if (Array.isArray(images)) payload.images = images;
    let data = await portfolioModel.findByIdAndUpdate(id, payload, {
      new: true,
    });
    res.status(201).json({
      success: true,
      message: " Portfolio Data UPDATE Successfully",
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
//! Portfolio SINGLE DATA DELETE
exports.deletePortfolio = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await portfolioModel.findByIdAndDelete(id);
    res.status(201).json({
      success: true,
      message: " Portfolio Data DELETED Successfully",
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
