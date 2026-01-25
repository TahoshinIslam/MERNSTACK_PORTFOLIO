const express = require("express");
const userController = require("../controllers/userController");
const experienceController = require("../controllers/experienceController");
const middlewares = require("../middlewares/authVerification");
let router = express.Router();

//! API FOR USER
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/user", middlewares, userController.user);
router.get("/logout", middlewares, userController.logout);
router.put("/update", middlewares, userController.update);

//! API FOR Experience
router.post("/create-experience", experienceController.createExperience);

module.exports = router;
