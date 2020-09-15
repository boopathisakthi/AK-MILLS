require('../config/db');

var express = require('express');
var router = express();
var engine = require('ejs-locals');
router.engine('ejs', engine);
router.set('view engine', 'ejs');

const Excelreport = require('../Controllers').Excelreport;
const Gstreport=require('../Controllers').Gstreport;
var RoleMappingModal = mongoose.model('RoleMapping');

router.post('/purchase/puchaseexcelreport', Excelreport.pushaselist);

router.get('/purchase/puchasereport', Excelreport.pushaselist);

router.post('/sales/salesreport', Excelreport.saleslist);

router.get('/sales/salesexcelreport', Excelreport.saleslist);

//router.get('/stock/stockreport',Excelreport.stocklist);

router.post('/stock/stockreport', Excelreport.stocklist);

router.get('/stock/stockexcelreport', Excelreport.stocklist);

router.post('/report/customeroutstandingreport', Excelreport.customeroutstanding)

//router.get('/report/supplieroutstanding',Excelreport.supplieroutstanding)
router.post('/router/supplieroutstanding', Excelreport.supplieroutstanding)

router.get('/purchasegstreport',function(req,res,next){
  //  if(req.session.usrid)
    res.render('./report/purchasegst', { title: 'supplieroutstanding' });
   // else
   // res.render('./Adminpanel/login/login', { title: 'Login' });
})
router.get('/salesgstreport',function(req,res,next){
  //  if(req.session.usrid)
    res.render('./report/salesgst', { title: 'salesgst' });
   // else
    //res.render('./Adminpanel/login/login', { title: 'Login' });
})
router.get('/spareprocessdetails',function(req,res,next){
    if(req.session.usrid){
      let roledetails = '';
      RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
          roledetails = data;
          branchid = req.session.branchid;
          res.render('./report/spareprocessdetails', { roledetails: roledetails ,branchid:branchid});
      })

    }
  else
    res.render('./Adminpanel/login/login', { title: 'Login' });
 
  
 
})
router.get('/salesreturnreport',function(req,res,next){
  if(req.session.usrid){
    let roledetails = '';
    RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
        roledetails = data;
        branchid = req.session.branchid;
        res.render('./report/salesreturn', { roledetails: roledetails ,branchid:branchid});
    })

  }
else
  res.render('./Adminpanel/login/login', { title: 'Login' });



})
router.get('/purchasereturnreport',function(req,res,next){
  if(req.session.usrid){
    let roledetails = '';
    RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
        roledetails = data;
        branchid = req.session.branchid;
        res.render('./report/purchasereturn', { roledetails: roledetails ,branchid:branchid});
    })

  }
else
  res.render('./Adminpanel/login/login', { title: 'Login' });



})
router.get('/purchasesummaryreport',function(req,res,next){
  if(req.session.usrid){
    let roledetails = '';
    RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
        roledetails = data;
        branchid = req.session.branchid;
        res.render('./report/purchasesummaryreport', { roledetails: roledetails ,branchid:branchid});
    })

  }
else
  res.render('./Adminpanel/login/login', { title: 'Login' });



})

router.post('/gstpurchasereport',Gstreport.purchaselist);
router.post('/gstzeropurchasereport',Gstreport.purchasegstzerolist);
router.post('/gstsalesreport',Gstreport.saleslist);
router.post('/gstzerosalesreport',Gstreport.saleszerolist);
router.post('/gstpurchaseamountdetails',Gstreport.purchaseamountdateils);
router.post('/gstsalesamountdetails',Gstreport.salesamountdetails);
router.post('/gstpurchasecount',Gstreport.purchasecount);
router.post('/gstsalescount',Gstreport.salescount);

router.post('/getstockprocessdetails',Excelreport.stockprocess);
router.post('/getstockprocessdetailsdownload',Excelreport.stockprocessdownload);
router.post('/getcategorywise',Excelreport.salescategorywise);
router.post('/getpurchasecategorywiseamount',Excelreport.purchasecategorywiseamount);

router.post('/getsalesreturn',Excelreport.salesreturnlist);
router.post('/getsalesreturnamount',Excelreport.salesreturnamount);

router.post('/getpurchasereturn',Excelreport.purchasereturnlist);
router.post('/getpurchasereturnamount',Excelreport.purchasereturnamount);

router.post('/dueamountcustomers',Excelreport.dueamountcustomers);

router.post('/download_stocklist',Excelreport.download_stocklist);
router.post('/purchasesummarydownload',Excelreport.purchasesummarydownload);

module.exports = router;