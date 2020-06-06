require('../config/db');

var express = require('express');
var router = express();
var engine = require('ejs-locals');
router.engine('ejs', engine);
router.set('view engine', 'ejs');

const Excelreport = require('../Controllers').Excelreport;
const Gstreport=require('../Controllers').Gstreport;

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
router.post('/gstpurchasereport',Gstreport.purchaselist);
router.post('/gstzeropurchasereport',Gstreport.purchasegstzerolist);
router.post('/gstsalesreport',Gstreport.saleslist);
router.post('/gstzerosalesreport',Gstreport.saleszerolist);
router.post('/gstpurchaseamountdetails',Gstreport.purchaseamountdateils);
router.post('/gstsalesamountdetails',Gstreport.salesamountdetails);
router.post('/gstpurchasecount',Gstreport.purchasecount);
router.post('/gstsalescount',Gstreport.salescount);
module.exports = router;