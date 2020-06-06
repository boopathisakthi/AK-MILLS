const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var StocktransferDetailSchema = new mongoose.Schema({
    productid: {
        type: ObjectId
    },
    productname: {
        type: String
    },
    qty: {
        type: Number
    },
    hsncode: {
        type: String
    }

});
var Schema = new mongoose.Schema({
    entrydate: {
        type: Date
    },
    frombranchid: {
        type: ObjectId
    },
    tobranchid: {
        type: ObjectId
    },
    StocktransferDetail: {
        type: [StocktransferDetailSchema]
    },
    isdeleted: {
        type: Number,
        default: 0
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
        type: Date,
        default: Date.now
    },
    updatedby: {
        type: ObjectId
    },
    updateddate: {
        type: Date,
        default: ''
    },
})
var StockTransfer = new mongoose.model('StockTransfer', Schema);
module.exports = StockTransfer;