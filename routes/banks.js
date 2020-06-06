require('../config/db');

var express = require('express');
var router = express();
var engine = require('ejs-locals');
router.engine('ejs', engine);
router.set('view engine', 'ejs');


const Banks=require('../Controllers').Banks;
var RoleMappingModal = mongoose.model('RoleMapping');
router.get('/banks',function(req,res,next){
   if(req.session.usrid)
   {
    let roledetails = '';
    RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
        roledetails = data;
        branchid = req.session.branchid;
        res.render('./banks/index', { roledetails: roledetails ,branchid:branchid});
    })
   }
    
   else
    res.render('./Adminpanel/login/login', { title: 'Login' });
})

router.get('/bankslist',Banks.bankslist);
router.post('/transaction_supplier_purchaseclose',Banks.supplier_billclose_insert)
router.post('/transaction_receipt_insert',Banks.customer_receipt_insert)
router.post('/cash_contra_insert',Banks.cash_contra_insert);
router.post('/bankstransaction/:_id',Banks.transactiondetails)
router.post('/banksbeforetransaction/:_id',Banks.beforebalance)
module.exports = router;