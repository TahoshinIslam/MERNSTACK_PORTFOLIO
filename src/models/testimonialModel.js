const mongoose = require("mongoose");
const DataSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },

    img: {
      type: String,
    },
    feedback: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
const testimonialModel = mongoose.model("testimonials", DataSchema);
module.exports = testimonialModel;
