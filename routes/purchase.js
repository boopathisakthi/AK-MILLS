require('../config/db');

var express = require('express');
var router = express();
var engine = require('ejs-locals');
router.engine('ejs', engine);
router.set('view engine', 'ejs');

const purchase = require('../Controllers').purchase;
const purchasereturn = require('../Controllers').purchasereturn;
const balancepayment = require('../Controllers').balancepayment;
const RoleMappingModal = mongoose.model('RoleMapping');
//Purchase Entry
router.get('/purchase', function (req, res, next) {

    if (req.session.usrid) {
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;
            branchid=req.session.branchid;
            res.render('./Purchase/PurchaseEntry/index.ejs', { roledetails: roledetails,branchid:branchid });

        })
    }

    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
})


//Purchase Return
router.get('/purchasereturn', function (req, res, next) {

    if (req.session.usrid) {
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;
            branchid=req.session.branchid;
            res.render('./Purchase/PurchaseReturn/index.ejs', { roledetails: roledetails,branchid:branchid });

        })
    }

    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});
//Bill payemnt for purchase

router.get('/billpayment', function (req, res, next) {
    if (req.session.usrid) {
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;
            branchid=req.session.branchid;
            res.render('./payment/billpayment/index', { roledetails: roledetails,branchid:branchid })

        })
    }


    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
})

//master Attribute
router.post('/purchase/insertupdate', purchase.insert);
router.get('/purchase/list', purchase.list);
router.get('/purchase/edit/:_id', purchase.edit);
router.get('/purchase/purchaseno', purchase.purchaseno);
//  router.get('/master/attributeedit/:_id',Attribute.edit);
router.post('/purchase/delete/:_id', purchase.delete);
router.get('/purchase/purchasenolist', purchase.purchasenodropdownlist);
router.get('/purchase/amountdateils', purchase.amountdateils);

router.get('/purchase/purchase_productlist', purchase.productdropdownlist);


//Purchase Retrun pr means purchase return
router.post('/purchasereturn/insertupdate', purchasereturn.insert);
router.get('/purchasereturn/list', purchasereturn.list);
router.get('/purchasereturn/edit/:_id', purchasereturn.edit);
router.get('/purchasereturn/purchasereturnno', purchasereturn.purchaseretrunno);
router.post('/purchasereturn/delete/:_id', purchasereturn.delete);
router.get('/purchasereturn/purchasedetails/:_id', purchasereturn.purchasedetails);


//balance payment
router.get('/balancepayment/supplierbalance/:id', purchase.supplierbalance_purchasedetail);
router.get('/balancepayment/list', balancepayment.list);
// router.get('/testbalancepayment/supplierbalance/:id',purchase.balance_amount);
router.get('/balancepayment/edit/:_id', balancepayment.edit);
router.get('/balancepayment/billno', balancepayment.paymentno);
router.post('/balancepayment/insert', balancepayment.insert);
router.post('/balancepayment/delete/', balancepayment.delete);
router.get('/balancepayment/findcancelperson/:_id', balancepayment.find_cancelperson);



module.exports = router;