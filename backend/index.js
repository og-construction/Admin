const http = require("http");
const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose"); // MongoDB library
const dbConnect = require("./config/dbConnect"); // Import the dbConnect function
const userRoute = require("./routes/userRoute");
const adminRoutes = require("./routes/adminRoute");
const productRoute = require("./routes/productRoute");
const CategoryRoute = require("./routes/CategoryRoute");
const SubCategoryRoute = require("./routes/SubCategoryRoute.js");
const role = require("./routes/roleRoute");
const sellerRoutes = require("./routes/sellerRoute");
const OrderRoute = require("./routes/OrderRoute");
const cart = require("./routes/CartRoute");
const payment = require("./routes/paymentRoute");
const wishlist = require("./routes/wishlistRoute");
const orderTracking = require("./routes/OrderTrackingRoute.js");
const deliveryCharge = require("./routes/deliveryCharge.js");
const upload = require("./middlewares/multer.js");
const FileModel = require("./models/fileModel.js");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const socket = require("./socket.js");
const addressRoute = require("./routes/addressRoute.js"); //sk
const otherpayment = require("./routes/otherpayment.js");
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

// Initialize GridFS for file storage
const conn = mongoose.connection;
let gfs;

conn.once("open", () => {
  console.log("MongoDB connection open");
  gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "uploads" }); // Ensure consistency
  console.log("GridFS Bucket initialized");
});

// Define the upload route

// Define the upload route
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Convert file buffer to Base64 string
    const base64Image = req.file.buffer.toString("base64");
    const fileData = {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      data: base64Image,
    };

    // Save to database
    const uploadedFile = await FileModel.create(fileData);

    res.status(201).json({
      message: "File uploaded successfully",
      fileId: uploadedFile._id,
      fileData: uploadedFile,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res
      .status(500)
      .json({ message: "File upload failed", error: error.message });
  }
});

app.get("/image/:id", async (req, res) => {
  try {
    const file = await FileModel.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Respond with the Base64 image data
    res.status(200).json({
      filename: file.filename,
      contentType: file.contentType,
      data: `data:${file.contentType};base64,${file.data}`,
    });
  } catch (error) {
    console.error("Error fetching file:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch file", error: error.message });
  }
});

// Middleware configuration
app.use("/api", sellerRoutes);
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://buildpro.ogcs.co.in",
      "https://buildproseller.ogcs.co.in",
      "https://buildproadmin.ogcs.co.in",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",

    ],
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.json("backend started");
});
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/category", CategoryRoute);
app.use("/api/subcategory", SubCategoryRoute);
app.use("/api/role", role);
// app.use("/api/seller", seller);
app.use("/api/admin", adminRoutes);
app.use("/api/order", OrderRoute);
app.use("/api/cart", cart);
app.use("/api/payment", payment);
app.use("/api/address", addressRoute);
app.use("/api/wishlist", wishlist);
app.use("/api/deliverycharge", deliveryCharge);
app.use("/api/order-tracking", orderTracking);
app.use('/api/otherpayment',otherpayment)
// app.use('/api/seller', seller);
app.use("/api/seller", sellerRoutes); //sk

// Static file serving
app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: err.message });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Initialize Socket.IO
socket.init(server);

// Server initialization
server.listen(PORT, async () => {
  await dbConnect();
  console.log(`Server is running at PORT ${PORT}`);
});
