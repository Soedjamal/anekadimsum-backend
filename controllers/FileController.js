const File = require("../models/File");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const file = await File.create({
      name: req.file.originalname,
      url: req.file.path,
      cloudinary_id: req.file.filename,
    });

    res.status(201).json(file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "File upload failed" });
  }
};
