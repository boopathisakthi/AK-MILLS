var Purchase = mongoose.model('Purchase');
var Product = mongoose.model('MasterProduct');
var Payment = mongoose.model('Payment');
const StockProcessDetails = mongoose.model('StockProcessDetails');
var each = require('promise-each');
require("datejs");
require('../../config/logger');
module.exports = {
    async insert(req, res) {

        if (req.body._id) {

            Purchase.findOne({ _id: new mongoose.Types.ObjectId(req.body._id), branchid: new mongoose.Types.ObjectId(req.session.branchid) })
                .then(data => {

                    if (!data) {
                        return res.status(400).send('Data Not Found')
                    }


                    return data.updateOne({
                        purchaseorderno: req.body.purchaseorderno,
                        purchasedate: req.body.purchasedate,
                        creditdays: req.body.creditdays,
                        reference: req.body.reference,
                        supplierid: req.body.supplierid,
                        subtotal: req.body.subtotal,
                        roundoff: req.body.roundoff,
                        roundofftype: req.body.roundofftype,
                        duedate: req.body.duedate,
                        actualtotal: req.body.actualtotal,
                        total: req.body.total,
                        payamount: req.body.payamount,
                        balance: req.body.balance,
                        purchaseDetail: req.body.purchaseDetail,
                        SupplierDetail: req.body.SupplierDetail,
                        hsncolumn: req.body.hsncolumn,
                        unitcolumn: req.body.unitcolumn,
                        discountcolumn: req.body.discountcolumn,
                        discountype: req.body.discountype,
                        taxtype: req.body.taxtype,
                        companyid: req.session.companyid,
                        branchid: req.session.branchid,
                        modifiedby: req.session.userid,
                        gstdetail: req.body.gstdetail,
                        note: req.body.note,
                    })
                        .then((data5) => {
                            Promise.resolve(data.purchaseDetail).then(each((ele) =>
                                req.body.purchaseDetail.forEach((update) => {
                                    if (ele.productid == update.productid) {

                                        StockProcessDetails.findOne({ isdeleted: 0, productid: ele.productid, branchid: req.session.branchid })
                                            .then((data2) => {

                                                if (!data2) {

                                                    StockProcessDetails.create({
                                                        productid: ele.productid,
                                                        openingstock: 0,
                                                        salesqty: 0,
                                                        stock_transfer: 0,
                                                        stock_received: 0,
                                                        purchaseqty: parseInt(ele.qty),
                                                        branchid: req.session.branchid,
                                                        companyid: req.session.companyid,
                                                        createdby: req.session.usrid,
                                                        createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                                                        isdeleted: '0'
                                                    }).then((data7) => { })
                                                }
                                                else {

                                                    console.log('purchase qty:' + data2.purchaseqty)
                                                    console.log('old ele qty:' + ele.qty)
                                                    console.log('updated qty:' + update.qty)
                                                    if (ele._id == update._id) {
                                                        data2.updateOne({
                                                            purchaseqty: (parseInt(data2.purchaseqty) - parseInt(ele.qty)) + parseInt(update.qty)
                                                        }).then((data1) => { })

                                                    }
                                                    else {
                                                        data2.updateOne({
                                                            purchaseqty: parseInt(data2.purchaseqty) + parseInt(update.qty)
                                                        }).then((data1) => { })

                                                    }


                                                }

                                            })

                                    }

                                })
                            ))


                            logger.log('info', 'logjson{ page : purchaes, Acion : Update,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                            res.status(200).send({
                                status: 'success',
                                message: 'record Updated  successfully',

                            })
                        })
                })
                .catch(err => res.status(400).send(err))
        } else {

            //purchase insert
            await Purchase.create({
                purchaseorderno: req.body.purchaseorderno,
                duedate: req.body.duedate,
                purchasedate: req.body.purchasedate,
                creditdays: req.body.creditdays,
                reference: req.body.reference,
                supplierid: req.body.supplierid,
                subtotal: req.body.subtotal,
                roundoff: req.body.roundoff,
                roundofftype: req.body.roundofftype,
                actualtotal: req.body.actualtotal,
                payamount: req.body.paidamount,
                balance: req.body.balance,
                total: req.body.total,
                purchaseDetail: req.body.purchaseDetail,
                SupplierDetail: req.body.SupplierDetail,
                hsncolumn: req.body.hsncolumn,
                unitcolumn: req.body.unitcolumn,
                discountcolumn: req.body.discountcolumn,
                discountype: req.body.discountype,
                taxtype: req.body.taxtype,
                gstdetail: req.body.gstdetail,
                note: req.body.note,
                type: 'purchase',
                companyid: req.session.companyid,
                branchid: req.session.branchid,
                createdby: req.session.usrid,
                createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                isdeleted: '0'
            }).then((data) => {

                let PaymentDetail = [];
                let detail = {
                    trans_id: data._id,
                    trans_no: req.body.purchaseorderno,
                    payedamount: req.body.paidamount,
                    balance: req.body.balance,
                    trans_date: req.body.transdate,
                }
                PaymentDetail.push(detail)
                //product qty details insert in stockprocessdetails
                Promise.resolve(req.body.purchaseDetail).then(each((ele) => {

                    StockProcessDetails.findOne({ isdeleted: 0, productid: ele.productid, branchid: req.session.branchid })
                        .then((data2) => {

                            if (!data2) {

                                StockProcessDetails.create({
                                    productid: ele.productid,
                                    openingstock: 0,
                                    salesqty: 0,
                                    stock_transfer: 0,
                                    stock_received: 0,
                                    purchaseqty: parseInt(ele.qty),
                                    branchid: req.session.branchid,
                                    companyid: req.session.companyid,
                                    createdby: req.session.usrid,
                                    createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                                    isdeleted: '0'
                                }).then((data7) => { })
                            }
                            else {

                                data2.updateOne({
                                    purchaseqty: parseInt(data2.purchaseqty) + parseInt(ele.qty)
                                }).then((data1) => { })
                            }

                        })

                }
                ))

                if (parseInt(req.body.paidamount) > 0) {
                    //balance payment bill no
                    Payment.aggregate([
                        {
                            $match: { type: "supplier" }
                        },
                        { $count: "myCount" }
                    ])
                        .then((paymentcount) => {

                            let billno = paymentcount.length == 0 ? 1 : paymentcount[0].myCount + 1
                            //payment entry
                            Payment.create({
                                billno: 'BPE' + billno,
                                billdate: req.body.purchasedate,
                                type: 'supplier',
                                typeid: req.body.supplierid,
                                paidamount: req.body.paidamount,
                                PaymentDetail: PaymentDetail,
                                PaymodeDetail: req.body.PaymodeDetail,
                                companyid: req.session.companyid,
                                branchid: req.session.branchid,
                                createdby: req.session.usrid,
                                createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                                isdeleted: '0',
                                entrythrough: 'purchase'
                            }).then((datarr) => {

                            })
                                .catch((err) => res.status(400).send(err))

                        })
                }

                logger.log('info', 'logjson{ page : purchaes, Acion : Insert,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                res.status(200).send({
                    status: 'success',
                    message: 'record added successfully',

                })
            })
                .catch((error) => {
                    res.status(400).send(error)

                })
        }
    },
    list(req, res) {
        console.log(req.url);
        var queryString = url.parse(req.url, true);
        var urlparms = queryString.query;
        // console.log(urlparms);
        var searchStr = { isdeleted: 0 };
        var recordsTotal = 0;
        var recordsFiltered = 0;
        Purchase.count({ isdeleted: 0 }, function (err, c) {
            recordsTotal = c;
            console.log('total count ' + c);
            Purchase.count(searchStr, function (err, c) {
                recordsFiltered = c;
                console.log('record fliter count ' + c);
                console.log('start ' + urlparms.start);
                console.log('length ' + urlparms.length);
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
                            from: "rolemappings",
                            "let": { "id": new mongoose.Types.ObjectId(req.session.roleid) },
                            "pipeline": [{
                                "$match": {
                                    isdeleted: 0,
                                    pagename: "Purchase Entry",
                                    "$expr": {
                                        $and: [
                                            { $eq: ["$roleid", "$$id"] },
                                        ]
                                    },
                                }
                            }],
                            as: "roledetails"
                        }
                    },
                    {
                        $unwind: "$roledetails"
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
                            "_id": {
                                $concat: [{ $toString: "$_id" }, " - ", { $toString: "$roledetails.edit" }, "-", { $toString: "$roledetails.delete" }]
                            },
                            "purchasedate": { $dateToString: { format: "%d-%m-%Y", date: "$purchasedate" } },
                            "reference": 1,
                            "Supplier.name": 1,
                            "purchaseorderno": 1,
                            "total": 1,
                            creditdays: 1,
                            'dueamount': { $subtract: ['$total', { $add: [{ "$sum": '$purchasereturns.total' }, { "$sum": '$balancepayment.PaymentDetail.payedamount' }] }] }
                        }
                    },
                    { "$skip": Number(urlparms.start), },
                    { "$limit": Number(urlparms.length) },
                    ],
                    function (err, results) {

                        if (err) {
                            console.log('error while getting results' + err);
                            return;
                        }
                        // console.log(results)
                        var data = JSON.stringify({
                            "draw": urlparms.draw,
                            "recordsFiltered": recordsFiltered,
                            "recordsTotal": recordsTotal,
                            "data": results
                        });
                        // console.log(data)
                        res.send(data);
                    })
            })
        })

    },
    edit(req, res) {
        console.log(req.params._id)
        var id = req.params._id;
        Purchase.aggregate(
            [
                {
                    $match: { _id: new mongoose.Types.ObjectId(req.params._id), isdeleted: 0 }
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
                    $unwind: "$Supplier",
                },
                {
                    $lookup: {
                        from: "masterproducts",
                        "localField": "purchaseDetail.productid",
                        "foreignField": "_id",
                        as: "productdetail"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        "purchasedate": { $dateToString: { format: "%d-%m-%Y", date: "$purchasedate" } },
                        "reference": 1,
                        "supplierid": 1,
                        "Supplier.name": 1,
                        "Supplier.gstin": 1,
                        "Supplier.billingstate": 1,
                        "purchaseorderno": 1,
                        "total": 1,
                        "creditdays": 1,
                        "reference": 1,
                        "purchaseDetail": 1,
                        "productdetail.productname": 1,
                        "productdetail._id": 1,
                        "unitcolumn": 1,
                        "hsncolumn": 1,
                        "discountcolumn": 1,
                        "roundoff": 1,
                        "discountype": 1,
                        "taxtype": 1,
                        roundofftype: 1,
                        balance: 1,
                        payamount: { $add: [{ "$sum": '$purchasereturns.total' }, { "$sum": '$balancepayment.PaymentDetail.payedamount' }] },
                        roundoff: 1,
                        actualtotal: 1,
                        note: 1,
                        "balancepayment.PaymodeDetail": 1,
                        "balancepayment.entrythrough": 1,
                        'dueamount': { $subtract: ['$total', { $add: [{ "$sum": '$purchasereturns.total' }, { "$sum": '$balancepayment.PaymentDetail.payedamount' }] }] }
                    }
                }
            ])
            .then((data) => {

                return res.status(200).send(data)
            })
            .catch((error) => {
                return res.status(400).send(error)
            })
    },
    purchaseno(req, res) {

        Purchase.aggregate([
            {
                $match: {
                    isdeleted: 0,
                    companyid: new mongoose.Types.ObjectId(req.session.companyid),
                    branchid: new mongoose.Types.ObjectId(req.session.branchid)
                }
            },
            { $count: "myCount" }
        ])
            .then((data) => {

                res.status(200).send({ billno: data.length == 0 ? 1 : data[0].myCount + 1 })
            })
            .catch((error) => res.status(400).send(error))
    },
    delete(req, res) {

        Payment.find({ "PaymentDetail.trans_id": req.params._id, isdeleted: 0, branchid: new mongoose.Types.ObjectId(req.session.branchid) })
            .then((paymentdata) => {
                if (paymentdata.length != 0) {
                    let billno = '';
                    paymentdata.forEach((i) => {
                        if (billno == '') {
                            billno = i.billno;
                        }
                        else {
                            billno = billno + ',' + i.billno;
                        }
                    })

                    return res.status(404).send("Can't Delete this Purchase " + paymentdata[0].PaymentDetail[0].trans_no + " there is a Balance Payment(" + billno + ")  aganist this Purchase.. pls delete that");
                }
                else {
                    Purchase.findOne({ _id: req.params._id, branchid: new mongoose.Types.ObjectId(req.session.branchid) })
                        .then(data => {
                            if (!data) {
                                return res.status(404).send({
                                    message: 'Data Not Found',
                                });
                            }

                            Promise.resolve(data.purchaseDetail).then(each((ele) =>

                                StockProcessDetails.findOne({ isdeleted: 0, productid: ele.productid, branchid: req.session.branchid })
                                    .then((stockdata) => {

                                        if (!stockdata) {
                                            return res.status(400).send('Data Not Found');
                                        }
                                        stockdata.updateOne({
                                            purchaseqty: parseInt(stockdata.purchaseqty) - parseInt(ele.qty)
                                        }).then((data1) => { })
                                    })


                            ))

                            return data.updateOne({
                                isdeleted: 1
                            })
                                .then((data1) => res.status(200).send({ status: 'success', message: 'Record deleted SuccessFully', data1 }))
                                .catch((error) => res.status(400).send(error));
                        })
                        .catch((error) => res.status(400).send(error));
                }
            })

    },
    purchasenodropdownlist(req, res) {
        Purchase.aggregate([{
            $match: { "isdeleted": 0 }
        },
        {
            $project: {
                _id: 0,
                id: '$_id',
                name: "$purchaseorderno"
            }
        }
        ])
            .then((data) => { res.status(200).send(data); })
            .catch((error) => res.status(400).send(error));
    },
    supplierbalance_purchasedetail(req, res) {

        Purchase.aggregate([{
            $match: { isdeleted: 0, supplierid: new mongoose.Types.ObjectId(req.params.id) }
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
            $project: {
                _id: 1,
                'purchasereturns._id': 1,
                'purchasereturns.purchase_id': 1,
                'purchasereturns.total': 1,
                'creditdays': 1,
                'purchaseorderno': 1,
                "purchasedate": { $dateToString: { format: "%d-%m-%Y", date: "$purchasedate" } },
                // "balancepayment.balance": 1,
                'total': 1,
                'balance': { $subtract: ['$total', { $add: [{ "$sum": '$purchasereturns.total' }, { "$sum": '$balancepayment.PaymentDetail.payedamount' }] }] }

            }
        }
        ])
            .then((data) => res.status(200).send(data))
            .catch((err) => res.status(400).send(err))
    },
    test(req, res) {
        Purchase.aggregate([{
            $match: { isdeleted: 0 }
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
                "pipeline": [{
                    "$match": {
                        isdeleted: 0,
                        type: "supplier",
                        "$expr": {
                            $and: [
                                { $eq: ["$trans_id", "$$purchase_id"] },
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
                totalpay: { $sum: { $add: [{ "$sum": '$purchasereturns.total' }, { "$sum": '$balancepayment.payedamount' }, { "$sum": '$payamount' }] } },
                totalbalance: { $sum: { $subtract: [{ "$sum": '$total' }, { $add: [{ "$sum": '$purchasereturns.total' }, { "$sum": '$balancepayment.payedamount' }, { "$sum": '$payamount' }] }] } },
                overdue: {
                    $sum: {
                        $cond: [
                            { $lte: ["$duedate", (new Date())] }
                            ,
                            { $sum: { $subtract: [{ "$sum": '$total' }, { $add: [{ "$sum": '$purchasereturns.total' }, { "$sum": '$balancepayment.payedamount' }, { "$sum": '$payamount' }] }] } },
                            0]
                    }
                },

            },



        },
        {
            $project: {
                _id: "$_id",
                totalpurchase: "$totalpurchase",
                totalpay: "$totalpay",
                overdue: "$overdue",
                dueamount: { $subtract: ["$totalbalance", "$overdue"] }
            }
        }

        ])
            .then((data) => res.status(200).send(data))
            .catch((err) => res.status(400).send(err))

    },
    amountdateils(req, res) {
        Purchase.aggregate([
            {
                $match: {
                    isdeleted: 0,
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
                    balancepayment: 1,

                    overdue: "$overdue",

                    payedamount: "$payedamount",
                    dueamount: { $subtract: ["$totalbalance", "$overdue"] }
                }
            }

        ])
            .then((data) => res.status(200).send(data))
            .catch((err) => res.status(400).send(err))

    },
    productdropdownlist(req, res) {
        Purchase.aggregate([{
            $match: { "isdeleted": 0, type: 'product', modified: 0 }
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
            $project: {
                _id: 0,
                purchase_productid: '$_id',
                id: '$productid',
                itemcode: '$itemcode',
                name: "$productname",
                hsnorsac_code: "$hsnorsac_code",
                unitid: "$unitid",
                purchaseprice: "$purchaseprice",
                salesprice: 1,
                "tax.taxname": 1,
                "tax.sgst": 1,
                "tax.cgst": 1,
                "tax.igst": 1,
                taxid: 1
            }
        }
        ])
            .then((data) => { res.status(200).send(data); })
            .catch((error) => res.status(400).send(error));
    },


}

