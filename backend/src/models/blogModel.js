const mongoose = require("mongoose");
const DataSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },

    img: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
const blogModel = mongoose.model("blogs", DataSchema);
module.exports = blogModel;
