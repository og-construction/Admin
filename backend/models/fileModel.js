const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    data: { type: String, required: true }, // Store Base64 string
});

const FileModel = mongoose.model("File", fileSchema);
module.exports = FileModel; // Ensure the correct export
