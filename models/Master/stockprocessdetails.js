const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var Schema = new mongoose.Schema({
    productid: {
        type: ObjectId
    },
    openingstock: {
        type: Number
    },
    purchaseqty: {
        type: Number
    },
    salesqty: {
        type: Number
    },
    stock_transfer: {
        type: Number
    },
    stock_received: {
        type: Number
    },
    branchid: {
        type: ObjectId
    },
    companyid: {
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

var StockProcessDetails=new mongoose.model('StockProcessDetails', Schema);
module.exports=StockProcessDetails;