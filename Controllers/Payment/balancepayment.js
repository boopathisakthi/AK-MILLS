var Payment = mongoose.model('Payment');
var UserCreation = mongoose.model('UserCreation');
module.exports = {
    insert(req, res) {

        if (req.body._id) {
            Payment.findById(req.body._id)
                .then((data) => {
                    data.updateOne({
                        billno: req.body.billno,
                        billdate: req.body.billdate,
                        type: 'supplier',
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
                        // Paymentdetail:req.body.Paymentdetail,
                        companyid: req.session.companyid,
                        updatedby: req.session.usrid,
                        updateddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                        isdeleted: '0'
                    }).then((data) => {
                        logger.log('info', 'logjson{ page : BalancePayment, Acion : update,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
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
            console.log(req.body.PaymentDetail)
            Payment.create({
                billno: req.body.billno,
                billdate: req.body.billdate,
                type: 'supplier',
                typeid: req.body.typeid,
                paidamount: req.body.paidamount,
                PaymentDetail: req.body.PaymentDetail,
                PaymodeDetail: req.body.PaymodeDetail,
                entrythrough: 'billpayment',
                companyid: req.session.companyid,
                branchid: req.session.branchid,
                createdby: req.session.usrid,
                createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                isdeleted: '0'
            }).then((data) => {
                logger.log('info', 'logjson{ page : BalancePayment, Acion : Insert,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
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
    },
    list(req, res) {

        var queryString = url.parse(req.url, true);
        var urlparms = queryString.query;
        // console.log(urlparms);
        var searchStr = { isdeleted: 0 };
        var recordsTotal = 0;
        var recordsFiltered = 0;
        Payment.count({ isdeleted: 0 }, function (err, c) {
            recordsTotal = c;
            console.log('total count ' + c);
            Payment.count(searchStr, function (err, c) {
                recordsFiltered = c;
                console.log('record fliter count ' + c);
                console.log('start ' + urlparms.start);
                console.log('length ' + urlparms.length);
                Payment.aggregate(
                    [
                        {
                            $match: { type: "supplier", billno: { $ne: 'purchase' }}
                        },
                        {

                            $lookup: {
                                from: "rolemappings",
                                "let": { "id": new mongoose.Types.ObjectId(req.session.roleid) },
                                "pipeline": [{
                                    "$match": {
                                        isdeleted: 0,
                                        pagename: "Balance Payment Entry",
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
                            $lookup:
                            {
                                from: "mastersuppliers",
                                "localField": "typeid",
                                "foreignField": "_id",
                                as: "Supplier"
                            }
                        },
                        {
                            $lookup:
                            {
                                from: "masterbanks",
                                "localField": "paidfrom",
                                "foreignField": "_id",
                                as: "bankdetails"
                            }
                        },
                        {
                            "$group": {
                                _id: {
                                    _id: "$_id",
                                    billno: "$billno",
                                    billdate: { $dateToString: { format: "%d-%m-%Y", date: "$billdate" } },
                                    paidamount: "$paidamount",
                                    suppliername: "$Supplier.name",
                                    entrythrough: "$entrythrough",
                                    isdeleted: "$isdeleted",
                                    role_edit: "$roledetails.edit",
                                    role_delete: "$roledetails.delete",
                                },

                                "count": { "$sum": 1 }
                            }

                        },


                        {
                            $project: {

                                _id: 1,

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
    paymentno(req, res) {
        Payment.aggregate([
            {
                $match: { type: "supplier" }
            },
            { $count: "myCount" }
        ])
            .then((data) => {
                res.status(200).send({ billno: data.length == 0 ? 1 : data[0].myCount + 1 })
                //  res.status(200).send(data)
            })
            .catch((error) => res.status(400).send(error))
    },
    edit(req, res) {

        Payment.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.params._id), isdeleted: 0, type: "supplier" }
            },
            {
                $lookup:
                {
                    from: "mastersuppliers",
                    "localField": "typeid",
                    "foreignField": "_id",
                    as: "Supplier"
                }
            },
            {
                $project: {
                    _id: 1,
                    billno: 1,
                    billpaymentdate: { $dateToString: { format: "%d-%m-%Y", date: "$billdate" } },
                    paidamount: 1,
                    supplierid: "$typeid",
                    "Supplier.name": 1,
                    PaymentDetail: 1,
                    PaymodeDetail: 1
                }
            }
        ])
            .then((data) => {
                res.status(200).send(data)
                console.log(data)
            })
            .catch((err) => res.status(400).send(err))


    },
    delete(req, res) {
        console.log(req.body._id)
        Payment.findOne({ _id: req.body._id })
            .then((data) => {

                data.updateOne({
                    isdeleted: 1,
                    note: req.body.note,
                    updatedby: req.session.usrid,
                    updateddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                }).then((data3) => {
                   
                    res.status(200).send({
                        status: 'success',
                        message: 'record delete successfully',
                    })
                })
                    .catch((err) => res.status(400).send(err))




            })
            .catch((err) => res.status(400).send(err))
    },
    find_cancelperson(req, res) {
        let date = '', note = '';
        let details = '';
        Payment.aggregate([
            {
                $match: {_id: new mongoose.Types.ObjectId(req.params._id)}
            },
            {
                $lookup:
                {
                    from: "mastersuppliers",
                    "localField": "typeid",
                    "foreignField": "_id",
                    as: "Supplier"
                }
            },
            {
                $project: {
                    _id: 1,
                    billno: 1,
                    billpaymentdate: { $dateToString: { format: "%d-%m-%Y", date: "$billdate" } },
                    paidamount: 1,
                    supplierid: "$typeid",
                    "Supplier.name": 1,
                    PaymentDetail: 1,
                    PaymodeDetail: 1,
                    updateddate: { $dateToString: { format: "%d-%m-%Y", date: "$updateddate" } },
                    note: "$note",
                    updatedby: 1
                }
            }



        ]).then((data) => {
            UserCreation.findById(data[0].updatedby)
                .then((data2) => {

                    details = {
                        name: data2.name,
                        date: data[0].updateddate,
                        note: data[0].note
                    }
                    data.push(details)
                    return res.status(200).send(data);
                })
        })
            .catch((err) => res.status(400).send(err))


    }

}