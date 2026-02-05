const express = require("express");
const userController = require("../controllers/userController");
const experienceController = require("../controllers/experienceController");
const educationController = require("../controllers/educationController");
const advantageController = require("../controllers/advantageController");
const portfolioController = require("../controllers/portfolioController");
const serviceController = require("../controllers/serviceController");
const testimonialController = require("../controllers/testimonialController");
const contactController = require("../controllers/contactController");
const blogController = require("../controllers/blogController");
const commentController = require("../controllers/commentController");
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

//! API FOR CONTACT
router.post("/create-contact", contactController.createContact);
router.get("/all-contact", contactController.allContact);
router.get("/single-contact/:id", contactController.singleContact);
router.delete(
  "/delete-contact/:id",
  middlewares,
  contactController.deleteContact,
);

//! API FOR BLOG
router.post("/create-blog", middlewares, blogController.createBlog);
router.get("/all-blog/:pageNo/:perPage", blogController.allBlog);
router.get("/single-blog/:id", blogController.singleBlog);
router.put("/update-blog/:id", middlewares, blogController.updateBlog);
router.delete("/delete-blog/:id", middlewares, blogController.deleteBlog);

//! API FOR COMMENT
router.post("/create-comment", commentController.createComment);
router.get("/all-comment", commentController.allComment);
router.get("/single-comment/:id", commentController.singleComment);
router.delete(
  "/delete-comment/:id",
  middlewares,
  commentController.deleteComment,
);
module.exports = router;
