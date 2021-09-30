const express = require("express");
const router = express.Router();

// Importing Controllers
const countryController = require("./countryController");

// Connected Middlewares
const authMiddleware = require("../../middleware/authMiddleware");

// * @route   GET http://localhost:5000/api/v1/country/test
// * @desc    Country route testing
// * @access  Public
router.get("/test", countryController.test);

// * @route   GET http://localhost:5000/api/v1/country
// * @desc    Get Countries
// * @access  Public
router.get("/", countryController.getCountries);

// * @route   GET http://localhost:5000/api/v1/country/:_id
// * @desc    Get Country by id
// * @access  Public
router.get("/:_id", countryController.getCountryById);

// * @route   POST http://localhost:5000/api/v1/country
// * @desc    Country craete
// * @access  Private
router.post("/", authMiddleware, countryController.create);

// * @route   PUT http://localhost:5000/api/v1/country/:_id
// * @desc    Country edit
// * @access  Private
router.put("/:_id", authMiddleware, countryController.updateCountryById);

// * @route   DELETE http://localhost:5000/api/v1/country/:_id
// * @desc    Country delete
// * @access  Private
router.delete("/:_id", authMiddleware, countryController.deleteCountryById);

module.exports = router;
