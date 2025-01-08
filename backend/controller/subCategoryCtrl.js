const SubCategory = require("../models/SubCategory");
const Category = require("../models/CategoryModel");
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId');

// Create Subcategory
// subcategoryController.js
const createSubcategory = asyncHandler(async (req, res) => {
    const { name, category } = req.body;
  
    if (!name || !category) {
      res.status(400);
      throw new Error('Name and category are required');
    }
  
    try {
      const imageFile = req.file;
      if (!imageFile) {
        return res.status(400).json({ message: 'Image file is required' });
      }
  
      const newSubcategory = await SubCategory.create({
        name,
        category,
        image: imageFile.id, // Store the file ID from GridFS
      });
  
      res.status(201).json(newSubcategory);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to create subcategory',
        error: error.message,
      });
    }
  });
  
// Update Subcategory
const updateSubcategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
  
    try {
      const updatedData = { ...req.body };
      if (req.file) {
        updatedData.image = req.file.id; // Update image reference
      }
  
      const updatedSubcategory = await SubCategory.findByIdAndUpdate(
        id,
        updatedData,
        { new: true }
      );
  
      if (!updatedSubcategory) {
        res.status(404);
        throw new Error('Subcategory not found');
      }
  
      res.json(updatedSubcategory);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to update subcategory',
        error: error.message,
      });
    }
  });
  
// Delete Subcategory
const deleteSubcategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    try {
        const deletedSubcategory = await SubCategory.findByIdAndDelete(id);

        if (!deletedSubcategory) {
            res.status(404);
            throw new Error("Subcategory not found");
        }

        res.json({ message: "Subcategory deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete subcategory", error: error.message });
    }
});

// Get All Subcategories
const getAllSubcategories = asyncHandler(async (req, res) => {
    try {
        const subcategories = await SubCategory.find().populate("category", "name");
        res.json(subcategories);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch subcategories", error: error.message });
    }
});

// Get a Single Subcategory by ID
const getSubcategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    try {
        const subcategory = await SubCategory.findById(id).populate("category", "name");

        if (!subcategory) {
            res.status(404);
            throw new Error("Subcategory not found");
        }

        res.json(subcategory);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch subcategory", error: error.message });
    }
});

// Get Subcategories by Category ID
const getSubcategoriesByCategoryId = asyncHandler(async (req, res) => {
    const { id: categoryId } = req.params;
    validateMongodbId(categoryId);

    try {
        const subcategories = await SubCategory.find({ category: categoryId }).populate("category", "name");

        if (!subcategories || subcategories.length === 0) {
            res.status(404);
            throw new Error("No subcategories found for this category");
        }

        res.json(subcategories);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch subcategories", error: error.message });
    }
});

module.exports = {
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    getAllSubcategories,
    getSubcategory,
    getSubcategoriesByCategoryId
};
