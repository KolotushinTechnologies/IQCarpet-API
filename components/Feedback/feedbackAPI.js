const express = require("express");
const router = express.Router();

// Importing Controllers
const feedbackController = require("./feedbackController");

// * @route   GET http://localhost:5000/api/v1/feedback/test
// * @desc    Feedback route testing
// * @access  Public
router.get("/test", feedbackController.test);

// * @route   POST http://localhost:5000/api/v1/feedback/send
// * @desc    Send request for feedback
// * @access  Public
router.post("/send", feedbackController.sendRequestForFeedback);

module.exports = router;
