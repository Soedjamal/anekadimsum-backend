const cloudinary = require("../config/cloudinary");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");

exports.getAllProducts = async (req, res) => {
  try {
    const data = await Product.find();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Product.findById(id);

    if (!data) {
      return res.status(404).json({
        message: "product not found",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Thumbnail is required" });
    }

    const product = await Product.create({
      name,
      price,
      stock,
      thumbnail: req.file.path,
      cloudinary_id: req.file.filename,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProducts = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).select("cloudinary_id");

    console.log(product);

    await cloudinary.uploader.destroy(product.cloudinary_id);

    await Product.deleteOne({ _id: id });

    return res.status(200).json({
      message: "success delete product",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, sold } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const updateFields = {};
    if (name) updateFields.name = name;
    if (price) updateFields.price = price;
    if (stock) updateFields.stock = stock;
    if (sold) updateFields.stock = sold;

    if (req.file) {
      updateFields.thumbnail = req.file.path;
      updateFields.cloudinary_id = req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    res.status(202).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProductByTRX = async (req, res) => {
  const { id } = req.params;

  try {
    const productData = await Transaction.findOne({
      transaction_id: id,
    }).select("product_id quantity");

    const result = await Product.findByIdAndUpdate(
      productData.product_id,
      {
        $inc: { stock: -productData.quantity, sold: productData.quantity },
      },
      { new: true },
    );

    res.status(201).json({
      message: "payment success",
      data: {
        stock: result.stock,
        sold: result.sold,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetStockAndSold = async (req, res) => {
  try {
    const result = await Product.updateMany(
      {},
      { $set: { stock: 0, sold: 0 } },
    );
    res.status(200).json({
      message: `${result.modifiedCount} products reset to 0`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAllStock = async (req, res) => {
  const { amount } = req.query;
  try {
    const result = await Product.updateMany({}, { $set: { stock: amount } });
    res.status(200).json({
      message: `${result.modifiedCount} products updated`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
