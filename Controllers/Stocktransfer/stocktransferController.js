var StockTransfer = mongoose.model('StockTransfer');

const StockProcessDetails = mongoose.model('StockProcessDetails');
var each = require('promise-each');
require("datejs");
require('../../config/logger');
module.exports = {
    insert(req, res) {
        if (req.body._id) {
            console.log(req.session.branchid)

            StockTransfer.findOne({ _id: new mongoose.Types.ObjectId(req.body._id), branchid: new mongoose.Types.ObjectId(req.session.branchid) })
                .then(data => {

                    if (!data) {
                        return res.status(400).send('Data Not Found')
                    }
                    return data.updateOne({
                        entrydate: req.body.entrydate,
                        frombranchid: req.body.frombranchid,
                        tobranchid: req.body.tobranchid,
                        StocktransferDetail: req.body.StocktransferDetail,
                        companyid: req.session.companyid,
                        branchid: req.session.branchid,
                        updatedby: req.session.userid,
                        updateddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),

                    })
                        .then((data5) => {
                            Promise.resolve(data.StocktransferDetail).then(each((ele) =>
                                req.body.StocktransferDetail.forEach((update) => {
                                    if (ele.productid == update.productid) {

                                        //product qty details insert in stockprocessdetails for from branch in stock_transfer column
                                        StockProcessDetails.findOne({ isdeleted: 0, productid: ele.productid, branchid: req.body.frombranchid })
                                            .then((data2) => {

                                                if (!data2) {

                                                    StockProcessDetails.create({
                                                        productid: ele.productid,
                                                        openingstock: 0,
                                                        salesqty: 0,
                                                        stock_transfer: parseInt(ele.qty),
                                                        stock_received: 0,
                                                        purchaseqty: 0,
                                                        branchid: req.session.branchid,
                                                        companyid: req.session.companyid,
                                                        createdby: req.session.usrid,
                                                        createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                                                        isdeleted: '0'
                                                    }).then((data7) => { })
                                                }
                                                else {

                                                    data2.updateOne({

                                                        stock_transfer: (parseInt(data2.stock_transfer) - parseInt(ele.qty)) + parseInt(update.qty)
                                                    }).then((data1) => { })
                                                }

                                            })
                                        if (data.tobranchid == req.body.tobranchid) {
                                            //stockprocessdetails for to branch  insert on in stock_received column
                                            StockProcessDetails.findOne({ isdeleted: 0, productid: ele.productid, branchid: req.body.tobranchid })
                                                .then((data2) => {

                                                    if (!data2) {

                                                        StockProcessDetails.create({
                                                            productid: ele.productid,
                                                            openingstock: 0,
                                                            salesqty: 0,
                                                            stock_transfer: 0,
                                                            stock_received: parseInt(ele.qty),
                                                            purchaseqty: 0,
                                                            branchid: req.body.tobranchid,
                                                            companyid: req.session.companyid,
                                                            createdby: req.session.usrid,
                                                            createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                                                            isdeleted: '0'
                                                        }).then((data7) => { })
                                                    }
                                                    else {

                                                        data2.updateOne({
                                                            stock_received: (parseInt(data2.stock_received) - parseInt(ele.qty)) + parseInt(update.qty)

                                                        }).then((data1) => { })
                                                    }

                                                })

                                        }
                                        else {

                                            StockProcessDetails.findOne({ isdeleted: 0, productid: ele.productid, branchid: data.tobranchid })
                                                .then((data2) => {

                                                    if (!data2) {


                                                    }
                                                    else {

                                                        data2.updateOne({
                                                            stock_received: (parseInt(data2.stock_received) - parseInt(ele.qty))

                                                        }).then((data1) => { })
                                                    }

                                                })
                                            StockProcessDetails.findOne({ isdeleted: 0, productid: ele.productid, branchid: req.body.tobranchid })
                                                .then((data2) => {

                                                    if (!data2) {

                                                        StockProcessDetails.create({
                                                            productid: ele.productid,
                                                            openingstock: 0,
                                                            salesqty: 0,
                                                            stock_transfer: 0,
                                                            stock_received: parseInt(ele.qty),
                                                            purchaseqty: 0,
                                                            branchid: req.body.tobranchid,
                                                            companyid: req.session.companyid,
                                                            createdby: req.session.usrid,
                                                            createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                                                            isdeleted: '0'
                                                        }).then((data7) => { })
                                                    }
                                                    else {

                                                        data2.updateOne({
                                                            stock_received: (parseInt(data2.stock_received) - parseInt(ele.qty)) + parseInt(update.qty)

                                                        }).then((data1) => { })
                                                    }

                                                })


                                        }



                                    }
                                })
                            ))


                            logger.log('info', 'logjson{ page : Stocktransfer, Acion : Update,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                            res.status(200).send({
                                status: 'success',
                                message: 'record Updated  successfully',

                            })
                        })
                })
                .catch(err => res.status(400).send(err))
        } else {

            //StockTransfer insert
            StockTransfer.create({
                entrydate: req.body.entrydate,
                frombranchid: req.body.frombranchid,
                tobranchid: req.body.tobranchid,
                StocktransferDetail: req.body.StocktransferDetail,
                companyid: req.session.companyid,
                branchid: req.session.branchid,
                createdby: req.session.usrid,
                createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                isdeleted: '0'
            }).then((data) => {




                Promise.resolve(req.body.StocktransferDetail).then(each((ele) => {
                    //product qty details insert in stockprocessdetails for from branch in stock_transfer column
                    StockProcessDetails.findOne({ isdeleted: 0, productid: ele.productid, branchid: req.body.frombranchid })
                        .then((data2) => {

                            if (!data2) {

                                StockProcessDetails.create({
                                    productid: ele.productid,
                                    openingstock: 0,
                                    salesqty: 0,
                                    stock_transfer: parseInt(ele.qty),
                                    stock_received: 0,
                                    purchaseqty: 0,
                                    branchid: req.session.branchid,
                                    companyid: req.session.companyid,
                                    createdby: req.session.usrid,
                                    createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                                    isdeleted: '0'
                                }).then((data7) => { })
                            }
                            else {

                                data2.updateOne({
                                    stock_transfer: parseInt(data2.stock_transfer) + parseInt(ele.qty)
                                }).then((data1) => { })
                            }

                        })

                    //stockprocessdetails for to branch  insert on in stock_received column
                    StockProcessDetails.findOne({ isdeleted: 0, productid: ele.productid, branchid: req.body.tobranchid })
                        .then((data2) => {

                            if (!data2) {

                                StockProcessDetails.create({
                                    productid: ele.productid,
                                    openingstock: 0,
                                    salesqty: 0,
                                    stock_transfer: 0,
                                    stock_received: parseInt(ele.qty),
                                    purchaseqty: 0,
                                    branchid: req.body.tobranchid,
                                    companyid: req.session.companyid,
                                    createdby: req.session.usrid,
                                    createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                                    isdeleted: '0'
                                }).then((data7) => { })
                            }
                            else {
                                console.log(data2)
                                data2.updateOne({
                                    stock_received: parseInt(data2.stock_received) + parseInt(ele.qty)
                                }).then((data1) => { })
                            }

                        })




                }



                ))




                logger.log('info', 'logjson{ page : Stocktransfer, Acion : Insert,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
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
        var queryString = url.parse(req.url, true);
        var urlparms = queryString.query;
        // console.log(urlparms);
        var searchStr = { isdeleted: 0 };
        var recordsTotal = 0;
        var recordsFiltered = 0;
        StockTransfer.count({ isdeleted: 0 }, function (err, c) {
            recordsTotal = c;
            console.log('total count ' + c);
            StockTransfer.count(searchStr, function (err, c) {

                StockTransfer.aggregate(
                    [{
                        $match: {
                            "isdeleted": 0,
                            companyid: new mongoose.Types.ObjectId(req.session.companyid),
                            branchid: new mongoose.Types.ObjectId(req.session.branchid)
                        }
                    },
                    {
                        $lookup: {
                            from: "branches",
                            "localField": "frombranchid",
                            "foreignField": "_id",
                            as: "frombranch"
                        }

                    },
                    {
                        $unwind: "$frombranch"
                    },
                    {
                        $lookup: {
                            from: "branches",
                            "localField": "tobranchid",
                            "foreignField": "_id",
                            as: "tobranch"
                        }

                    },
                    {
                        $unwind: "$tobranch"
                    },

                    {
                        $project: {
                            "_id": 1,
                            "entrydate": { $dateToString: { format: "%d-%m-%Y", date: "$entrydate" } },
                            frombranchname: "$frombranch.companyname",
                            tobranchname: "$tobranch.companyname"


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
        StockTransfer.aggregate(
            [
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(req.params._id)
                    }

                },
                {
                    $project: {
                        _id: 1,
                        "entrydate": { $dateToString: { format: "%d-%m-%Y", date: "$entrydate" } },
                        frombranchid: 1,
                        tobranchid: 1,
                        StocktransferDetail: 1


                    }
                }
            ]).then((data) => res.status(200).send(data))
            .catch((Err) => res.status(400).send(Err))
    },
    delete(req, res) {
        console.log('varthu')
        StockTransfer.findOne({ _id: new mongoose.Types.ObjectId(req.params._id), branchid: new mongoose.Types.ObjectId(req.session.branchid) })
            .then(data => {
              
                if (!data) {
                    return res.status(404).send({
                        message: 'Data Not Found',
                    });
                }

                Promise.resolve(data.StocktransferDetail).then(each((ele) =>{
                      //product qty details delete in stockprocessdetails for from branch in stock_transfer column
                      StockProcessDetails.findOne({ isdeleted: 0, productid: ele.productid, branchid: data.frombranchid })
                      .then((data2) => {
                          if (!data2) {
                          }
                          else {
                              data2.updateOne({
                                  stock_transfer: (parseInt(data2.stock_transfer) - parseInt(ele.qty))
                              }).then((data1) => { })
                          }

                      })

                  //stockprocessdetails for to branch  delete on in stock_received column
                  StockProcessDetails.findOne({ isdeleted: 0, productid: ele.productid, branchid: data.tobranchid })
                      .then((data2) => {

                          if (!data2) {


                          }
                          else {

                              data2.updateOne({
                                  stock_received: parseInt(data2.stock_received) - parseInt(ele.qty)

                              }).then((data1) => { })
                          }

                      })


                }
                
                  



                ))

                return data.updateOne({
                    isdeleted: 1
                })
                    .then((data1) => res.status(200).send({ status: 'success', message: 'Record deleted SuccessFully', data1 }))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));

    },
}