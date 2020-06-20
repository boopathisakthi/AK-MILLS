var Purchase = mongoose.model('Purchase');
var PurchaseReturn = mongoose.model('PurchaseReturn');
var sales = mongoose.model('sales');
var SaleReturn = mongoose.model('SaleReturn');
var Product = mongoose.model('MasterProduct');
var customer = mongoose.model('mastercustomer');
var supplier = mongoose.model('mastersupplier');
var recipt = mongoose.model('ReceiptPayment');
var supplier = mongoose.model('mastersupplier');
const pdf = require('html-pdf');
const mark = require('markup-js');
var fs = require('fs');
require("datejs");

var url = require('url');
module.exports = {
    pushaselist(req, res) {
        var searchStr = {};

        Purchase.aggregate([
            {
                $match: {
                    isdeleted: 0,
                    purchasedate: {
                        $gte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),
                        $lt: new Date(req.body.tdate),
                    }
                }
            },
            {
                $lookup: {
                    from: "mastersuppliers",
                    "localField": "supplierid",
                    "foreignField": "_id",
                    as: "Supplier"
                }

            },
            {
                $unwind: "$Supplier"

            },
            {
                $project: {
                    "_id": 1,
                    "total": 1,
                    "Supplier.name": 1,
                    "purchaseorderno": 1,
                    purchaseDetail: 1,
                    "purchasedate": { $dateToString: { format: "%d-%m-%Y", date: "$purchasedate" } },
                }
            }
        ]).then(data => {
            res.status(200).send({ data: data });
        })
    },
    saleslist(req, res) {

        sales.aggregate([
            {
                $match: {
                    isdeleted: 0,
                    invoicedate: {
                        $gte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),
                        $lt: new Date(req.body.tdate),
                    }
                }

            },
            {
                $lookup: {
                    from: "mastercustomers",
                    "localField": "customerid",
                    "foreignField": "_id",
                    as: "customer"
                }
            },
            {
                $unwind: "$customer"
            },

            {
                $lookup: {
                    from: "payments",
                    "let": { "sale_id": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$PaymentDetail"
                        },
                        {
                            "$match": {
                                isdeleted: 0,
                                type: "customer",
                                "$expr": {
                                    $and: [
                                        { $eq: ["$PaymentDetail.trans_id", "$$sale_id"] },
                                    ]
                                },
                            }
                        }],
                    as: "receiptpayment",
                }
            },
            {
                $project: {
                    "_id": 1,
                    "invoicedate": { $dateToString: { format: "%d-%m-%Y", date: "$invoicedate" } },
                    "reference": 1,
                
                    "customername": "$customer.name",
                    "invoiceno": 1,
                    "total": 1,
                    "dueamount": { $subtract: ['$total', { $sum: { "$sum": '$receiptpayment.PaymentDetail.payedamount' } }] },
                    invoiceDetail: 1,
                   
                },

            },
            { $sort: { _id: 1, } }
        ]).then(data => {

            res.status(200).send({ data: data });
        })
    },
    stocklist(req, res) {
        Product.aggregate([{
            $match: { "isdeleted": 0 }
        },
        {
            $lookup: {
                from: "masterattributes",
                "localField": "categoryid",
                "foreignField": "categoryid",
                as: "attributes"
            }
        },
        {
            $lookup: {
                from: "mastertaxes",
                "localField": "taxid",
                "foreignField": "_id",
                as: "tax"
            }
        },
        {

            $lookup: {
                from: "stockprocessdetails",
                "let": { "id": "$_id" },
                "pipeline": [{
                    "$match": {
                        isdeleted: 0,
                        branchid: new mongoose.Types.ObjectId(req.session.branchid),
                        "$expr": {
                            $and: [
                                { $eq: ["$productid", "$$id"] },
                            ]
                        },
                    }
                }],
                as: "stockprocessdetails"
            }
        },
        {
            $project: {
                _id: 0,
                //id:0,
                name: "$productname",

                purchaseprice: 1,
                salesprice: 1,
                "availbleqty": { $subtract: [{ '$add': [{ "$sum": '$stockprocessdetails.openingstock' }, { "$sum": '$stockprocessdetails.purchaseqty' }, { "$sum": '$stockprocessdetails.stock_received' }] }, { '$add': [{ "$sum": '$stockprocessdetails.salesqty' }, { "$sum": '$stockprocessdetails.stock_transfer' }] }] },
                "minimumqty": "$minimumstock"

            }
        }
        ])
            .then(data => {
                res.status(200).send({ data: data });

            })
    },
    customeroutstanding(req, res) {
        console.log(req.body.customer)
        var regex = new RegExp(req.body.customer, "i")
        customer.aggregate([{
            $match: {
                $or: [
                    { 'name': regex },
                ],
                isdeleted: 0,
            }
        },
        {
            $lookup: {
                from: "sales",
                "let": { "id": "$_id" },
                "pipeline": [{
                    "$match": {
                        isdeleted: 0,
                        "$expr": {
                            $and: [
                                { $eq: ["$customerid", "$$id"] },
                            ]
                        },
                    }
                }],
                as: "invoice",
            }
        },
        {
            $lookup: {
                from: "salereturns",
                "let": { "id": "$_id" },
                "pipeline": [{
                    "$match": {
                        isdeleted: 0,
                        "$expr": {
                            $and: [
                                { $eq: ["$customerid", "$$id"] },
                            ]
                        },
                    }
                }],
                as: "salereturn",
            }
        },
        {
            $lookup: {
                from: "payments",
                "let": { "customer_id": "$_id" },
                "pipeline": [
                    {
                        $unwind: "$PaymentDetail"
                    },
                    {
                        "$match": {
                            isdeleted: 0,
                            type: "customer",
                            "$expr": {
                                $and: [
                                    { $eq: ["$typeid", "$$customer_id"] },
                                ]
                            },
                        }
                    }],
                as: "receipt",
            }
        },
        {
            $project: {
                _id: 0,
                name: 1,
                mobile: 1,
                total: { "$sum": '$invoice.total' },
                receipt: { "$sum": '$receipt.PaymentDetail.payedamount' },
                'pendingamount': { $subtract: [{ "$sum": '$invoice.total' }, { $add: [{ "$sum": '$salereturn.total' }, { "$sum": '$receipt.PaymentDetail.payedamount' }] }] },
                // 'pendingamount': { $subtract: [{ "$sum": '$invoice.total' },, { $add: [{ "$sum": '$salereturn.total' }, { "$sum": '$receipt.PaymentDetail.payedamount' }] }] }

            }
        }
        ])
            .then(data => {
                console.log(data)
                res.status(200).send({ data: data });
            })
    },
    supplieroutstanding(req, res) {
        var regex = new RegExp(req.body.supplier, "i")
        supplier.aggregate([{
            $match: {
                $or: [
                    { 'name': regex },
                ],
                isdeleted: 0,
            }
        },
        {
            $lookup: {
                from: "purchases",
                "let": { "id": "$_id" },
                "pipeline": [{
                    "$match": {
                        isdeleted: 0,
                        "$expr": {
                            $and: [
                                { $eq: ["$supplierid", "$$id"] },
                            ]
                        },
                    }
                }],
                as: "purchase",
            }
        },
        {
            $lookup: {
                from: "purchasereturns",
                "let": { "id": "$_id" },
                "pipeline": [{
                    "$match": {
                        isdeleted: 0,
                        "$expr": {
                            $and: [
                                { $eq: ["$supplierid", "$$id"] },
                            ]
                        },
                    }
                }],
                as: "purchasereturn",
            }
        },
        {
            $lookup: {
                from: "payments",
                "let": { "supplier_id": "$_id" },
                "pipeline": [
                    {
                        $unwind: "$PaymentDetail"
                    },
                    {
                        "$match": {
                            type: "supplier",
                            "$expr": {
                                $and: [
                                    { $eq: ["$typeid", "$$supplier_id"] },
                                ]
                            },
                        }
                    }],
                as: "balancepayment",
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                mobile: 1,
                "balancepayment.PaymentDetail": 1,
                payedamount: { "$sum": '$balancepayment.PaymentDetail.payedamount' },
                'pendingamount': { $subtract: [{ "$sum": '$purchase.total' }, { $add: [{ "$sum": '$purchasereturn.total' }, { "$sum": '$balancepayment.PaymentDetail.payedamount' }] }] },
            }
        }
        ])
            .then(data => {
                console.log(data)
                res.status(200).send({ data: data });
            })
    },
    stockprocess(req, res) {
        console.log(req.body.productname)
        if (req.body.productname == '') {
            var searchstr = {
                $match: {
                    isdeleted: 0,

                }
            }
        }
        else {
            var searchstr = {
                $match: {
                    isdeleted: 0,
                    'productname': { '$regex': req.body.productname }
                }
            }

        }
        Product.aggregate([
            searchstr,
            {
                $lookup: {
                    from: "sales",
                    "let": { "productid": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$invoiceDetail"
                        },
                        {
                            "$match": {
                                invoicedate: {
                                    $gte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),
                                    $lt: new Date(req.body.tdate),
                                },
                                isdeleted: 0,
                                "$expr": {
                                    $and: [
                                        { $eq: ["$invoiceDetail.productid", "$$productid"] },
                                    ]
                                },
                            }
                        }],
                    as: "salesdetail"
                }
            },
            {
                $lookup: {
                    from: "salereturns",
                    "let": { "productid": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$invoiceReturnDetail"
                        },
                        {
                            "$match": {
                                isdeleted: 0,
                                invoicedate: {
                                    $gte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),
                                    $lt: new Date(req.body.tdate),
                                },
                                "$expr": {
                                    $and: [
                                        { $eq: ["$invoiceReturnDetail.productid", "$$productid"] },
                                    ]
                                },
                            }
                        }],
                    as: "salesreturndetail"
                }
            },
            {
                $lookup: {
                    from: "purchases",
                    "let": { "productid": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$purchaseDetail"
                        },
                        {
                            "$match": {
                                isdeleted: 0,
                                purchasedate: {
                                    $gte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),
                                    $lt: new Date(req.body.tdate),
                                },
                                "$expr": {
                                    $and: [
                                        { $eq: ["$purchaseDetail.productid", "$$productid"] },
                                    ]
                                },
                            }
                        }],
                    as: "purchasedetail"
                }
            },
            {
                $lookup: {
                    from: "purchasereturns",
                    "let": { "productid": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$purchaseRetrunDetail"
                        },
                        {
                            "$match": {
                                purchasedate: {
                                    $gte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),
                                    $lt: new Date(req.body.tdate),
                                },
                                isdeleted: 0,
                                "$expr": {
                                    $and: [
                                        { $eq: ["$purchaseRetrunDetail.productid", "$$productid"] },
                                    ]
                                },
                            }
                        }],
                    as: "purchasereturndetail"
                }
            },
            {
                $lookup: {
                    from: "sales",
                    "let": { "productid": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$invoiceDetail"
                        },
                        {
                            "$match": {
                                invoicedate: {
                                    $lte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),

                                },
                                isdeleted: 0,
                                "$expr": {
                                    $and: [
                                        { $eq: ["$invoiceDetail.productid", "$$productid"] },
                                    ]
                                },
                            }
                        }],
                    as: "previous_salesdetail"
                }
            },
            {
                $lookup: {
                    from: "salereturns",
                    "let": { "productid": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$invoiceReturnDetail"
                        },
                        {
                            "$match": {
                                isdeleted: 0,
                                invoicedate: {
                                    $lte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),
                                },
                                "$expr": {
                                    $and: [
                                        { $eq: ["$invoiceReturnDetail.productid", "$$productid"] },
                                    ]
                                },
                            }
                        }],
                    as: "previous_salesreturndetail"
                }
            },
            {
                $lookup: {
                    from: "purchases",
                    "let": { "productid": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$purchaseDetail"
                        },
                        {
                            "$match": {
                                isdeleted: 0,
                                purchasedate: {
                                    $lte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),
                                },
                                "$expr": {
                                    $and: [
                                        { $eq: ["$purchaseDetail.productid", "$$productid"] },
                                    ]
                                },
                            }
                        }],
                    as: "previous_purchasedetail"
                }
            },
            {
                $lookup: {
                    from: "purchasereturns",
                    "let": { "productid": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$purchaseRetrunDetail"
                        },
                        {
                            "$match": {
                                purchasedate: {
                                    $lt: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),

                                },
                                isdeleted: 0,
                                "$expr": {
                                    $and: [
                                        { $eq: ["$purchaseRetrunDetail.productid", "$$productid"] },
                                    ]
                                },
                            }
                        }],
                    as: "previous_purchasereturndetail"
                }
            },
            {
                $group:
                {
                    _id: {
                        _id: "$_id",
                        productname: "$productname",
                        openingstock: "$openingstock",
                        salesqty: { $sum: "$salesdetail.invoiceDetail.qty" },
                        salesreturnqty: { $sum: "$salesreturndetail.invoiceReturnDetail.qty" },
                        purchaseqty: { $sum: "$purchasedetail.purchaseDetail.qty" },
                        purchasereturnqty: { $sum: "$purchasereturndetail.purchaseRetrunDetail.qty" },

                        previous_salesqty: { $sum: "$previous_salesdetail.invoiceDetail.qty" },
                        previous_salesreturnqty: { $sum: "$previous_salesreturndetail.invoiceReturnDetail.qty" },
                        previous_purchaseqty: { $sum: "$previous_purchasedetail.purchaseDetail.qty" },
                        previous_purchasereturnqty: { $sum: "$previous_purchasereturndetail.purchaseRetrunDetail.qty" },
                    },

                }
            },
            {
                $project: {
                    productname: "$_id.productname",
                    salesqty: "$_id.salesqty",
                    salesreturnqty: "$_id.salesreturnqty",
                    purchaseqty: "$_id.purchaseqty",
                    purchasereturnqty: "$_id.purchasereturnqty",
                    openingstock: { $subtract: [{ $subtract: [{ $add: ["$_id.openingstock", "$_id.previous_purchaseqty"] }, "$_id.previous_purchasereturnqty"] }, { $subtract: ["$_id.previous_salesqty", "$_id.previous_salesreturnqty"] }] },
                    totalstock: {
                        $subtract: [
                            { $add: ["$_id.openingstock", "$_id.purchaseqty", { $subtract: ["$_id.previous_purchaseqty", "$_id.previous_purchasereturnqty"] },] },
                            { $subtract: ["$_id.previous_salesqty", "$_id.previous_salesreturnqty"] }
                        ]
                    },
                    Remainingqty: {
                        $subtract: [
                            { $add: ["$_id.openingstock", { $subtract: ["$_id.purchaseqty", "$_id.purchasereturnqty"] }, { $subtract: ["$_id.previous_purchaseqty", "$_id.previous_purchasereturnqty"] },] },
                            { $add: [{ $subtract: ["$_id.salesqty", "$_id.salesreturnqty"] }, { $subtract: ["$_id.previous_salesqty", "$_id.previous_salesreturnqty"] }] },

                        ]

                    }
                }
            },
            { $sort: { productname: 1, } }
        ])
            .then((data) => {

                res.status(200).send(data)
            })
            .catch((err) => res.status(400).send(err))
    },
    stockprocessdownload(req, res) {
        Product.aggregate([
            {
                $match: {
                    isdeleted: 0,

                }
            },
            {
                $lookup: {
                    from: "sales",
                    "let": { "productid": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$invoiceDetail"
                        },
                        {
                            "$match": {
                                invoicedate: {
                                    $gte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),
                                    $lt: new Date(req.body.tdate),
                                },
                                isdeleted: 0,
                                "$expr": {
                                    $and: [
                                        { $eq: ["$invoiceDetail.productid", "$$productid"] },
                                    ]
                                },
                            }
                        }],
                    as: "salesdetail"
                }
            },
            {
                $lookup: {
                    from: "salereturns",
                    "let": { "productid": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$invoiceReturnDetail"
                        },
                        {
                            "$match": {
                                isdeleted: 0,
                                invoicedate: {
                                    $gte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),
                                    $lt: new Date(req.body.tdate),
                                },
                                "$expr": {
                                    $and: [
                                        { $eq: ["$invoiceReturnDetail.productid", "$$productid"] },
                                    ]
                                },
                            }
                        }],
                    as: "salesreturndetail"
                }
            },
            {
                $lookup: {
                    from: "purchases",
                    "let": { "productid": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$purchaseDetail"
                        },
                        {
                            "$match": {
                                isdeleted: 0,
                                purchasedate: {
                                    $gte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),
                                    $lt: new Date(req.body.tdate),
                                },
                                "$expr": {
                                    $and: [
                                        { $eq: ["$purchaseDetail.productid", "$$productid"] },
                                    ]
                                },
                            }
                        }],
                    as: "purchasedetail"
                }
            },
            {
                $lookup: {
                    from: "purchasereturns",
                    "let": { "productid": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$purchaseRetrunDetail"
                        },
                        {
                            "$match": {
                                purchasedate: {
                                    $gte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),
                                    $lt: new Date(req.body.tdate),
                                },
                                isdeleted: 0,
                                "$expr": {
                                    $and: [
                                        { $eq: ["$purchaseRetrunDetail.productid", "$$productid"] },
                                    ]
                                },
                            }
                        }],
                    as: "purchasereturndetail"
                }
            },
            {
                $lookup: {
                    from: "sales",
                    "let": { "productid": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$invoiceDetail"
                        },
                        {
                            "$match": {
                                invoicedate: {
                                    $lte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),

                                },
                                isdeleted: 0,
                                "$expr": {
                                    $and: [
                                        { $eq: ["$invoiceDetail.productid", "$$productid"] },
                                    ]
                                },
                            }
                        }],
                    as: "previous_salesdetail"
                }
            },
            {
                $lookup: {
                    from: "salereturns",
                    "let": { "productid": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$invoiceReturnDetail"
                        },
                        {
                            "$match": {
                                isdeleted: 0,
                                invoicedate: {
                                    $lte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),
                                },
                                "$expr": {
                                    $and: [
                                        { $eq: ["$invoiceReturnDetail.productid", "$$productid"] },
                                    ]
                                },
                            }
                        }],
                    as: "previous_salesreturndetail"
                }
            },
            {
                $lookup: {
                    from: "purchases",
                    "let": { "productid": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$purchaseDetail"
                        },
                        {
                            "$match": {
                                isdeleted: 0,
                                purchasedate: {
                                    $lte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),
                                },
                                "$expr": {
                                    $and: [
                                        { $eq: ["$purchaseDetail.productid", "$$productid"] },
                                    ]
                                },
                            }
                        }],
                    as: "previous_purchasedetail"
                }
            },
            {
                $lookup: {
                    from: "purchasereturns",
                    "let": { "productid": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$purchaseRetrunDetail"
                        },
                        {
                            "$match": {
                                purchasedate: {
                                    $lt: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),
                                },
                                isdeleted: 0,
                                "$expr": {
                                    $and: [
                                        { $eq: ["$purchaseRetrunDetail.productid", "$$productid"] },
                                    ]
                                },
                            }
                        }],
                    as: "previous_purchasereturndetail"
                }
            },
            {
                $group:
                {
                    _id: {
                        _id: "$_id",
                        productname: "$productname",
                        openingstock: "$openingstock",
                        salesqty: { $sum: "$salesdetail.invoiceDetail.qty" },
                        salesreturnqty: { $sum: "$salesreturndetail.invoiceReturnDetail.qty" },
                        purchaseqty: { $sum: "$purchasedetail.purchaseDetail.qty" },
                        purchasereturnqty: { $sum: "$purchasereturndetail.purchaseRetrunDetail.qty" },

                        previous_salesqty: { $sum: "$previous_salesdetail.invoiceDetail.qty" },
                        previous_salesreturnqty: { $sum: "$previous_salesreturndetail.invoiceReturnDetail.qty" },
                        previous_purchaseqty: { $sum: "$previous_purchasedetail.purchaseDetail.qty" },
                        previous_purchasereturnqty: { $sum: "$previous_purchasereturndetail.purchaseRetrunDetail.qty" },
                    },
                }
            },
            {
                $project: {
                    productname: "$_id.productname",
                    salesqty: "$_id.salesqty",
                    salesreturnqty: "$_id.salesreturnqty",
                    purchaseqty: "$_id.purchaseqty",
                    purchasereturnqty: "$_id.purchasereturnqty",
                    openingstock: { $subtract: [{ $subtract: [{ $add: ["$_id.openingstock", "$_id.previous_purchaseqty"] }, "$_id.previous_purchasereturnqty"] }, { $subtract: ["$_id.previous_salesqty", "$_id.previous_salesreturnqty"] }] },
                    totalstock: {
                        $subtract: [
                            { $add: ["$_id.openingstock", "$_id.purchaseqty", { $subtract: ["$_id.previous_purchaseqty", "$_id.previous_purchasereturnqty"] },] },
                            { $subtract: ["$_id.previous_salesqty", "$_id.previous_salesreturnqty"] }
                        ]
                    },
                    Remainingqty: {
                        $subtract: [
                            { $add: ["$_id.openingstock", { $subtract: ["$_id.purchaseqty", "$_id.purchasereturnqty"] }, { $subtract: ["$_id.previous_purchaseqty", "$_id.previous_purchasereturnqty"] },] },
                            { $add: [{ $subtract: ["$_id.salesqty", "$_id.salesreturnqty"] }, { $subtract: ["$_id.previous_salesqty", "$_id.previous_salesreturnqty"] }] },

                        ]

                    }
                }
            },
            { $sort: { productname: 1, } }
        ])
            .then((data) => {
                var todayTime = new Date(req.body.fdate);
                var month = todayTime.getMonth() + 1;
                var day = todayTime.getDate();
                var year = todayTime.getFullYear();
                var currentdate = day + "-" + month + "-" + year;


                let result = [];
                result.printdate = currentdate;
                result.data = data;
                let bindvalues = result;
                var html = `
                <html>
                <head>
               <style>
                    table {
                    font-family: arial, sans-serif;
                    border-collapse: collapse;
                    width: 100%;
                    }

                    td, th {
                    border: 1px solid #1a1919;
                    text-align: left;
                    padding: 8px;
                    }

                    tr:nth-child(even) {
                    background-color: #80A9DE ;
                    }
                </style>
                </head>

                <body>
                <label style="margin-left: 35%;font-size: 23px;font-weight: 800;">A.K. Ahamed Modern Rice Mill</label><br>
                <div style="margin-left: 30%;font-size: 15px;font-weight: 800;">
                 40/2,Mannarpalayam Road,Allikuttai (Po),Salem - 3. Ph :9487158740
                 </div>
                 <div style="margin-left: 40%;font-size: 15px;font-weight: 800;">GSTIN : 33AAFFA2346C1Z5</div>
                 <hr style="width:100%;"></hr>
                 <br>
                <div style="margin-left:40%;font-size:20px;font-weight:800">STOCK REPORT({{printdate}})</div>
                <br>
                        <table   style="width:90%;border: 1px;margin-left:5%;margin-right:5%  ">

                        <thead  class="bgcolor vam" ><tr>
                    
                    <th  style="text-align: center;background-color:#092E5E;color:white;font-size:16px;width:30%" class="">Product Name</th>
                    <th  style="text-align: center;background-color:#092E5E;color:white;font-size:16px;width:10%" class="ac">Opening Stock</th>
                    <th style="text-align: center;background-color:#092E5E;color:white;font-size:16px;width:10%" class="ac">Purchase Qty</th>
                    <th style="text-align: center;background-color:#092E5E;color:white;font-size:16px;width:10%" class="ac">Total Stock</th>
                    
                    <th  style="text-align: center;background-color:#092E5E;color:white;font-size:16px;width:10%" class="ac">Sales Qty</th>
                    <th  style="text-align: center;background-color:#092E5E;color:white;font-size:16px;width:10%" class="ac">SR Qty</th>
                    <th  style="text-align: center;background-color:#092E5E;color:white;font-size:16px;width:10%" class="ac">PR Qty</th>
                    
                   
                    <th  style="text-align: center;background-color:#092E5E;color:white;font-size:16px;width:10%" class="ac">Closing Stock</th>
                    
                    
                    </tr>
                    </thead>
                    <tbody style="background-color: #fff;">
                    <tr class="tbody" {{data}}>
                    
                    <td style="text-align: center;font-size:14px;width:30%">{{productname}}</td>
                    <td style="text-align: center;font-size:14px;width:10%"> {{openingstock}}</td>
                    <td style="text-align: center;font-size:14px;width:10%"> {{purchaseqty}}</td>
                    <td style="text-align: center;font-size:14px;width:10%"> {{totalstock}}</td>
                    <td style="text-align: center;font-size:14px;width:10%"> {{salesqty}}</td>
                    <td style="text-align: center;font-size:14px;width:10%">{{salesreturnqty}}</td>
                    <td style="text-align: center;font-size:14px;width:10%"> {{purchasereturnqty}}</td>
                    <td style="text-align: center;font-size:14px;width:10%">{{Remainingqty}}</td>
                    </tr {{/data}}>
                    </table>
                </body>
                </html>
               
                
                `;
                htmlcontent = mark.up(html, bindvalues);

                filepath = 'productreport' + (new Date()).toString("yyyyMMddHHMMss") + '.pdf';

                pdf.create(htmlcontent).toFile('./public/appfiles/productpdf/' + filepath, function (err, res) {
                    if (err) return console.log(err);

                });




                res.status(200).send(filepath)

            })
            .catch((err) => {
                console.log(err)
                res.status(400).send(err)
            })

    },
    salescategorywise(req, res) {
        var searchStr = {

        };
        sales.aggregate([
            {
                $match: {
                    isdeleted: 0,
                    invoicedate: {
                        $gte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),
                        $lt: new Date(req.body.tdate),
                    }
                }
            },
            {
                $unwind: "$invoiceDetail"
            },
            {
                $group:
                {
                    _id: {
                        _id: "$invoiceDetail.categoryid",
                    },
                    amount: { $sum: "$invoiceDetail.amount" },
                }
            },
            {
                $project: {
                    _id: 0,
                    categoryid: "$_id._id",
                    amount: "$amount",
                }
            }

        ]).then(data => {
            console.log(data)
            res.status(200).send(data);
        })

    },
    purchasecategorywiseamount(req, res) {

        Purchase.aggregate([
            {
                $match: {
                    isdeleted: 0,
                    purchasedate: {
                        $gte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),
                        $lt: new Date(req.body.tdate),
                    }
                }
            },
            {
                $unwind: "$purchaseDetail"
            },
            {
                $group:
                {
                    _id: {
                        _id: "$purchaseDetail.categoryid",
                    },
                    amount: { $sum: "$purchaseDetail.amount" },
                }
            },
            {
                $project: {
                    _id: 0,
                    categoryid: "$_id._id",
                    amount: "$amount",
                }
            }

        ]).then(data => {
            console.log(data)
            res.status(200).send(data);
        })

    },
    salesreturnlist(req, res) {

        SaleReturn.aggregate([
            {
                $match: {
                    isdeleted: 0,
                    invoicedate: {
                        $gte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),
                        $lt: new Date(req.body.tdate),
                    }
                }

            },
            {
                $lookup: {
                    from: "mastercustomers",
                    "localField": "customerid",
                    "foreignField": "_id",
                    as: "customer"
                }
            },
            {
                $unwind: "$customer"
            },


            {
                $project: {
                    "_id": 1,
                    "invoicedate": { $dateToString: { format: "%d-%m-%Y", date: "$invoicedate" } },
                    "reference": 1,
                    "customername": "$customer.name",
                    "invoiceno": "$invoicereturn_no",
                    "total": 1,

                    invoiceDetail: "$invoiceReturnDetail",

                },

            },
        ]).then(data => {

            res.status(200).send({ data: data });
        })
    },
    salesreturnamount(req, res) {
        var searchStr = {

        };
        SaleReturn.aggregate([
            {
                $match: {
                    isdeleted: 0,
                    invoicedate: {
                        $gte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),
                        $lt: new Date(req.body.tdate),
                    }
                }
            },
            {
                $group:
                {
                    _id: 0,
                    amount: { $sum: "$total" },
                }
            },
            {
                $project: {
                    _id: 0,
                    total: "$amount",
                }
            }

        ]).then(data => {
            console.log(data)
            res.status(200).send(data);
        })

    },
    purchasereturnlist(req, res) {

        PurchaseReturn.aggregate([
            {
                $match: {
                    isdeleted: 0,
                    purchasedate: {
                        $gte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),
                        $lt: new Date(req.body.tdate),
                    }
                }

            },
            {
                $lookup: {
                    from: "mastersuppliers",
                    "localField": "supplierid",
                    "foreignField": "_id",
                    as: "Supplier"
                }

            },
            {
                $unwind: "$Supplier"

            },
            {
                $project: {
                    "_id": 1,
                    "total": 1,
                    "Supplier_name": "$Supplier.name",
                    "purchasereturnno": 1,
                    purchaseRetrunDetail: 1,
                    "purchasedate": { $dateToString: { format: "%d-%m-%Y", date: "$purchasedate" } },
                }
            }
        ]).then(data => {

            res.status(200).send({ data: data });
        })
    },
    purchasereturnamount(req, res) {

        PurchaseReturn.aggregate([
            {
                $match: {
                    isdeleted: 0,
                    purchasedate: {
                        $gte: new Date(new Date(req.body.fdate).toString("yyyy-MM-dd")),
                        $lt: new Date(req.body.tdate),
                    }
                }
            },
            {
                $group:
                {
                    _id: 0,
                    amount: { $sum: "$total" },
                }
            },
            {
                $project: {
                    _id: 0,
                    total: "$amount",
                }
            }

        ]).then(data => {
            console.log(data)
            res.status(200).send(data);
        })

    },
}