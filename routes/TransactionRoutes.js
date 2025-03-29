const express = require("express");
const {
  createTransaction,
  deleteAllTransactions,
} = require("../controllers/TransactionController");

const router = express.Router();

router.post("/", createTransaction);
router.delete("/del", deleteAllTransactions);

module.exports = router;

