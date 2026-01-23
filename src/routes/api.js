const express = require("express");
let router = express.Router();

router.get("/data", (req, res) => {
  res.status(200).json({
    data: "Hello",
  });
});
module.exports = router;
