const mongoose = require("mongoose");
const DataSchema = new mongoose.Schema(
  {
    title: {
      type: "String",
      required: true,
    },
    company: {
      type: "String",
      required: true,
    },

    description: {
      type: "String",
      required: true,
    },
    time: {
      type: "String",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
const experienceModel = mongoose.model("experiences", DataSchema);
module.exports = experienceModel;
