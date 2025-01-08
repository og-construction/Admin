const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types; // Ensure this is included
const bcrypt = require('bcrypt');
const crypto = require("crypto");
//const { type } = require('os');

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum:['AccountAdmin','SalesAdmin','technicalAdmin','AnalysisAdmin','admin'], default:'admin' },
    isVerified: {type: Boolean, default: false},
    verificationOtp: {type: String},
    verificationExpires: Date,
    isBlocked: {type: Boolean, default: false},
  //  cart: { type: Array, default: [] },
   // address: [{ type: ObjectId, ref: "Address" }],
   // wishlist: [{ type: ObjectId, ref: "Product" }],
   // refreshToken: [{type: String, default:null}],
    passwordChangedAt: Date,
    passwordResetToken : String,
    passwordResetExpires : Date,
}, { timestamps: true });

// Hash the password before saving
adminSchema.pre("save", async function (next) {
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
adminSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex'); 
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken; 
}

// Method to compare password
adminSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
