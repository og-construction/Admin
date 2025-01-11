const express = require("express");
const upload2 = require("../middlewares/multer2"); // Import multer2 for categories
const router = express.Router();

// Example: POST API to upload category images
router.post("/api/category/upload-image", upload2.single("image"), (req, res) => {
  try {
    const imageUrl = `/upload/images/${req.file.filename}`;
    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl, // Provide URL to access the uploaded image
    });
  } catch (error) {
    res.status(500).json({
      message: "Image upload failed",
      error: error.message,
    });
  }
});

// Export router
module.exports = router;
