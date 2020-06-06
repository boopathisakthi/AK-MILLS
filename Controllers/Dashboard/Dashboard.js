var sales = mongoose.model('sales');
var Purchase = mongoose.model('Purchase');
const expense = mongoose.model('expense');
var customer = mongoose.model('mastercustomer');
var supplier = mongoose.model('mastersupplier');

module.exports = {
    saleschart(req, res) {

        if (req.body.datecount <= 31) {
            sales.aggregate([
                {
                    $match: {
                        isdeleted: 0,
                        invoicedate: {
                            $gte: new Date(req.body.fromdate),
                            $lt: new Date(req.body.todate)
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
                            $gte: new Date(req.body.fromdate),
                            $lt: new Date(req.body.todate)
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

        if (req.body.datecount <= 31) {
            Purchase.aggregate([
                {
                    $match: {
                        isdeleted: 0,
                        purchasedate: {
                            $gte: new Date(req.body.fromdate),
                            $lt: new Date(req.body.todate)
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
                            $gte: new Date(req.body.fromdate),
                            $lt: new Date(req.body.todate)
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
        sales.aggregate(
            [
                {
                    $match: {
                        isdeleted: 0,
                        invoicedate: {
                            $gte: new Date(req.body.fromdate),
                            $lt: new Date(req.body.todate)
                        },
                        companyid: new mongoose.Types.ObjectId(req.session.companyid),
                        branchid: new mongoose.Types.ObjectId(req.session.branchid)
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
                                        { $eq: ["$sale_id", "$$id"] },
                                    ]
                                },
                            }
                        }],
                        as: "salereturn",
                    }
                },
                {
                    $group:
                    {
                        _id: null,
                        totalsales: { $sum: { $subtract: [{ "$sum": '$total' }, { "$sum": '$salereturn.total' }] } },

                    }
                },


            ])
            .then((data) => {
                return res.status(200).send(data)
            })
            .catch((error) => {
                return res.status(400).send(error)
            })
    },
    totalpurchases(req, res) {
        Purchase.aggregate(
            [
                {
                    $match: {
                        isdeleted: 0,
                        purchasedate: {
                            $gte: new Date(req.body.fromdate),
                            $lt: new Date(req.body.todate)
                        },
                        companyid: new mongoose.Types.ObjectId(req.session.companyid),
                        branchid: new mongoose.Types.ObjectId(req.session.branchid)
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
                                        { $eq: ["$purchase_id", "$$id"] },
                                    ]
                                },
                            }
                        }],
                        as: "purchasereturns",
                    }
                },
                {
                    $group:
                    {
                        _id: null,
                        totalpurchase: { $sum: { $subtract: [{ "$sum": '$total' }, { "$sum": '$purchasereturns.total' }] } },

                    }
                },


            ])
            .then((data) => {
                return res.status(200).send(data)
            })
            .catch((error) => {
                return res.status(400).send(error)
            })
    },
    totalexpense(req, res) {
        expense.aggregate([
            {
                $match: {
                    isdeleted: 0,
                    entrydate: {
                        $gte: new Date(req.body.fromdate),
                        $lt: new Date(req.body.todate)
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
            sales.aggregate(
                [
                    {
                        $match: {
                            isdeleted: 0,
                            invoicedate: {
                                $gte: new Date(req.body.fromdate),
                                $lt: new Date(req.body.todate)
                            },
                            companyid: new mongoose.Types.ObjectId(req.session.companyid),
                            branchid: new mongoose.Types.ObjectId(req.session.branchid)
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
                                            { $eq: ["$sale_id", "$$id"] },
                                        ]
                                    },
                                }
                            }],
                            as: "salereturn",
                        }
                    },
                    {
                        $group:
                        {
                            _id: null,
                            totalsales: { $sum: { $subtract: [{ "$sum": '$total' }, { "$sum": '$salereturn.total' }] } },

                        }
                    },


                ])
                .then((salesdata) => {

                    Purchase.aggregate(
                        [
                            {
                                $match: {
                                    isdeleted: 0,
                                    purchasedate: {
                                        $gte: new Date(req.body.fromdate),
                                        $lt: new Date(req.body.todate)
                                    },
                                    companyid: new mongoose.Types.ObjectId(req.session.companyid),
                                    branchid: new mongoose.Types.ObjectId(req.session.branchid)
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
                                                    { $eq: ["$purchase_id", "$$id"] },
                                                ]
                                            },
                                        }
                                    }],
                                    as: "purchasereturns",
                                }
                            },
                            {
                                $group:
                                {
                                    _id: null,
                                    totalpurchase: { $sum: { $subtract: [{ "$sum": '$total' }, { "$sum": '$purchasereturns.total' }] } },

                                }
                            },


                        ])
                        .then((purchasedata) => {
                            expense.aggregate([
                                {
                                    $match: {
                                        isdeleted: 0,
                                        entrydate: {
                                            $gte: new Date(req.body.fromdate),
                                            $lt: new Date(req.body.todate)
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
                                        salesamount = 0
                                    }
                                    else {
                                        salesamount = salesdata[0].totalsales
                                    }
                                    if (purchasedata.length == 0) {
                                        purchaseamount = 0
                                    } else {
                                        purchaseamount = purchasedata[0].totalpurchase
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
                        .catch((error) => {
                            return res.status(400).send(error)
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
                            $gte: new Date(req.body.fromdate),
                            $lt: new Date(req.body.todate)
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
            $group: {
                _id: null,
               
                pendingamount: { $sum: { $subtract: [{ "$sum": '$invoice.total' }, { $add: [{ "$sum": '$salereturn.total' }, { "$sum": '$receipt.PaymentDetail.payedamount' }] }] } },
                paidamount:{$sum:{ $add: [{ "$sum": '$salereturn.total' }, { "$sum": '$receipt.PaymentDetail.payedamount' }] }},
                total:{$sum:{ "$sum": '$invoice.total' }}
            }
        },
        {
            $project: {
                _id: 0,
                'pendingamount': "$pendingamount",
                paidamount:"$paidamount",
                total:"$total"
               

            }
        }
        ])
            .then(data => {
                console.log(data)
                res.status(200).send(data);
            })
    },
    totalsupplieroutstanding(req, res) {

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
                            $gte: new Date(req.body.fromdate),
                            $lt: new Date(req.body.todate)
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
            $group: {
                _id: null,
                pendingamount: { $sum: { $subtract: [{ "$sum": '$purchase.total' }, { $add: [{ "$sum": '$purchasereturn.total' }, { "$sum": '$balancepayment.PaymentDetail.payedamount' }] }] } }
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
                            $gte: new Date(req.body.fromdate),
                            $lt: new Date(req.body.todate)
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
                            $gte: new Date(req.body.fromdate),
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

        console.log('ssssss')
        Purchase.aggregate([
            {
                $match: {
                    isdeleted: 0,
                    purchasedate: {
                        $gte: new Date(req.body.fromdate),
                        $lt: new Date(req.body.todate)
                    },
                    companyid: new mongoose.Types.ObjectId(req.session.companyid),
                    branchid: new mongoose.Types.ObjectId(req.session.branchid)
                },

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
                                    { $eq: ["$purchase_id", "$$id"] },
                                ]
                            },
                        }
                    }],
                    as: "purchasereturns",
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
                $group:
                {
                    _id: null,
                    totalpurchase: { "$sum": "$total" },
                    payedamount: { "$sum": '$balancepayment.PaymentDetail.payedamount' },
                    totalpay: { $sum: { $add: [{ "$sum": '$purchasereturns.total' }, { "$sum": '$balancepayment.PaymentDetail.payedamount' }] } },
                    totalbalance: { $sum: { $subtract: [{ "$sum": '$total' }, { $add: [{ "$sum": '$purchasereturns.total' }, { "$sum": '$balancepayment.PaymentDetail.payedamount' }] }] } },
                    overdue: {
                        $sum: {
                            $cond: [
                                { $lte: ["$duedate", (new Date())] }
                                ,
                                { $sum: { $subtract: [{ "$sum": '$total' }, { $add: [{ "$sum": '$purchasereturns.total' }, { "$sum": '$balancepayment.PaymentDetail.payedamount' }] }] } },

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
        sales.aggregate([{
            $match: {
                isdeleted: 0,
                invoicedate: {
                    $gte: new Date(req.body.fromdate),
                    $lt: new Date(req.body.todate)
                },
                companyid: new mongoose.Types.ObjectId(req.session.companyid),
                branchid: new mongoose.Types.ObjectId(req.session.branchid)
            }
        },
        {
            $lookup: {
                from: "salesreturns",
                "let": { "id": "$_id" },
                "pipeline": [{
                    "$match": {
                        isdeleted: 0,
                        "$expr": {
                            $and: [
                                { $eq: ["$sales_id", "$$id"] },
                            ]
                        },
                    }
                }],
                as: "salesreturns",
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
                totalpay: { $sum: { $add: [{ "$sum": '$salesreturns.total' }, { "$sum": '$receipt.PaymentDetail.payedamount' }] } },
                totalbalance: { $sum: { $subtract: [{ "$sum": '$total' }, { $add: [{ "$sum": '$salesreturns.total' }, { "$sum": '$receipt.PaymentDetail.payedamount' }] }] } },
                overdue: {
                    $sum: {
                        $cond: [
                            { $lte: ["$duedate", (new Date())] }
                            ,
                            { $sum: { $subtract: [{ "$sum": '$total' }, { $add: [{ "$sum": '$salesreturns.total' }, { "$sum": '$receipt.PaymentDetail.payedamount' }] }] } },
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
                            $gte: new Date(req.body.fromdate),
                            $lt: new Date(req.body.todate)
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
                as: "saleretrun",
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

                pendingamount: { $sum: { $subtract: [{ "$sum": '$invoice.total' }, { $add: [{ "$sum": '$salereturn.total' }, { "$sum": '$receipt.PaymentDetail.payedamount' }] }] } },
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
                            $gte: new Date(req.body.fromdate),
                            $lt: new Date(req.body.todate)
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
            $group: {
                _id: { _id: "$_id", name: "$name", mobile: "$mobile" },
                pendingamount: { $sum: { $subtract: [{ "$sum": '$purchase.total' }, { $add: [{ "$sum": '$purchasereturn.total' }, { "$sum": '$balancepayment.PaymentDetail.payedamount' }] }] } }
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
        sales.aggregate(
            [
                {
                    $match: {
                        isdeleted: 0,
                        invoicedate: {
                            $gte: new Date(req.body.fromdate),
                            $lt: new Date(req.body.todate)
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
                                    $gte: new Date(req.body.fromdate),
                                    $lt: new Date(req.body.todate)
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
    top3expenses(req, res) {
        expense.aggregate(
            [
                {
                    $match: {
                        isdeleted: 0,
                        entrydate: {
                            $gte: new Date(req.body.fromdate),
                            $lt: new Date(req.body.todate)
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
                                    $gte: new Date(req.body.fromdate),
                                    $lt: new Date(req.body.todate)
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
        sales.aggregate(
            [{
                $match: {
                    isdeleted: 0,
                    invoicedate: {
                        $gte: new Date(req.body.fromdate),
                        $lt: new Date(req.body.todate)
                    },
                    companyid: new mongoose.Types.ObjectId(req.session.companyid),
                    branchid: new mongoose.Types.ObjectId(req.session.branchid)
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
                                    { $eq: ["$sale_id", "$$id"] },
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
                    "dueamount": { $subtract: ['$total', { $add: [{ "$sum": '$salereturn.total' }, { "$sum": '$receiptpayment.PaymentDetail.payedamount' }] }] },
                    "status": {
                        $cond: [{ $lt: [ (new Date()),"$duedate"] }, 'Due', 'OverDue'],
                    },
                    duedays: { $trunc: { $divide: [{ $subtract: ["$duedate", new Date()] }, (1000 * 60 * 60 * 24)] } },
                    'balancedueamount': { $subtract: ['$total', { $add: [{ "$sum": '$salereturn.total' }, { "$sum": '$receiptpayment.PaymentDetail.payedamount' }] }] }
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
        Purchase.aggregate(
            [{
                $match: {
                    "isdeleted": 0,
                    companyid: new mongoose.Types.ObjectId(req.session.companyid),
                    branchid: new mongoose.Types.ObjectId(req.session.branchid)
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
                                    { $eq: ["$purchase_id", "$$id"] },
                                ]
                            },
                        }
                    }],
                    as: "purchasereturns",
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
                        $cond: [{ $lt: [ (new Date()),"$duedate"] }, 'Due', 'OverDue'],
                    },
                    duedays: { $trunc: { $divide: [{ $subtract: ["$duedate", new Date()] }, (1000 * 60 * 60 * 24)] } },
                    'dueamount': { $subtract: ['$total', { $add: [{ "$sum": '$purchasereturns.total' }, { "$sum": '$balancepayment.PaymentDetail.payedamount' }] }] }
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
        console.log(req.body.datecount)
        console.log(req.body.fromdate)
        if (req.body.datecount <= 31) {
            Purchase.aggregate([
                {
                    $match: {
                        isdeleted: 0,
                        purchasedate: {
                            $gte: new Date(req.body.fromdate),
                            $lt: new Date(req.body.todate)
                        },
                        companyid: new mongoose.Types.ObjectId(req.session.companyid),
                        branchid: new mongoose.Types.ObjectId(req.session.branchid)
                    }
                },
                {
                    $group: {
                        // _id: { "purchasedate": { $dateToString: { format: "%d-%m-%Y", date: "$purchasedate" } } },
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
                                $gte: new Date(req.body.fromdate),
                                $lt: new Date(req.body.todate)
                            },
                            companyid: new mongoose.Types.ObjectId(req.session.companyid),
                            branchid: new mongoose.Types.ObjectId(req.session.branchid)
                        }
                    },
                    {
                        $group: {
                            //  _id: { "entrydate": { $dateToString: { format: "%d-%m-%Y", date: "$entrydate" } } },
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
                                    $gte: new Date(req.body.fromdate),
                                    $lt: new Date(req.body.todate)
                                },
                                companyid: new mongoose.Types.ObjectId(req.session.companyid),
                                branchid: new mongoose.Types.ObjectId(req.session.branchid)
                            }
                        },
                        {
                            $group: {

                                // _id: { "invoicedate": { $dateToString: { format: "%d-%m-%Y", date: "$invoicedate" } } },
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
                            $gte: new Date(req.body.fromdate),
                            $lt: new Date(req.body.todate)
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
                                $gte: new Date(req.body.fromdate),
                                $lt: new Date(req.body.todate)
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
                                    $gte: new Date(req.body.fromdate),
                                    $lt: new Date(req.body.todate)
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


    }

}