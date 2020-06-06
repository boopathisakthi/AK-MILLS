var salesorder = mongoose.model('salesorder');
var Product = mongoose.model('MasterProduct');
var company = mongoose.model('MasterCompany');
var Branch = mongoose.model('Branch');
var Payment = mongoose.model('Payment');
const StockProcessDetails = mongoose.model('StockProcessDetails');
var msg91 = require("msg91")("81619ASNflfbcW3K55601452", "ZROBGZ", "1");
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var each = require('promise-each');
const path = require("path");


require('../../config/logger');


module.exports = {
    salesnodropdownlist(req, res) {
        salesorder.aggregate([{
            $match: {
                isdeleted: 0,
                // companyid: new mongoose.Types.ObjectId(req.session.companyid),
                // branchid: new mongoose.Types.ObjectId(req.session.branchid)
            }
        },


        {
            $project: {
                _id: 0,
                id: '$_id',
                name: "$invoiceno",
            }
        }
        ])
            .then((data) => { res.status(200).send(data); })
            .catch((error) => res.status(400).send(error));
    },
    invoiceno(req, res) {
        salesorder.aggregate([
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

                res.status(200).send({ billno: 'INV' + (data.length == 0 ? 1 : data[0].myCount + 1) })
            })
            .catch((error) => res.status(400).send(error))
    },
    insert(req, res) {
        if (req.body._id) {
            salesorder.findById(req.body._id)
                .then(data => {
                    if (!data) {
                        return res.status(404).send({
                            message: 'Data Not Found',
                        });
                    }

                    return data.updateOne({
                        invoiceno: req.body.invoiceno,
                        invoicedate: req.body.invoicedate,
                        duedate: req.body.duedate,
                        creditdays: req.body.creditdays,
                        reference: req.body.reference,
                        customerid: req.body.customerid,
                        subtotal: req.body.subtotal,
                        roundoff: req.body.roundoff,
                        roundofftype: req.body.roundofftype,
                        actualtotal: req.body.actualtotal,
                        payamount: req.body.payamount,
                        balance: req.body.balance,
                        total: req.body.total,
                        invoiceDetail: req.body.invoiceDetail,
                        gstdetail: req.body.gstdetail,
                        CustomerDetail: req.body.CustomerDetail,
                        hsncolumn: req.body.hsncolumn,
                        unitcolumn: req.body.unitcolumn,
                        discountcolumn: req.body.discountcolumn,
                        discountype: req.body.discountype,
                        taxtype: req.body.taxtype,
                        salesrep: req.body.salesrep,
                        companyid: req.session.companyid,
                        branchid: req.session.branchid,
                        modifiedby: req.session.userid,
                        note: req.body.note,
                        termsandconditions: req.body.termsandconditions,
                    })
                        .then((data5) => {




                            logger.log('info', 'logjson{ page : Sales, Acion : Update,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                            res.status(200).send({
                                status: 'success',
                                message: 'record Updated  successfully',

                            })
                        })
                })
                .catch(err => res.status(400).send(err))
        } else {
            console.log('---Insert process----')
            console.log(req.body.CustomerDetail)

            salesorder.create({
                invoiceno: req.body.invoiceno,
                invoicedate: req.body.invoicedate,
                duedate: req.body.duedate,
                creditdays: req.body.creditdays,
                reference: req.body.reference,
                customerid: req.body.customerid,
                subtotal: req.body.subtotal,
                roundoff: req.body.roundoff,
                roundofftype: req.body.roundofftype,
                actualtotal: req.body.actualtotal,
                payamount: req.body.paidamount,
                balance: req.body.balance,
                total: req.body.total,
                invoiceDetail: req.body.invoiceDetail,
                gstdetail: req.body.gstdetail,
                CustomerDetail: req.body.CustomerDetail,
                hsncolumn: req.body.hsncolumn,
                unitcolumn: req.body.unitcolumn,
                discountcolumn: req.body.discountcolumn,
                discountype: req.body.discountype,
                taxtype: req.body.taxtype,
                salesrep: req.body.salesrep,
                note: req.body.note,
                termsandconditions: req.body.termsandconditions,
                companyid: req.session.companyid,
                branchid: req.session.branchid,
                createdby: req.session.usrid,
                createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                isdeleted: '0'
            }).then((data) => {


                console.log('---SMS Sending Process completed----')
                msg91.send(req.body.CustomerDetail[0].mobile, "Thanks For Shopping in Zerobugz your invoice no is " + req.body.invoiceno + " And Bill Amount is " + req.body.total + "", function (err, response) {
                    if (err) {
                        res.status(400).send({
                            status: 'Error',
                            message: err
                        })
                        return null
                    }

                });

                logger.log('info', 'logjson{ page : SalesOrder, Acion : Insert,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                return res.status(200).send({
                    status: 'success',
                    message: 'record added successfully',
                    data,
                })


            })
                .catch((error) => {
                    res.status(400).send({
                        status: 'Error',
                        message: error
                    })
                })
        }

    },
    list(req, res) {
        console.log(req.url);
        var queryString = url.parse(req.url, true);
        var urlparms = queryString.query;
        // console.log(urlparms);
        var searchStr = {
            isdeleted: 0,
            companyid: new mongoose.Types.ObjectId(req.session.companyid),
            branchid: new mongoose.Types.ObjectId(req.session.branchid)
        };
        var recordsTotal = 0;
        var recordsFiltered = 0;
        salesorder.count({ isdeleted: 0 }, function (err, c) {
            recordsTotal = c;
            console.log('total count ' + c);
            salesorder.count(searchStr, function (err, c) {
                recordsFiltered = c;
                console.log('record fliter count ' + c);
                console.log('start ' + urlparms.start);
                console.log('length ' + urlparms.length);
                salesorder.aggregate(
                    [{
                        $match: {
                            isdeleted: 0,
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
                                    pagename: "Sales Entry",
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
                            from: "mastercustomers",
                            "localField": "customerid",
                            "foreignField": "_id",
                            as: "customer"
                        }
                    },
                    { $unwind: "$customer" },
                    {
                        $project: {
                            "_id": {
                                $concat: [{ $toString: "$_id" }, " - ", { $toString: "$roledetails.edit" }, "-", { $toString: "$roledetails.delete" }]
                            },
                            "invoicedate": { $dateToString: { format: "%Y-%m-%d", date: "$invoicedate" } },
                            "reference": 1,
                            "duedate": { $dateToString: { format: "%Y-%m-%d", date: "$duedate" } },
                            "customer.name": 1,
                            "invoiceno": 1,
                            "total": 1,

                        },
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
    testlist(req, res) {
        console.log('test')
        sales.aggregate(
            [
                {
                    $match: { _id: new mongoose.Types.ObjectId(req.params._id), isdeleted: 0 }
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
                        _id: { _id: "$_id", customerid: "$customerid", invoiceno: "$invoiceno", hsncolumn: "$hsncolumn", unitcolumn: "$unitcolumn", discountcolumn: "$discountcolumn" },
                        itemsSold: { $push: { qty: "$invoiceDetail.qty", productid: "$invoiceDetail.productid", name: "$MP.productname", rate: "$invoiceDetail.rate" } }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        customerid: "$_id.customerid",
                        invoiceno: "$_id.invoiceno",
                        invoiceDetail: "$itemsSold",

                    }
                }
            ]).then(data => { res.send(data) })

    },
    edit(req, res) {
        console.log(req.params._id);
        var id = req.params._id;
        salesorder.aggregate(
            [

                {
                    $match: { _id: new mongoose.Types.ObjectId(req.params._id), isdeleted: 0 }
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
                    $unwind: "$customer",
                },


                {
                    $lookup: {
                        from: "masterproducts",
                        "localField": "invoiceDetail.productid",
                        "foreignField": "_id",
                        as: "productdetail"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        "invoicedate": { $dateToString: { format: "%d-%m-%Y", date: "$invoicedate" } },
                        "reference": 1,
                        "customerid": 1,
                        "customer.name": 1,
                        "customer.gstin": 1,
                        "customer.billingstate": 1,
                        "invoiceno": 1,
                        "total": 1,
                        "creditdays": 1,
                        "dueamount": "$total",
                        "reference": 1,
                        "invoiceDetail": 1,

                        "productdetail.productname": 1,
                        "productdetail.openingstock": 1,
                        "productdetail.stockinhand": 1,
                        "productdetail._id": 1,
                        "unitcolumn": 1,
                        "hsncolumn": 1,
                        "discountcolumn": 1,
                        "roundoff": 1,
                        roundofftype: 1,
                        "discountype": 1,
                        "taxtype": 1,
                        "salesrep": 1,
                        termsandconditions: 1,
                        note: 1,




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
    delete(req, res) {
        salesorder.findById(req.params._id)
            .then(data => {
                if (!data) {
                    return res.status(404).send({
                        message: 'Data Not Found',
                    });
                }
                return data.updateOne({
                    isdeleted: 1
                })
                    .then((data1) => res.status(200).send({ status: 'success', message: 'Record deleted SuccessFully', data1 }))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));

    },
    invoicebill(req, res) {
        console.log(req.params._id)
        var filepath = '';
        let salesbilldata = [];

        salesorder.aggregate(
            [
                {
                    $match: { _id: new mongoose.Types.ObjectId(req.params._id), isdeleted: 0 }
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
                    $lookup: {
                        from: "mastercustomers",
                        "localField": "customerid",
                        "foreignField": "_id",
                        as: "customer"
                    }
                },
                {
                    $group:
                    {
                        _id: {
                            _id: "$_id",
                            customerid: "$customerid", "invoiceno": "$invoiceno", customer: "$customer",
                            "invoicedate": { $dateToString: { format: "%d-%m-%Y", date: "$invoicedate" } },
                            gstdetail: "$gstdetail", "total": "$total",
                            subtotal: "$subtotal", hsncolumn: "$hsncolumn", unitcolumn: "$unitcolumn",
                            discountcolumn: "$discountcolumn", roundoff: "$roundoff",
                            discountype: "$discountype", companyid: "$companyid", branchid: "$branchid"
                        },
                        itemsSold: { $push: { productname: '$MP.productname', qty: "$invoiceDetail.qty", productid: "$invoiceDetail.productid", name: "$MP.productname", rate: "$invoiceDetail.rate", amount: "$invoiceDetail.amount" } }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        invoiceno: "$_id.invoiceno",
                        invoiceDetail: "$itemsSold",
                        "customer": "$_id.customer",
                        invoicedate: "$_id.invoicedate",
                        gstdetail: "$_id.gstdetail",
                        subtotal: "$_id.subtotal",
                        total: "$_id.total",
                        "companyid": "$_id.companyid",
                        "branchid": "$_id.branchid",
                    }
                }
            ])
            .then((data) => {

                console.log(data)
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

                                const pdf = require('html-pdf');
                                const mark = require('markup-js');

                                let bindvalues = salesbilldata[0];

                                console.log(bindvalues.invoice[0].invoiceDetail)
                               
                                var htmlcontent = `
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
                               /******* New Update - Dhayalan ***********/
                               body
                               {
                               margin: 5px 15px 2px 15px;
                               }
                               
                               td.headtd {
                                   background-color: #e91010 !important;
                                   }
                               table thead.bgcolor th {
                                   background-color: #e91010 !important;
                                   }
                                   
                               .total {
                                   background-color: #e91010 !important;
                                   }
                               .vat, table tbody tr td.vat, table.vat tbody tr td 
                                   {
                                   vertical-align: middle !important;
                                   }
                               /******* New Update - Dhayalan ***********/
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
                                       <!-- border-left: 0.5px solid #b7b7b7; -->
                                   }
                               table th, table td {
                                   vertical-align: middle;
                                   padding: 5px;
                                   border-bottom: 0px;
                                   border-left: 0px;
                                       <!-- border-right: 0.5px solid #b7b7b7;-->
                                       border-top: 0.5px solid #b7b7b7;
                                   line-height: 1.2;
                               }
                               
                                table.inv_details th {
                                   border-bottom: 0.5px solid #fff;
                                   border-top: 0px;
                               }
                               table.inv_details td{
                                       border-bottom: 0.5px solid #fff;
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
                                   vertical-align: middle ;
                                   border-bottom:1px solid #fff;
                                   <!--border-color: #000000;-->
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
                                   <!--border-color: #000000;-->
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
                                   background-color: #9a9a9a;
                                   color: #FFFFFF;
                                   font-weight: bold;
                                   padding: 7px;
                                   display: inline-block;
                                   width:100%;
                               }
                               td.headtd {
                                   background-color: #9a9a9a;
                                   color: #FFFFFF;
                                   font-weight: bold;
                                   padding: 7px !important;;
                                   width:100%;
                                   font-size:17px !important;
                               }
                               td.headtd2 {
                                   font-weight: bold;
                                   padding: 7px !important;;
                                   width:100%;
                                   font-size:17px !important;
                               }
                               .bgColor {
                                   color: #9a9a9a;
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
                               <htmlpageheader name="">	<div class="trans">
                                       <a name="INV2"></a>
                                       <table border="0" cellspacing="0" cellpadding="0" class="noborder nopadding vat"><!--<col style="width: 30%">-->
                                           <tbody>
                                                               <tr><td ><p class="address nm"><b><big>{{company.companyname}}</big></b><br>{{company.address}}<br>T. Nagar,<br>{{company.city}} - {{company.pincode}}, {{company.state}}, India.<br>Phone : {{company.mobile}}<br>Email : {{company.email}}<br>GSTIN : {{company.gstno}}</p>
                               </td>
                                                   <td class="vat" width="30%">
                                                       <table class="noborder invMeta" style="width:100%">
                                                           <tbody>
                                                               <tr><td colspan="2" style='padding:10px !important'  class="headtd">&nbsp;Tax Invoice</td></tr>
                                                                                               <tr>
                                                                   <td class="label">Invoice Number</td>
                                                                   <td>: <b>{{invoice.0.invoiceno}}</b></td>
                                                               </tr>
                                                               
                                                               <tr>
                                                                   <td class="label">Invoice Date</td>
                                                                   <td>: <b>{{invoice.0.invoicedate}}</b></td>
                                                               </tr>
                                                           
                                                               </tbody>
                                                       </table>
                                                   </td>
                                               </tr>
                               <tr class="vam">
                                               <td class="bot ac vam" style="border-bottom:0.5px solid #dfdfdf" colspan="2"></td>
                                           </tr></tbody>
                                       </table>
                                   </div><div class="trans"><table border="0" cellspacing="0" cellpadding="0" class="noborder vat" style="padding-top:5px;padding-bottom:5px;"><tbody>
                                               <tr>
                                                   <td width="50%" style="padding:5px;">
                                                       <div ><p class="fw nm" style="padding-bottom: 5px;"><span style="padding-bottom: 5px;">Issued To</span></p><b class="address nm">{{invoice.0.customer.0.name}}</b><p class="nm">GSTIN : {{invoice.0.customer.0.gstin}}</p><p class="nm">POS : {{invoice.0.customer.0.shippingstate}}</p></div>
                                               </td>
                                                                   <td width="50%" style="padding:5px;"><div><p class="fw nm" style="padding-bottom: 5px;">Billing Address</p><p class="address nm">{{invoice.0.customer.0.shippingaddress}}<br>NRKR Road,<br>Sivakasi - {{invoice.0.customer.0.shippingpincode}},{{invoice.0.customer.0.shippingstate}}, India.<br>Mobile :{{invoice.0.customer.0.mobile}}<br>Email : {{invoice.0.customer.0.email}}</p>
                               </div></td>				</tr>
                                           </tbody>
                                       </table>	</div>
                                   <!-- /page_header -->
                                   </htmlpageheader><sethtmlpageheader name="" value="on" show-this-page="1" /><div class="trans"><table border="0" cellspacing="0" cellpadding="0" class="nbv nbb vat " width="50%">
                                   <tbody>
                                       <tr class="custFields"><td  width="50%"><p class="nm"><span>Buyer's Order No#: </span><br><b>ORD000125</b></p></td><td  width="50%"><p class="nm"><span>Buyer's Order Date: </span><br><b>17/09/2018</b></p></td>		</tr>
                                   </tbody>
                               </table>
                                   </div>	
                                   <table align='left' cellspacing="0" cellpadding="0" style="width:100%" class="inv_details wpw vat nbb bot ft" style="width:100%;">
                                <thead  class="bgcolor vam" ><tr>
                               <th width="6%" style="background-color:#9a9a9a" class="first">SNo</th>
                               <th width:50% style="background-color:#9a9a9a" class="">ItemDescription</th>
                              
                               <th width="15%" style="background-color:#9a9a9a" class="ac">Qty</th>
                               <th width="12%" style="background-color:#9a9a9a" class="ar">Rate<br><small>(INR)</small></th>
          
                               <th width="25%" class="ar" style="background-color:#9a9a9a">Amount<br><small>(INR)</small></th>
                               </tr>
                               </thead>
                             <tbody style="background-color: #dfdfdf;">
                             <tr class="tbody" {{invoice.0.invoiceDetail}}>
                               <td width="6%" class="ac">1</td>
                               <td class="ac" width:50%>{{productname}}<p class="desc nm pretxt"><small></small></p></td>
                              
                               <td width="15%" class="ar"> {{qty}}<br><small></small></td>
                               <td width="12%" class="ar"> Rs.{{rate}}</td>
                        
                               <td width="25%" class="ar">Rs.{{amount}}</td>
                            </tr {{/invoice.0.invoiceDetail}}>
                               
                               
                            
                               <tr class="subtot">				<!----*********************For discount total********************---->
                                               
                               <td class="ar bob sss" style="border-bottom:1px solid black;background-color: none !important" colspan="3">
                                                           <label  class="disc">Less : Discount</label>&nbsp;</td>
                                               <td class="ar subTotal title bob ass" style="border-bottom:1px solid black" colspan="1"><b>Sub Total</b></td>
                                               <td style="width: 15%;" class="ar subTotal value bob" style="border-bottom:1px solid black"><b>{{invoice.0.subtotal}}</b></td>		</tr></table><table  align="left" cellspacing="0" cellpadding="0" width="100%"><tbody>
                                       </tbody>
                                   </table>
                               <table align="left" border="0" cellspacing="0" cellpadding="0" class="footTable vat nbh2 wpw" style="width:100%;clear:both;">	<!-- <thead>
                                       <tr>
                                           <th class="nb np"></th>
                                           <th class="nb np"></th>
                                       </tr>
                                   </thead> -->
                                   <tbody>
                                       <tr>
                                           <td width="60%" class="wrp">
                                               <div class="nm amtinwords" style="white-space: pre-line; word-wrap: break-word !important;">Amount (in words) :<br>
                                              Under Process Amount in Words</div><br><span class="nm notes pretxt">You are a Valuable Customer</span><br><br><br>			</td>
                                           <td width="40%" class="np wrp" style="padding:0px !important;">
                                               <table align="left" cellspacing="0" cellpadding="0" class="noborder">
                                                   <col style="width:36%;" />
                                                   <col style="width:30%;" />
                                                   <col style="width:34%;" />
                                                   <!-- <thead>
                                                       <tr>
                                                           <th class="nb np"></th>
                                                           <th class="nb np"></th>
                                                           <th class="nb np"></th>
                                                       </tr>
                                                   </thead> -->
                                                   <tbody style="background-color: #dfdfdf;" {{invoice.0.gstdetail}} >
                                                   {{if igst|between>0>0}} 
                                                   
                                                   <tr>
                                               
                                                   <td  class="ar tax title wrp" colspan="2">SGST {{percentage}}%: </small>
                                               
                                                   </td>
                                                   <td class="ar tax value wrp"><b> {{sgst}}</b></td>
                                                   </tr>
                                                   <tr> 
                                                   <td  borer="none"  class="ar tax title wrp" colspan="2">CGST  {{percentage}}%: <small></small>
                                                   </td>
                                                   <td class="ar tax value wrp"><b> {{cgst}}</b></td>
                                                   </tr>
                                                   {{else}} 
                                                   <tr>
                                                   <td></td> 
                                                   <td borer="none" class="ar tax title wrp" colspan="1">IGST {{percentage}}+{{percentage}}%: </small>
                                               
                                                   </td>
                                                   <td class="ar tax value wrp"><b>{{igst}}</b></td>
                                                   <td></td>
                                                   </tr>
               
                                                   {{/if}}
                                                   
                                                      
                                                   </tr>
                                                 
                                                   </tbody  {{/invoice.0.gstdetail}}>
                                                     <tr>
                                                       <!-- td class="total value vam wrp" style="border-top: 0.5px solid #000000"><b>Total</b></td -->
                                                       <td class="ar total value vam wrp npr" colspan="3"  style="background-color:#9a9a9a">
                                                       <small ><b>Total&nbsp;&nbsp;&nbsp;</b></small><b style="margin-right: 4px;">Rs {{invoice.0.total}}</b></td>
                                                       </tr>
                                                      
                                                           <tr>
                                                       <td valign="top" colspan="3" class="vat ar eoe nb">
                                                           <p class="nm ar"><small>E & O.E</small></p>
                                                       </td>
                                                   </tr>
                                               </table>
                                           </td>
                                       </tr>
                                   </tbody>
                               </table><table align="left" cellspacing="0" cellpadding="0" class="footTable vat nbt wpw" autosize="1" style="page-break-inside: avoid ;     margin-top: 2px;    page-break-inside: avoid;    border-top: 1px solid #dfdfdf;">
                                   <!--<col style="width:50%;">
                                   <col style="width:50%;">-->
                                   <tbody><tr>
                                           <td valign="bottom" colspan="2" class="vab terms" ><div class="noside " style="display:inline-block;"><span class="nm pretxt">Terms :<br>Goods once sold will not be taken back</span></div>
                                           </td>
                                       </tr><tr>
                                           <td class="ar bgColor" colspan="2" style="color:#9a9a9a" >For companyName</td>
                                       </tr><tr><td valign="bottom" class="vab nbr custsign bgColor" ></td><td valign="bottom" class="vab ar authsign bgColor" style="color:#9a9a9a" ><br><br><br><span class="" style="margin-top:40px;float:right;color:#9a9a9a">Authorized Signature</span></td></tr>
                                   </tbody>
                               </table><p class="footerTxt nm pretxt">This is a computer generated document</p></div>
                               <style>
                               
                               
                               .detailTable {
                                   width: 100%;
                                   display: inline-block;
                                   margin-top: 10px;
                               }
                               .accInfo {
                                   width: auto;
                               }
                               table, table td, table th {
                                   <!--border-color:black; -->
                                   
                                   /*$headColor == "transparent"?'#000000':$borderColor*/
                               }
                               .subtot td {
                                   border-top: none;
                                   border-bottom: none;
                                       
                               }
                               
                               table thead.bgcolor th {
                                   background-color: #9a9a9a;
                                   color: #FFFFFF !important;
                               }
                               p.curr small {
                                   width: 50%;
                                   text-align: center;
                                   display: inline-block;
                               }
                               .tc {
                                   color: #9a9a9a !important;
                               }
                               .total {
                                   background-color: #9a9a9a ;
                                   color: #FFFFFF;
                               }
                               .vl {
                                    border-left: 4px solid #9a9a9a !important;
                                   padding-left:5px !important;
                               }
                               .ft{
                                   border-top:1px solid black !important;
                               }
                               
                               .as {
                                   color:black;
                               }
                               .disc{
                                   font-style: italic;
                                   color: grey;
                                   font-weight: bold;
                                   padding-right: 15px;
                               }
                               .bob {
                                   border-bottom:1px solid grey !important;
                               }
                               .wrp {	
                                   white-space: nowrap !important;
                               }
                               .subTotal,.total {
                                   border-bottom:1px solid #000000 !important;
                               }
                               .first {
                                   border-right:0.5px solid #000000;
                                   border-left:1px solid #000000;
                               }
                               .total {
                                   border-top:none !important;
                               }
                               .bob {
                                   border-bottom:1px solid grey !important;
                               }
                               </style>
                               <style>
                               .invMeta {
                                   width: auto;
                               }
                               </style>
                           
                             
                                `;

                                htmlcontent = mark.up(htmlcontent, bindvalues);

                                filepath = 'salesorder' + (new Date()).toString("yyyyMMddHMMss") + '.pdf';
                                pdf.create(htmlcontent).toFile('./public/appfiles/salesorder/' + filepath, function (err, res) {
                                    if (err) return console.log(err);
                                });
                               res.status(200).send(filepath)
                             

                            })

                    })


            }).catch((err)=>{
                console.log(err)
                res.status(400).send(err)
            })
    },
    amountdateils(req, res) {
        sales.aggregate([{
            $match: {
                isdeleted: 0,
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
    customermaildetails(req, res) {
        sales.aggregate(
            [

                {
                    $match: { _id: new mongoose.Types.ObjectId(req.params._id), isdeleted: 0 }
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
                    $unwind: "$customer",
                },

                {
                    $project: {
                        _id: 1,
                        "customerid": 1,
                        "customer.name": 1,
                        "customer.email": 1,
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
    sendmailtocustomer(req, res) {
        var filepath = '';
        let salesbilldata = [];

        sales.aggregate(
            [

                {
                    $match: { _id: new mongoose.Types.ObjectId(req.params._id), isdeleted: 0 }
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
                    $lookup: {
                        from: "mastercustomers",
                        "localField": "customerid",
                        "foreignField": "_id",
                        as: "customer"
                    }
                },
                {
                    $group:
                    {
                        _id: {
                            _id: "$_id",
                            customerid: "$customerid", "invoiceno": "$invoiceno", customer: "$customer",
                            "invoicedate": { $dateToString: { format: "%d-%m-%Y", date: "$invoicedate" } },
                            gstdetail: "$gstdetail", "total": "$total",
                            subtotal: "$subtotal", hsncolumn: "$hsncolumn", unitcolumn: "$unitcolumn",
                            discountcolumn: "$discountcolumn", roundoff: "$roundoff",
                            discountype: "$discountype", companyid: "$companyid", branchid: "$branchid"
                        },
                        itemsSold: { $push: { productname: 'waterbottle', qty: "$invoiceDetail.qty", productid: "$invoiceDetail.productid", name: "$MP.productname", rate: "$invoiceDetail.rate", amount: "$invoiceDetail.amount" } }
                    }
                },


                {
                    $project: {
                        _id: 0,

                        invoiceno: "$_id.invoiceno",
                        invoiceDetail: "$itemsSold",
                        "customer": "$_id.customer",
                        invoicedate: "$_id.invoicedate",
                        gstdetail: "$_id.gstdetail",
                        subtotal: "$_id.subtotal",
                        total: "$_id.total",


                        // "unitcolumn": "$_id.unitcolumn",
                        // "hsncolumn":"$_id.hsncolumn",
                        // "discountcolumn":"$_id.discountcolumn",
                        // "roundoff":"$_id.roundoff",
                        // "discountype": "$_id.discountype",

                        "companyid": "$_id.companyid",
                        "branchid": "$_id.branchid",
                    }
                }
            ])
            .then((data) => {

                console.log(data)
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

                                const pdf = require('html-pdf');
                                const mark = require('markup-js');

                                let bindvalues = salesbilldata[0];

                                console.log(bindvalues.invoice[0].invoiceDetail)
                                // invoiceDetail.productdetail.0.productname
                                // console.log(bindvalues[0].company.companyname)

                                var htmlcontent = `
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
                               /******* New Update - Dhayalan ***********/
                               body
                               {
                               margin: 5px 15px 2px 15px;
                               }
                               
                               td.headtd {
                                   background-color: #e91010 !important;
                                   }
                               table thead.bgcolor th {
                                   background-color: #e91010 !important;
                                   }
                                   
                               .total {
                                   background-color: #e91010 !important;
                                   }
                               .vat, table tbody tr td.vat, table.vat tbody tr td 
                                   {
                                   vertical-align: middle !important;
                                   }
                               /******* New Update - Dhayalan ***********/
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
                                       <!-- border-left: 0.5px solid #b7b7b7; -->
                                   }
                               table th, table td {
                                   vertical-align: middle;
                                   padding: 5px;
                                   border-bottom: 0px;
                                   border-left: 0px;
                                       <!-- border-right: 0.5px solid #b7b7b7;-->
                                       border-top: 0.5px solid #b7b7b7;
                                   line-height: 1.2;
                               }
                               
                                table.inv_details th {
                                   border-bottom: 0.5px solid #fff;
                                   border-top: 0px;
                               }
                               table.inv_details td{
                                       border-bottom: 0.5px solid #fff;
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
                                   vertical-align: middle ;
                                   border-bottom:1px solid #fff;
                                   <!--border-color: #000000;-->
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
                                   <!--border-color: #000000;-->
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
                                   background-color: #9a9a9a;
                                   color: #FFFFFF;
                                   font-weight: bold;
                                   padding: 7px;
                                   display: inline-block;
                                   width:100%;
                               }
                               td.headtd {
                                   background-color: #9a9a9a;
                                   color: #FFFFFF;
                                   font-weight: bold;
                                   padding: 7px !important;;
                                   width:100%;
                                   font-size:17px !important;
                               }
                               td.headtd2 {
                                   font-weight: bold;
                                   padding: 7px !important;;
                                   width:100%;
                                   font-size:17px !important;
                               }
                               .bgColor {
                                   color: #9a9a9a;
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
                               <htmlpageheader name="">	<div class="trans">
                                       <a name="INV2"></a>
                                       <table border="0" cellspacing="0" cellpadding="0" class="noborder nopadding vat"><!--<col style="width: 30%">-->
                                           <tbody>
                                                               <tr><td ><p class="address nm"><b><big>{{company.companyname}}</big></b><br>{{company.address}}<br>T. Nagar,<br>{{company.city}} - {{company.pincode}}, {{company.state}}, India.<br>Phone : {{company.mobile}}<br>Email : {{company.email}}<br>GSTIN : {{company.gstno}}</p>
                               </td>
                                                   <td class="vat" width="30%">
                                                       <table class="noborder invMeta" style="width:100%">
                                                           <tbody>
                                                               <tr><td colspan="2" style='padding:10px !important'  class="headtd">&nbsp;Tax Invoice</td></tr>
                                                                                               <tr>
                                                                   <td class="label">Invoice Number</td>
                                                                   <td>: <b>{{invoice.0.invoiceno}}</b></td>
                                                               </tr>
                                                               
                                                               <tr>
                                                                   <td class="label">Invoice Date</td>
                                                                   <td>: <b>{{invoice.0.invoicedate}}</b></td>
                                                               </tr>
                                                           
                                                               </tbody>
                                                       </table>
                                                   </td>
                                               </tr>
                               <tr class="vam">
                                               <td class="bot ac vam" style="border-bottom:0.5px solid #dfdfdf" colspan="2"></td>
                                           </tr></tbody>
                                       </table>
                                   </div><div class="trans"><table border="0" cellspacing="0" cellpadding="0" class="noborder vat" style="padding-top:5px;padding-bottom:5px;"><tbody>
                                               <tr>
                                                   <td width="50%" style="padding:5px;">
                                                       <div ><p class="fw nm" style="padding-bottom: 5px;"><span style="padding-bottom: 5px;">Issued To</span></p><b class="address nm">{{invoice.0.customer.0.name}}</b><p class="nm">GSTIN : {{invoice.0.customer.0.gstin}}</p><p class="nm">POS : {{invoice.0.customer.0.shippingstate}}</p></div>
                                               </td>
                                                                   <td width="50%" style="padding:5px;"><div><p class="fw nm" style="padding-bottom: 5px;">Billing Address</p><p class="address nm">{{invoice.0.customer.0.shippingaddress}}<br>NRKR Road,<br>Sivakasi - {{invoice.0.customer.0.shippingpincode}},{{invoice.0.customer.0.shippingstate}}, India.<br>Mobile :{{invoice.0.customer.0.mobile}}<br>Email : {{invoice.0.customer.0.email}}</p>
                               </div></td>				</tr>
                                           </tbody>
                                       </table>	</div>
                                   <!-- /page_header -->
                                   </htmlpageheader><sethtmlpageheader name="" value="on" show-this-page="1" /><div class="trans"><table border="0" cellspacing="0" cellpadding="0" class="nbv nbb vat " width="50%">
                                   <tbody>
                                       <tr class="custFields"><td  width="50%"><p class="nm"><span>Buyer's Order No#: </span><br><b>ORD000125</b></p></td><td  width="50%"><p class="nm"><span>Buyer's Order Date: </span><br><b>17/09/2018</b></p></td>		</tr>
                                   </tbody>
                               </table>
                                   </div>	
                                   <table align='left' cellspacing="0" cellpadding="0" style="width:100%" class="inv_details wpw vat nbb bot ft" style="width:100%;">
                                <thead  class="bgcolor vam" ><tr>
                               <th width="6%" style="background-color:#9a9a9a" class="first">SNo</th>
                               <th width:50% style="background-color:#9a9a9a" class="">ItemDescription</th>
                              
                               <th width="15%" style="background-color:#9a9a9a" class="ac">Qty</th>
                               <th width="12%" style="background-color:#9a9a9a" class="ar">Rate<br><small>(INR)</small></th>
          
                               <th width="25%" class="ar" style="background-color:#9a9a9a">Amount<br><small>(INR)</small></th>
                               </tr>
                               </thead>
                             <tbody style="background-color: #dfdfdf;">
                             <tr class="tbody" {{invoice.0.invoiceDetail}}>
                               <td width="6%" class="ac">1</td>
                               <td class="ac" width:50%>{{productname}}<p class="desc nm pretxt"><small></small></p></td>
                              
                               <td width="15%" class="ar"> {{qty}}<br><small></small></td>
                               <td width="12%" class="ar"> Rs.{{rate}}</td>
                        
                               <td width="25%" class="ar">Rs.{{amount}}</td>
                            </tr {{/invoice.0.invoiceDetail}}>
                               
                               
                            
                               <tr class="subtot">				<!----*********************For discount total********************---->
                                               
                               <td class="ar bob sss" style="border-bottom:1px solid black;background-color: none !important" colspan="3">
                                                           <label  class="disc">Less : Discount</label>&nbsp;</td>
                                               <td class="ar subTotal title bob ass" style="border-bottom:1px solid black" colspan="1"><b>Sub Total</b></td>
                                               <td style="width: 15%;" class="ar subTotal value bob" style="border-bottom:1px solid black"><b>{{invoice.0.subtotal}}</b></td>		</tr></table><table  align="left" cellspacing="0" cellpadding="0" width="100%"><tbody>
                                       </tbody>
                                   </table>
                               <table align="left" border="0" cellspacing="0" cellpadding="0" class="footTable vat nbh2 wpw" style="width:100%;clear:both;">	<!-- <thead>
                                       <tr>
                                           <th class="nb np"></th>
                                           <th class="nb np"></th>
                                       </tr>
                                   </thead> -->
                                   <tbody>
                                       <tr>
                                           <td width="60%" class="wrp">
                                               <div class="nm amtinwords" style="white-space: pre-line; word-wrap: break-word !important;">Amount (in words) :<br>
                                              Under Process Amount in Words</div><br><span class="nm notes pretxt">You are a Valuable Customer</span><br><br><br>			</td>
                                           <td width="40%" class="np wrp" style="padding:0px !important;">
                                               <table align="left" cellspacing="0" cellpadding="0" class="noborder">
                                                   <col style="width:36%;" />
                                                   <col style="width:30%;" />
                                                   <col style="width:34%;" />
                                                   <!-- <thead>
                                                       <tr>
                                                           <th class="nb np"></th>
                                                           <th class="nb np"></th>
                                                           <th class="nb np"></th>
                                                       </tr>
                                                   </thead> -->
                                                   <tbody style="background-color: #dfdfdf;" {{invoice.0.gstdetail}} >
                                                   {{if igst|between>0>0}} 
                                                   
                                                   <tr>
                                               
                                                   <td  class="ar tax title wrp" colspan="2">SGST {{percentage}}%: </small>
                                               
                                                   </td>
                                                   <td class="ar tax value wrp"><b> {{sgst}}</b></td>
                                                   </tr>
                                                   <tr> 
                                                   <td  borer="none"  class="ar tax title wrp" colspan="2">CGST  {{percentage}}%: <small></small>
                                                   </td>
                                                   <td class="ar tax value wrp"><b> {{cgst}}</b></td>
                                                   </tr>
                                                   {{else}} 
                                                   <tr>
                                                   <td></td> 
                                                   <td borer="none" class="ar tax title wrp" colspan="1">IGST {{percentage}}+{{percentage}}%: </small>
                                               
                                                   </td>
                                                   <td class="ar tax value wrp"><b>{{igst}}</b></td>
                                                   <td></td>
                                                   </tr>
               
                                                   {{/if}}
                                                   
                                                      
                                                   </tr>
                                                 
                                                   </tbody  {{/invoice.0.gstdetail}}>
                                                     <tr>
                                                       <!-- td class="total value vam wrp" style="border-top: 0.5px solid #000000"><b>Total</b></td -->
                                                       <td class="ar total value vam wrp npr" colspan="3"  style="background-color:#9a9a9a">
                                                       <small ><b>Total&nbsp;&nbsp;&nbsp;</b></small><b style="margin-right: 4px;">Rs {{invoice.0.total}}</b></td>
                                                       </tr>
                                                      
                                                           <tr>
                                                       <td valign="top" colspan="3" class="vat ar eoe nb">
                                                           <p class="nm ar"><small>E & O.E</small></p>
                                                       </td>
                                                   </tr>
                                               </table>
                                           </td>
                                       </tr>
                                   </tbody>
                               </table><table align="left" cellspacing="0" cellpadding="0" class="footTable vat nbt wpw" autosize="1" style="page-break-inside: avoid ;     margin-top: 2px;    page-break-inside: avoid;    border-top: 1px solid #dfdfdf;">
                                   <!--<col style="width:50%;">
                                   <col style="width:50%;">-->
                                   <tbody><tr>
                                           <td valign="bottom" colspan="2" class="vab terms" ><div class="noside " style="display:inline-block;"><span class="nm pretxt">Terms :<br>Goods once sold will not be taken back</span></div>
                                           </td>
                                       </tr><tr>
                                           <td class="ar bgColor" colspan="2" style="color:#9a9a9a" >For companyName</td>
                                       </tr><tr><td valign="bottom" class="vab nbr custsign bgColor" ></td><td valign="bottom" class="vab ar authsign bgColor" style="color:#9a9a9a" ><br><br><br><span class="" style="margin-top:40px;float:right;color:#9a9a9a">Authorized Signature</span></td></tr>
                                   </tbody>
                               </table><p class="footerTxt nm pretxt">This is a computer generated document</p></div>
                               <style>
                               
                               
                               .detailTable {
                                   width: 100%;
                                   display: inline-block;
                                   margin-top: 10px;
                               }
                               .accInfo {
                                   width: auto;
                               }
                               table, table td, table th {
                                   <!--border-color:black; -->
                                   
                                   /*$headColor == "transparent"?'#000000':$borderColor*/
                               }
                               .subtot td {
                                   border-top: none;
                                   border-bottom: none;
                                       
                               }
                               
                               table thead.bgcolor th {
                                   background-color: #9a9a9a;
                                   color: #FFFFFF !important;
                               }
                               p.curr small {
                                   width: 50%;
                                   text-align: center;
                                   display: inline-block;
                               }
                               .tc {
                                   color: #9a9a9a !important;
                               }
                               .total {
                                   background-color: #9a9a9a ;
                                   color: #FFFFFF;
                               }
                               .vl {
                                    border-left: 4px solid #9a9a9a !important;
                                   padding-left:5px !important;
                               }
                               .ft{
                                   border-top:1px solid black !important;
                               }
                               
                               .as {
                                   color:black;
                               }
                               .disc{
                                   font-style: italic;
                                   color: grey;
                                   font-weight: bold;
                                   padding-right: 15px;
                               }
                               .bob {
                                   border-bottom:1px solid grey !important;
                               }
                               .wrp {	
                                   white-space: nowrap !important;
                               }
                               .subTotal,.total {
                                   border-bottom:1px solid #000000 !important;
                               }
                               .first {
                                   border-right:0.5px solid #000000;
                                   border-left:1px solid #000000;
                               }
                               .total {
                                   border-top:none !important;
                               }
                               .bob {
                                   border-bottom:1px solid grey !important;
                               }
                               </style>
                               <style>
                               .invMeta {
                                   width: auto;
                               }
                               </style>
                           
                             
                                `;

                                htmlcontent = mark.up(htmlcontent, bindvalues);

                                filepath = 'invoice' + (new Date()).toString("yyyy-MM-dd HH-MM-ss") + '.pdf';
                                pdf.create(htmlcontent).toFile('./public/appfiles/salespdf/' + filepath, function (err, res) {
                                    if (err) return console.log(err);
                                    // { filename: '/app/businesscard.pdf' }
                                });
                                var transporter = nodemailer.createTransport(smtpTransport({
                                    service: 'gmail',
                                    auth: {
                                        user: 'boopathisakthi52@gmail.com', // generated ethereal user
                                        pass: '9443469845', // generated ethereal password
                                    }
                                }));
                                console.log(filepath)
                                var attachments = [{ filename: filepath, path: __dirname + './../../public/appfiles/salespdf/' + filepath, contentType: 'application/pdf' }];
                                var mailOptions = {
                                    from: '"Boopathi Sakthi" <boopathisakthi52@gmail.com>', // sender address
                                    to: "boopathisakthizerobugz@gmail.com,dhaya1sss@gmail.com,umamanic5@gmail.com",// list of receivers
                                    subject: req.body.subject, // Subject line
                                    attachments: attachments,
                                    text: req.body.mailcontent, // plain text body
                                    // html: `
                                    // <body>

                                    // <h2> Welcome to Zerobugz!</h2>


                                    // <p>The focus of Zero Bugz is in providing cost-effective Software development Services in the field of Information Technology.</

                                    // </body>`


                                };


                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        return res.status(400).send(error)
                                    } else {
                                        // '../../Sales/SalesEntry/invoice.ejs'

                                        return res.status(200).send({ message: 'Mail Sended Successfully' })

                                    }
                                });


                            })

                    })


            })






    }

}