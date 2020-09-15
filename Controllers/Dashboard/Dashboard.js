var sales = mongoose.model('sales');
const SaleReturn = mongoose.model('SaleReturn');
var Purchase = mongoose.model('Purchase');
var PurchaseReturn = mongoose.model('PurchaseReturn');
const expense = mongoose.model('expense');
var customer = mongoose.model('mastercustomer');
var supplier = mongoose.model('mastersupplier');
const Product = mongoose.model('MasterProduct');
const moment = require('moment');

require("datejs");

module.exports = {
    saleschart(req, res) {
        var fromDate = moment(req.body.fromdate).add(0, 'days').format("YYYY-MM-DD");
        var toDate = moment(req.body.todate).add(0, 'days').format("YYYY-MM-DD");

        if (req.body.datecount <= 31) {
            sales.aggregate([
                {
                    $match: {
                        isdeleted: 0,
                        invoicedate: {
                            $gte: new Date(fromDate + "T00:00:00.000Z"),
                            $lte: new Date(toDate + "T23:59:59.999Z")
                        },
                        companyid: new mongoose.Types.ObjectId(req.session.companyid),
                        branchid: new mongoose.Types.ObjectId(req.session.branchid)
                    }
                },
                {
                    $group: {

                        _id: { "invoicedate": { $dateToString: { format: "%d-%m-%Y", date: "$invoicedate" } } },
                        total: { $sum: "$total" }
                    }

                },

                {
                    $project: {
                        "invoicedate": "$_id.invoicedate",
                        "total": "$total"
                    }
                },
                { '$sort': { 'invoicedate': 1 } }


            ]).then((data) => {

                res.status(200).send(data)
            })
                .catch((err) => res.status(400).send(err))

        } else if (req.body.datecount <= 365) {
            sales.aggregate([
                {
                    $match: {
                        isdeleted: 0,
                        invoicedate: {
                            $gte: new Date(fromDate + "T00:00:00.000Z"),
                            $lte: new Date(toDate + "T23:59:59.999Z")
                        }
                    }
                },
                {
                    $group: {

                        _id: { $month: "$invoicedate" },
                        total: { $sum: "$total" }
                    }

                },

                {
                    $project: {
                        "invoicedate": "$_id",
                        "total": "$total"
                    }
                },
                { '$sort': { 'invoicedate': 1 } }


            ]).then((data) => {

                res.status(200).send(data)
            })
                .catch((err) => res.status(400).send(err))

        } else {
            res.status(200).send('yr');
        }
    },
    purchasechart(req, res) {
        var fromDate = moment(req.body.fromdate).add(0, 'days').format("YYYY-MM-DD");
        var toDate = moment(req.body.todate).add(0, 'days').format("YYYY-MM-DD");
        if (req.body.datecount <= 31) {
            Purchase.aggregate([
                {
                    $match: {
                        isdeleted: 0,
                        purchasedate: {
                            $gte: new Date(fromDate + "T00:00:00.000Z"),
                            $lte: new Date(toDate + "T23:59:59.999Z")
                        },
                        companyid: new mongoose.Types.ObjectId(req.session.companyid),
                        branchid: new mongoose.Types.ObjectId(req.session.branchid)
                    }
                },
                {
                    $group: {

                        _id: { "purchasedate": { $dateToString: { format: "%d-%m-%Y", date: "$purchasedate" } } },
                        total: { $sum: "$total" }
                    }

                },

                {
                    $project: {
                        "purchasedate": "$_id.purchasedate",
                        "total": "$total"
                    }
                },
                { '$sort': { 'purchasedate': 1 } }


            ]).then((data) => {

                res.status(200).send(data)
            })
                .catch((err) => res.status(400).send(err))

        } else if (req.body.datecount <= 365) {
            Purchase.aggregate([
                {
                    $match: {
                        isdeleted: 0,
                        purchasedate: {
                            $gte: new Date(fromDate + "T00:00:00.000Z"),
                            $lte: new Date(toDate + "T23:59:59.999Z")
                        }
                    }
                },
                {
                    $group: {

                        _id: { $month: "$purchasedate" },
                        total: { $sum: "$total" }
                    }

                },

                {
                    $project: {
                        "purchasedate": "$_id",
                        "total": "$total"
                    }
                },
                { '$sort': { 'purchasedate': 1 } }


            ]).then((data) => {
                console.log(data)
                res.status(200).send(data)
            })
                .catch((err) => res.status(400).send(err))

        } else {
            res.status(200).send('yr');
        }
    },
    totalsales(req, res) {
        var fromDate = moment(req.body.fromdate).add(0, 'days').format("YYYY-MM-DD");
        var toDate = moment(req.body.todate).add(0, 'days').format("YYYY-MM-DD");
        sales.aggregate(
            [
                {
                    $match: {
                        isdeleted: 0,
                        invoicedate: {
                            $gte: new Date(fromDate + "T00:00:00.000Z"),
                            $lte: new Date(toDate + "T23:59:59.999Z")
                        },
                        companyid: new mongoose.Types.ObjectId(req.session.companyid),
                        branchid: new mongoose.Types.ObjectId(req.session.branchid)
                    }
                },

                {
                    $group:
                    {
                        _id: null,
                        totalsales: { $sum: '$total' },

                    }
                },
            ])
            .then((data) => {
                SaleReturn.aggregate([
                    {
                        $match: {
                            isdeleted: 0,
                            invoicedate: {
                                $gte: new Date(fromDate + "T00:00:00.000Z"),
                                $lte: new Date(toDate + "T23:59:59.999Z")
                            },
                            companyid: new mongoose.Types.ObjectId(req.session.companyid),
                            branchid: new mongoose.Types.ObjectId(req.session.branchid)
                        }
                    },
                    {
                        $group:
                        {
                            _id: null,
                            totalsalesreturn: { $sum: '$total' },

                        }
                    },
                ])
                    .then((salesreturn) => {
                        data[0].totalsales = data[0].totalsales - (salesreturn.length == 0 ? 0 : salesreturn[0].totalsalesreturn);
                        return res.status(200).send(data)
                    })

            })
            .catch((error) => {
                return res.status(400).send(error)
            })
    },
    totalpurchases(req, res) {
        var fromDate = moment(req.body.fromdate).add(0, 'days').format("YYYY-MM-DD");
        var toDate = moment(req.body.todate).add(0, 'days').format("YYYY-MM-DD");

        Purchase.aggregate(
            [
                {
                    $match: {
                        isdeleted: 0,
                        purchasedate: {
                            $gte: new Date(fromDate + "T00:00:00.000Z"),
                            $lte: new Date(toDate + "T23:59:59.999Z")
                        },
                        companyid: new mongoose.Types.ObjectId(req.session.companyid),
                        branchid: new mongoose.Types.ObjectId(req.session.branchid)
                    }
                },

                {
                    $group:
                    {
                        _id: null,
                        totalpurchase: { $sum: { "$sum": '$total' } },

                    }
                },


            ])
            .then((data) => {
                PurchaseReturn.aggregate([
                    {
                        $match: {
                            isdeleted: 0,
                            purchasedate: {
                                $gte: new Date(fromDate + "T00:00:00.000Z"),
                                $lte: new Date(toDate + "T23:59:59.999Z")
                            },
                            companyid: new mongoose.Types.ObjectId(req.session.companyid),
                            branchid: new mongoose.Types.ObjectId(req.session.branchid)
                        }
                    },

                    {
                        $group:
                        {
                            _id: null,
                            totalpurchasereturn: { $sum: { "$sum": '$total' } },

                        }
                    },

                ])
                    .then((purchasereturn) => {

                        data[0].totalpurchase = data[0].totalpurchase - (purchasereturn.length == 0 ? 0 : purchasereturn[0].totalpurchasereturn);
                        console.log(data)
                        return res.status(200).send(data)
                    })



            })
            .catch((error) => {
                return res.status(400).send(error)
            })
    },
    totalexpense(req, res) {
        var fromDate = moment(req.body.fromdate).add(0, 'days').format("YYYY-MM-DD");
        var toDate = moment(req.body.todate).add(0, 'days').format("YYYY-MM-DD");


        expense.aggregate([
            {
                $match: {
                    isdeleted: 0,
                    entrydate: {
                        $gte: new Date(fromDate + "T00:00:00.000Z"),
                        $lte: new Date(toDate + "T23:59:59.999Z")
                    },
                    companyid: new mongoose.Types.ObjectId(req.session.companyid),
                    branchid: new mongoose.Types.ObjectId(req.session.branchid)
                },
            },
            {
                $group:
                {
                    _id: null,
                    totalamt: { $sum: { "$sum": '$totalamt' } },
                }
            },
        ])
            .then((data) => {
                console.log(data)
                return res.status(200).send(data)
            })
            .catch((error) => {
                return res.status(400).send(error)
            })
    },
    totalprofit(req, res) {
        try {
            var fromDate = moment(req.body.fromdate).add(0, 'days').format("YYYY-MM-DD");
            var toDate = moment(req.body.todate).add(0, 'days').format("YYYY-MM-DD");

            sales.aggregate(
                [
                    {
                        $match: {
                            isdeleted: 0,
                            invoicedate: {
                                $gte: new Date(fromDate + "T00:00:00.000Z"),
                                $lte: new Date(toDate + "T23:59:59.999Z")
                            },
                            companyid: new mongoose.Types.ObjectId(req.session.companyid),
                            branchid: new mongoose.Types.ObjectId(req.session.branchid)
                        }
                    },

                    {
                        $group:
                        {
                            _id: null,
                            totalsales: { $sum: '$total' },

                        }
                    },


                ])
                .then((salesdata) => {
                    SaleReturn.aggregate([
                        {
                            $match: {
                                isdeleted: 0,
                                invoicedate: {
                                    $gte: new Date(fromDate + "T00:00:00.000Z"),
                                    $lte: new Date(toDate + "T23:59:59.999Z")
                                },
                                companyid: new mongoose.Types.ObjectId(req.session.companyid),
                                branchid: new mongoose.Types.ObjectId(req.session.branchid)
                            }
                        },
                        {
                            $group:
                            {
                                _id: null,
                                totalsalesreturn: { $sum: '$total' },

                            }
                        },
                    ])
                        .then((salesreturn) => {
                            Purchase.aggregate(
                                [
                                    {
                                        $match: {
                                            isdeleted: 0,
                                            purchasedate: {
                                                $gte: new Date(fromDate + "T00:00:00.000Z"),
                                                $lte: new Date(toDate + "T23:59:59.999Z")
                                            },
                                            companyid: new mongoose.Types.ObjectId(req.session.companyid),
                                            branchid: new mongoose.Types.ObjectId(req.session.branchid)
                                        }
                                    },

                                    {
                                        $group:
                                        {
                                            _id: null,
                                            totalpurchase: { $sum: '$total' },

                                        }
                                    },


                                ])
                                .then((purchasedata) => {
                                    PurchaseReturn.aggregate([
                                        {
                                            $match: {
                                                isdeleted: 0,
                                                purchasedate: {
                                                    $gte: new Date(fromDate + "T00:00:00.000Z"),
                                                    $lte: new Date(toDate + "T23:59:59.999Z")
                                                },
                                                companyid: new mongoose.Types.ObjectId(req.session.companyid),
                                                branchid: new mongoose.Types.ObjectId(req.session.branchid)
                                            }
                                        },

                                        {
                                            $group:
                                            {
                                                _id: null,
                                                totalpurchasereturn: { $sum: { "$sum": '$total' } },

                                            }
                                        },

                                    ])
                                        .then((purchasereturn) => {

                                            expense.aggregate([
                                                {
                                                    $match: {
                                                        isdeleted: 0,
                                                        entrydate: {
                                                            $gte: new Date(fromDate + "T00:00:00.000Z"),
                                                            $lte: new Date(toDate + "T23:59:59.999Z")
                                                        },
                                                        companyid: new mongoose.Types.ObjectId(req.session.companyid),
                                                        branchid: new mongoose.Types.ObjectId(req.session.branchid)
                                                    },
                                                },
                                                {
                                                    $group:
                                                    {
                                                        _id: null,
                                                        totalamt: { $sum: { "$sum": '$totalamt' } },

                                                    }
                                                },

                                            ])
                                                .then((expensedata) => {

                                                    let salesamount, purchaseamount, expenseamount = 0;

                                                    if (salesdata.length == 0) {
                                                        salesamount = 0 + (salesreturn.length == 0 ? 0 : salesreturn[0].totalsalesreturn)
                                                    }
                                                    else {
                                                        salesamount = salesdata[0].totalsales + (salesreturn.length == 0 ? 0 : salesreturn[0].totalsalesreturn)
                                                    }
                                                    if (purchasedata.length == 0) {
                                                        purchaseamount = 0 + (purchasereturn.length == 0 ? 0 : purchasereturn[0].totalpurchasereturn)

                                                    } else {
                                                        purchaseamount = purchasedata[0].totalpurchase + (purchasereturn.length == 0 ? 0 : purchasereturn[0].totalpurchasereturn)
                                                    }
                                                    if (expensedata.length == 0) {
                                                        expenseamount = 0
                                                    }
                                                    else {
                                                        expenseamount = expensedata[0].totalamt;
                                                    }
                                                    let profit = salesamount - (purchaseamount + expenseamount)
                                                    return res.status(200).send({ data: profit })
                                                })
                                                .catch((error) => {
                                                    return res.status(400).send(error)
                                                })
                                        })



                                })
                                .catch((error) => {
                                    return res.status(400).send(error)
                                })

                        })


                })
                .catch((error) => {
                    return res.status(400).send(error)
                })
        }
        catch (err) {
            return res.status(400).send(err)
        }
    },
    totalcustomeroutstanding(req, res) {
        var fromDate = moment(req.body.fromdate).add(0, 'days').format("YYYY-MM-DD");
        var toDate = moment(req.body.todate).add(0, 'days').format("YYYY-MM-DD");

        customer.aggregate([{
            $match: {

                isdeleted: 0,
                companyid: new mongoose.Types.ObjectId(req.session.companyid),
                branchid: new mongoose.Types.ObjectId(req.session.branchid)
            }
        },
        {
            $lookup: {
                from: "sales",
                "let": { "id": "$_id" },
                "pipeline": [{
                    "$match": {
                        isdeleted: 0,
                        invoicedate: {
                            $gte: new Date(fromDate + "T00:00:00.000Z"),
                            $lte: new Date(toDate + "T23:59:59.999Z")
                        },
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
            $group: {
                _id: null,

                pendingamount: { $sum: { $subtract: [{ "$sum": '$invoice.total' }, { "$sum": '$receipt.PaymentDetail.payedamount' }] } },
                paidamount: { "$sum": '$receipt.PaymentDetail.payedamount' },
                total: { $sum: { "$sum": '$invoice.total' } }
            }
        },
        {
            $project: {
                _id: 0,
                'pendingamount': "$pendingamount",
                paidamount: "$paidamount",
                total: "$total"


            }
        }
        ])
            .then(data => {
                console.log(data)
                res.status(200).send(data);
            })
    },
    totalsupplieroutstanding(req, res) {
        var fromDate = moment(req.body.fromdate).add(0, 'days').format("YYYY-MM-DD");
        var toDate = moment(req.body.todate).add(0, 'days').format("YYYY-MM-DD");


        supplier.aggregate([{
            $match: {

                isdeleted: 0,
                companyid: new mongoose.Types.ObjectId(req.session.companyid),
                branchid: new mongoose.Types.ObjectId(req.session.branchid)
            }
        },
        {
            $lookup: {
                from: "purchases",
                "let": { "id": "$_id" },
                "pipeline": [{
                    "$match": {
                        isdeleted: 0,
                        purchasedate: {
                            $gte: new Date(fromDate + "T00:00:00.000Z"),
                            $lte: new Date(toDate + "T23:59:59.999Z")
                        },
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
            $group: {
                _id: null,
                pendingamount: { $sum: { $subtract: [{ "$sum": '$purchase.total' }, { "$sum": '$balancepayment.PaymentDetail.payedamount' }] } }
            }

        },
        {
            $project: {
                name: "$_id.name",
                'pendingamount': "$pendingamount",
            }
        }
        ])
            .then(data => {

                res.status(200).send(data);
            })
    },
    totalcustomer(req, res) {
        customer.aggregate(
            [
                {
                    $match: {
                        isdeleted: 0,
                        createddate: {
                            $gte: new Date(fromDate + "T00:00:00.000Z"),
                            $lte: new Date(toDate + "T23:59:59.999Z")
                        },
                        companyid: new mongoose.Types.ObjectId(req.session.companyid),
                        branchid: new mongoose.Types.ObjectId(req.session.branchid)
                    }
                },
                { $count: "customercount" }
            ])
            .then((data) => {

                return res.status(200).send(data)
            })
            .catch((error) => {
                return res.status(400).send(error)
            })
    },
    totalsupplier(req, res) {
        supplier.aggregate(
            [
                {
                    $match: {
                        isdeleted: 0,
                        createddate: {
                            $gte: new Date(new Date(req.body.fromdate).toString("yyyy-MM-dd")),
                            $lt: new Date(req.body.todate)
                        }
                    }
                },
                { $count: "suppliercount" }


            ])
            .then((data) => {

                return res.status(200).send(data)
            })
            .catch((error) => {
                return res.status(400).send(error)
            })
    },
    purchaseamountdetails(req, res) {
        var fromDate = moment(req.body.fromdate).add(0, 'days').format("YYYY-MM-DD");
        var toDate = moment(req.body.todate).add(0, 'days').format("YYYY-MM-DD");

        console.log('ssssss')
        Purchase.aggregate([
            {
                $match: {
                    isdeleted: 0,
                    purchasedate: {
                        $gte: new Date(fromDate + "T00:00:00.000Z"),
                        $lte: new Date(toDate + "T23:59:59.999Z")
                    },
                    companyid: new mongoose.Types.ObjectId(req.session.companyid),
                    branchid: new mongoose.Types.ObjectId(req.session.branchid)
                },

            },


            {
                $lookup: {

                    from: "payments",
                    "let": { "purchase_id": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$PaymentDetail"
                        },
                        {
                            "$match": {
                                isdeleted: 0,
                                type: "supplier",
                                "$expr": {
                                    $and: [
                                        { $eq: ["$PaymentDetail.trans_id", "$$purchase_id"] },
                                    ]
                                },
                            }
                        }],
                    as: "balancepayment",
                }
            },
            {
                $group:
                {
                    _id: null,
                    totalpurchase: { "$sum": "$total" },
                    payedamount: { "$sum": '$balancepayment.PaymentDetail.payedamount' },
                    totalpay: { "$sum": '$balancepayment.PaymentDetail.payedamount' },
                    totalbalance: { $sum: { $subtract: [{ "$sum": '$total' }, { "$sum": '$balancepayment.PaymentDetail.payedamount' }] } },
                    overdue: {
                        $sum: {
                            $cond: [
                                { $lte: ["$duedate", (new Date())] }
                                ,
                                { $sum: { $subtract: [{ "$sum": '$total' }, { "$sum": '$balancepayment.PaymentDetail.payedamount' }] } },

                                0
                            ]
                        }
                    },

                },
            },

            {
                $project: {
                    _id: 0,
                    _id: "$_id",
                    totalpurchase: "$totalpurchase",
                    totalpay: "$totalpay",
                    //  balancepayment: 1,
                    overdue: "$overdue",
                    payedamount: "$payedamount",
                    dueamount: { $subtract: ["$totalbalance", "$overdue"] }
                }
            }

        ])
            .then((data) => res.status(200).send(data))
            .catch((err) => res.status(400).send(err))

    },
    salesamountdetails(req, res) {
        var fromDate = moment(req.body.fromdate).add(0, 'days').format("YYYY-MM-DD");
        var toDate = moment(req.body.todate).add(0, 'days').format("YYYY-MM-DD");

        sales.aggregate([{
            $match: {
                isdeleted: 0,
                invoicedate: {
                    $gte: new Date(fromDate + "T00:00:00.000Z"),
                    $lte: new Date(toDate + "T23:59:59.999Z")
                },
                companyid: new mongoose.Types.ObjectId(req.session.companyid),
                branchid: new mongoose.Types.ObjectId(req.session.branchid)
            }
        },

        {
            $lookup: {

                from: "payments",
                "let": { "purchase_id": "$_id" },
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
                                    { $eq: ["$PaymentDetail.trans_id", "$$purchase_id"] },
                                ]
                            },
                        }
                    }],
                as: "receipt",
            }
        },
        {
            $group:
            {
                _id: null,
                totalsales: { "$sum": "$total" },
                totalpay: { "$sum": '$receipt.PaymentDetail.payedamount' },
                totalbalance: { $sum: { $subtract: [{ "$sum": '$total' }, { "$sum": '$receipt.PaymentDetail.payedamount' }] } },
                overdue: {
                    $sum: {
                        $cond: [
                            { $lte: ["$duedate", (new Date())] }
                            ,
                            { $sum: { $subtract: [{ "$sum": '$total' }, { "$sum": '$receipt.PaymentDetail.payedamount' }] } },
                            0]
                    }
                },

            },



        },
        {
            $project: {
                _id: "$_id",
                totalsales: "$totalsales",
                totalpay: "$totalpay",
                overdue: "$overdue",
                totalbalance: "$totalbalance",
                dueamount: { $subtract: ["$totalbalance", "$overdue"] }
            }
        }

        ])
            .then((data) => res.status(200).send(data))
            .catch((err) => res.status(400).send(err))
    },
    customeroutstanding(req, res) {
        var fromDate = moment(req.body.fromdate).add(0, 'days').format("YYYY-MM-DD");
        var toDate = moment(req.body.todate).add(0, 'days').format("YYYY-MM-DD");


        customer.aggregate([{
            $match: {

                isdeleted: 0,
                companyid: new mongoose.Types.ObjectId(req.session.companyid),
                branchid: new mongoose.Types.ObjectId(req.session.branchid)
            }
        },
        {
            $lookup: {
                from: "sales",
                "let": { "id": "$_id" },
                "pipeline": [{
                    "$match": {
                        isdeleted: 0,
                        invoicedate: {
                            $gte: new Date(fromDate + "T00:00:00.000Z"),
                            $lte: new Date(toDate + "T23:59:59.999Z")
                        },
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
            $group: {
                _id: { _id: "$_id", name: "$name", mobile: "$mobile" },

                pendingamount: { $sum: { $subtract: [{ "$sum": '$invoice.total' }, { "$sum": '$receipt.PaymentDetail.payedamount' }] } },
            }
        },
        {
            $project: {
                _id: 0,
                name: "$_id.name",
                mobile: "$_id.mobile",
                'pendingamount': "$pendingamount"


            }
        }
        ])
            .then(data => {
                console.log(data)
                res.status(200).send({ data: data });
            })
    },
    supplieroutstanding(req, res) {

        var fromDate = moment(req.body.fromdate).add(0, 'days').format("YYYY-MM-DD");
        var toDate = moment(req.body.todate).add(0, 'days').format("YYYY-MM-DD");


        supplier.aggregate([{
            $match: {

                isdeleted: 0,
                companyid: new mongoose.Types.ObjectId(req.session.companyid),
                branchid: new mongoose.Types.ObjectId(req.session.branchid)
            }
        },
        {
            $lookup: {
                from: "purchases",
                "let": { "id": "$_id" },
                "pipeline": [{
                    "$match": {
                        isdeleted: 0,
                        purchasedate: {
                            $gte: new Date(fromDate + "T00:00:00.000Z"),
                            $lte: new Date(toDate + "T23:59:59.999Z")
                        },
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
            $group: {
                _id: { _id: "$_id", name: "$name", mobile: "$mobile" },
                pendingamount: { $sum: { $subtract: [{ "$sum": '$purchase.total' }, { "$sum": '$balancepayment.PaymentDetail.payedamount' }] } }
            }

        },
        {
            $project: {
                name: "$_id.name",
                mobile: "$_id.mobile",
                'pendingamount': "$pendingamount",
            }
        }
        ])
            .then(data => {
                console.log(data)
                res.status(200).send({ data: data });
            })
    },
    top3productsales(req, res) {
        var fromDate = moment(req.body.fromdate).add(0, 'days').format("YYYY-MM-DD");
        var toDate = moment(req.body.todate).add(0, 'days').format("YYYY-MM-DD");

        sales.aggregate(
            [
                {
                    $match: {
                        isdeleted: 0,
                        invoicedate: {
                            $gte: new Date(fromDate + "T00:00:00.000Z"),
                            $lte: new Date(toDate + "T23:59:59.999Z")
                        },
                        companyid: new mongoose.Types.ObjectId(req.session.companyid),
                        branchid: new mongoose.Types.ObjectId(req.session.branchid)
                    }
                },
                {
                    $unwind: "$invoiceDetail"
                },
                {
                    "$lookup": {
                        "from": "masterproducts",
                        "localField": "invoiceDetail.productid",
                        "foreignField": "_id",
                        "as": "MP"
                    }
                },
                {
                    $group:
                    {
                        _id: { _id: "$invoiceDetail.productid", name: "$MP.productname" },
                        itemsSold: { $sum: "$invoiceDetail.qty" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: "$_id.name",
                        saleqty: "$itemsSold",

                    }
                },
                { $sort: { saleqty: -1 } },
                { $limit: 3 }

            ])
            .then((data) => {
                sales.aggregate(
                    [
                        {
                            $match: {
                                isdeleted: 0,
                                invoicedate: {
                                    $gte: new Date(fromDate + "T00:00:00.000Z"),
                                    $lte: new Date(toDate + "T23:59:59.999Z")
                                }
                            }
                        },
                        {
                            $unwind: "$invoiceDetail"
                        },
                        {
                            "$lookup": {
                                "from": "masterproducts",
                                "localField": "invoiceDetail.productid",
                                "foreignField": "_id",
                                "as": "MP"
                            }
                        },
                        {
                            $group:
                            {
                                _id: null,
                                itemsSold: { $sum: "$invoiceDetail.qty" }
                            }
                        },
                        { '$sort': { itemsSold: -1 } }

                    ])
                    .then((totalsaleqtydetails) => {
                        return res.status(200).send({ salesproductdetails: data, totalsalesqtydeatils: totalsaleqtydetails })
                    }).catch((error) => {
                        return res.status(400).send(error)
                    })


            })
            .catch((error) => {
                return res.status(400).send(error)
            })
    },
    top10productsales(req, res) {
        var fromDate = moment(req.body.fromdate).add(0, 'days').format("YYYY-MM-DD");
        var toDate = moment(req.body.todate).add(0, 'days').format("YYYY-MM-DD");

        sales.aggregate(
            [
                {
                    $match: {
                        isdeleted: 0,
                        invoicedate: {
                            $gte: new Date(fromDate + "T00:00:00.000Z"),
                            $lte: new Date(toDate + "T23:59:59.999Z")
                        },
                        companyid: new mongoose.Types.ObjectId(req.session.companyid),
                        branchid: new mongoose.Types.ObjectId(req.session.branchid)
                    }
                },
                {
                    $unwind: "$invoiceDetail"
                },
                {
                    "$lookup": {
                        "from": "masterproducts",
                        "localField": "invoiceDetail.productid",
                        "foreignField": "_id",
                        "as": "MP"
                    }
                },
                {
                    $group:
                    {
                        _id: { _id: "$invoiceDetail.productid", name: "$MP.productname" },
                        itemsSold: { $sum: "$invoiceDetail.qty" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: "$_id.name",
                        saleqty: "$itemsSold",

                    }
                },
                { $sort: { saleqty: -1 } },
                { $limit: 10 }

            ])
            .then((data) => {

                return res.status(200).send({ salesproductdetails: data })



            })
            .catch((error) => {
                return res.status(400).send(error)
            })
    },
    top3expenses(req, res) {
        var fromDate = moment(req.body.fromdate).add(0, 'days').format("YYYY-MM-DD");
        var toDate = moment(req.body.todate).add(0, 'days').format("YYYY-MM-DD");

        expense.aggregate(
            [
                {
                    $match: {
                        isdeleted: 0,
                        entrydate: {
                            $gte: new Date(fromDate + "T00:00:00.000Z"),
                            $lte: new Date(toDate + "T23:59:59.999Z")
                        },
                        companyid: new mongoose.Types.ObjectId(req.session.companyid),
                        branchid: new mongoose.Types.ObjectId(req.session.branchid)
                    }
                },
                {
                    $unwind: "$expansedetail"
                },

                {
                    $group:
                    {
                        _id: null,
                        expenseamount: { $sum: "$expansedetail.amount" }
                    }
                },
                {
                    $project: {
                        _id: 0,

                        expenseamount: "$expenseamount",
                    }
                },

            ]).then((data) => {
                expense.aggregate(
                    [
                        {
                            $match: {
                                isdeleted: 0,
                                entrydate: {
                                    $gte: new Date(fromDate + "T00:00:00.000Z"),
                                    $lte: new Date(toDate + "T23:59:59.999Z")
                                }
                            }
                        },
                        {
                            $unwind: "$expansedetail"
                        },
                        {
                            "$lookup": {
                                "from": "masterexpanses",
                                "localField": "expansedetail.expanseid",
                                "foreignField": "_id",
                                "as": "ME"
                            }
                        },
                        {
                            $group:
                            {
                                _id: { _id: "$expansedetail.expanseid", name: "$ME.expansename" },
                                expenseamount: { $sum: "$expansedetail.amount" }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                name: "$_id.name",
                                expenseamount: "$expenseamount",
                            }
                        },
                        {
                            $sort: { expenseamount: -1 }
                        },

                        { $limit: 3 },



                    ])
                    .then((data2) => {

                        return res.status(200).send({ expensedata: data2, expenseamount: data[0].expenseamount })
                    })
                    .catch((error) => {
                        return res.status(400).send(error)
                    })

            })
            .catch((error) => {
                return res.status(400).send(error)
            })

    },
    saleslist(req, res) {
        var fromDate = moment(req.body.fromdate).add(0, 'days').format("YYYY-MM-DD");
        var toDate = moment(req.body.todate).add(0, 'days').format("YYYY-MM-DD");

        sales.aggregate(
            [{
                $match: {
                    isdeleted: 0,
                    invoicedate: {
                        $gte: new Date(fromDate + "T00:00:00.000Z"),
                        $lte: new Date(toDate + "T23:59:59.999Z")
                    },
                    companyid: new mongoose.Types.ObjectId(req.session.companyid),
                    branchid: new mongoose.Types.ObjectId(req.session.branchid)
                }
            },
            {
                $lookup: {

                    from: "payments",
                    "let": { "purchase_id": "$_id" },
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
                                        { $eq: ["$PaymentDetail.trans_id", "$$purchase_id"] },
                                    ]
                                },
                            }
                        }],
                    as: "receiptpayment",
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
            { $unwind: "$customer" },
            {
                $project: {
                    "_id": 1,
                    "reference": 1,
                    "customer.name": 1,
                    "invoiceno": 1,
                    "total": 1,
                    "dueamount": { $subtract: ['$total', { "$sum": '$receiptpayment.PaymentDetail.payedamount' }] },
                    "status": {
                        $cond: [{ $lt: [(new Date()), "$duedate"] }, 'Due', 'OverDue'],
                    },
                    duedays: { $trunc: { $divide: [{ $subtract: ["$duedate", new Date()] }, (1000 * 60 * 60 * 24)] } },
                    'balancedueamount': { $subtract: ['$total', { "$sum": '$receiptpayment.PaymentDetail.payedamount' }] }
                },
            },
            {
                $match: {
                    balancedueamount: { $gt: 0 }
                }
            },
            {
                "$sort": { 'duedays': 1 }
            }
            ])
            .then(data => {

                res.status(200).send({ data: data });
            })
    },
    purchaselist(req, res) {
        var fromDate = moment(req.body.fromdate).add(0, 'days').format("YYYY-MM-DD");
        var toDate = moment(req.body.todate).add(0, 'days').format("YYYY-MM-DD");

        Purchase.aggregate(
            [{
                $match: {
                    "isdeleted": 0,
                    companyid: new mongoose.Types.ObjectId(req.session.companyid),
                    branchid: new mongoose.Types.ObjectId(req.session.branchid),
                    purchasedate: {
                        $gte: new Date(fromDate + "T00:00:00.000Z"),
                        $lte: new Date(toDate + "T23:59:59.999Z")
                    },
                }
            },

            {
                $lookup: {

                    from: "payments",
                    "let": { "purchase_id": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$PaymentDetail"
                        },
                        {
                            "$match": {
                                isdeleted: 0,
                                type: "supplier",
                                "$expr": {
                                    $and: [
                                        { $eq: ["$PaymentDetail.trans_id", "$$purchase_id"] },
                                    ]
                                },
                            }
                        }],
                    as: "balancepayment",
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
                    "purchasedate": { $dateToString: { format: "%d-%m-%Y", date: "$purchasedate" } },
                    "Supplier.name": 1,
                    "purchaseorderno": 1,
                    "total": 1,
                    creditdays: 1,
                    "status": {
                        $cond: [{ $lt: [(new Date()), "$duedate"] }, 'Due', 'OverDue'],
                    },
                    duedays: { $trunc: { $divide: [{ $subtract: ["$duedate", new Date()] }, (1000 * 60 * 60 * 24)] } },
                    'dueamount': { $subtract: ['$total', { "$sum": '$balancepayment.PaymentDetail.payedamount' }] }
                }
            },
            {
                $match: {
                    dueamount: { $gt: 0 }
                }
            },
            {
                "$sort": { 'duedays': 1 }
            }

            ])
            .then(data => {

                res.status(200).send({ data: data });
            })
    },
    incomevsexpense(req, res) {
        var fromDate = moment(req.body.fromdate).add(0, 'days').format("YYYY-MM-DD");
        var toDate = moment(req.body.todate).add(0, 'days').format("YYYY-MM-DD");

        if (req.body.datecount <= 31) {
            Purchase.aggregate([
                {
                    $match: {
                        isdeleted: 0,
                        purchasedate: {
                            $gte: new Date(fromDate + "T00:00:00.000Z"),
                            $lte: new Date(toDate + "T23:59:59.999Z")
                        },
                        companyid: new mongoose.Types.ObjectId(req.session.companyid),
                        branchid: new mongoose.Types.ObjectId(req.session.branchid)
                    }
                },
                {
                    $group: {

                        _id: { formated_date: { $dateToString: { format: "%d-%m-%Y", date: "$purchasedate" } } },

                        total: { $sum: "$total" }
                    }

                },
                {
                    $project: {
                        "purchasedate": "$_id.formated_date",
                        "total": "$total",
                        formated_date: "$_id.formated_date"
                    }
                },
                { '$sort': { purchasedate: 1 } }
            ]).then((data) => {
                expense.aggregate([
                    {
                        $match: {
                            isdeleted: 0,
                            entrydate: {
                                $gte: new Date(fromDate + "T00:00:00.000Z"),
                                $lte: new Date(toDate + "T23:59:59.999Z")
                            },
                            companyid: new mongoose.Types.ObjectId(req.session.companyid),
                            branchid: new mongoose.Types.ObjectId(req.session.branchid)
                        }
                    },
                    {
                        $group: {

                            _id: { "formated_date": { $dateToString: { format: "%d-%m-%Y", date: "$entrydate" } } },
                            total: { $sum: "$totalamt" }
                        }

                    },
                    {
                        $project: {
                            "entrydate": "$_id.formated_date",
                            formated_date: "$_id.formated_date",
                            "total": "$total"
                        }
                    },
                    { '$sort': { entrydate: 1 } }
                ]).then((expensedata) => {
                    sales.aggregate([
                        {
                            $match: {
                                isdeleted: 0,
                                invoicedate: {
                                    $gte: new Date(fromDate + "T00:00:00.000Z"),
                                    $lte: new Date(toDate + "T23:59:59.999Z")
                                },
                                companyid: new mongoose.Types.ObjectId(req.session.companyid),
                                branchid: new mongoose.Types.ObjectId(req.session.branchid)
                            }
                        },
                        {
                            $group: {


                                _id: { formated_date: { $dateToString: { format: "%d-%m-%Y", date: "$invoicedate" } } },
                                total: { $sum: "$total" }
                            }

                        },

                        {
                            $project: {
                                "invoicedate": "$_id.formated_date",
                                "total": "$total",
                                formated_date: "$_id.formated_date"
                            }
                        },
                        { '$sort': { invoicedate: 1 } }
                    ]).then((salesdata) => {

                        res.status(200).send({ purchasedata: data, expensedata: expensedata, salesdata: salesdata })
                        // res.status(200).send(data)
                    })
                        .catch((err) => res.status(400).send(err))

                })

            })
                .catch((err) => res.status(400).send(err))
        }
        else {
            Purchase.aggregate([
                {
                    $match: {
                        isdeleted: 0,
                        type: 'purchase',
                        purchasedate: {
                            $gte: new Date(fromDate + "T00:00:00.000Z"),
                            $lte: new Date(toDate + "T23:59:59.999Z")
                        },
                        companyid: new mongoose.Types.ObjectId(req.session.companyid),
                        branchid: new mongoose.Types.ObjectId(req.session.branchid)
                    }
                },
                {
                    $group: {

                        _id: { $month: "$purchasedate" },
                        total: { $sum: "$total" }
                    }

                },

                {
                    $project: {
                        "month": "$_id",
                        "total": "$total"
                    }
                },
                { '$sort': { 'month': 1 } }


            ]).then((data) => {
                expense.aggregate([
                    {
                        $match: {
                            isdeleted: 0,
                            entrydate: {
                                $gte: new Date(fromDate + "T00:00:00.000Z"),
                                $lte: new Date(toDate + "T23:59:59.999Z")
                            },
                            companyid: new mongoose.Types.ObjectId(req.session.companyid),
                            branchid: new mongoose.Types.ObjectId(req.session.branchid)
                        }
                    },
                    {
                        $group: {

                            _id: { $month: "$entrydate" },
                            total: { $sum: "$totalamt" }
                        }

                    },

                    {
                        $project: {
                            "month": "$_id",
                            "total": "$total"
                        }
                    },
                    { '$sort': { 'month': 1 } }
                ]).then((expensedata) => {

                    sales.aggregate([
                        {
                            $match: {
                                isdeleted: 0,
                                invoicedate: {
                                    $gte: new Date(fromDate + "T00:00:00.000Z"),
                                    $lte: new Date(toDate + "T23:59:59.999Z")
                                },
                                companyid: new mongoose.Types.ObjectId(req.session.companyid),
                                branchid: new mongoose.Types.ObjectId(req.session.branchid)

                            }
                        },
                        {
                            $group: {

                                _id: { $month: "$invoicedate" },
                                total: { $sum: "$total" }
                            }

                        },

                        {
                            $project: {
                                "month": "$_id",
                                "total": "$total"
                            }
                        },
                        { '$sort': { 'month': 1 } }


                    ]).then((salesdata) => {
                        console.log('purchasedata' + data)
                        res.status(200).send({ purchasedata: data, expensedata: expensedata, salesdata: salesdata })
                        // res.status(200).send(data)
                    })
                        .catch((err) => res.status(400).send(err))
                })
            })
                .catch((err) => res.status(400).send(err))

        }


    },
    profit_musthifr_method(req, res) {
       
        var fromDate = moment(req.body.fromdate).add(0, 'days').format("YYYY-MM-DD");
        var toDate = moment(req.body.todate).add(0, 'days').format("YYYY-MM-DD");
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
                                    $gte: new Date(fromDate + "T00:00:00.000Z"),
                                    $lte: new Date(toDate + "T23:59:59.999Z")
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
                                    $gte: new Date(fromDate + "T00:00:00.000Z"),
                                    $lte: new Date(toDate + "T23:59:59.999Z")
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
                                    $gte: new Date(fromDate + "T00:00:00.000Z"),
                                    $lte: new Date(toDate + "T23:59:59.999Z")
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
                                    $gte: new Date(fromDate + "T00:00:00.000Z"),
                                    $lte: new Date(toDate + "T23:59:59.999Z")
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
                                    $lte: new Date(new Date(req.body.fromdate).toString("yyyy-MM-dd")),

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
                                    $lte: new Date(new Date(req.body.fromdate).toString("yyyy-MM-dd")),
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
                                    $lte: new Date(new Date(req.body.fromdate).toString("yyyy-MM-dd")),
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
                                    $lt: new Date(new Date(req.body.fromdate).toString("yyyy-MM-dd")),

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
                        purchaseprice: "$purchaseprice",
                        salesprice: "$salesprice",
                        salesqty: { $sum: "$salesdetail.invoiceDetail.qty" },
                        salesreturnqty: { $sum: "$salesreturndetail.invoiceReturnDetail.qty" },
                        openingstock: "$openingstock",
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
                    _id:0,
                    productname: "$_id.productname",
                    purchaseprice: "$_id.purchaseprice",
                    salesprice: "$_id.salesprice",
                    openingstock: {
                        $subtract: [
                            { $add: ["$_id.openingstock","$_id.purchaseqty", { $subtract: ["$_id.previous_purchaseqty", "$_id.previous_purchasereturnqty"] },] },
                            { $subtract: ["$_id.previous_salesqty", "$_id.previous_salesreturnqty"] },
                         ]
                    },
                    salesqty:
                        { $subtract: ["$_id.salesqty", "$_id.salesreturnqty"] },
                    closingstock: {
                        $subtract: [
                            { $add: ["$_id.openingstock", { $subtract: ["$_id.purchaseqty", "$_id.purchasereturnqty"] }, { $subtract: ["$_id.previous_purchaseqty", "$_id.previous_purchasereturnqty"] },] },
                            { $add: [{ $subtract: ["$_id.salesqty", "$_id.salesreturnqty"] }, { $subtract: ["$_id.previous_salesqty", "$_id.previous_salesreturnqty"] }] },

                        ]

                    }
                }
            },
            { $sort: { productname: 1, } }
        ])
            .then((incomedata) => {

                res.status(200).send(incomedata)
            })
            .catch((err) => res.status(400).send(err))

    }

}