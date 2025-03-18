const express = require("express")
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProducts } = require("../controllers/ProductController")

const router = express.Router()

router.get("/", getAllProducts)
router.get("/:id", getProductById)
router.post("/", createProduct)
router.patch("/:id", updateProduct)
router.delete("/:id", deleteProducts)

module.exports = router