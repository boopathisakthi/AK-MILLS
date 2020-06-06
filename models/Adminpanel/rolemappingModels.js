const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var Schema = new mongoose.Schema({
    roleid: {
        type: ObjectId
    },
    pagename: {
        type: String
    },
    viewrights: {
        type: Boolean
    },
    insert: {
        type:Boolean
    },
    edit: {
        type: Boolean
    },
    delete:
    {
        type: Boolean
    },
    isdeleted:{
       type:Number,default:0
    },
    createddate:
    {
        type: Date, default: Date.now
    },
    updatedby:
    {
        type: Number
    },
    updateddate:
    {
        type: Date,
    },
    type: {
        type: String
    },
    creditdays: {
        type: Number
    },
    companyid: {
        type: ObjectId
    }
})

var Branch = new mongoose.model('RoleMapping', Schema);
module.exports = Branch;