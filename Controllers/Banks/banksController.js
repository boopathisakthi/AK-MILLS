const Payment = mongoose.model('Payment');
const Bank = mongoose.model('MasterBank');

var UserCreation = mongoose.model('UserCreation');

module.exports = {
    bankslist(req, res) {
        Bank.aggregate([
            {
                $match: { isdeleted: 0, companyid: new mongoose.Types.ObjectId(req.session.companyid) }
            },
            {
                $lookup: {
                    from: "payments",
                    "let": { "bank_id": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$PaymodeDetail"
                        },
                        {
                            "$match": {
                                isdeleted: 0,
                                "$expr": {
                                    $and: [
                                        { $eq: ["$PaymodeDetail.paidfrom", "$$bank_id"] },
                                    ]
                                },
                            }
                        }],
                    as: "paymodesdetails",
                }
            },
            {
                $lookup: {
                    from: "payments",
                    "let": { "bank_id": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$PaymodeDetail"
                        },
                        {
                            "$match": {
                                isdeleted: 0,
                                type: 'bank',
                                "$expr": {
                                    $and: [
                                        { $eq: ["$typeid", "$$bank_id"] },
                                    ]
                                },
                            }
                        }],
                    as: "bankamountreceiveddetails",
                }
            },
            {
                $lookup: {
                    from: "payments",
                    "let": { "bank_id": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$PaymodeDetail"
                        },
                        {
                            "$match": {
                                isdeleted: 0,
                                type: 'bank',
                                "$expr": {
                                    $and: [
                                        { $eq: ["$PaymodeDetail.paidfrom", "$$bank_id"] },
                                    ]
                                },
                            }
                        }],
                    as: "bankamountpaiddetails",
                }
            },
            {
                $group:
                {
                    _id: { _id: "$_id", bankname: "$bankname", type: "$type", account: "$accountno", bankamount: { $add: [{ "$sum": '$openingbalance' }, { "$sum": '$paymodesdetails.PaymodeDetail.amount' }] }, transferamount: { "$sum": '$bankamountpaiddetails.PaymodeDetail.amount' }, receivedamount: { "$sum": '$bankamountreceiveddetails.paidamount' } },
                    balance: { $sum: { $subtract: [{ $add: [{ "$sum": '$openingbalance' }, { "$sum": '$paymodesdetails.PaymodeDetail.amount' }, { "$sum": '$bankamountreceiveddetails.paidamount' }] }, { "$sum": '$bankamountpaiddetails.PaymodeDetail.amount' }] } },
                    // balance: { $sum: { $add: [{ "$sum": '$openingbalance' },, { "$sum": '$paymodesdetails.PaymodeDetail.amount' }] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    _id: "$_id._id",
                    bankname: "$_id.bankname",
                    transferamount: "$_id.transferamount",
                    receivedamount: "$_id.receivedamount",
                    bankamount: "$_id.bankamount",
                    balance: "$balance",
                    account: "$_id.account"

                }
            }

        ])
            .then((data) => {

                res.status(200).send({ data: data })
            })
            .catch((err) => res.status(400).send(err))

    },
    transactiondetails(req, res) {
        console.log(req.params._id)
        Payment.aggregate([
            {
                $match: {
                    isdeleted: 0,
                    billdate: {
                        $gte: new Date(req.body.fromdate),
                        $lt: new Date(req.body.todate)
                    }
                }
            },
            {
                $unwind: "$PaymodeDetail"
            },
            {
                $lookup:
                {
                    from: "masterbanks",
                    "localField": "PaymodeDetail.paidfrom",
                    "foreignField": "_id",
                    as: "paidto_other_bank"
                }
            },
            {
                $match: {
                    $or: [
                        { "typeid": new mongoose.Types.ObjectId(req.params._id) },
                        { "PaymodeDetail.paidfrom": new mongoose.Types.ObjectId(req.params._id) }
                    ]
                }

            },
            {
                $lookup: {
                    from: "mastersuppliers",
                    "localField": "typeid",
                    "foreignField": "_id",
                    as: "Supplier"
                }

            },
            {
                $lookup:
                {
                    from: "mastercustomers",
                    "localField": "typeid",
                    "foreignField": "_id",
                    as: "Customer"
                }
            },
            {
                $lookup:
                {
                    from: "masterbanks",
                    "localField": "typeid",
                    "foreignField": "_id",
                    as: "received_from_other_bank"
                }
            },

            {
                $project: {
                    _id: 0,
                    billdate: { $dateToString: { format: "%d-%m-%Y", date: "$billdate" } },
                    bankname: { $cond: [{ $eq: ["$typeid", new mongoose.Types.ObjectId(req.params._id)] }, "$paidto_other_bank.bankname", "$received_from_other_bank.bankname"], },
                    name: { $cond: [{ $eq: ["$type", 'supplier'] }, "$Supplier.name", "$Customer.name"], },
                    trans_no: "$PaymentDetail.trans_no",
                    type: 1,
                    typeid: 1,


                    withdrawl: { $cond: [{ $eq: ["$typeid", new mongoose.Types.ObjectId(req.params._id)] }, 0, { $add: [{ $cond: [{ $eq: ["$type", 'bank'] }, { "$sum": "$PaymodeDetail.amount" }, 0] }, { $cond: [{ $eq: ["$type", 'supplier'] }, "$PaymodeDetail.amount", 0], }, { $cond: [{ $eq: ["$type", 'expense'] }, "$PaymodeDetail.amount", 0], }] }], },
                    deposit: { $cond: [{ $eq: ["$typeid", new mongoose.Types.ObjectId(req.params._id)] }, { $add: [{ "$sum": "$PaymodeDetail.amount" }, { $cond: [{ $eq: ["$type", 'customer'] }, "$PaymodeDetail.amount", 0], }] }, { $cond: [{ $eq: ["$type", 'customer'] }, "$PaymodeDetail.amount", 0], }], },
                }
            }
        ])
            .then((data) => {
                console.log(data)
                res.status(200).send({ data: data })
            })
            .catch((err) => {

                res.status(400).send(err)
            })
    },
    beforebalance(req, res) {
        Bank.aggregate([
            {
                $match: {
                    isdeleted: 0,
                    _id: new mongoose.Types.ObjectId(req.params._id)
                }
            },
            {
                $lookup: {
                    from: "payments",
                    "let": { "bank_id": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$PaymodeDetail"
                        },
                        {
                            "$match": {
                                isdeleted: 0,
                                type: 'supplier',
                                billdate: {
                                    $lt: new Date(req.body.fromdate)
                                },
                                "$expr": {
                                    $and: [
                                        { $eq: ["$PaymodeDetail.paidfrom", "$$bank_id"] },

                                    ]
                                },
                            }
                        }],
                    as: "paymentswithdraw",
                }
            },
            {
                $lookup: {
                    from: "payments",
                    "let": { "bank_id": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$PaymodeDetail"
                        },
                        {
                            "$match": {
                                isdeleted: 0,
                                type: 'customer',
                                billdate: {
                                    $lt: new Date(req.body.fromdate)
                                },
                                "$expr": {
                                    $and: [
                                        { $eq: ["$PaymodeDetail.paidfrom", "$$bank_id"] },

                                    ]
                                },
                            }
                        }],
                    as: "paymentsdeposit",
                }
            },
            {
                $lookup: {
                    from: "payments",
                    "let": { "bank_id": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$PaymodeDetail"
                        },
                        {
                            "$match": {
                                isdeleted: 0,
                                type: 'bank',
                                billdate: {
                                    $lt: new Date(req.body.fromdate)
                                },
                                "$expr": {
                                    $and: [
                                        { $eq: ["$PaymodeDetail.paidfrom", "$$bank_id"] },
                                    ]
                                },
                            }
                        }],
                    as: "bankamountpaiddetails",
                }
            },
            {
                $lookup: {
                    from: "payments",
                    "let": { "bank_id": "$_id" },
                    "pipeline": [
                        {
                            $unwind: "$PaymodeDetail"
                        },
                        {
                            "$match": {
                                isdeleted: 0,
                                type: 'bank',
                                billdate: {
                                    $lt: new Date(req.body.fromdate)
                                },
                                "$expr": {
                                    $and: [
                                        { $eq: ["$typeid", "$$bank_id"] },
                                    ]
                                },
                            }
                        }],
                    as: "bankamountreceiveddetails",
                }
            },

            {
                $group:
                {
                    _id: { deposit: { "$sum": "$paymentsdeposit.PaymodeDetail.amount" }, receivedamount: { "$sum": '$bankamountreceiveddetails.paidamount' } },
                    beforeamount: { $sum: { $subtract: [{ $add: [{ "$sum": "$openingbalance" }, { "$sum": "$paymentsdeposit.PaymodeDetail.amount" }, { "$sum": '$bankamountreceiveddetails.paidamount' }] }, { $add: [{ "$sum": "$paymentswithdraw.PaymodeDetail.amount" }, { "$sum": '$bankamountpaiddetails.PaymodeDetail.amount' }] }] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    openingbalance: { "$sum": "$openingbalance" },
                    // type:"$_id.type",
                    deposit: "$_id.deposit",
                    receivedamount: "$_id.receivedamount",
                    balance: "$beforeamount"
                }
            }
        ])
            .then((data) => {

                res.status(200).send({ data: data })
            })
            .catch((err) => {

                res.status(400).send(err)
            })
    },
    supplier_billclose_insert(req, res) {
        Payment.aggregate([
            {
                $match: { type: "supplier" }
            },

            { $count: "myCount" }
        ])
            .then((paymentcount) => {
                let billno = paymentcount.length == 0 ? 1 : paymentcount[0].myCount + 1
                Payment.create({
                    billno: 'BPE' + billno,
                    billdate: req.body.billdate,
                    type: 'supplier',
                    typeid: req.body.typeid,
                    paidamount: req.body.paidamount,
                    PaymentDetail: req.body.PaymentDetail,
                    PaymodeDetail: req.body.PaymodeDetail,
                    entrythrough: 'transaction',
                    companyid: req.session.companyid,
                    branchid: req.session.branchid,
                    createdby: req.session.usrid,
                    createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                    isdeleted: '0'
                }).then((data) => {
                    logger.log('info', 'logjson{ page : Transaction, Acion : Insert,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                    res.status(200).send({
                        status: 'success',
                        message: 'record added successfully',
                    })
                }).catch((error) => {
                    res.status(400).send({
                        status: 'Error',
                        message: error
                    })
                }
                )
            })




    },
    customer_receipt_insert(req, res) {

        Payment.aggregate([
            {
                $match: { type: "customer" }
            },
            { $count: "myCount" }
        ])
            .then((paymentcount) => {
                let billno = paymentcount.length == 0 ? 1 : paymentcount[0].myCount + 1;
                Payment.create({
                    billno: 'RE' + billno,
                    billdate: req.body.billdate,
                    type: 'customer',
                    typeid: req.body.typeid,
                    paidamount: req.body.paidamount,
                    PaymentDetail: req.body.PaymentDetail,
                    PaymodeDetail: req.body.PaymodeDetail,
                    entrythrough: 'transaction',
                    companyid: req.session.companyid,
                    branchid: req.session.branchid,
                    createdby: req.session.usrid,
                    createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                    isdeleted: '0'
                }).then((data) => {
                    logger.log('info', 'logjson{ page : ReceiptPayment, Acion : Insert,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                    res.status(200).send({
                        status: 'success',
                        message: 'record added successfully',

                    })
                }).catch((error) => {
                    res.status(400).send({
                        status: 'Error',
                        message: error
                    })
                }
                )
            })




    },
    cash_contra_insert(req, res) {
        if (req.body._id) {
            Payment.findById(req.body._id)
                .then((data) => {
                    data.updateOne({
                        billno: req.body.billno,
                        billdate: req.body.billdate,
                        type: "customer",
                        typeid: req.body.typeid,
                        paidfrom: req.body.paidfrom,
                        referencemode: req.body.referencemode,
                        reference: req.body.reference,
                        paidamount: req.body.paidamount,
                        trans_no: req.body.trans_no,
                        trans_date: req.body.trans_date,
                        trans_id: req.body.trans_id,
                        payedamount: req.body.payedamount,
                        balance: req.body.balance,

                        companyid: req.session.companyid,
                        updatedby: req.session.usrid,
                        updateddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                        isdeleted: '0'
                    }).then((data) => {
                        logger.log('info', 'logjson{ page : ReceiptPayment, Acion : update,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                        res.status(200).send({
                            status: 'success',
                            message: 'record update successfully',

                        })
                    }).catch((error) => {
                        res.status(400).send({
                            status: 'Error',
                            message: error
                        })
                    })


                }).catch((error) => {
                    res.status(400).send({
                        status: 'Error',
                        message: error
                    })
                })
        }
        else {

            Payment.create({
                // billno: req.body.billno,
                billdate: req.body.billdate,
                type: 'bank',
                typeid: req.body.typeid,
                paidamount: req.body.paidamount,
                PaymentDetail: [],
                PaymodeDetail: req.body.PaymodeDetail,
                entrythrough: 'transaction',
                companyid: req.session.companyid,
                branchid: req.session.branchid,
                createdby: req.session.usrid,
                createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                isdeleted: '0'
            }).then((data) => {
                logger.log('info', 'logjson{ page : BankAmount, Acion : Insert,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                res.status(200).send({
                    status: 'success',
                    message: 'record added successfully',

                })
            }).catch((error) => {
                res.status(400).send({
                    status: 'Error',
                    message: error
                })
            }
            )
        }

    }
}
