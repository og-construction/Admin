const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    image: { type: String, required: true },
}, { timestamps: true });

const Subcategory = mongoose.models.Subcategory || mongoose.model('Subcategory', SubcategorySchema);

module.exports = Subcategory;
