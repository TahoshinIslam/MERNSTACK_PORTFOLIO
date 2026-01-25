const experienceModel = require("../models/experienceModel");
//! EXPERIENCE CREATE

exports.createExperience = async (req, res) => {
  try {
    let { title, company, description, time } = req.body;

    let data = await experienceModel.create({
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
