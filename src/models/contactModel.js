const mongoose = require("mongoose");
const DataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    website: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
const contactModel = mongoose.model("contacts", DataSchema);
module.exports = contactModel;
