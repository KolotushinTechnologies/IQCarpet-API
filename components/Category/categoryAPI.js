const express = require("express");
const router = express.Router();

// Importing Controllers
const categoryController = require("./categoryController");

// Connected Middlewares
const authMiddleware = require("../../middleware/authMiddleware");

// * @route   GET http://localhost:5000/api/v1/category/test
// * @desc    Category route testing
// * @access  Public
router.get("/test", categoryController.test);

// * @route   GET http://localhost:5000/api/v1/category
// * @desc    Get Categories
// * @access  Public
router.get("/", categoryController.getCategories);

// * @route   GET http://localhost:5000/api/v1/category/:_id
// * @desc    Get Category by id
// * @access  Public
router.get("/:_id", categoryController.getCategoryById);

// * @route   POST http://localhost:5000/api/v1/category
// * @desc    Category craete
// * @access  Private
router.post("/", authMiddleware, categoryController.create);

// * @route   PUT http://localhost:5000/api/v1/category/:_id
// * @desc    Category edit
// * @access  Private
router.put("/:_id", authMiddleware, categoryController.updateCategoryById);

// * @route   DELETE http://localhost:5000/api/v1/category/:_id
// * @desc    Category delete
// * @access  Private
router.delete("/:_id", authMiddleware, categoryController.deleteCategoryById);

module.exports = router;
