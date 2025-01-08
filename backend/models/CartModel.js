const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      image: { type: mongoose.Schema.Types.ObjectId, ref: "File", }, // Reference to FileModel

    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);

