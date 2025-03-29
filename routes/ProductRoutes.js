const express = require("express");
const cloudinary = require("../config/cloudinary");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProducts,
  updateProductByTRX,
  updateAllStock,
  resetStockAndSold,
} = require("../controllers/ProductController");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    format: async (req, file) => "png",
    public_id: (req, file) => file.originalname,
  },
});
const upload = multer({ storage });

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", upload.single("thumbnail"), createProduct);
router.patch("/:id", upload.single("thumbnail"), updateProduct);
router.patch("/trx/:id", updateProductByTRX);
router.patch("/", updateAllStock);
router.delete("/del", resetStockAndSold);
router.delete("/:id", deleteProducts);

module.exports = router;
