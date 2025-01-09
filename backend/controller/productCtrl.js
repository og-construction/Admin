const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongodbId = require("../utils/validateMongodbId");
const Seller = require("../models/sellerModel"); // Adjust the path if necessary
const User = require("../models/userModel"); // Adjust the path if necessary

// Create a new product
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({ message: "Name and price are required" });
    }
    req.body.slug = slugify(req.body.name);
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id); // Validate the ID

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id); // Validate the ID

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a single product by ID
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id); // Validate the ID

  try {
    const findProduct = await Product.findById(id);

    if (!findProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(findProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all products
const getAllProduct = asyncHandler(async (req, res) => {
  try {
    // Get the query object from req.query
    const queryObj = { ...req.query };

    // Exclude pagination and sort parameters
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((field) => delete queryObj[field]);

    // Convert query to JSON string and replace operators
    let queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    const finalQuery = JSON.parse(queryStr);

    // Find products
    const products = await Product.find(finalQuery).populate("image"); // Populate the image details

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    // Transform response if necessary to include base64 image data
    const response = products.map((product) => ({
      ...product.toObject(),
      image: product.image
        ? {
            filename: product.image.filename,
            contentType: product.image.contentType,
            data: product.image.data, // Assuming this is the Base64-encoded data
          }
        : null,
    }));
  // Return the products along with the total count
  res.status(200).json({
    totalProducts: products.length, // Total number of products
    products: response, // Transformed product data
  });
} catch (error) {
  console.error("Error fetching products:", error);
  res.status(500).json({ message: "Error fetching products" });
}
});

const getProductCounts = asyncHandler(async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const approvedProducts = await Product.countDocuments({ approved: true }); // Count approved products
    const recentlyAddedProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name createdAt");
    const unapprovedProducts = await Product.countDocuments({ approved: false });

    res.status(200).json({
      totalProducts,
      approvedProducts, // Include in response
      recentlyAddedProducts,
      unapprovedProducts,
    });
  } catch (error) {
    console.error("Error fetching product counts:", error);
    res.status(500).json({ message: "Failed to fetch product counts" });
  }
});


// Shuffle array utility function
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Get visible products for a seller
const getVisibleProducts = asyncHandler(async (req, res) => {
  const { sellerId } = req.params; // Extract seller ID from request parameters

  // Step 1: Check if the seller exists
  const seller = await Seller.findById(sellerId);
  if (!seller) {
    return res.status(404).json({ message: "Seller not found" });
  }

  // Step 2: Get the current visibility level
  const visibilityLevel = seller.visibility;
  console.log("Visibility Level:", visibilityLevel);

  // Step 3: Find products for this seller
  const products = await Product.find({ seller: sellerId });
  console.log("Products Found:", products);

  // Step 4: Check if any products were found
  if (products.length === 0) {
    return res
      .status(404)
      .json({ message: "No products found for this seller" });
  }

  // Step 5: Shuffle and limit products based on visibility level
  const shuffledProducts = shuffleArray(products);
  console.log("Shuffled Products:", shuffledProducts);

  // Limit products based on visibility level
  const visibleProducts = shuffledProducts.slice(0, visibilityLevel);
  console.log("Visible Products:", visibleProducts);

  // Step 6: Return visible products
  res.status(200).json(visibleProducts);
});

//------------Wishlist----------------------------------------
const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user; // Extract user ID from request
  const { prodId } = req.body; // Get product ID from request body

  try {
    const user = await User.findById(_id); // Await user retrieval

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if product is already in the wishlist
    if (user.wishlist.includes(prodId)) {
      return res
        .status(400)
        .json({ message: "Product is already in the wishlist" });
    }

    // Add product to wishlist
    user.wishlist.push(prodId); // Push the product ID to wishlist
    await user.save(); // Save the updated user

    res.json(user); // Return updated user
  } catch (error) {
    console.error("Error adding to wishlist:", error); // Log error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
});

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user; // Extract user ID
  const { star, prodId } = req.body; // Get star rating and product ID from request body

  try {
    const product = await Product.findById(prodId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user has already rated the product
    const alreadyRated = product.ratings.find(
      (userRating) => userRating.postedby.toString() === _id.toString()
    );

    if (alreadyRated) {
      // Update the existing rating
      await Product.updateOne(
        { "ratings.postedby": _id },
        { $set: { "ratings.$.star": star } }
      );
      return res.json({ message: "Rating updated" });
    } else {
      // Add a new rating
      product.ratings.push({ star, postedby: _id });
      await product.save();
      return res.json({ message: "Rating added", product });
    }
  } catch (error) {
    console.error("Error adding rating:", error); // Log error for debugging
    return res.status(500).json({ message: error.message });
  }
});
//--------------total rating ---------------------------

module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getVisibleProducts,
  addToWishlist,
  rating,
  getProductCounts  
};
