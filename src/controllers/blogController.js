const blogModel = require("../models/blogModel");
//! BLOG CREATE

exports.createBlog = async (req, res) => {
  try {
    let { title, category, img, shortDescription, description } = req.body;

    let data = await blogModel.create({
      title,
      category,
      img,
      shortDescription,
      description,
    });
    res.status(201).json({
      success: true,
      message: "BLOG Created Successfully",
      data,
    });
    console.log(title, category, img, shortDescription, description);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something Went Wrong",
    });
  }
};
//! BLOG GET ALL
exports.allBlog = async (req, res) => {
  try {
    let pageNo = Number(req.params.pageNo);
    let perPage = Number(req.params.perPage);

    res.status(201).json({
      success: true,
      message: " ALL Blog Data Get Successfully",
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
//! BLOG SINGLE DATA GET
exports.singleBlog = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await blogModel.findById(id);
    res.status(201).json({
      success: true,
      message: " Blog Data Get Successfully",
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
//! BLOG SINGLE DATA UPDATE
exports.updateBlog = async (req, res) => {
  try {
    let { id } = req.params;
    let { title, category, img, description } = req.body;
    let data = await blogModel.findByIdAndUpdate(
      id,
      { title, category, img, description },
      { new: true },
    );
    res.status(201).json({
      success: true,
      message: " Blog Data UPDATED Successfully",
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
//! BLOG SINGLE DATA DELETE
exports.deleteBlog = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await blogModel.findByIdAndDelete(id);
    res.status(201).json({
      success: true,
      message: " Blog Data DELETED Successfully",
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
