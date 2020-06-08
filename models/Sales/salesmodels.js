const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var InvoiceDetailSchema = new mongoose.Schema({
    productid: {
        type: ObjectId
    },
    qty: {
        type: Number
    },
    rate: {
        type: Number
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
    },
    productname:{
        type:String
    }
    

});
var GstDetialschema=new mongoose.Schema({
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
var CustomerDetail=new mongoose.Schema({
    customername:{
        type:String
    },
    customertype:{
        type:String
    },
    email:{
        type:String
    },
    shippingaddress:{
        type:String
    },
    billingaddress:{
        type:String
    },
    gstin:{
        type:String
    },
    gsttype:{
        type:String
    },
    gstno:{
        type:String
    },
})
var Schema = new mongoose.Schema({
    invoiceno: {
        type: String
    },
    invoicedate: {
        type: Date
    },
    duedate: {
        type: Date
    },
    creditdays: {
        type:Number
    },
    reference: {
        type: String
    },
    customerid: {
        type: ObjectId
    },
    invoiceDetail: {
        type: [InvoiceDetailSchema]
    },
    CustomerDetail:{
       type:[CustomerDetail]
    },
    subtotal: {
        type: Number
    },
    roundoff: {
        type: Number
    },
    actualtotal: {
        type: Number
    },
    roundofftype: {
        type: String
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
    hsncolumn:{
        type: Number, default: 0
    },
    unitcolumn:{
        type: Number, default: 0
    },
    discountcolumn:{
        type: Number, default: 0
    },
    discountype:{
        type:String
    },
    taxtype:{
        type:String
    },
    salesrep:{
        type:ObjectId
    },
    gstdetail:{
        type:[GstDetialschema]
    },
    note:{
        type:String
    },
    termsandconditions:{
        type:String
    }

})
var sales = new mongoose.model('sales', Schema);
module.exports = sales;