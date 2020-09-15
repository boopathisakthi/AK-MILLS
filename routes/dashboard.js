var express = require('express');
var router = express();
var engine = require('ejs-locals');
router.engine('ejs', engine);
router.set('view engine', 'ejs');
const Dashboard = require('../Controllers').Dashboard;


router.post('/dashboard/gettotalsales', Dashboard.totalsales);
router.post('/dashboard/gettotalpurchase', Dashboard.totalpurchases);
router.post('/dashboard/gettotalexpense', Dashboard.totalexpense);
router.post('/dashboard/gettotalprofit', Dashboard.totalprofit);
router.post('/dashboard/gettotalcustomer', Dashboard.totalcustomer);
router.post('/dashboard/gettotalsupplier', Dashboard.totalsupplier);

router.post('/dashboard/gettotaloutstandingcustomer',Dashboard.totalcustomeroutstanding);
router.post('/dashboard/gettotaloutstandingsupplier',Dashboard.totalsupplieroutstanding);

router.post('/dashboard/saleschart', Dashboard.saleschart);
router.post('/dashboard/purchasechart', Dashboard.purchasechart);

router.post('/dashboard/purchaseamountdetails',Dashboard.purchaseamountdetails);
router.post('/dashboard/salesamountdetails',Dashboard.salesamountdetails);

router.post('/dashboard/customeroutstanding',Dashboard.customeroutstanding);
router.post('/dashboard/supplieroutstanding',Dashboard.supplieroutstanding);

router.post('/dashboard/top3productsales',Dashboard.top3productsales);

router.post('/dashboard/top3expenses',Dashboard.top3expenses);

router.post('/dashboard/saleslist',Dashboard.saleslist);
router.post('/dashboard/purchaselist',Dashboard.purchaselist);

router.post('/dashboard/incomevsexpense',Dashboard.incomevsexpense);

router.post('/dashboard/top10sellingproducts',Dashboard.top10productsales);
router.post('/dashboard/profit_musthifr_method2',Dashboard.profit_musthifr_method);










module.exports = router;