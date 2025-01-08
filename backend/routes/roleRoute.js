const express = require('express');
const router = express.Router();

// Sample controller function (replace this with your actual logic)
const createRole = (req, res) => {
    res.status(201).json({ message: "Role created" });
};

// Define your role routes here
router.post("/", createRole); // This sets up a POST /api/role route

module.exports = router;
