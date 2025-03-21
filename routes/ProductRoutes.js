const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProducts,
} = require("../controllers/ProductController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", upload.single("thumbnail"), createProduct);
router.patch("/:id", upload.single("thumbnail"), updateProduct);
router.delete("/:id", deleteProducts);

module.exports = router;

