const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const DataSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true },

    // Public-facing profile (admin/portfolio owner)
    name: { type: String, default: "" },
    title: { type: String, default: "" }, // e.g. "Full-Stack Developer"
    picture: { type: String, default: "" }, // /uploads/<filename> or full URL
    bio: { type: String, default: "" },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
//! HASH PASSWORD BEFORE SAVING TO DATABASE
DataSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const userModel = mongoose.model("users", DataSchema);

module.exports = userModel;
