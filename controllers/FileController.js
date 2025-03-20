const cloudinary = require("../config/cloudinary");
const File = require("../models/File");

exports.uploadFile = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const file = new File.insertOne({
      name: req.file.originalname,
      url: result.source_url,
      cloudniary_id: result.public_id,
    });

    res.status(201).json(file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "file upload failed" });
  }
};
