const Address = require("../models/addressModel");

let addadress = async (req, res) => {
  try {
    const {
      userId,
      mobileNumber,
      postalCode,
      houseNumberOrApartment,
      areaOrStreet,
      landmark,
      cityOrTown,
      selectedState,
      latitude,  // Add latitude
      longitude, // Add longitude
      selectedPlace
    } = req.body;

    // Validate required fields
    let missingFields = [];

    if (!userId) missingFields.push("userId");
    if (!mobileNumber) missingFields.push("mobileNumber");
    if (!postalCode) missingFields.push("postalCode");
    if (!houseNumberOrApartment) missingFields.push("houseNumberOrApartment");
    if (!areaOrStreet) missingFields.push("areaOrStreet");
    if (!cityOrTown) missingFields.push("cityOrTown");
    if (!selectedState) missingFields.push("selectedState");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `The following required fields are missing: ${missingFields.join(", ")}`,
      });
    }

    // Create a new address instance
    const newAddress = new Address({
      userId,
      mobileNumber,
      postalCode,
      houseNumberOrApartment,
      areaOrStreet,
      landmark,
      cityOrTown,
      selectedState,
      latitude,    // Include latitude
      longitude,   // Include longitude
      selectedPlace
    });

    // Save the address to the database
    const savedAddress = await newAddress.save();

    // Send success response
    res.status(201).json({
      message: "Address saved successfully",
      address: savedAddress,
    });
  } catch (error) {
    console.error("Error saving address:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};


// GET address by userId
let getAddressByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find address by userId
    const address = await Address.find({ userId });

    if (!address) {
      return res.status(404).json({ message: "Address not found for this user" });
    }

    // Send success response with the found address
    res.status(200).json({ address });
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

module.exports = { addadress, getAddressByUserId };
