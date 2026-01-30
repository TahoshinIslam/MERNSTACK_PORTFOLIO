const express = require("express");
const userController = require("../controllers/userController");
const experienceController = require("../controllers/experienceController");
const educationController = require("../controllers/educationController");
const advantageController = require("../controllers/advantageController");
const portfolioController = require("../controllers/portfolioController");
const serviceController = require("../controllers/serviceController");
const testimonialController = require("../controllers/testimonialController");
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

//! API FOR PORTFOLIO
router.post(
  "/create-portfolio",
  middlewares,
  portfolioController.createPortfolio,
);
router.get("/all-portfolio", portfolioController.allPortfolio);
router.get("/single-portfolio/:id", portfolioController.singlePortfolio);
router.put(
  "/update-portfolio/:id",
  middlewares,
  portfolioController.updatePortfolio,
);
router.delete(
  "/delete-portfolio/:id",
  middlewares,
  portfolioController.deletePortfolio,
);

//! API FOR SERVICE
router.post("/create-service", middlewares, serviceController.createService);
router.get("/all-service", serviceController.allService);
router.get("/single-service/:id", serviceController.singleService);
router.put("/update-service/:id", middlewares, serviceController.updateService);
router.delete(
  "/delete-service/:id",
  middlewares,
  serviceController.deleteService,
);
//! API FOR Testimonial
router.post(
  "/create-testimonial",
  middlewares,
  testimonialController.createTestimonial,
);
router.get("/all-testimonial", testimonialController.allTestimonial);
router.get("/single-testimonial/:id", testimonialController.singleTestimonial);
router.put(
  "/update-testimonial/:id",
  middlewares,
  testimonialController.updateTestimonial,
);
router.delete(
  "/delete-testimonial/:id",
  middlewares,
  testimonialController.deleteTestimonial,
);
module.exports = router;
