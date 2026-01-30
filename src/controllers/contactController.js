const contactModel = require("../models/contactModel");
//! CONTACT CREATE

exports.createContact = async (req, res) => {
  try {
    let { name, email, website, message } = req.body;

    let data = await contactModel.create({
      name,
      email,
      website,
      message,
    });
    res.status(201).json({
      success: true,
      message: "Your message has been sent Successfully",
      data,
    });
    console.log(name, email, website, message);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something Went Wrong",
    });
  }
};
//! CONTACT GET ALL
exports.allContact = async (req, res) => {
  try {
    let data = await contactModel.find();
    res.status(201).json({
      success: true,
      message: " ALL Contact Data Get Successfully",
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
//! CONTACT SINGLE DATA GET
exports.singleContact = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await contactModel.findById(id);
    res.status(201).json({
      success: true,
      message: "  Contact Data Get Successfully",
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

//! CONTACT SINGLE DATA DELETE
exports.deleteContact = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await contactModel.findByIdAndDelete(id);
    res.status(201).json({
      success: true,
      message: " CONTACT Data DELETED Successfully",
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
