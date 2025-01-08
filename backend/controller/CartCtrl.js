const Cart = require("../models/CartModel");
const validateMongodbId = require("../utils/validateMongodbId");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const Seller = require("../models/sellerModel");
const User = require("../models/userModel");
const InterestedUser = require("../models/InterestedUsers");
const sendEmail = require("./emailCtrl")
// Add items to cart
const addToCart = async (req, res) => {
  const { userId, items } = req.body;

  if (!userId || !items || !Array.isArray(items)) {
    return res
      .status(400)
      .json({ message: "Invalid input: userId and items are required" });
  }

  validateMongodbId(userId);

  try {
    // Check and update "Sale By Seller" products
    for (const { productId } of items) {
      // Retrieve user details
      const user = await User.findById(userId).select("name email mobile");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const productDetails = await Product.findById(productId).populate(
        "seller",
        "name email mobile companyName address"
      );
      if (!productDetails) {
        return res
          .status(404)
          .json({ message: `Product with ID ${productId} not found` });
      }

      if (productDetails.saleType === "Sale By Seller") {
        const seller = productDetails.seller;

        // Add interested user to the InterestedUser model
        const interestedUser = new InterestedUser({
          userId: user._id,
          productId: productDetails._id,
          sellerId: seller._id,
          interestDate: new Date(),
          status: "Pending",
        });

        await interestedUser.save();


        // Send email to the user with seller details
        const userEmailData = {
          to: user.email,
          subject: "Seller Details for Your Interested Product",
          type: "sellerDetails",
          templateData: {
            name: user.name,
            email: seller.email,
            mobile: seller.mobile,
            companyName: seller.companyName,
            address: seller.address,
          },
        };
        sendEmail(userEmailData).catch((error) => {
          console.error("Error sending email to user:", error.message);
        });


  // Send email to the seller with user details
  const sellerEmailData = {
    to: seller.email,
    subject: "User Interested in Your Product",
    type: "interestedUsers",
    templateData: {
      sellerName: seller.name,
      interestedUsers: [
        {
          user: {
            name: user.name,
            email: user.email,
            mobile: user.mobile,
          },
          product: {
            name: productDetails.name,
            price: productDetails.price,
          },
          interestDate: new Date(),
          status: "Pending",
        },
      ],
    },
  };
  sendEmail(sellerEmailData).catch((error) => {
    console.error("Error sending email to seller:", error.message);
  });

  return res.status(200).json({
    message: "This product is available for sale directly by the seller.",
    sellerDetails: {
      name: seller.name,
      email: seller.email,
      mobile: seller.mobile,
      companyName: seller.companyName,
      address: seller.address,
    },
  });
}
}    

    // Add to cart for "Sale By OGCS"
    let cart = await Cart.findOne({ userId });
    let productId = items[0].productId;
    let product = await Product.findById(productId);
    // Check if the product exists and the required quantity is available
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let requiredQuantity = items[0].quantity;
    if (product.stock < requiredQuantity) {
      return res
        .status(400)
        .json({ message: "Insufficient stock for the product" });
    }
    if (cart) {
      console.log("Existing cart found:", cart);
      items.forEach(({ productId, quantity }) => {
        const itemIndex = cart.items.findIndex((item) =>
          item.productId.equals(productId)
        );
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity = quantity;
        } else {
          cart.items.push({ productId, quantity });
        }
      });
    } else {
      console.log("Creating new cart...");
      cart = new Cart({ userId, items });
    }

    console.log("Saving cart with updated items:", cart);
    await cart.save();
    console.log("Cart saved successfully:", cart);

    res.status(200).json({ message: "Item(s) added to cart", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res
      .status(500)
      .json({ message: "Error adding to cart", error: error.message });
  }
};

// Get cart for a specific user
const getCart = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  validateMongodbId(userId);

  try {
    // const cart = await Cart.findOne({ userId }).populate({
    //   path: "items.productId",
    //   select: "name image price seller",
    // });
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId", // Populate the product details
      select: "name price seller image stock gstNumber hsnCode", // Select specific product fields
      populate: {
        path: "image",
      },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Error fetching cart", error });
  }
});

// Get all carts
const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate("items.productId");
    if (!carts || carts.length === 0) {
      return res.status(404).json({ message: "No carts found" });
    }
    res.status(200).json(carts);
  } catch (error) {
    console.error("Error fetching all carts:", error);
    res
      .status(500)
      .json({ message: "Error fetching all carts", error: error.message });
  }
};
// Delete a user's cart
const deleteCart = async (req, res) => {
  const { userId } = req.params; // Extract userId from request params
  validateMongodbId(userId); // Validate MongoDB ID

  try {
    const cart = await Cart.findOneAndDelete({ userId }); // Delete cart for the user
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" }); // Handle cart not found
    }
    res.status(200).json({ message: "Cart deleted successfully" }); // Success response
  } catch (error) {
    console.error("Error deleting cart:", error); // Log errors
    res
      .status(500)
      .json({ message: "Error deleting cart", error: error.message }); // Send error response
  }
};
const deleteSpecificCart = asyncHandler(async (req, res) => {
  const { userId, cartId } = req.body;

  const cart = await Cart.findOne({ user: userId, _id: cartId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  await Cart.findByIdAndDelete(cartId);

  res.status(200).json({ message: "Cart deleted successfully" });
});

const removeItemFromCart = asyncHandler(async (req, res) => {
  const { cartId, itemId } = req.body;

  const cart = await Cart.findById(cartId);

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Remove the item
  cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
  await cart.save();

  // Re-fetch the updated cart with populated product data
  const updatedCart = await Cart.findById(cartId).populate({
    path: "items.productId",
    select: "name price seller image",
    populate: { path: "image" },
  });

  res
    .status(200)
    .json({ message: "Item removed successfully", cart: updatedCart });
});

const checkoutCart = asyncHandler(async (req, res) => {
  const { cartId } = req.body;

  const cart = await Cart.findById(cartId);

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Perform checkout logic (e.g., payment, order creation, etc.)
  res.status(200).json({ message: "Checkout successful" });
});

module.exports = {
  addToCart,
  deleteCart,
  getCart,
  getAllCarts,
  deleteSpecificCart,
  checkoutCart,
  removeItemFromCart,
};
