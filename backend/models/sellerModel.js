const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types; // Ensure this is included
const bcrypt = require('bcrypt');
const crypto = require("crypto")

const sellerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, },
    gstNumber: { type: String, unique: true,required:true }, // Add sparse: true
    companyName: {
        type: String,
        required:true
    },
    pan: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Sale By Seller', 'Sale By OGCS'], required:true},
    isVerified: {type: Boolean, default: false},
    isPaymentDone: { type: Boolean, default: false },
    verificationOtp: {type: String},
    verificationExpires: Date,
    isBlocked: {type: Boolean, default: false},
    address: { 
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    passwordResetOtp: { type: String },
    passwordResetExpires: { type: Date },


 // Existing fields...
    interestedUsers: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            date: { type: Date, default: Date.now },
        },
    ],


    refreshToken: [{type: String, default:null}],
    passwordChangedAt: Date,
    passwordResetToken : String,
    passwordResetExpires : Date,
}, { timestamps: true });








// Hash the password before saving
sellerSchema.pre("save", async function (next) {
    if(!this.isModified('password'))       // password reset/update
  {
      next();
  }
      if (!this.isModified('password')) {
          return next();
      }
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
  });
  sellerSchema.methods.createPasswordResetToken = async function () {
      const resetToken = crypto.randomBytes(32).toString('hex');
      this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex'); 
      this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      return resetToken; 
  }
// Method to compare password
sellerSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// In sellerModel.js
sellerSchema.virtual('products', {
    ref: 'Product', // Model to reference
    localField: '_id', // Seller's ID in Seller model
    foreignField: 'seller', // Field in Product that links to Seller
    justOne: false
});

// Ensure virtual fields are included when the document is converted to JSON or objects
sellerSchema.set('toJSON', { virtuals: true });
sellerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Seller', sellerSchema);

