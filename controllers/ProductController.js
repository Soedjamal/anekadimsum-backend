const cloudinary = require("../config/cloudinary");
const Product = require("../models/Product");

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
  console.log(req.file.path);
  console.log(req.body);
  try {
    const { name, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Thumbnail is required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const product = await Product.create({
      name,
      price,
      thumbnail: result.secure_url,
      cloudinary_id: result.public_id,
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
    const product = await Product.findById(id).select("cloudniary_id");

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
  const { id } = req.params;
  const { name, price } = req.body;

  try {
    const product = await Product.findById(id).select(
      "thumbnail",
      "cloudniary_id",
    );

    if (!product) {
      return res.status(404).json({
        message: "product not found",
      });
    }

    await cloudinary.uploader.destroy(product.cloudinary_id);

    const result = await cloudinary.uploader.upload(req.file.path);

    const update = Product.findByIdAndUpdate(id, {
      name: name,
      price: price,
      thumbnail: result?.secure_url || product.thumbnail,
      cloudniary_id: result?.public_id || product.cloudinary_id,
    });

    return res.status(202).json(update);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
