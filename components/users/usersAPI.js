const express = require("express");
const router = express.Router();

// Importing Controllers
const usersController = require("./usersController");

// * @route   GET http://localhost:5000/api/v1/users/test
// * @desc    User route testing
// * @access  Public
router.get("/test", usersController.test);

module.exports = router;