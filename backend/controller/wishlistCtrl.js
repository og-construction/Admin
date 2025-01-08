const Wishlist = require("../models/Wishlist");
const { validateMongodbId } = require("./CategoryCtrl");

// Add to Wishlist
const addToWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  validateMongodbId(userId);

  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $addToSet: { items: { productId } } },
      { new: true, upsert: true }
    ).populate("items.productId");
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishlist", error });
  }
};

// Get a user's Wishlist
const getWishlist = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    res.status(400).json({ message: "UserId is Required" });
    return;
  }
  validateMongodbId(userId);

  try {
    const wishlist = await Wishlist.findOne({ userId }).populate({
      path: "items.productId",
      populate: [
        { path: "image" }, // Populate `image` of `product`
        { path: "category", select: "name" }, // Populate `category` with only the `name` field
        { path: "subcategory", select: "name" }, // Populate `subcategory` with only the `name` field
      ],
    })
    if (!wishlist)
      return res.status(404).json({ message: "Wishlist not found" });
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist", error });
  }
};

// Delete a user's Wishlist
// In your backend controller (e.g., `wishlistCtrl.js`)
const deleteWishlist = async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body; // Ensure this is being passed in the request body

  validateMongodbId(userId);

  try {
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Remove the product from the wishlist
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } }, // This removes the product with the given productId
      { new: true }
    ).populate("items.productId");

    if (!updatedWishlist) {
      return res
        .status(404)
        .json({ message: "Failed to remove item from wishlist" });
    }

    res.status(200).json(updatedWishlist);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting item from wishlist", error });
  }
};

// Remove from Wishlist
const removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  validateMongodbId(userId);

  try {
    // Remove product from the wishlist items array
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    ).populate("items.productId");

    if (!wishlist)
      return res.status(404).json({ message: "Wishlist not found" });
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Error removing from wishlist", error });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  deleteWishlist,
  removeFromWishlist,
};
