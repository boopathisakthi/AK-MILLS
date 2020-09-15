const salesmodel = require('./Sales/salesmodels');
const salesorder = require('./Sales/salesorder');
const SaleReturn = require('./Sales/salereturnmodels');
const BalancePayment = require('./Payment/balancepayment');
const ReceiptPayment = require('./Payment/receiptpayment');
const Payment = require('./Payment/payment');
const RoleMapping = require('./Adminpanel/rolemappingModels')
const StockProcessDetails = require('./Master/stockprocessdetails');
const StockTransfer = require('./Stocktransfer/stocktransfermodel');

module.exports = {
    salesmodel,
    SaleReturn,
    BalancePayment,
    ReceiptPayment,
    Payment,
    RoleMapping,
    StockProcessDetails,
    StockTransfer,
    salesorder


}