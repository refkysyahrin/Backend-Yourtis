const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

// URL: http://localhost:3000/api/transactions/checkout
router.post("/checkout", transactionController.checkout);

module.exports = router;
