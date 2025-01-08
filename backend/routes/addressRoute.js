const express = require("express");
const { addadress, getAddressByUserId } = require("../controller/addresscontroller");
const addressRoute = express.Router();

// POST API to save address
addressRoute.post("/add", addadress);

// GET API to fetch address by userId
addressRoute.get("/get/:userId", getAddressByUserId);

module.exports = addressRoute;
