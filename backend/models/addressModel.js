const mongoose = require("mongoose");

// Define the schema for the user's address
const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming there's a User model, to associate addresses with a user
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    houseNumberOrApartment: {
      type: String,
      required: true,
    },
    areaOrStreet: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
      required: false, // Landmark is optional
    },
    cityOrTown: {
      type: String,
      required: true,
    },
    selectedState: {
      type: String,
      required: true,
    },
    // New fields for latitude, longitude, and selected place
    latitude: {
      type: Number,
      required: false, // Latitude is optional
    },
    longitude: {
      type: Number,
      required: false, // Longitude is optional
    },
    selectedPlace: {
      type: String,
      required: false, // Selected place is optional
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Create a model from the schema
const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
