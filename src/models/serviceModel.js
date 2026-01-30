const mongoose = require("mongoose");
const DataSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    img: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
const serviceModel = mongoose.model("services", DataSchema);
module.exports = serviceModel;
