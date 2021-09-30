require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Initialize all API Lettera routes
const usersRoute = require("../../components/users");
const feedbackRoute = require("../../components/Feedback");
const sellerCardRoute = require("../../components/SellerCard");
const categoryRoute = require("../../components/Category");
const countryRoute = require("../../components/Country");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use(express.static("public"));

app.use("/api/v1/users", usersRoute);
app.use("/api/v1/feedback", feedbackRoute);
app.use("/api/v1/seller-card", sellerCardRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/country", countryRoute);

module.exports = app;
