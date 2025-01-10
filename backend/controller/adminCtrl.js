// adminController.js
const asyncHandler = require("express-async-handler");
const Seller = require('../models/sellerModel');
const User = require('../models/userModel');
const Admin = require('../models/adminModel')
const sendEmail = require("./emailCtrl");
const {generateToken} = require('../config/jwtToken')
const {generateRefreshToken } = require("../config/refreshtoken");
const validateMongodbId = require('../utils/validateMongodbId')
const Product = require("../models/productModel"); // Correct path to Product model
const SellerPayment = require("../models/sellerPaymentModel");
const SellerProductVisibility = require("../models/SellerProductvisibilityModel");

const countLoggedInUsers = asyncHandler(async (req, res) => {
    const count = await User.countDocuments({ lastLogin: { $exists: true } }); // Adjust query based on your needs
    res.status(200).json({ count });
});

const createAdmin = asyncHandler(async (req, res) => {
    const { name, email, password, mobile, role } = req.body;

    // Validate required fields
    if (!name || !email || !mobile || !password || !role) {
        res.status(400);
        throw new Error('Please fill in all fields');
    }

    // Check if the admin already exists
    const findAdmin = await Admin.findOne({ email });
    if (findAdmin) {
        res.status(400);
        throw new Error('Admin already exists');
    }

    // Create the new admin
    const newAdmin = new Admin({ name, email, mobile, password, role });

    try {
        // Save the admin without OTP and email logic
        await newAdmin.save();

        res.status(201).json({
            message: "Admin created successfully.",
            admin: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                mobile: newAdmin.mobile,
                role: newAdmin.role,
            },
        });
    } catch (error) {
        console.error("Error details:", error); // Log the exact error message
        throw new Error('Could not save admin');
    }
});

// otp verification function
const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "admin not found" });
    if (admin.verificationOtp !== otp || admin.verificationExpires < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    admin.isVerified = true;
    admin.verificationOtp = undefined;
    admin.verificationExpires = undefined;
    await admin.save();

    res.status(200).json({ message: "Email verified successfully" });
});

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const findAdmin = await Admin.findOne({email});
    if (!findAdmin){
        return res.status(400).json({message: "Invalid credentials"});

    }
    const isMatch = await findAdmin.isPasswordMatched(password);
    if (!isMatch){
        return res.status(400).json({message: "Invalid credentials "});

    };


 // Genrate refresh token and update admin record 
 const refreshToken = generateRefreshToken(findAdmin._id);
 await Admin.findByIdAndUpdate(findAdmin._id, { refreshToken });

 res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 72 * 60 * 60 * 1000 });//72 hours 


 res.status(200).json({
     message: "Login successful",
     admin: {
         id: findAdmin._id,
         name: findAdmin.name,
         email: findAdmin.email,
         mobile: findAdmin.mobile,
         role: findAdmin.role,
     },
         token: generateToken(findAdmin._id),
         refreshToken: refreshToken
     
 });
});


// handle refreshtoken 
const handleRefreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    // Find seller by refresh token
    const admin = await Admin.findOne({ refreshToken });
    if (!admin) {
        return res.status(403).json({ message: "Refresh token not valid" });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Refresh token is invalid" });
        }

        // Generate a new access token
        const newAccessToken = generateToken(admin._id);
        res.status(200).json({ accessToken: newAccessToken });
    });
});


//--------------------------------
// Get All Sellers
const getAllAdmin = asyncHandler(async (req, res) => {
    const admins = await Admin.find(); 
    res.status(200).json(admins);
});
// Get Admin by ID
const logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken; // Ensure this is correct
    if (!refreshToken) {
        res.clearCookie('refreshToken');
        return res.sendStatus(204); // No content
    }

    await Seller.findOneAndUpdate({ refreshToken }, { refreshToken: null }); // Clear the refresh token
    res.clearCookie('refreshToken', { httpOnly: true, secure: true });
    return res.sendStatus(204);
});

// Update Seller
const updateAdmin = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const { name, email, mobile } = req.body;
    const admin = await Admin.findById(id); // Change User to Seller
    if (!admin) {
        return res.status(404).json({ message: "Seller not found" });
    }

    // Only allow updating certain fields
    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.mobile = mobile || admin.mobile;

    const updatedAdmin = await admin.save();
    res.status(200).json({
        message: "Seller updated successfully",
        admin: updatedAdmin,
    });
});

// Delete Seller
const deleteAdmin = asyncHandler(async (req, res) => {
    const adminId = req.params.id; // Get admin ID from request parameters
    validateMongodbId(adminId);
    const admin = await Admin.findById(adminId);

    if (!admin) {
        return res.status(404).json({ message: "admin not found" });
    }

    await Admin.findByIdAndDelete(adminId); 
    res.status(200).json({ message: "admin deleted successfully" });
});


// Block Seller
const blockAdmin = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const blockedAdmin = await Admin.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
        if (!blockedAdmin) {
            return res.status(404).json({ message: "Seller not found" });
        }
        res.json({ message: "admin Blocked" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const getaAdmin = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract admin ID from request parameters
    validateMongodbId(id); // Validate the ID

    const admin = await Admin.findById(id); 
    if (!admin) {
        return res.status(404).json({ message: "admin not found" });
    }

    res.status(200).json(admin); 
});

// Unblock Seller
const unblockAdmin = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const unblockedAdmin = await Admin.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
        if (!unblockedAdmin) {
            return res.status(404).json({ message: "admin not found" });
        }
        res.json({ message: "admin UnBlocked" });
    } catch (error) {
        throw new Error(error);
    }
});

// ----------------password reset/update--------------------------
const updatePassword = asyncHandler(async (req, res) => {
    if (!req.admin) {
        return res.status(400).json({ message: "admin not authenticated" });
    }
    const { password } = req.body; // Get the new password from the request body
    const adminId = req.admin._id; // Extract admin ID from request
    validateMongodbId(adminId); // Validate the MongoDB ID

    const admin = await Admin.findById(adminId);
    if (!admin) {
        return res.status(404).json({ message: "admin not found" });
    }

    if (password) {
        admin.password = password; // Set the new password
        const updatedPassword = await admin.save(); // Save the updated 
        res.json({ message: "Password updated successfully", admin: updatedPassword });
    } else {
        res.status(400).json({ message: "Password is required" });
    }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const admin = await Admin.findOne({ email }); 
    if (!admin) throw new Error("admin not found with this email");
    
    try {
        const token = await admin.createPasswordResetToken();
        await admin.save();
        const resetURL = `Hi, please use this link to reset your password. This link is valid for 10 minutes: <a href='http://localhost:5000/api/admin/reset-password/${token}'>click Here</a>`;
        
        const data = { 
            to: email,
            text: "Hey Admin",
            subject: "Forgot Password Link",
            html: resetURL,
        };
        sendEmail(data);
        res.json(token);
    } catch (error) {
        throw new Error(error);
    }
});

const resetPassword = asyncHandler(async(req, res) => {
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const admin = await Admin.findOne({
        passwordResetToken : hashedToken,
        passwordResetExpires :  {$gte: Date.now()},

    })
    if(!admin) throw new Error("Token Expired, Please try again later");
    admin.password = password;
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined
    await admin.save();
    res.json(admin);
})


const getSellerMetrics = asyncHandler(async (req, res) => {
    try {
        const totalSellers = await Seller.countDocuments();
        const totalProductsBySellers = await Product.countDocuments({ role: 'Sale By Seller' });
        const totalProductsByOGCS = await Product.countDocuments({ role: 'Sale By OGCS' });

        res.status(200).json({
            totalSellers,
            totalProductsBySellers,
            totalProductsByOGCS,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching seller metrics", error: error.message });
    }
});


// Controller for fetching earnings data
const getEarningsData = async (req, res) => {
    try {
      // Fetch visibility, power pack, and deposit amounts from SellerProductVisibility
      const visibilityData = await SellerProductVisibility.aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: null,
            visibilityAmount: { $sum: "$products.visibilityAmount" },
            powerPackAmount: { $sum: "$products.powerPackAmount" },
            depositAmount: { $sum: "$products.totalProductAmount" },
          },
        },
      ]);
  
      const visibilityAmount = visibilityData[0]?.visibilityAmount || 0;
      const powerPackAmount = visibilityData[0]?.powerPackAmount || 0;
      const depositAmount = visibilityData[0]?.depositAmount || 0;
  
      // Fetch registration amount and total earnings from SellerPayment
      const paymentData = await SellerPayment.aggregate([
        {
          $group: {
            _id: null,
            registrationAmount: { $sum: "$amount" },
          },
        },
      ]);
  
      const registrationAmount = paymentData[0]?.registrationAmount || 0;
  
      // Total earnings calculation
      const totalEarnings =
        visibilityAmount + powerPackAmount + depositAmount + registrationAmount;
  
      res.status(200).json({
        visibilityAmount,
        powerPackAmount,
        depositAmount,
        registrationAmount,
        totalEarnings,
      });
    } catch (error) {
      console.error("Error fetching earnings data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  };

module.exports = { 
    
    countLoggedInUsers, 
    createAdmin,
    unblockAdmin,loginAdmin,updateAdmin,
    blockAdmin,
    deleteAdmin,
    getAllAdmin,getaAdmin,
    forgotPasswordToken,resetPassword,
    updateAdmin,updatePassword,
    verifyOtp,handleRefreshToken,generateRefreshToken,
    getSellerMetrics,
    getEarningsData 
};
