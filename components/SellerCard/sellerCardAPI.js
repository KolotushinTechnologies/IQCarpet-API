const express = require("express");
const router = express.Router();

// Importing Controllers
const sellerCardController = require("./sellerCardController");

// Connected Middlewares
const authMiddleware = require("../../middleware/authMiddleware");

// * @route   GET http://localhost:5000/api/v1/seller-card/test
// * @desc    Seller Card route testing
// * @access  Public
router.get("/test", sellerCardController.test);

// * @route   GET http://localhost:5000/api/v1/seller-card/my-seller-card
// * @desc    Get my seller card
// * @access  Private
router.get(
  "/my-seller-card",
  authMiddleware,
  sellerCardController.mySellerCard
);

module.exports = router;
