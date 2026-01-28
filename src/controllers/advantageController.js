const advantageModel = require("../models/advantageModel");
//! EDUCATION CREATE

exports.createAdvantage = async (req, res) => {
  try {
    let { title, category, percent, time } = req.body;

    // Validate required fields
    if (!title || !category || !percent || !time) {
      return res.status(400).json({
        success: false,
        message: "All fields (title, category, percent, time) are required",
      });
    }

    let data = await advantageModel.create({
      title,
      category,
      percent,
      time,
    });
    res.status(201).json({
      success: true,
      message: "Advantage Created Successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something Went Wrong",
    });
  }
};
//! EDUCATION GET ALL
exports.allAdvantage = async (req, res) => {
  try {
    let data = await advantageModel.find();
    res.status(201).json({
      success: true,
      message: " ALL Advantage Data Get Successfully",
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
exports.singleAdvantage = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await advantageModel.findById(id);
    res.status(201).json({
      success: true,
      message: " Advantage Data Get Successfully",
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

//! ADVANTAGE SINGLE DATA UPDATE
exports.updateAdvantage = async (req, res) => {
  try {
    let { id } = req.params;
    let { title, category, percent, time, company, description } = req.body;

    // Check if record exists
    let existingData = await advantageModel.findById(id);
    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: "Advantage not found",
      });
    }

    // Build update object with only provided fields
    // Use correct field names: category and percent (not company/description)
    let updateData = {};
    if (title !== undefined && title !== null && title !== "") {
      updateData.title = title;
    }
    if (category !== undefined && category !== null && category !== "") {
      updateData.category = category;
    }
    if (percent !== undefined && percent !== null && percent !== "") {
      updateData.percent = percent;
    }
    if (time !== undefined && time !== null && time !== "") {
      updateData.time = time;
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update",
      });
    }

    let data = await advantageModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      success: true,
      message: " Advantage Data UPDATED Successfully",
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
//! Advantage SINGLE DATA DELETE
exports.deleteAdvantage = async (req, res) => {
  try {
    let { id } = req.params;

    // Check if record exists before deleting
    let existingData = await advantageModel.findById(id);
    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: "Advantage not found",
      });
    }

    // Delete the record
    let data = await advantageModel.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Advantage not found or already deleted",
      });
    }

    res.status(200).json({
      success: true,
      message: "Advantage Data DELETED Successfully",
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
