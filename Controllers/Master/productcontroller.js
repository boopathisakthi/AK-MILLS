const mongoose = require('mongoose');
var Product = mongoose.model('MasterProduct');
const StockProcessDetails = mongoose.model('StockProcessDetails');
const Purchase = mongoose.model('Purchase');
require("datejs");
require('../../config/logger');
var url = require('url');
module.exports = {
    insert(req, res) {
        console.log(req.body)
        if (req.body._id) {
            Product.findById(req.body._id)
                .then((data) => {
                    if (!data) {
                        return res.status(400).send({
                            status: 'error',
                            messag: 'Data is Not availble'
                        })
                    } else {

                        data.updateOne({
                            productname: req.body.productname.toLowerCase() || data.productname,
                            itemcode: req.body.itemcode || data.itemcode,
                            unitid: req.body.unitid || data.unitid,
                            type: req.body.type || data.type,
                            taxinclusive: req.body.taxinclusive || data.taxinclusive,
                            salesprice: req.body.salesprice || data.salesprice,
                            purchaseprice: req.body.purchaseprice || data.purchaseprice,
                         //   mrp: req.body.mrp || data.mrp,
                            taxid: req.body.taxid || data.taxid,
                          //  hsnorsac_code: req.body.hsnorsac_code || data.hsnorsac_code,
                            categoryid: req.body.categoryid || data.categoryid,
                            subcategoryid: req.body.subcategoryid || data.subcategoryid,
                            minimumstock: req.body.minimumstock || data.minimumstock,
                            openingstock: req.body.openingstock || data.openingstock,
                            branchid: req.session.branchid || data.branchid,
                            companyid: req.session.companyid || data.companyid,
                            updatedby: req.session.usrid || data.userid,
                            updateddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                            isdeleted: '0'
                        })
                            .then((data1) => {

                                StockProcessDetails.findOne({ isdeleted: 0, productid: req.body._id, branchid: req.session.branchid })
                                    .then((data) => {

                                        if (!data) {
                                            console.log('iga varathu')
                                            StockProcessDetails.create({
                                                productid: req.body._id,
                                                openingstock: req.body.openingstock,
                                                purchaseqty: 0,
                                                salesqty: 0,
                                                stock_transfer: 0,
                                                stock_received: 0,
                                                branchid: req.session.branchid,
                                                companyid: req.session.companyid,
                                                createdby: req.session.usrid,
                                                createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                                                isdeleted: '0'
                                            })
                                        }
                                        else {
                                            data.updateOne({
                                                openingstock: req.body.openingstock,
                                                updatedby: req.session.usrid || data.userid,
                                                updateddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                                            }).then((data) => {

                                            })
                                        }
                                    })

                                logger.log('info', 'logjson{ page : MasterProduct, Acion : update,Process : Success,_id:' + req.body._id + ',userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                                res.status(200).send({
                                    status: 'success',
                                    message: 'Record Update SuccessFully'
                                })
                            })
                    }
                })
        } else {
            Product.findOne({ isdeleted: 0, productname: req.body.productname.toLowerCase() })
                .then((data) => {
                    if (!data) {
                        Product.create({
                            productname: req.body.productname.toLowerCase(),
                            itemcode: req.body.itemcode,
                            unitid: req.body.unitid,
                            type: req.body.type,
                            taxinclusive: req.body.taxinclusive,
                            salesprice: req.body.salesprice,
                            purchaseprice: req.body.purchaseprice,
                          //  mrp: req.body.mrp,
                            taxid: req.body.taxid,
                           // hsnorsac_code: req.body.hsnorsac_code,
                            categoryid: req.body.categoryid,
                            subcategoryid: req.body.subcategoryid,
                            minimumstock: req.body.minimumstock,
                            openingstock: req.body.openingstock,
                            stockinhand: 0,
                            branchid: req.session.branchid,
                            companyid: req.session.companyid,
                            createdby: req.session.usrid,
                            createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                            isdeleted: '0'
                        }).then((data) => {
                            StockProcessDetails.create({
                                productid: data._id,
                                openingstock: req.body.openingstock,
                                purchaseqty: 0,
                                salesqty: 0,
                                stock_transfer: 0,
                                stock_received: 0,
                                branchid: req.session.branchid,
                                companyid: req.session.companyid,
                                createdby: req.session.usrid,
                                createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                                isdeleted: '0'
                            })
                            logger.log('info', 'logjson{ page : MasterProduct, Acion : Insert,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                            res.status(200).send({

                                status: 'success',
                                message: 'record added successfully'
                            })
                        })
                            .catch((error) => {
                                res.status(400).send({
                                    status: 'Error',
                                    message: error
                                })
                            })
                    } else {
                        return res.status(400).send('Product Name already Used')
                    }
                })

        }

    },
    list(req, res) {
        console.log(req.url);
        var queryString = url.parse(req.url, true);
        var urlparms = queryString.query;
        var orderby = {};
        if (urlparms['order[0][column]'] == '0') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { _id: -1 } };
            }
            else {
                orderby = { $sort: { _id: 1 } };
            }
        } else if (urlparms['order[0][column]'] == '1') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { productname: -1 } };
            }
            else {
                orderby = { $sort: { productname: 1 } };
            }
        } else if (urlparms['order[0][column]'] == '2') {

            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { itemcode: -1 } };
            }
            else {
                orderby = { $sort: { itemcode: 1 } };
            }
        } else if (urlparms['order[0][column]'] == '3') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { type: -1 } };
            }
            else {
                orderby = { $sort: { type: 1 } };
            }
        }
        else if (urlparms['order[0][column]'] == '4') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { openingstock: -1 } };
            }
            else {
                orderby = { $sort: { openingstock: 1 } };
            }
        } console.log(orderby);
        var searchStr = urlparms['search[value]'];
        if (urlparms['search[value]']) {
            var regex = new RegExp(urlparms['search[value]'], "i")
            searchStr = {
                $match: {
                    $or: [
                        { 'productname': regex },
                        { 'itemcode': regex },
                        { 'type': regex },
                        { 'openingstock': regex },
                    ],
                    isdeleted: 0,
                    //  companyid: new mongoose.Types.ObjectId(req.session.companyid),
                    //  branchid: new mongoose.Types.ObjectId(req.session.branchid)
                }

            };
        } else {
            searchStr = {
                $match: {
                    isdeleted: 0,
                    //  companyid: new mongoose.Types.ObjectId(req.session.companyid),
                    //  branchid: new mongoose.Types.ObjectId(req.session.branchid)
                }
            };
        }
        console.log(searchStr)
        var recordsTotal = 0;
        var recordsFiltered = 0;
        Product.count({ isdeleted: 0 }, function (err, c) {
            recordsTotal = c;
            console.log('total count ' + c);
            Product.count({ isdeleted: 0 }, function (err, c) {
                recordsFiltered = c;
                console.log('record fliter count ' + c);
                console.log('start ' + urlparms.start);
                console.log('length ' + urlparms.length);
                Product.aggregate([
                    searchStr,
                    orderby,
                    {

                        $lookup: {
                            from: "rolemappings",
                            "let": { "id": new mongoose.Types.ObjectId(req.session.roleid) },
                            "pipeline": [{
                                "$match": {
                                    isdeleted: 0,
                                    pagename: "Product",
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
                            "_id": {
                                $concat: [{ $toString: "$_id" }, " - ", { $toString: "$roledetails.edit" }, "-", { $toString: "$roledetails.delete" }]


                            },
                            "productname": 1,
                            "itemcode": 1,
                            "type": 1,
                            // availbleqty: { $subtract: [{ '$add': [{ "$sum": '$stockprocessdetails.openingstock' }, { "$sum": '$stockprocessdetails.purchaseqty' }, { "$sum": '$stockprocessdetails.stock_received' }] }, { '$add': [{ "$sum": '$stockprocessdetails.salesqty' }, { "$sum": '$stockprocessdetails.stock_transfer' }] }] },
                            "openingstock": { $subtract: [{ '$add': [{ "$sum": '$stockprocessdetails.openingstock' }, { "$sum": '$stockprocessdetails.purchaseqty' }, { "$sum": '$stockprocessdetails.stock_received' }] }, { '$add': [{ "$sum": '$stockprocessdetails.salesqty' }, { "$sum": '$stockprocessdetails.stock_transfer' }] }] },
                            // { $add: [ "$stockinhand, "$openingstock" ] } 
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
    angularlist(req, res) {
        Product.aggregate([
            {
                $match: {
                    isdeleted: 0
                }
            },
            {
                $project: {
                    "_id": 1,
                    "productname": 1,
                    "itemcode": 1,
                    "type": 1,
                    "openingstock": { $add: ["$stockinhand", "$openingstock"] }

                }
            },

        ])
            .then((data) => res.status(200).send(data))
            .catch((err) => res.status(400).send(err))
    },
    edit(req, res) {

        Product.findById({ isdeleted: 0, _id: req.params._id })
            .then((data) => {
                return res.status(200).send(data)
            })
            .catch((error) => {
                return res.status(400).send(error)
            })
    },
    deleterecord(req, res) {
        console.log("sjjdjd")
        console.log(req.params._id)
        Product.findById(req.params._id)
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
    dropdownlist(req, res) {
        Product.aggregate([{
            $match: { "isdeleted": 0 }
        },
        {
            $project: {
                _id: 0,
                id: '$_id',
                name: "$productname"
            }
        }
        ])
            .then((data) => { res.status(200).send({ data: data }); })
            .catch((error) => res.status(400).send(error));
    },
    productdetailswithattributes(req, res) {
        Product.aggregate([{
            $match: { "isdeleted": 0, "_id": mongoose.Types.ObjectId(req.params._id) }
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
            $project: {
                _id: 0,

                purchaseprice: 1,
                hsnorsac_code: 1,

                "attributes.type": 1,
                "attributes.attributename": 1
            }
        }
        ])
            .then((data) => { res.status(200).send({ data: data }); })
            .catch((error) => res.status(400).send(error));
    },
    productdetails(req, res) {

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
                id: "$_id",
                name: "$productname",
                hsnorsac_code: 1,
                purchaseprice: 1,
                salesprice: 1,
                unitid: 1,
                stockprocessdetails: 1,
                //  "availbleqty": { '$add': ['$openingstock', '$stockinhand'] },
                availbleqty: { $subtract: [{ '$add': [{ "$sum": '$stockprocessdetails.openingstock' }, { "$sum": '$stockprocessdetails.purchaseqty' }, { "$sum": '$stockprocessdetails.stock_received' }] }, { '$add': [{ "$sum": '$stockprocessdetails.salesqty' }, { "$sum": '$stockprocessdetails.stock_transfer' }] }] },
                "attributes.type": 1,
                "attributes.attributename": 1,
                "tax.taxname": 1,
                "tax.sgst": 1,
                "tax.cgst": 1,
                "tax.igst": 1

            }
        }
        ])
            .then((data) => res.status(200).send(data))
            .catch((error) => res.status(400).send(error));
    },
    itemcodeno(req, res) {
        Product.countDocuments({ isdeleted: 0 })
        .then((data) => {
            console.log(data)
            res.status(200).send({ itemcode: data == 0 ? parseInt(1000) + 1 : parseInt(1000) + data + 1 })
        }
        )
        .catch((error) =>{
            console.log(error)
            res.status(400).send(error)} )

      
    },
}