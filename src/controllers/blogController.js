const mongoose = require("mongoose");
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
//! BLOG GET ALL WITH PAGINATION
exports.allBlog = async (req, res) => {
  try {
    let pageNo = Number(req.params.pageNo);
    let perPage = Number(req.params.perPage);

    let skipRow = (pageNo - 1) * perPage;
    let sortStage = { createdAt: -1 };
    let facetStage = {
      $facet: {
        totalCount: [{ $count: "count" }],
        blogs: [
          { $sort: sortStage },
          { $skip: skipRow },
          { $limit: perPage },
          {
            $project: {
              title: 1,
              category: 1,
              img: 1,
              shortDescription: 1,
            },
          },
        ],
      },
    };

    let blogs = await blogModel.aggregate([facetStage]);
    console.log(blogs);

    res.status(201).json({
      success: true,
      message: " ALL Blog Data Get Successfully",
      data: blogs,
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
    let matchStage = { $match: { _id: new mongoose.Types.ObjectId(id) } };
    let joinStage = {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "blogID",
        as: "comments",
      },
    };

    let project = {
      $project: {
        title: 1,
        category: 1,
        img: 1,
        description: 1,
        comments: 1,
        createdAt: 1,
      },
    };
    let data = await blogModel.aggregate([matchStage, joinStage, project]);

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

    let { title, category, img, shortDescription, description } = req.body;
    let data = await blogModel.findByIdAndUpdate(
      id,
      { title, category, img, shortDescription, description },
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
