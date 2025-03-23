const express = require("express");
const { uploadFile } = require("../controllers/FileController");
const cloudinary = require("../config/cloudinary");
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

router.post("/upload", upload.single("file"), uploadFile);

module.exports = router;

