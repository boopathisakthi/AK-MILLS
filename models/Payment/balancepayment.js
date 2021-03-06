const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
// var PaymentDeatilschema=new mongoose.schema({
//     paidamount:{
//         type:Number
//     },
//     purchase_id: {
//         type: ObjectId
//     },
//     payment: {
//         type: Number
//     },
  
//     balance: {
//         type: Number
//     },
//     payedamount:{
//         type: Number
//     },
// })

var Schema = new mongoose.Schema({

    billpaymentno: {
        type: String
    },
    billpaymentdate: {
        type: Date
    },
    duedate: {
        type: Date
    },
    paidfrom:{
        type: ObjectId
    },
    supplierid: {
        type: ObjectId
    },
    referencemode:{
        type: String
    },
    reference:{
        type: String
    },
    paidamount:{
        type:Number
    },
    purchase_id: {
        type: ObjectId
    },
    purchaseno: {
        type: String
    },
    purchasedate: {
        type: Date,
    },
    payment: {
        type: Number
    },
    balance: {
        type: Number
    },
    payedamount:{
        type: Number
    },
    companyid: {
        type: ObjectId
    },
    branchid: {
        type: ObjectId
    },
    createdby: {
        type: ObjectId
    },
    createddate: {
        type: Date, default: Date.now
    },
    updatedby: {
        type: ObjectId
    },
    updateddate: {
        type: Date, default: ''
    },
    isdeleted: {
        type: Number, default: 0
    },
   

})
var BalancePayment = new mongoose.model('BalancePayment', Schema);
module.exports = BalancePayment;