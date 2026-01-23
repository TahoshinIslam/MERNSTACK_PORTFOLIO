const express = require("express");
const router = require("./routes/api");
let router = express.Router();

router.get("/data", (req, res) => {
  res.status(200).json({
    data: "Hello",
  });
});
module.exports = router;
