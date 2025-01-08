const User = require('../models/userModel');
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Seller = require('../models/sellerModel')
const Admin = require('../models/adminModel')

/*
const authUserMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        console.log("Received token:", token);
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id); // Attach user to request
                if (!req.user) {
                    throw new Error("User not found");
                }
                console.log("User authenticated:", req.user);
                next();
            }
        } catch (error) {
            console.error("Token verification failed:", error);
            res.status(401).json({ message: "Not Authorized, token expired. Please log in again." });
        }
    } else {
        res.status(401).json({ message: "No token attached to header" });
    }
});


const authSellerMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

   /* if (!token) {
        return res.status(401).json({ message: "No token provided" });
    } 
        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
          }
          const actualToken = token.split(" ")[1];
          

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.seller = await Seller.findById(decoded.id).select("-password -__v");

        if (!req.seller) {
            return res.status(401).json({ message: "Seller not found" });
        }

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({ message: "Session expired. Please log in again." });
            }

            try {
                const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_SECRET);
                const newAccessToken = generateToken(decodedRefresh.id);

                // Send the new token back to the client in a response
                res.status(200).json({
                    message: "Token refreshed",
                    accessToken: newAccessToken
                });
                return;
            } catch (refreshError) {
                console.error("Refresh Token Error:", refreshError);
                return res.status(401).json({ message: "Refresh token expired. Please log in again." });
            }
        } else {
            console.error("Authorization Error:", error);
            return res.status(401).json({ message: "Not authorized" });
        }
    }
});

*/
// Updated authSellerMiddleware--------------------05-11-2024--------------------------------
const authSellerMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.seller = await Seller.findById(decoded.id).select("-password -__v");

        if (!req.seller) {
            return res.status(401).json({ message: "Seller not found" });
        }

        next();
    } catch (error) {
        console.error("Authorization Error:", error);
        return res.status(401).json({ message: "Not authorized" });
    }
});

const authUserMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            throw new Error("User not found");
        }

        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ message: "Not Authorized, token expired or invalid." });
    }
});



/*
const isAdmin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next(); // User is admin, proceed
    } else {
        console.log("No token attached to header");
        res.status(403).json({ message: "Not authorized as an admin" });
    }

});
*/
//---------------validate visbility -------------------

// Updated authSellerMiddleware--------------------05-11-2024--------------------------------


const authAdminMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = await Admin.findById(decoded.id);

        if (!req.admin) {
            throw new Error("User not found");
        }

        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ message: "Not Authorized, token expired or invalid." });
    }
});




module.exports = { authSellerMiddleware, authUserMiddleware, /*isAdmin*/ authAdminMiddleware /*validateVisibility*/ };
