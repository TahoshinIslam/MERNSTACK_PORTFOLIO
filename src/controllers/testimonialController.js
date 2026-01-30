const testimonialModel = require("../models/testimonialModel");
//! TESTIMONIAL CREATE

exports.createTestimonial = async (req, res) => {
  try {
    let { clientName, address, img, feedback } = req.body;

    let data = await testimonialModel.create({
      clientName,
      address,
      img,
      feedback,
    });
    res.status(201).json({
      success: true,
      message: "TESTIMONIAL Created Successfully",
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
//! TESTIMONIAL GET ALL
exports.allTestimonial = async (req, res) => {
  try {
    let data = await testimonialModel.find();
    res.status(201).json({
      success: true,
      message: " ALL TESTIMONIALData Get Successfully",
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
//! TESTIMONIAL SINGLE DATA GET
exports.singleTestimonial = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await testimonialModel.findById(id);
    res.status(201).json({
      success: true,
      message: " ALL TESTIMONIAL Data Get Successfully",
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
//! TESTIMONIAL SINGLE DATA UPDATE
exports.updateTestimonial = async (req, res) => {
  try {
    let { id } = req.params;
    let { clientName, address, img, feedback } = req.body;
    let data = await testimonialModel.findByIdAndUpdate(
      id,
      { clientName, address, img, feedback },
      { new: true },
    );
    res.status(201).json({
      success: true,
      message: " TESTIMONIAL Data UPDATED Successfully",
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
//! TESTIMONIAL SINGLE DATA DELETE
exports.deleteTestimonial = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await testimonialModel.findByIdAndDelete(id);
    res.status(201).json({
      success: true,
      message: " TESTIMONIAL Data DELETED Successfully",
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
