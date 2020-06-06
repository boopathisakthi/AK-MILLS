const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var PaymentDetailSchema = new mongoose.Schema({
    trans_id: {
        type: ObjectId
    },
    trans_no: {
        type: String
    },
    payedamount:{
        type:Number
    },
    balance:{
        type:Number
    },
    trans_date:{
        type:String
    }

});

var PaymodeDetailSchema = new mongoose.Schema({
    paidfrom: {
        type: ObjectId
    },
    referencemode: {
        type: String
    },
    reference: {
        type: String
    },
    amount: {
        type: Number
    },
   
  

});

var Schema = new mongoose.Schema({

    billno: {
        type: String
    },
    billdate: {
        type: Date
    },
   
    type: {
        type: String
    },
    typeid: {
        type: ObjectId
    },
    paidamount: {
        type: Number
    },
    PaymentDetail:{
       type: [PaymentDetailSchema]
    },
    PaymodeDetail:{
        type: [PaymodeDetailSchema]
    },
    companyid: {
        type: ObjectId
    },
    branchid: {
        type: ObjectId
    },
    entrythrough:{
        type:String
    },
    createdby: {
        type: ObjectId
    },
    createddate: {
        type: Date, default: Date.now
    },
    updatedby: {
        type: ObjectId ,
    },
    updateddate: {
        type: Date, default: Date.now
    },
    isdeleted: {
        type: Number, default: 0
    },
    note:{
        type: String
    }
})
var Payment = new mongoose.model('Payment', Schema);
module.exports = Payment;