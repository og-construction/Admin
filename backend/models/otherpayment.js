const mongoose = require('mongoose');

const otherPaymentSchema = new mongoose.Schema({
    method:{type:String,enum:['IMPS','NEFT','RTGS','DD','CHECK'], required:true},
    amount:{type:Number,required:true},
    date:{type:Date,required:true},
    bankName:{type:String,required:true},
    transactionId:{type:String,required:true},
    ifscCode:{type:String,required:true},
    accountNumber:{type:String,required:true},
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }], // Array for multiple products
    sellerId:{type:mongoose.Schema.Types.ObjectId,ref:'Seller'},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    orderId:{type:mongoose.Schema.Types.ObjectId,ref:'Order'},
});
module.exports = mongoose.model("OtherPayment", otherPaymentSchema);
