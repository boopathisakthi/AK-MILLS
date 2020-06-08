const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var PurchaseDetailSchema = new mongoose.Schema({
    productid: {
        type: ObjectId
    },
     productname: {
        type: String
     },
    qty: {
        type: Number
    },
    rate: {
        type: Number
    },
    salesprice:{
        type:Number
    },
    discount: {
        type: Number
    },
    amount: {
        type: Number
    },
    unitid: {
        type: ObjectId
    },
    hsn: {
        type: Number
    }

});
var SupplierDetail = new mongoose.Schema({
    suppliername: {
        type: String
    },
    suppliertype: {
        type: String
    },
    email: {
        type: String
    },
    shippingaddress: {
        type: String
    },
    billingaddress: {
        type: String
    },
    gstin: {
        type: String
    },
    gsttype: {
        type: String
    },
    gstno: {
        type: String
    }
})
var GstDetialschema = new mongoose.Schema({
    name: {
        type: String
    },
    percentage: {
        type: Number
    },
    sgst: {
        type: Number,
        default: 0
    },
    cgst: {
        type: Number,
        default: 0
    
    },
    igst: {
        type: Number,
        default: 0
    },
    taxablevalue:{
        type:Number
    },
    itemtotal:{
        type:Number
    },
    taxvalue:{
        type:Number
    }
})
var PayementDetialschema = new mongoose.Schema({
    paidfrom: {
        type: String
    },
    referencemode: {
        type: String
    },
    amount: {
        type: Number
    },
    description:{
        type:String
    },
    paymentid:{
        type:ObjectId
    }
})

var Schema = new mongoose.Schema({
    purchaseorderno: {
        type: String
    },
    purchasedate: {
        type: Date
    },
    duedate: {
        type: Date
    },
    creditdays: {
        type: Number
    },
    reference: {
        type: String
    },
    supplierid: {
        type: ObjectId
    },
    gstdetail: {
        type: [GstDetialschema]
    },
    purchaseDetail: {
        type: [PurchaseDetailSchema]
    },
    SupplierDetail: {
        type: [SupplierDetail]
    },
    PaymentDetails: {
        type: [PayementDetialschema]
    },
    subtotal: {
        type: Number
    },
    actualtotal: {
        type: Number
    },
    roundofftype: {
        type: String
    },
    roundoff: {
        type: Number
    },
    total: {
        type: Number
    },
    payamount: {
        type: Number
    },
    balance: {
        type: Number
    },
    note: {
        type: String
    },
    isdeleted: {
        type: Number,
        default: 0
    },
    hsncolumn: {
        type: Number,
        default: 0
    },
    unitcolumn: {
        type: Number,
        default: 0
    },
    discountcolumn: {
        type: Number,
        default: 0
    },
    discountype: {
        type: String
    },
    taxtype: {
        type: String
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
    productname:{
        type:String
    },
    productid:{
        type:ObjectId
    },
    type:{
        type:String
    },
    purchaseprice:{
        type:Number
    },
    salesprice:{
        type:Number
    },
    itemcode:{
        type:String
    },
    lastmodified:{
        type:Date
    },
    hsnorsac_code:{
        type:String
    },
    unitid:{
        type:ObjectId
    },
    taxid:{
        type:ObjectId
    },
    modified:{
        type:Number
    },
    branchid:{
        type:ObjectId
    }


})
var Purchase = new mongoose.model('Purchase', Schema);
module.exports = Purchase;