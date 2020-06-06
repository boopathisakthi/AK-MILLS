const sales = mongoose.model('sales');
const Payment = mongoose.model('Payment');
var UserCreation = mongoose.model('UserCreation');
var company = mongoose.model('MasterCompany');
var Branch = mongoose.model('Branch');
const path = require("path");
var msg91 = require("msg91")("81619ASNflfbcW3K55601452", "ZROBGZ", "1");
var customer = mongoose.model('mastercustomer');
module.exports = {
    insert(req, res) {

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
                billno: req.body.billno,
                billdate: req.body.billdate,
                type: 'customer',
                typeid: req.body.typeid,
                paidamount: req.body.paidamount,
                PaymentDetail: req.body.PaymentDetail,
                PaymodeDetail: req.body.PaymodeDetail,
                entrythrough: 'receipt',
                companyid: req.session.companyid,
                branchid: req.session.branchid,
                createdby: req.session.usrid,
                createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                isdeleted: '0'
            }).then((data) => {
                customer.findById(req.body.typeid)
                .then((data)=>{
                    console.log('---SMS Sending Process completed----')
                    msg91.send(data.mobile, "Thanks For Paying Balance in Zerobugz your  paid amount is  "+req.body.paidamount+"  and Receipt no is "+req.body.billno+"", function (err, response) {
                        if (err) {
                            res.status(400).send({
                                status: 'Error',
                                message: err
                            })
                            return null
                        }
    
                    });
                 
                })
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
                            $match: { type: "customer" }
                        },
                        {

                            $lookup: {
                                from: "rolemappings",
                                "let": { "id": new mongoose.Types.ObjectId(req.session.roleid) },
                                "pipeline": [{
                                    "$match": {
                                        isdeleted: 0,
                                        pagename: "Receipt Entry",
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
                                    customername: "$Customer.name",
                                    entrythrough: "$entrythrough",
                                    isdeleted: "$isdeleted",
                                    role_edit: "$roledetails.edit",
                                    role_delete: "$roledetails.delete",
                                },
                                // totalqty: { "$sum": "$payedamount" },
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
    edit(req, res) {
        Payment.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.params._id), isdeleted: 0, type: "customer" },
            },
            {
                $lookup:
                {
                    from: "mastercustomers",
                    "localField": "typeid",
                    "foreignField": "_id",
                    as: "customers"
                }
            },
            {
                $project: {
                    _id: 1,
                    billno: 1,
                    billpaymentdate: { $dateToString: { format: "%d-%m-%Y", date: "$billdate" } },
                    paidamount: 1,
                    customerid: "$typeid",
                    "customers.name": 1,
                    PaymentDetail: 1,
                    PaymodeDetail: 1
                }
            }
        ])
            .then((data) => res.status(200).send(data))
            .catch((err) => res.status(400).send(err))
    },
    delete(req, res) {
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
    CustomerBalanceDetails(req, res) {
        sales.aggregate([
            {
                $match: { isdeleted: 0, customerid: new mongoose.Types.ObjectId(req.params.id) }
            },
            {
                $lookup:
                {
                    from: "salereturns",
                    "let": { "id": "$_id" },
                    "pipeline": [
                        {
                            "$match": {
                                isdeleted: 0,
                                "$expr": {
                                    $and:
                                        [
                                            { $eq: ["$sale_id", "$$id"] },
                                        ]
                                },
                            }
                        }
                    ],
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
                $project: {
                    _id: 1,
                    'salereturn._id': 1,
                    'salereturn.sale_id': 1,
                    'salereturn.total': 1,
                    // 'creditdays':1,
                    'invoiceno': 1,
                    "invoicedate": { $dateToString: { format: "%d-%m-%Y", date: "$invoicedate" } },
                    "receiptpayment.balance": 1,
                    'total': 1,
                    'balance': { $subtract: ['$total', { $add: [{ "$sum": '$salereturn.total' }, { "$sum": '$receiptpayment.PaymentDetail.payedamount' }] }] }

                }
            }

        ])
            .then((data) => { res.status(200).send(data) })
    },
    receiptno(req, res) {
        Payment.aggregate([
            {
                $match: { type: "customer" }
            },
            { $count: "myCount" }
        ])
            .then((data) => {
                res.status(200).send({ billno: data.length == 0 ? 1 : data[0].myCount + 1 })
                //  res.status(200).send(data)
            })
            .catch((error) => res.status(400).send(error))
    },
    find_cancelperson(req, res) {
        let date = '', note = '';
        let details = '';
        console.log(req.params._id)
        Payment.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.params._id), type: "customer" }
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
                $project: {
                    _id: 1,
                    billno: 1,
                    billpaymentdate: { $dateToString: { format: "%d-%m-%Y", date: "$billdate" } },
                    paidamount: 1,
                    customerid: "$typeid",
                    "Customer.name": 1,
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


    },
    downloadreceipt(req, res) {
        const pdf = require('html-pdf');
        const mark = require('markup-js');
        var fs = require('fs');
      
        let salesbilldata = [];

        Payment.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.params._id), isdeleted: 0, type: "customer" },
            },
            {
                $lookup:
                {
                    from: "mastercustomers",
                    "localField": "typeid",
                    "foreignField": "_id",
                    as: "customers"
                }
            },
            {
                $project: {
                    _id: 1,
                    billno: 1,
                    billpaymentdate: { $dateToString: { format: "%d-%m-%Y", date: "$billdate" } },
                    paidamount: 1,
                    // customerid: "$typeid",
                    "customers": 1,
                    PaymentDetail: 1,
                    PaymodeDetail: 1,
                    "companyid": 1,
                    "branchid": 1,
                }
            }
        ])
        .then((data) => {
               
                company.findOne({ _id: new mongoose.Types.ObjectId(data[0].companyid) })
                .then(company => {
                   
                    Branch.findOne({
                        companyid: new mongoose.Types.ObjectId(data[0].companyid),
                        _id: new mongoose.Types.ObjectId(data[0].branchid)
                    })
                        .then(Branch => {
                            let salesdata = {
                                invoice: data,
                                company: company,
                                Branch: Branch
                            }
                            salesbilldata.push(salesdata)
                            let bindvalues=salesbilldata[0];
                          
                            var htmlcontent = `
                            <!-- Template : export/salpmt -->
                            <style>
                            /** {
                             all: initial;
                            }*/
                            html, body, page, pre {
                                font-family: Arial,Helvetica,sans-serif;
                                font-size: 13px !important;
                                line-height: 1.2;
                                color: #222;
                            }
                            page {
                                width: 100%;
                                display: inline-block;
                                height: auto;
                                
                            }
                            h1, .h1 { font-size: 29.25px;}
                            h2, .h2 { font-size: 19.5px;}
                            h3, .h3 { font-size: 14.625px;}
                            h4, .h4 { font-size: 11.375px;}
                            table {
                                width: 100%;
                                font-size: 13px !important;
                                border-bottom: 0.5px solid #b7b7b7;
                                    border-left: 0.5px solid #b7b7b7;
                                }
                            table th, table td {
                                vertical-align: middle;
                                padding: 5px;
                                border-bottom: 0px;
                                border-left: 0px;
                                    border-right: 0.5px solid #b7b7b7;
                                    border-top: 0.5px solid #b7b7b7;
                                line-height: 1.2;
                            }
            
                            table.inv_details th {
                                border-bottom: 0.5px solid #b7b7b7;
                                border-top: 0px;
                            }
                            table.inv_details td{
                                    border-bottom: 0.5px solid #b7b7b7;
                                    border-top: 0px;
                            }
                            table.inv_details th  {
                                /*border-top: 0.5px solid #b7b7b7;*/
                            }
                            table th {
                                font-weight: bold;
                            }
                            table.noborder {
                                border-bottom: 0px;
                                border-left: 0px;
                            }
                            table.noborder th, table.noborder td {
                                border-right: 0px;
                                border-top: 0px;
                                border-bottom: 0px;
                            }
                            .nbh, table.nbh, table.nbh th, table.nbh td, table.nbh2 th, table.nbh2 td {
                                border-bottom: 0px;
                                border-top: 0px;
                            }
                            .nbv, table.nbv, table.nbv th, table.nbv td {
                                border-left: 0px;
                                border-right: 0px;
                            }
                            .nb, table.nb, table.nb th, table.nb td {
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                            }
                            .taxbob td{
                                    border-top: none;
                                }
                            table.nopadding th, table.nopadding td {
                                padding: 0px;
                            }
                            table.auto {
                                width: auto;
                            }
                            table.vat th, table.vat td {
                                vertical-align: top;
                                border-color: #000000;
                            }
                            table.vam th, table.vam td, thead.vam th, tr.vam td {
                                vertical-align: middle;
                            }
                            table.wpw td {
                                white-space: pre-wrap;
                            }
                            /*
                            h1 { font-size: 2.25em;}
                            h2 { font-size: 1.5em;}
                            h3 { font-size: 1.125em;}
                            h4 { font-size: 0.875em;}
                            */
                            .hr {
                                color: #b7b7b7;
                                border-color: #b7b7b7;
                                margin: 0px;
                                padding: 0px;
                                line-height: 0.5px;
                            }
                            tr.hrtag td {
                                padding: 0px;
                            }
                            .dib {
                                display: inline-block;
                            }
                            .nm {
                                margin: 0px;
                            }
                            .nmt {
                                margin-top: 0px;
                            }
                            .nmb {
                                margin-bottom: 0px;
                            }
                            .nmr {
                                margin-right: 0px;
                            }
                            .nml {
                                margin-left: 0px;
                            }
                            .al {
                                text-align: left;
                            }
                            .ar {
                                text-align: right;
                            }
                            .ac {
                                text-align: center;
                            }
                            .nb {
                                border: 0px;
                            }
                            .nbt, table.nbt, table.nbt th, table.nbt td {
                                border-top: 0px;
                            }
                            .nbr, table tr td.nbr {
                                border-right: 0px;
                            }
                            .nbb {
                                border-bottom: 0px;
                            }
                            .nbl {
                                border-left: 0px;
                            }
                            .np {
                                padding: 0px;
                            }
                            .npl {
                                padding-left: 0px;
                            }
                            .npt {
                                padding-top: 0px;
                            }
                            .npr {
                                padding-right: 0px;
                            }
                            .npb {
                                padding-bottom: 0px;
                            }
                            .npv {
                                padding-left: 0px;
                                padding-right: 0px;
                            }
                            .nph, table td.nph {
                                padding-top: 0px;
                                padding-bottom: 0px;
                            }
                            .fw {
                                width: 100%;
                                display: block;
                            }
                            .detailTable table tr.odd {
                                background: #EAEAEA;
                            }
                            .detailTable table tr.even {
                                background: #FFFFFF;
                            }
                            .vat, table tbody tr td.vat, table.vat tbody tr td {
                                vertical-align: top;
                                border-color: #000000;
                            }
                            .vam, table tbody tr td.vam  {
                                vertical-align: middle;
                            }
                            .vab, table tbody tr td.vab {
                                vertical-align: bottom;
                            }
                            .noside {
                                float: left;
                                clear: both;
                            }
                            .fltlt {
                                float: left;
                            }
                            .fltrt {
                                float: right;
                            }
                            .clrbth {
                                clear: both;
                            }
                            .bob {
                                border-bottom: 0.5px solid #b7b7b7 !important;
                            }
                            .bol {
                                border-left: 0.5px solid #b7b7b7 !important;
                            }
                            .bor {
                                border-right: 0.5px solid #b7b7b7 !important;
                            }
                            .bot {
                                border-top: 0.5px solid #b7b7b7 !important;
                            }
                            .pretxt {
                                white-space: pre-wrap;
                            }
                            /*
                            .bol {
                                border-left: 1px solid #b7b7b7;
                            }
                            .bob, table.noborder tbody tr td.bob {
                                border-bottom: 1px solid #b7b7b7;
                            }
                            .bot {
                                border-top: 1px solid #b7b7b7;
                            }
                            */
                            .b {
                                font-weight: bold;
                            }
                            .asterisk {
                                color: black;
                                font-weight: bold;
                            }
                            .imgDiv {
                                display: inline-block;
                                /*max-height: 90px;*/
                                padding: 5px;
                                text-align: center;
                            }
                            .sign img {
                                max-width: 120px;
                                width: 120px;
                            }
                            .imgDiv img {
                                max-width: 120px;
                                width: 120px;
                                /*height: auto;
                                max-height: 80px;*/
                                display: inline-block;
                            }
                            .fnt-small, table tr td.fnt-small {
                                font-size: smaller;
                            }
                            .fnt-11, table tr td.fnt-11 {
                                font-size: 11.375px;
                                line-height: 13px;
                            }
                            .genby, .footerTxt {
                                text-align: center;
                                font-size: 11.375px;
                                width:100%;
                                display: inline-block;
                                padding: 10px 0;
                            }
                            .watermark {
                                text-align: center;
                                font-size: 11.375px;
                                width:100%;
                                display: inline-block;
                                color: gray;
                            }
                            .watermark a {
                                color: gray;
                                text-decoration: none;
                            }
                            .headtxt {
                                background-color: transparent;
                                color: #000000;
                                font-weight: bold;
                                padding: 0px 7px 7px 0px;
                                display: inline-block;
                                width:100%;
                            }
                            td.headtd {
                                background-color: transparent;
                                color: #000000;
                                font-weight: bold;
                                padding: 0px 7px 7px 0px !important;;
                                width:100%;
                                font-size:17px !important;
                            }
                            td.headtd2 {
                                font-weight: bold;
                                padding: 0px 7px 7px 0px !important;;
                                width:100%;
                                font-size:17px !important;
                            }
                            .bgColor {
                                color: #000000;
                            }
                            /*
                            td.headtd2 small {
                                font-weight: normal;
                            }
                            */
                            .total {
                                font-size: 16.9px;
                            }
                            /*
                            td.subTotal {
                                height: 36px;
                            }
                            */
                            table tbody tr.includetax td, table tbody tr.includetax td b {
                                /*color: #888;
                                font-weight: normal;*/
                                font-style: italic;
                            }
            
                            </style>
                            <page footer="page" pagegroup="new">	
                                <table class="noborder vat" cellspacing="0" cellpadding="0" style="width:100%;">
                                    <tbody>
                                        <tr>
                                        <td width="25%" class="vat al" style="display:block;height:auto;"></td>
                                        <td width="50%" class="ac"><p class="address nm"><b><big>{{company.companyname}}</big></b><br>{{company.address}},<br> {{company.city}} - {{company.pincode}}, {{company.state}}, India.<br>Phone : {{company.mobile}}<br>Email : {{company.email}}<br>GSTIN : {{company.gstno}}</p>
                            </td><td width="25%"></td></tr>
                                    </tbody>
                                </table>
                                        <div class="highlght ac">RECEIPT</div><br>
                                <!--<p class="">
                                    <span class="fltlt">Receipt No : <b>{{invoice.0.billno}}</b></span>
                                    <span class="fltrt">Date : <b>{{invoice.0.billpaymentdate}}</b></span>
                                </p>-->
                                <table class="noborder vat" cellspacing="0" cellpadding="0">
                                    <tbody>
                                        <tr>
                                            <td >Receipt No <b>{{invoice.0.billno}}</b></td>
                                            <td class="ar">Date <b>{{invoice.0.billpaymentdate}}</b></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="trans"><table border="0" cellspacing="0" cellpadding="0" class="nbv nbb vat " width="50%">
                                <tbody>
                                   
                                </tbody>
                            </table>
                                </div>
                                <table class="paymentTable noborder vat" cellspacing="0" cellpadding="0" align="center" style="width:60%;" border="1" >
                                    <tbody>
                                        <tr>
                                            <td width="40%">Amt from</td>
                                            <td width="60%"><p class="address nm"><b>{{invoice.0.customers.0.name}}</b><br>{{invoice.0.customers.0.shippingaddress}},<br>Sivakasi - {{invoice.0.customers.0.shippingpincode}}, {{invoice.0.customers.0.shippingstate}}, India.<br>Mobile :{{invoice.0.customers.0.mobile}}<br>Email : {{invoice.0.customers.0.email}}</p>
                            </td>
                                        </tr>
                                                                    <tr>
                                                <td width="40%">Amount Received (INR)</td>
                                                <td width="60%"><b>{{invoice.0.paidamount}}</b> (Thirty Six Thousand Four Hundred and Ninety Seven Rupees Seventy Six Paise only)</td>
                                            </tr>
                                                    <tr>
                                            <td width="40%">Payment Mode</td>
                                            <td width="60%">{{invoice.0.PaymodeDetail.0.reference}}</td>
                                        </tr>			<tr>
                                            <td width="40%">Remarks</td>
                                            <td width="60%"> You are a Valuable Customer</td>
                                        </tr>						<tr>
                                            <td class="ac bot" colspan="2" width="100%" style="border-top:1px solid black">Thanks</td>
                                        </tr>
                                        
                                    </tbody>
                                </table><br>
                                
                                <table class="noborder vat">
                                    <tr>
                                                    <td width="50%"  style="text-align:left"><span class="" style="margin-top:40px;">Customer Signature</span></td>
                                        <td width="50%" style="text-align:right"><div class="ar">For <span style="font-size:12px;">companyName</span></div><br><span class="sign" style="float:right;"><br>Authorized Signature</span></td>
                                                </tr>
                                </table> 
                            </page>
                            <style>
                                table.paymentTable {
                                    width: 100%;
                                    min-width: 500px;
                                    border: 0.1px solid #b7b7b7;
                                }
                                .authSign {
                                    margin-top: 60px;
                                }
                                .highlght {
                                    background-color: transparent;
                                    color: #000000;
                                        padding: 6px;
                                    padding-top:;
                                        font-weight: bold;
                                        font-size: 19px;
                                }
                                
                            </style>
            
                    `
            
                            htmlcontent = mark.up(htmlcontent, bindvalues);
            
                            filepath = 'receipt' + (new Date()).toString("yyyyMMddHHMMss") + '.pdf';
                            console.log(filepath)
                            pdf.create(htmlcontent).toFile('./public/appfiles/receipt/' + filepath, function (err, res) {
                                if (err) return console.log(err);
                                
                            });
                            
                          
                           // res.sendFile(path.resolve('./public/appfiles/salespdf/invoice.pdf'));
            
                            res.status(200).send(filepath)
                            
                        })
                    })
                   
              
         })
        .catch((err) => res.status(400).send(err))

    }

}