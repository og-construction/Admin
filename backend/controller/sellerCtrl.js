const Seller = require("../models/sellerModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const category = require("./CategoryCtrl");
//const { errorHandler } = require("../middlewares/errorHandler");
const validateMongodbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
//const { text } = require("body-parser");
const sendEmail = require("./emailCtrl");
//const { create } = require('domain');
//const bcrypt = require('bcrypt'); // Ensure bcrypt is imported
const slugify = require("slugify"); // Add this line
const socket = require("../socket");
const mongoose = require("mongoose");
const Category = require("../models/CategoryModel");
const Subcategory = require("../models/SubCategory");
const FileModel = require("../models/fileModel");
const DeliveryCharge = require("../models/deliveryCharge"); // Add this line
const InterestedUser = require("../models/InterestedUsers");
const { type } = require("os");
const SellerProductVisibilityModel =require('../models/SellerProductvisibilityModel')
const OtherPayment = require("../models/otherpayment");

const createSeller = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    mobile,
    password,
    companyName,
    role,
    street,
    city,
    state,
    gstNumber,
    pan,
    country,
    postalCode,
  } = req.body;

  if (
    !name ||
    !email ||
    !mobile ||
    !companyName ||
    !gstNumber ||
    !pan ||
    !password ||
    !role ||
    !street ||
    !city ||
    !state ||
    !country ||
    !postalCode
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const findSeller = await Seller.findOne({ email });
  if (findSeller) {
    res.status(400);
    throw new Error("Seller already exists");
  }

  const address = { street, city, state, country, postalCode };

  const newSeller = new Seller({
    name,
    email,
    mobile,
    companyName,
    gstNumber,
    pan,
    password,
    role,
    address,
  });

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  newSeller.verificationOtp = otp;
  newSeller.verificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  try {
    await newSeller.save();
  } catch (error) {
    console.error("Error saving seller:", error);
    throw new Error("Could not save seller");
  }

  // send otp via email
  const data = {
    to: email,
    subject: "Verify your email",
    name: newSeller.name,
    type: "verifyEmail", // Specify the type
    otp: otp, // Pass OTP dynamically
  };
  await sendEmail(data);

  // TODO: send otp via sms using your sms services provider

  res.status(201).json({
    message:
      "Seller registered successfully. Please verify your email and mobile.",
    id: newSeller._id,
  });
});

// otp verification function
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const seller = await Seller.findOne({ email });
  if (!seller) return res.status(400).json({ message: "seller not found" });

  if (
    seller.verificationOtp !== otp ||
    seller.verificationExpires < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  seller.isVerified = true;
  seller.verificationOtp = undefined;
  seller.verificationExpires = undefined;
  await seller.save();

  res.status(200).json({ message: "Email verified successfully" });
});

// Login Seller
const loginSellerCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const findSeller = await Seller.findOne({ email });
  if (!findSeller) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const isMatch = await findSeller.isPasswordMatched(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials " });
  }

  // Genrate refresh token and update seller record
  const refreshToken = generateRefreshToken(findSeller._id);
  await Seller.findByIdAndUpdate(findSeller._id, { refreshToken });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
  }); //72 hours

  res.status(200).json({
    message: "Login successful",
    seller: {
      id: findSeller._id,
      name: findSeller.name,
      email: findSeller.email,
      mobile: findSeller.mobile,
      companyName: findSeller,
      role: findSeller.role,
    },
    token: generateToken(findSeller._id),
    refreshToken: refreshToken,
  });
});

// handle refreshtoken
const handleRefreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  // Find seller by refresh token
  const seller = await Seller.findOne({ refreshToken });
  if (!seller) {
    return res.status(403).json({ message: "Refresh token not valid" });
  }

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Refresh token is invalid" });
    }

    // Generate a new access token
    const newAccessToken = generateToken(seller._id);
    res.status(200).json({ accessToken: newAccessToken });
  });
});

//

//--------------------------------
// Get All Sellers
const getAllSellers = asyncHandler(async (req, res) => {
  const sellers = await Seller.find(); // Change User to Seller
  res.status(200).json(sellers);
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Ensure this is correct
  if (!refreshToken) {
    res.clearCookie("refreshToken");
    return res.sendStatus(204); // No content
  }

  await Seller.findOneAndUpdate({ refreshToken }, { refreshToken: null }); // Clear the refresh token
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  return res.sendStatus(204);
});

const updateSeller = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const updateData = req.body; // Dynamically take fields from request body

  // Validate if there are any fields to update
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const seller = await Seller.findById(id); // Fetch seller by ID
  if (!seller) {
    return res.status(404).json({ message: "Seller not found" });
  }

  // Update only fields present in the request body
  const updatedSeller = await Seller.updateOne(
    { _id: id }, // Filter by seller's ID
    { $set: updateData } // Set the fields to be updated
  );

  // Check if any document was updated
  if (updatedSeller.nModified === 0) {
    return res.status(400).json({ message: "No changes were made" });
  }

  res.status(200).json({
    message: "Seller updated successfully",
    updatedFields: updateData,
  });
});

// Delete Seller
const deleteSeller = asyncHandler(async (req, res) => {
  const sellerId = req.params.id; // Get seller ID from request parameters
  validateMongodbId(sellerId);
  const seller = await Seller.findById(sellerId); // Change User to Seller

  if (!seller) {
    return res.status(404).json({ message: "Seller not found" });
  }

  await Seller.findByIdAndDelete(sellerId); // Change User to Seller
  res.status(200).json({ message: "Seller deleted successfully" });
});

// Block Seller
const blockSeller = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const blockedSeller = await Seller.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    if (!blockedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.json({ message: "Seller Blocked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get a Seller by ID
const getaSeler = asyncHandler(async (req, res) => {
  const { id } = req.params; // Extract seller ID from request parameters
  validateMongodbId(id); // Validate the ID

  const seller = await Seller.findById(id); // Use Seller model to find the seller
  if (!seller) {
    return res.status(404).json({ message: "Seller not found" });
  }

  res.status(200).json(seller); // Return the found seller
});

// Unblock Seller
const unblockSeller = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const unblockedSeller = await Seller.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    if (!unblockedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.json({ message: "Seller UnBlocked" });
  } catch (error) {
    throw new Error(error);
  }
});

// ----------------password reset/update--------------------------
const updatePassword = asyncHandler(async (req, res) => {
  if (!req.seller) {
    return res.status(400).json({ message: "Seller not authenticated" });
  }
  const { password } = req.body; // Get the new password from the request body
  const sellerId = req.seller._id; // Extract seller ID from request
  validateMongodbId(sellerId); // Validate the MongoDB ID

  const seller = await Seller.findById(sellerId);
  if (!seller) {
    return res.status(404).json({ message: "Seller not found" });
  }

  if (password) {
    seller.password = password; // Set the new password
    const updatedPassword = await seller.save(); // Save the updated seller
    res.json({
      message: "Password updated successfully",
      seller: updatedPassword,
    });
  } else {
    res.status(400).json({ message: "Password is required" });
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const seller = await Seller.findOne({ email });

  if (!seller) {
    return res
      .status(404)
      .json({ message: "Seller not found with this email" });
  }

  try {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    seller.passwordResetOtp = otp;
    seller.passwordResetExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    await seller.save(); // Ensure this operation is successful

    // Log data for debugging
    console.log(`Generated OTP: ${otp} for email: ${email}`);

    // Send OTP via email
    const data = {
      to: email,
      subject: "Reset Your Password - OTP",
      type: "forgotPassword", // Specify the type
      name: seller.name, // Optional
      otp, // Pass OTP dynamically
    };

    await sendEmail(data);

    res.status(200).json({ message: "OTP sent successfully to your email." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;

  const seller = await Seller.findOne({ email });
  console.log("Seller found:", seller);

  if (!seller) {
    return res.status(404).json({ message: "Seller not found" });
  }

  // Debug logs
  console.log(`Stored OTP: ${seller.passwordResetOtp}, Provided OTP: ${otp}`);
  console.log(
    `Expires At: ${seller.passwordResetExpires}, Current Time: ${Date.now()}`
  );

  if (!seller.passwordResetOtp || !seller.passwordResetExpires) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  if (seller.passwordResetOtp !== otp) {
    return res.status(400).json({ message: "Incorrect OTP" });
  }

  if (seller.passwordResetExpires < Date.now()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  // Update password
  seller.password = password;
  seller.passwordResetOtp = undefined;
  seller.passwordResetExpires = undefined;

  await seller.save();

  res.status(200).json({ message: "Password reset successfully" });
});

const approveProduct = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (!req.admin || req.admin.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admins can approve products" });
  }

  const { id } = req.params; // Product ID
  validateMongodbId(id);
  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  product.approved = true;
  await product.save();

  res.status(200).json({ message: "Product approved successfully", product });
});

// Example of how to call the processSale function after a product sale
const CreateProduct = asyncHandler(async (req, res) => {
  let {
    name,
    description,
    price,
    priceUnit,
    size,
    minquantity,
    maxquantity,
    stock,
    unit, // Add unit to the request body
    HSNCODE,
    PGCST,
    specifications,
    category,
    subcategory,
    visibilityLevel = "1X", // Default visibility level
    videoPriority = [], // Default video priority
    saleType,
    PowerPackVisibility = false,
    hsnCode,
    gstNumber,
    deliveryPreference,

  } = req.body;
  const sellerId = req.seller?._id;
  if (
    !name ||
    !price ||
    !priceUnit || // Ensure price unit is provided
    !size ||
    !minquantity ||
    !maxquantity ||
    !stock ||
    !category ||
    !subcategory ||
    !saleType
  ) {
    return res
      .status(400)
      .json({ message: "All fields are required, including sale type" });
  }

  videoPriority = JSON.parse(videoPriority || "[]")
  console.log(typeof videoPriority, videoPriority, 'videoPriority');

  // Validate visibility level
  const validVisibilityLevels = ["1X", "2X", "3X", "4X"];
  if (!validVisibilityLevels.includes(visibilityLevel)) {
    return res.status(400).json({
      message: `Invalid visibility level. Valid options are: ${validVisibilityLevels.join(
        ", "
      )}`,
    });
  }

  // Validate video priority
  const validVideoPriorities = ["1XVIDEO", "3XVIDEO"];
  if (!Array.isArray(videoPriority) || !videoPriority.every(vp => validVideoPriorities.includes(vp))) {
    return res.status(400).json({
      message: `Invalid video priority. Valid options are: ${validVideoPriorities.join(", ")}`,
    });
  }

  if (!priceUnit) {
    return res.status(400).json({ message: "Price unit is required" });
  }
  const validUnits = [
    "Perkg",
    "PerNumber",
    "PerMeter",
    "PerLiter",
    "PerCum",
    "PerCft",
    "PerMT",
    "PerBox",
    "PerRF",
    "PerRM",
    "PerLtr",
    "PerSqft",
    "perBundle",
    "PerRoll",
  ];

  if (!validUnits.includes(priceUnit)) {
    return res.status(400).json({ message: "Invalid price unit" });
  }

  if (!["Sale By Seller", "Sale By OGCS"].includes(saleType)) {
    return res.status(400).json({ message: "Invalid sale type" });
  }

  try {
    // Handle file upload
    const file = req.files[req.files.length - 1];
    if (!file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Convert file buffer to Base64
    const base64Image = file.buffer.toString("base64");

    // Save the image to the FileModel
    const savedFile = await FileModel.create({
      filename: file.originalname,
      contentType: file.mimetype,
      data: base64Image,
    });

    // Handle additional images
    const images = req?.files || [];
    const imageIds = [];

    for (let i = 0; i < images.length - 1; i++) {
      const img = images[i];
      const base64Image = img.buffer.toString("base64");
      const savedImage = await FileModel.create({
        filename: img.originalname,
        contentType: img.mimetype,
        data: base64Image,
      });
      imageIds.push(savedImage._id); // Store the image reference in the array
    }

    const newProduct = new Product({
      name,
      description,
      price,
      priceUnit, // Make sure this is included
      size,
      minquantity,
      maxquantity,
      stock,
      unit, // Save the unit
      specifications,
      seller: sellerId,
      category,
      subcategory,
      saleType,
      visibilityLevel,
      videoPriority,
      PowerPackVisibility,
      image: savedFile._id, // Reference the saved file ID
      seller: sellerId, // Link the seller to the product
      images: imageIds,
      gstNumber,
      hsnCode,
      deliveryPreference,
      slug: slugify(name),
    });
    await newProduct.save();
    res.status(201).json({
      message: "Product created successfully",
      product: newProduct, // Use 'newProduct', which is the actual created product
      seller: req.seller._id, // Include seller ID in the response
    });

    // Emit notification to all connected clients
    const io = socket.getIO();
    if (io) {
      io.emit("newProduct", {
        message: `New product created: ${name}`,
        productId: newProduct._id,
      });
    } else {
      console.error("Socket.io is not initialized.");
    }
  } catch (error) {
    console.log("Error creating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//  } catch (error) {
//     console.error("Error creating product:", error);
//     res.status(500).json({ message: "Internal Server Error" });
// }

const getAllProducts = asyncHandler(async (req, res) => {
  const sellerId = req.seller._id; // Assuming seller ID is available in req.seller
  console.log("Reached here with sellerId:", sellerId);

  // Fetch all products for the seller
  const products = await Product.find({
    seller: sellerId,
  })
    .populate("image")
    .populate("images")
    .populate({
      path: "category",
      select: "name",
    })
    .populate({
      path: "subcategory",
      select: "name",
    });
    

  // Add delivery charge details to each product
  const enrichedProducts = await Promise.all(
    products.map(async (product) => {
      const deliveryCharge = await DeliveryCharge.findOne({
        product: product._id,
      });

      return {
        ...product.toObject(),
        deliveryCharge: deliveryCharge || null, // Add deliveryCharge if found, otherwise null
      };
    })
  );

  res.status(200).json(enrichedProducts);
});


/*

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        // Step 1: Fetch approved products with required fields
        const products = await Product.aggregate([
            { $match: { approved: true } },
            { $project: { name: 1, visibilityLevel: 1, createdAt: 1, image: 1 } }
        ]);

        if (!products.length) {
            return res.status(200).json({ message: "No approved products found", products: [] });
        }

        // Step 2: Group products by visibility level
        const groupedProducts = products.reduce((acc, product) => {
            const level = (product.visibilityLevel || '1X').toUpperCase();
            if (!acc[level]) acc[level] = [];
            acc[level].push(product);
            return acc;
        }, { '1X': [], '2X': [], '3X': [], '4X': [] });

        // Step 3: Define the display count percentages for each visibility level
        const displayCounts = {
            '1X': Math.ceil(products.length * 0.1),
            '2X': Math.ceil(products.length * 0.2),
            '3X': Math.ceil(products.length * 0.3),
            '4X': Math.ceil(products.length * 0.4)
        };

        // Step 4: Function to repeat products by their visibility count and prevent null entries
        const repeatProducts = (productArray, times) => {
            if (!productArray.length) return []; // Return empty array if no products for that level
            const result = [];
            let i = 0;
            while (result.length < times) {
                result.push(productArray[i % productArray.length]);
                i++;
            }
            return result;
        };

        // Step 5: Construct the final display list based on visibility order and repetition
        const finalDisplayList = [
            ...repeatProducts(groupedProducts['4X'], displayCounts['4X']),
            ...repeatProducts(groupedProducts['3X'], displayCounts['3X']),
            ...repeatProducts(groupedProducts['2X'], displayCounts['2X']),
            ...repeatProducts(groupedProducts['1X'], displayCounts['1X'])
        ];

        res.status(200).json(finalDisplayList);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

*/

//---------------------Update Product--------------------------------------------------------
/*const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const seller = req.seller; // Ensure only the product owner or admin can update

    validateMongodbId(id);

    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    // Ensure only the product owner (seller) or an admin can update the product
    if (!product.seller.equals(seller._id)) {
        return res.status(403).json({ message: "Not authorized to update this product" });
    }

    // Update fields if they are provided in the request
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.size = req.body.size || product.size;
    product.quantity = req.body.quantity || product.quantity;
    product.specifications = req.body.specifications || product.specifications;

    // Update the image if a new one is provided
    if (req.file) {
        product.image = `/uploads/images/${req.file.filename}`;
    }

    // Save updated product
    const updatedProduct = await product.save();
    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
});

*/
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const isAdmin = req.admin && req.admin.role === "admin";
    const isOwner = req.seller && product.seller.equals(req.seller._id);

    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this product" });
    }
    const validUnits = [
      "Perkg",
      "PerNumber",
      "PerMeter",
      "PerLiter",
      "PerCum",
      "PerCft",
      "PerMT",
      "PerBox",
      "PerRF",
      "PerRM",
      "PerLtr",
      "PerSqft",
      "perBundle",
      "PerRoll",
    ];
    const priceUnit =
      typeof req.body.priceUnit === "string" ? req.body.priceUnit.trim() : null;

    if (!priceUnit || !validUnits.includes(priceUnit)) {
      return res.status(400).json({
        message: `Invalid price unit: ${priceUnit}. Must be one of ${validUnits.join(
          ", "
        )}.`,
      });
    }

    product.priceUnit = priceUnit; // Update product if valid



    // Validate and update the unit if provided
    if (req.body.unit) {
      const validUnits = [
        "kg",
        "liter",
        "Number",
        "meter",
        "ton",
        "Mt",
        "cft",
        "cum",
        "box",
        "RF",
        "RM",
        "sqft",
        "sqmtr",
        "bundle",
        "roll",
      ];
      if (!validUnits.includes(req.body.unit)) {
        return res.status(400).json({
          message: `please give valide unit. Valid options are: ${validUnits.join(", ")}`,
        });
      }
      product.unit = req.body.unit;
    }



    // Parse or validate specifications
    if (req.body.specifications) {
      let specifications = req.body.specifications;

      // Check if specifications is a string and parse it
      if (typeof specifications === "string") {
        try {
          specifications = JSON.parse(specifications);
        } catch (error) {
          console.error("Error parsing specifications:", error.message);
          return res
            .status(400)
            .json({ message: "Invalid specifications format" });
        }
      }

      // Validate specifications is an array and has valid keys and values
      if (!Array.isArray(specifications)) {
        return res
          .status(400)
          .json({ message: "Specifications must be an array" });
      }

      const isValid = specifications.every(
        (spec) =>
          typeof spec.key === "string" &&
          typeof spec.value === "string" &&
          spec.key.trim() !== "" &&
          spec.value.trim() !== ""
      );

      if (!isValid) {
        return res.status(400).json({
          message: "Each specification must have a valid 'key' and 'value'",
        });
      }

      product.specifications = specifications;
    }

    // Update other fields
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.size = req.body.size || product.size;
    product.minquantity = req.body.minquantity || product.minquantity;
    product.maxquantity = req.body.maxquantity || product.maxquantity;
    product.stock = req.body.stock || product.stock;
    product.category = req.body.category || product.category;
    product.subcategory = req.body.subcategory || product.subcategory;
    product.saleType = req.body.saleType || product.saleType;
    product.deliveryPreference = req.body.deliveryPreference;
    console.log(product, "product");


    // Handle image update
    if (req.file) {
      const base64Image = req.file.buffer.toString("base64");

      // Save the image to the database
      const savedFile = await FileModel.create({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: base64Image,
      });

      product.image = savedFile._id; // Link the new image ID
    } else if (req.body.image) {
      // Handle Base64 image from request body (if any)
      const savedFile = await FileModel.create({
        filename: "File",
        contentType: "image/jpeg", // Update with correct MIME type if provided
        data: req.body.image,
      });

      product.image = savedFile._id;
    }
    // Unapprove the product if not updated by admin
    if (!isAdmin) {
      product.approved = false;
    }

    const updatedProduct = await product.save();
    res.status(200).json({
      message: isAdmin
        ? "Product updated successfully"
        : "Product updated and pending admin approval",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});


// Fetch products for Box 2
const getProductsForBox2 = asyncHandler(async (req, res) => {
  try {
    // Fetch products named 'hammer' or with PowerPackVisibility set to true
    const products = await Product.find({
      $or: [{ name: "hammer" }, { PowerPackVisibility: true }],
    }).populate("image");

    if (!products.length) {
      return res.status(404).json({ message: "No products found for Box 2" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching Box 2 products:", error);
    res.status(500).json({
      message: "Error fetching Box 2 products",
      error: error.message,
    });
  }
});

//--------------------------------visibility Logic----------------
const calculateVisibility = (level) => {
  // Define visibility percentages for each level
  const visibilityPercentages = {
    "1X": 10,
    "2X": 20,
    "3X": 30,
    "4X": 40,
  };
  // Normalize level to uppercase to handle case mismatches
  const normalizedLevel = level.toUpperCase();
  // Check if level is valid
  if (!visibilityPercentages[level]) {
    throw new Error(
      "Invalid visibility level. Choose from '1X', '2X', '3X', or '4X'."
    );
  }

  // Calculate visibility score based on the level
  return visibilityPercentages[level];
};
const createProductWithVisibility = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    size,
    specifications = [],
    category,
    subcategory,
    visibilityLevel = "1X",
    videoPriority = false,
  } = req.body;
  const sellerId = req.seller?._id;

  if (
    !name ||
    !price ||
    !size ||
    !quantity ||
    !category ||
    !subcategory ||
    !sellerId
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const image = req.file
      ? `/uploads/images/${req.file.filename}`
      : req.body.image;
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      size,
      quantity,
      seller: sellerId,
      category,
      subcategory, // Store subcategory ID
      specifications,
      visibilityLevel: visibilityLevel.toUpperCase(),
      //videoPriority: visibilityLevel === '3X' && videoPriority, // Set video priority only if 3X is selected
      image,
    });

    await newProduct.save();
    res.status(201).json({
      message: "Product created successfully with visibility level",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update Product Visibility
const updateProductVisibility = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { visibilityLevel } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  try {
    // Calculate new visibility score
    const visibilityScore = calculateVisibility(visibilityLevel);
    product.visibilityLevel = visibilityLevel;
    product.visibilityScore = visibilityScore;

    const updatedProduct = await product.save();
    res.status(200).json({
      message: "Product visibility updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating visibility:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/*
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get product ID from request parameters
    validateMongodbId(id); // Validate the ID

    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
});
*/

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params; // Get product ID from request parameters

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const isAdmin = req.admin && req.admin.role === "admin";
  const isOwner = req.seller && product.seller.equals(req.seller._id);

  // Ensure only the product owner (seller) or an admin can delete the product
  if (!isAdmin && !isOwner) {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this product" });
  }

  await Product.findByIdAndDelete(id);
  res.status(200).json({ message: "Product deleted successfully" });
});

// visibility logic
// Fetch full seller details by ID
const getSellerDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ID
  validateMongodbId(id);

  try {
    // Fetch seller details along with products
    const seller = await Seller.findById(id)
      .select("name email mobile address city state country pincode gstNumber Visibilitylevel paymentDate")
      .populate({
        path: "products", // Assuming there's a `products` reference in the Seller model
        select: "productName price stock category subCategory deliveryPreference saleMode",
      });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

const getProductDetails = asyncHandler(async (req, res) => {
  console.log("reach here", req.params.id);
  const product = await Product.findOne({
    _id: req.params.id,
    approved: true, // Only fetch approved products
  })
    .populate("image")
    .populate("seller", "name email mobile companyName address")
    .populate("category", "name")
    .populate("subcategory", "name")
    .populate("images");

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  const isAdmin = req.admin && req.admin.role === "admin";

  res.status(200).json({
    ...product.toObject(),
    seller: product.saleType === "Sale By Seller" ? product.seller : null,
    isAdmin,
  });
});

// Fetch all approved products
const getApprovedProducts = asyncHandler(async (req, res) => {
  try {
    const approvedProducts = await Product.find({ approved: true });
    res.status(200).json(approvedProducts);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching approved products",
      error: error.message,
    });
  }
});

// get all visible products
// Fetch similar products based on category and visibility levels
/*const getSimilarProducts = asyncHandler(async (req, res) => {
    const { name } = req.query;

    try {
        if (!name) {
            return res.status(400).json({ message: "Product name is required" });
        }

        const products = await Product.find({ approved: true, name: new RegExp(name, 'i') });
        console.log('product is',products)
    
        if (!products.length) {
            return res.status(200).json({ message: "No similar products found", products: [] });
        }

        // Separate products into visibility groups
        const visibilityGroups = { '1X': [], '2X': [], '3X': [], '4X': [] };
        products.forEach(product => {
            const level = product.visibilityLevel ? product.visibilityLevel.toUpperCase() : '1X';
            visibilityGroups[level].push(product);

        });
       // console.log('visibility is',visibilityGroups)

        // Define total products and percentage allocations//here need to apply total visitors
        const totalProducts = products.length;
        const displayCounts = {
            '4X': Math.ceil(totalProducts * 0.4),
            '3X': Math.ceil(totalProducts * 0.3),
            '2X': Math.ceil(totalProducts * 0.2),
            '1X': Math.ceil(totalProducts * 0.1)
        };
//console.log('product is',displayCounts)
        // Fetch products without doubling unnecessarily
        const getProductsForLevel = (productArray, count) => {
            const result = [];
            let i = 0;
            while (result.length < count) {
                if (productArray.length === 0) break;
                result.push(productArray[i % productArray.length]);
                i++;
            }
            return result;
        };

        // Build the final list by fetching products per visibility level with reduced repetition
        const finalProductList = [
            ...getProductsForLevel(visibilityGroups['4X'], displayCounts['4X']),
            ...getProductsForLevel(visibilityGroups['3X'], displayCounts['3X']),
            ...getProductsForLevel(visibilityGroups['2X'], displayCounts['2X']),
            ...getProductsForLevel(visibilityGroups['1X'], displayCounts['1X']),
        ];

        // Shuffle to randomize product distribution within the final list
        for (let i = finalProductList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [finalProductList[i], finalProductList[j]] = [finalProductList[j], finalProductList[i]];
        }
console.log('final product', finalProductList)
        res.status(200).json(finalProductList);
    } catch (error) {
        console.error("Error fetching similar products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

*/

const getSimilarProducts = asyncHandler(async (req, res) => {
  const { name } = req.query;

  try {
    if (!name) {
      return res.status(400).json({ message: "Product name is required" });
    }

    // Fetch all approved products with a name similar to the provided name
    const products = await Product.find({
      name: { $regex: new RegExp(name, "i") }, // Case-insensitive match
      approved: true,
    })
      .populate("image")
      .populate("category", "name")
      .populate("subcategory", "name");

    if (!products.length) {
      return res
        .status(200)
        .json({ message: "No similar products found", products: [] });
    }

    // Group products by visibility level
    const groupedProducts = {
      "1X": [],
      "2X": [],
      "3X": [],
      "4X": [],
    };

    products.forEach((product) => {
      const visibilityLevel = product.visibilityLevel || "1X"; // Default to 1X
      groupedProducts[visibilityLevel].push(product);
    });

    // Define visibility percentages
    const visibilityDistribution = {
      "1X": 10, // 10% of users
      "2X": 20, // 20% of users
      "3X": 30, // 30% of users
      "4X": 40, // 40% of users
    };

    // Get total visitors
    const totalVisitors = 100; // Example: 100 users

    // Calculate how many users should see each visibility group
    const usersPerGroup = {
      "1X": Math.ceil((visibilityDistribution["1X"] / 100) * totalVisitors),
      "2X": Math.ceil((visibilityDistribution["2X"] / 100) * totalVisitors),
      "3X": Math.ceil((visibilityDistribution["3X"] / 100) * totalVisitors),
      "4X": Math.ceil((visibilityDistribution["4X"] / 100) * totalVisitors),
    };

    // Distribute products uniquely across visibility levels
    const finalProducts = [];

    for (const [level, count] of Object.entries(usersPerGroup)) {
      const productsForLevel = groupedProducts[level];
      const uniqueProducts = [];

      // Assign products uniquely for the user group
      for (let i = 0; i < count && productsForLevel.length > 0; i++) {
        const product = productsForLevel.shift();
        if (product) {
          uniqueProducts.push(product);
        }
      }

      finalProducts.push(...uniqueProducts);
    }

    // Shuffle the final products to randomize their order
    for (let i = finalProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalProducts[i], finalProducts[j]] = [
        finalProducts[j],
        finalProducts[i],
      ];
    }

    // Transform response to include additional data (like base64 image)
    const response = finalProducts.map((product) => ({
      ...product.toObject(),
      category: product.category?.name || "Unknown Category",
      subcategory: product.subcategory?.name || "Unknown Subcategory",
      image: product.image
        ? {
          filename: product.image.filename,
          contentType: product.image.contentType,
          data: product.image.data, // Assuming Base64-encoded data
        }
        : null,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching similar products:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Get Products by Subcategory ID

const getProductsBySubcategoryId = asyncHandler(async (req, res) => {
  const { subcategoryId } = req.params;

  validateMongodbId(subcategoryId); // Validate MongoDB ID format

  try {
    // Fetch all products for the subcategory
    const products = await Product.find({
      subcategory: subcategoryId,
      approved: true,
    })
      .populate("image") // Populate the image details
      .populate("category", "name") // Optionally populate the category name
      .populate("subcategory", "name"); // Populate subcategory name

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this subcategory" });
    }

    // Group products by visibility level
    const groupedProducts = {
      "1X": [],
      "2X": [],
      "3X": [],
      "4X": [],
    };

    products.forEach((product) => {
      const visibilityLevel = product.visibilityLevel || "1X"; // Default to 1X
      groupedProducts[visibilityLevel].push(product);
    });
    // Define visibility percentages
    const visibilityDistribution = {
      "1X": 10, // 10% of users
      "2X": 20, // 20% of users
      "3X": 30, // 30% of users
      "4X": 40, // 40% of users
    };

    // Get total visitors
    const totalVisitors = 100; // Example: 100 users

    // Calculate how many users should see each visibility group
    const usersPerGroup = {
      "1X": Math.ceil((visibilityDistribution["1X"] / 100) * totalVisitors),
      "2X": Math.ceil((visibilityDistribution["2X"] / 100) * totalVisitors),
      "3X": Math.ceil((visibilityDistribution["3X"] / 100) * totalVisitors),
      "4X": Math.ceil((visibilityDistribution["4X"] / 100) * totalVisitors),
    };

    // Distribute products uniquely across visibility levels
    const finalProducts = [];

    for (const [level, count] of Object.entries(usersPerGroup)) {
      const productsForLevel = groupedProducts[level];
      const uniqueProducts = [];

      // Assign products uniquely for the user group
      for (let i = 0; i < count && productsForLevel.length > 0; i++) {
        const product = productsForLevel.shift();
        if (product) {
          uniqueProducts.push(product);
        }
      }

      finalProducts.push(...uniqueProducts);
    }

    // Shuffle the final products to randomize their order
    for (let i = finalProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalProducts[i], finalProducts[j]] = [
        finalProducts[j],
        finalProducts[i],
      ];
    }

    // Return the prioritized and shuffled products
    res.status(200).json(finalProducts);
  } catch (error) {
    console.error("Error fetching products by subcategory:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Fetch seller details by ID
const getSellerDetailsById = asyncHandler(async (req, res) => {
  const { id } = req.params; // Extract seller ID from request parameters
  validateMongodbId(id); // Validate the MongoDB ID format

  try {
    const seller = await Seller.findById(id).select(
      "name email mobile companyName address gstNumber pan"
    );
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json(seller); // Return the seller details
  } catch (error) {
    console.error("Error fetching seller details:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

const getInterestedUsers = asyncHandler(async (req, res) => {
  try {
    // Extract seller ID from authenticated request
    const sellerId = req.seller?._id;

    if (!sellerId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const interestedUsers = await InterestedUser.find({ sellerId })
      .populate({
        path: "userId",
        select: "name email mobile", // Fields to include from User model
      })
      .populate({
        path: "productId",
        populate: [
          {
            path: "image", // Populate 'image' if it's a reference
          },
          {
            path: "category", // Populate 'category'
            select: "name", // Include only the 'name' field from the Category model
          },
          {
            path: "subcategory", // Populate 'subcategory'
            select: "name", // Include only the 'name' field from the Subcategory model
          },
        ],
      });

    if (!interestedUsers || interestedUsers.length === 0) {
      return res.status(404).json({ message: "No interested users found" });
    }

    // Format the response if needed
    // const formattedUsers = interestedUsers.map((entry) => ({
    //   id: entry._id,
    //   user: {
    //     id: entry.userId?._id,
    //     name: entry.userId?.name,
    //     email: entry.userId?.email,
    //     mobile: entry.userId?.mobile,
    //   },
    //   product: {
    //     id: entry.productId?._id,
    //     name: entry.productId?.name,
    //     price: entry.productId?.price,
    //   },
    //   interestDate: entry.interestDate,
    //   status: entry.status,
    // }));

    res.status(200).json(interestedUsers);
  } catch (error) {
    console.error("Error fetching interested users:", error);
    res.status(500).json({
      message: "Failed to retrieve interested users",
      error: error.message,
    });
  }
});

const removeInterestedUser = asyncHandler(async (req, res) => {
  const { userId, productId } = req.body; // Extract userId and productId from the request body

  try {
    // Find and delete the entry in the InterestedUser model
    const deletedEntry = await InterestedUser.findOneAndDelete({
      userId,
      productId,
    });

    if (!deletedEntry) {
      return res
        .status(404)
        .json({ message: "Interested user entry not found" });
    }

    res.status(200).json({ message: "Interested user removed successfully" });
  } catch (error) {
    console.error("Error removing interested user:", error);
    res.status(500).json({
      message: "Error removing interested user",
      error: error.message,
    });
  }
});
/*
// ------get product without payment-------------
const getProductWithIncompletePayments = asyncHandler(async (req, res) => {
  try {
    const sellerId = req.seller?._id;
    if (!sellerId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    console.log("Reached here with sellerId:", sellerId);

    // Query for products with incomplete payments
    const query = {
      seller: sellerId,
      $or: [
        { saleType: "Sale By OGCS", depositPayment: { $eq: false } }, // Ensure explicitly false
        { saleType: "Sale By Seller", visibilityPayment: { $eq: false } }, // Ensure explicitly false
      ],
    };

    console.log("MongoDB Query:", JSON.stringify(query, null, 2));

    const products = await Product.find(query)
      .select("name description price saleType depositPayment visibilityPayment")
      .populate("image")
      .populate("category", "name")
      .populate("subcategory", "name");

    if (!products.length) {
      return res.status(404).json({ message: "No products with incomplete payments found." });
    }

    console.log("Fetched Products:", JSON.stringify(products, null, 2));

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products with incomplete payments:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});
*/
const getProductWithIncompletePayments = asyncHandler(async (req, res) => {
  const sellerId = req.seller?._id;

  if (!sellerId) {
    console.error("Unauthorized access: Missing seller ID");
    return res.status(403).json({ message: "Unauthorized access" });
  }

  console.log("Fetching products with incomplete payments for seller:", sellerId);

  try {
    // Step 1: Find all product IDs in the SellerProductVisibilityModel for this seller
    const visibilityRecords = await SellerProductVisibilityModel.find({ sellerId }).select("products.productId");

    const excludedVisibilityProductIds = visibilityRecords.flatMap((record) =>
      record.products.map((product) => product.productId.toString())
    );

    console.log("Excluded Product IDs from Visibility Model:", excludedVisibilityProductIds);

    // Step 2: Find all product IDs in the OtherPayment model for this seller
    const otherPaymentRecords = await OtherPayment.find({ sellerId }).select("productIds");

    const excludedPaymentProductIds = otherPaymentRecords.flatMap((record) =>
      record.productIds.map((productId) => productId.toString())
    );

    console.log("Excluded Product IDs from Other Payment Model:", excludedPaymentProductIds);

    // Combine excluded product IDs from both models
    const excludedProductIds = [
      ...new Set([...excludedVisibilityProductIds, ...excludedPaymentProductIds]),
    ];

    console.log("Final Excluded Product IDs:", excludedProductIds);

    // Step 3: Build the query for incomplete payments and exclude the found product IDs
    const query = {
      seller: sellerId,
      _id: { $nin: excludedProductIds }, // Exclude products from both models
      $or: [
        { saleType: "Sale By OGCS", depositPayment: { $exists: false } }, // Deposit payment not made
        { saleType: "Sale By OGCS", depositPayment: false },
        { saleType: "Sale By Seller", visibilityPayment: { $exists: false } }, // Visibility payment not made
        { saleType: "Sale By Seller", visibilityPayment: false },
      ],
    };

    console.log("MongoDB Query:", JSON.stringify(query, null, 2));

    // Step 4: Execute the query
    const products = await Product.find(query)
      .populate("image")
      .populate({
        path: "category",
        select: "name",
      })
      .populate({
        path: "subcategory",
        select: "name",
      });

    if (!products.length) {
      console.warn("No products with incomplete payments found for seller:", sellerId);
      return res
        .status(404)
        .json({ message: "No products with incomplete payments found." });
    }

    console.log(`Found ${products.length} products with incomplete payments.`);

    // Step 5: Enrich products with additional details like delivery charge
    const enrichedProducts = await Promise.all(
      products.map(async (product) => {
        const deliveryCharge = await DeliveryCharge.findOne({
          product: product._id,
        });

        console.log(
          `Product ID: ${product._id}, Name: ${product.name}, Delivery Charge: ${
            deliveryCharge ? "Exists" : "Not Found"
          }`
        );

        return {
          ...product.toObject(),
          deliveryCharge: deliveryCharge || null, // Add deliveryCharge if found, otherwise null
        };
      })
    );

    console.log(`Returning ${enrichedProducts.length} enriched products with incomplete payments.`);

    res.status(200).json(enrichedProducts);
  } catch (error) {
    console.error("Error fetching products with incomplete payments:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});



module.exports = {
  createSeller,
  resetPassword,
  forgotPasswordToken,
  updatePassword,
  getProductWithIncompletePayments,
  blockSeller,
  unblockSeller,
  updateSeller,
  deleteSeller,
  getAllSellers,
  getaSeler,
  logout,
  loginSellerCtrl,
  handleRefreshToken,
  CreateProduct,
  verifyOtp,
  updateProduct,
  getAllProducts,
  deleteProduct,
  getSellerDetails,
  getProductDetails,
  approveProduct,
  getApprovedProducts,
  createProductWithVisibility,
  updateProductVisibility,
  getSimilarProducts,
  getProductsForBox2,
  getProductsBySubcategoryId,
  getSellerDetailsById,
  getInterestedUsers,
  removeInterestedUser,
};
