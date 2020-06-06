const mongoose = require('mongoose');

var ObjectId=require('mongodb').ObjectID;
var BranchDetailschema = new mongoose.Schema({
    branchid:{
        type:ObjectId
    }
})
var Schema = new mongoose.Schema({
    name: {
        type: String
    },
    mobile: {
        type: Number
    },
    email: {
        type: String
    },
    username: {
        type: String
    },
 
    password: {
        type: String
    },   
    profilepic: {
        type: String
    },
    roleid: {
        type: ObjectId    
    },
    BranchDetail:{
       type:[BranchDetailschema]
    },
    branchid: {
        type: ObjectId
    },
    companyid: {
        type: ObjectId
    },
    createdby: {
        type: Number,default: '' 
    },
    createddate: {
        type: Date,default: Date.now 
    },
    updatedby: {
        type: Number,default: ''
    },
    updateddate: {
        type: Date,default: ''
    },
    isdeleted: {
        type: Number,default: 0
    },
   
});
var UserCreation = new mongoose.model('UserCreation', Schema);
module.exports = UserCreation;
