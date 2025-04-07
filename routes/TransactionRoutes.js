const express = require("express");
const {
  createTransaction,
  deleteAllTransactions,
  getAllTransactions,
} = require("../controllers/TransactionController");

const router = express.Router();

router.get("/", getAllTransactions);
router.post("/", createTransaction);
router.delete("/del", deleteAllTransactions);

module.exports = router;
