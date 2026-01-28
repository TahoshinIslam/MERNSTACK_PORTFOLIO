const express = require("express");
const userController = require("../controllers/userController");
const experienceController = require("../controllers/experienceController");
const educationController = require("../controllers/educationController");
const advantageController = require("../controllers/advantageController");
const middlewares = require("../middlewares/authVerification");
let router = express.Router();

//! API FOR USER
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/user", middlewares, userController.user);
router.get("/logout", middlewares, userController.logout);
router.put("/update", middlewares, userController.update);

//! API FOR Experience
router.post(
  "/create-experience",
  middlewares,
  experienceController.createExperience,
);
router.get("/all-experience", experienceController.allExperience);
router.get("/single-experience/:id", experienceController.singleExperience);
router.put(
  "/update-experience/:id",
  middlewares,
  experienceController.updateExperience,
);
router.delete(
  "/delete-experience/:id",
  middlewares,
  experienceController.deleteExperience,
);

//! API FOR Education
router.post(
  "/create-education",
  middlewares,
  educationController.createEducation,
);
router.get("/all-education", educationController.allEducation);
router.get("/single-education/:id", educationController.singleEducation);
router.put(
  "/update-education/:id",
  middlewares,
  educationController.updateEducation,
);
router.delete(
  "/delete-education/:id",
  middlewares,
  educationController.deleteEducation,
);

//! API FOR Advantage
router.post(
  "/create-advantage",
  middlewares,
  advantageController.createAdvantage,
);
router.get("/all-advantage", advantageController.allAdvantage);
router.get("/single-advantage/:id", advantageController.singleAdvantage);
router.put(
  "/update-advantage/:id",
  middlewares,
  advantageController.updateAdvantage,
);
router.delete(
  "/delete-advantage/:id",
  middlewares,
  advantageController.deleteAdvantage,
);

module.exports = router;
