var express = require('express');
var router = express();
var engine = require('ejs-locals');
const SalesController = require('../Controllers/sales/SalesController');
router.engine('ejs', engine);
router.set('view engine', 'ejs');

const Salescontroller = require('../Controllers').Salescontroller;
const Salesreturncontroller = require('../Controllers').Salesreturncontroller;
const SalesOrder = require('../Controllers').Salesorder;
const receiptpayment = require('../Controllers').receiptpayment;
const RoleMappingModal = mongoose.model('RoleMapping');
router.get('/sales', function (req, res, next) {

    if (req.session.usrid) {
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            let roledetails = '';
            roledetails = data;
            branchid=req.session.branchid;
            res.render('./Sales/SalesEntry/index.ejs', { roledetails: roledetails,branchid:branchid });


        })
    }

    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});

router.get('/salesorder', function (req, res, next) {

    if (req.session.usrid) {
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            let roledetails = '';
            roledetails = data;
            branchid=req.session.branchid;
            res.render('./Sales/Salesorder/index.ejs', { roledetails: roledetails,branchid:branchid });


        })
    }

    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});

router.get('/salereturn', function (req, res, next) {

    if (req.session.usrid) {
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            let roledetails = '';
            roledetails = data;
            branchid=req.session.branchid;
            res.render('./Sales/Salesreturn/index.ejs', { roledetails: roledetails ,branchid:branchid});

        })
    }

    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});
router.get('/receiptentry', function (req, res, next) {

    if (req.session.usrid)
    {
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;
            branchid=req.session.branchid;
            res.render('./payment/ReceiptEntry/index.ejs', { roledetails: roledetails,branchid:branchid });

        })
    }
        
    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});
router.get('/sales/invoiceno', Salescontroller.invoiceno);
router.post('/sales/insertupdate', Salescontroller.insert);
router.post('/sales/list', Salescontroller.list);
router.get('/sales/testlist/:_id', Salescontroller.testlist);
router.get('/sales/edit/:_id', Salescontroller.edit);
router.post('/sales/delete/:_id', Salescontroller.delete);
router.get('/sales/invoicenolist', Salescontroller.salesnodropdownlist);
router.post('/sales/invoicebill/:_id', Salescontroller.invoicebill);
router.get('/sales/amountdetails', Salescontroller.amountdateils);
router.get('/sales/getmaildetails/:_id', Salescontroller.customermaildetails);
router.post('/sales/sendmailtocustomer/:_id', Salescontroller.sendmailtocustomer);
router.get('/sales/getinvoicewithbob/:_id',SalesController.printinvoice_bob);

router.get('/salesreturn/salesretrunno', Salesreturncontroller.salesretrunno);
router.post('/salesreturn/insertupdate', Salesreturncontroller.insert);
router.get('/salesreturn/list', Salesreturncontroller.list);
router.get('/sales/return/:_id', Salesreturncontroller.edit);
router.post('/sales/returndelete/:_id', Salesreturncontroller.delete);
router.get('/sales/invoiceno/:_id', Salesreturncontroller.saledetails);

router.get('/receipt/customerbalance/:id', receiptpayment.CustomerBalanceDetails);
router.get('/receipt/receiptno', receiptpayment.receiptno);
router.post('/receipt/insertupdate', receiptpayment.insert);
router.get('/receipt/list', receiptpayment.list);
router.get('/receipt/edit/:_id', receiptpayment.edit);
router.post('/receipt/delete/:_id', receiptpayment.delete);
router.get('/receipt/deletedetail/:_id', receiptpayment.find_cancelperson);
router.get('/receipt/downloadreceipt/:_id',receiptpayment.downloadreceipt);


router.get('/salesorder/invoiceno', SalesOrder.invoiceno);
router.post('/salesorder/insertupdate',SalesOrder.insert);
router.get('/salesorder/list', SalesOrder.list);
router.get('/salesorder/edit/:_id', SalesOrder.edit);
router.post('/salesorder/delete/:_id', SalesOrder.delete);
router.get('/salesorder/printinvoice/:_id', SalesOrder.invoicebill);




module.exports = router;