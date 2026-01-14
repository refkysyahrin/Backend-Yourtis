const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Endpoint: http://localhost:3000/api/auth/register
router.post("/register", authController.register);

// Endpoint: http://localhost:3000/api/auth/login
router.post("/login", authController.login);

module.exports = router;
