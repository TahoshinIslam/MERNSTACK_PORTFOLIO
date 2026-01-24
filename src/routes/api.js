const express = require("express");
const userController = require("../controllers/userController");
let router = express.Router();

//! Register anew user
router.post("/register", userController.register);
router.post("/login", userController.login);
module.exports = router;
