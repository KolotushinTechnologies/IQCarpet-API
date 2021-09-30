const express = require("express");
const router = express.Router();

// Connecting to multer
const multer = require("../../utils/multer/multer");

// Importing Controllers
const usersController = require("./usersController");

// Connected Middlewares
const authMiddleware = require("../../middleware/authMiddleware");

// * @route   GET http://localhost:5000/api/v1/users/test
// * @desc    User route testing
// * @access  Public
router.get("/test", usersController.test);

// * @route   POST http://localhost:5000/api/v1/users/registration
// * @desc    User registration
// * @access  Public
router.post("/registration", usersController.registration);

// * @route   POST http://localhost:5000/api/v1/users/login
// * @desc    User login
// * @access  Public
router.post("/login", usersController.login);

// * @route   POST http://localhost:5000/api/v1/users/reset-password-send-code
// * @desc    User reset password send code
// * @access  Public
router.post("/reset-password-send-code", usersController.resetPasswordSendCode);

// * @route   POST http://localhost:5000/api/v1/users/reset-password
// * @desc    User reset password
// * @access  Public
router.post("/reset-password", usersController.resetPassword);

// * @route   POST http://localhost:5000/api/v1/users/my-profile/settings/upload-avatar
// * @desc    Post my profile for my settings Upload Avatar(My Profile Settings Upload Logo)
// * @access  Private
router.post(
  "/my-profile/settings/upload-avatar",
  multer.single("file"),
  authMiddleware,
  usersController.myProfileSettingsUploadAvatar
);

// **************************************
// *** CUSTOMER SECTION (CRUD SYSTEM) ***
// **************************************

// * @route   GET http://localhost:5000/api/v1/users/my-customer-profile
// * @desc    Get customer profile for customer(My Customer Profile)
// * @access  Private
router.get(
  "/my-customer-profile",
  authMiddleware,
  usersController.myCustomerProfile
);

// * @route   PUT http://localhost:5000/api/v1/users/my-customer-profile/settings
// * @desc    Put customer profile for customer settings(My Customer Profile Settings)
// * @access  Private
router.put(
  "/my-customer-profile/settings",
  authMiddleware,
  usersController.myCustomerProfileSettings
);

// ************************************
// *** SELLER SECTION (CRUD SYSTEM) ***
// ************************************

// * @route   GET http://localhost:5000/api/v1/users/my-seller-profile
// * @desc    Get seller profile for seller(My Seller Profile)
// * @access  Private
router.get(
  "/my-seller-profile",
  authMiddleware,
  usersController.mySellerProfile
);

// * @route   PUT http://localhost:5000/api/v1/users/my-seller-profile/settings
// * @desc    Put seller profile for seller settings(My Seller Profile Settings)
// * @access  Private
router.put(
  "/my-seller-profile/settings",
  authMiddleware,
  usersController.mySellerProfileSettings
);

module.exports = router;
