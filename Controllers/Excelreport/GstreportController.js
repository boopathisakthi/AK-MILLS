const Purchase = mongoose.model('Purchase');
var Sales = mongoose.model('sales');
var each = require('promise-each');
module.exports = {
    purchaselist(req, res) {
        var searchStr = {};
        if (req.body.type == 'Download') {
            searchStr = {
                $match: {
                    isdeleted: 0,
                    purchasedate: {
                        $gte: new Date(req.body.fromdate),
                        $lt: new Date(req.body.todate)
                    },

                }
            };
        } else {
            searchStr = {
                $match: {
                    isdeleted: 0,
                    purchasedate: {
                        $gte: new Date(req.body.fromdate),
                        $lt: new Date(req.body.todate)
                    },
                    
                }
            };
        }
        Purchase.aggregate([
            {
                $match: {
                    isdeleted: 0,
                    purchasedate: {
                        $gte: new Date(req.body.fromdate),
                        $lt: new Date(req.body.todate)
                    },
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
                $unwind: "$gstdetail"
            },
            {
                $match: {
                    "gstdetail.name": { '$ne': 'gst0' },
                }
            },
           
          
            {
                $project: {
                    "_id": 0,
                    "purchaseorderno": 1,
                    purchasedate: { $dateToString: { format: "%d-%m-%Y", date: "$purchasedate" } },
                    "total": 1,
                    "Suppliername": "$Supplier.name",
                    "gstno": "$Supplier.gstin",
                    "taxablevalue": "$gstdetail.taxablevalue",
                    "itemtotal": "$gstdetail.itemtotal",
                    "name": "$gstdetail.name",
                    "igst": "$gstdetail.igst",
                    "sgst": "$gstdetail.sgst",
                    "cgst": "$gstdetail.cgst",
                }
            }
        ]).then(data => {
            res.status(200).send({ data: data});
        })
    },
    purchasegstzerolist(req, res) {
        console.log('varthutha')
        var searchStr = {};
        if (req.body.type == 'Download') {
            searchStr = {
                $match: {
                    isdeleted: 0,
                    purchasedate: {
                        $gte: new Date(req.body.fromdate),
                        $lt: new Date(req.body.todate)
                    },

                }
            };
        } else {
            searchStr = {
                $match: {
                    isdeleted: 0,
                    purchasedate: {
                        $gte: new Date(req.body.fromdate),
                        $lt: new Date(req.body.todate)
                    },
                   
                }
            };
        }
        Purchase.aggregate([
            {
                $match: {
                    isdeleted: 0,
                    purchasedate: {
                        $gte: new Date(req.body.fromdate),
                        $lt: new Date(req.body.todate)
                    },
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
                $unwind: "$gstdetail"
            },
            {
                $match: {
                    "gstdetail.name": 'gst0' ,
                }
            }
           ,
          
            {
                $project: {
                    "_id": 0,
                    "purchaseorderno": 1,
                    purchasedate: { $dateToString: { format: "%d-%m-%Y", date: "$purchasedate" } },
                    "total": 1,
                    "Suppliername": "$Supplier.name",
                    "gstno": "$Supplier.gstin",
                    "taxablevalue": "$gstdetail.taxablevalue",
                    "itemtotal": "$gstdetail.itemtotal",
                    "name": "$gstdetail.name",
                    "igst": "$gstdetail.igst",
                    "sgst": "$gstdetail.sgst",
                    "cgst": "$gstdetail.cgst",
                }
            }
        ]).then(data => {
            res.status(200).send({ data: data});
        })
    },
 
  
    saleslist(req, res) {
        var searchStr = {};
        if (req.body.type == 'Download') {
            searchStr = {
                $match: {
                    isdeleted: 0,
                }
            };
        } else {
            searchStr = {
                $match: {
                    isdeleted: 0,
                    invoicedate: {
                        $gte: new Date(req.body.fromdate),
                        $lt: new Date(req.body.todate)
                    }
                }
            };
        }

        Sales.aggregate([
            searchStr,

            {
                $lookup: {
                    from: "mastercustomers",
                    "localField": "customerid",
                    "foreignField": "_id",
                    as: "Customer"
                }
            },
            {
                $unwind: "$Customer"
            },
            {
                $unwind: "$gstdetail"
            },
            {
                $match: {
                    "gstdetail.name": { '$ne': 'gst0' },
                }
            },
            {
                $project: {
                    "_id": 0,
                    "invoiceno": 1,
                    invoicedate: { $dateToString: { format: "%d-%m-%Y", date: "$invoicedate" } },
                    "total": 1,
                    "customername": "$Customer.name",
                    "gstno": "$Customer.gstin",
                    "taxablevalue": "$gstdetail.taxablevalue",
                    "itemtotal": "$gstdetail.itemtotal",
                    "name": "$gstdetail.name",
                    "igst": "$gstdetail.igst",
                    "sgst": "$gstdetail.sgst",
                    "cgst": "$gstdetail.cgst",
                }
            }
        ]).then(data => {

            res.status(200).send({ data: data });
        })
    },
    saleszerolist(req, res) {
        var searchStr = {};
        if (req.body.type == 'Download') {
            searchStr = {
                $match: {
                    isdeleted: 0,
                }
            };
        } else {
            searchStr = {
                $match: {
                    isdeleted: 0,
                    invoicedate: {
                        $gte: new Date(req.body.fromdate),
                        $lt: new Date(req.body.todate)
                    }
                }
            };
        }

        Sales.aggregate([
            searchStr,

            {
                $lookup: {
                    from: "mastercustomers",
                    "localField": "customerid",
                    "foreignField": "_id",
                    as: "Customer"
                }
            },
            {
                $unwind: "$Customer"
            },
            {
                $unwind: "$gstdetail"
            },
            {
                $match: {
                    "gstdetail.name": 'gst0' ,
                }
            },
            {
                $project: {
                    "_id": 0,
                    "invoiceno": 1,
                    invoicedate: { $dateToString: { format: "%d-%m-%Y", date: "$invoicedate" } },
                    "total": 1,
                    "customername": "$Customer.name",
                    "gstno": "$Customer.gstin",
                    "taxablevalue": "$gstdetail.taxablevalue",
                    "itemtotal": "$gstdetail.itemtotal",
                    "name": "$gstdetail.name",
                    "igst": "$gstdetail.igst",
                    "sgst": "$gstdetail.sgst",
                    "cgst": "$gstdetail.cgst",
                }
            }
        ]).then(data => {

            res.status(200).send({ data: data });
        })
    },
    purchaseamountdateils(req, res) {
        Purchase.aggregate([{
            $match: {
                isdeleted: 0,
                purchasedate: {
                    $gte: new Date(req.body.fromdate),
                    $lt: new Date(req.body.todate)
                },
                type: 'purchase'
            }
        },
        {
            $unwind: "$gstdetail"
        },
        {
            $group:
            {
                _id: null,
                // totalsales: { "$sum": "$total" },
                totaltaxablevalue: { "$sum": "$gstdetail.taxablevalue" },
                totaltaxamount: { $sum: { $add: [{ "$sum": "$gstdetail.igst" }, { "$sum": "$gstdetail.sgst" }, { "$sum": "$gstdetail.cgst" }] } },
                // totaltaxamount:{ $add: [ { "$sum": "$gstdetail.igst" }, { "$sum": "$gstdetail.sgst" } ] },
                totalvalue: { "$sum": "$gstdetail.itemtotal" }
            },
        },
        ])
            .then((data) => {

                res.status(200).send(data)
            })
            .catch((err) => {
                console.log(err)
                res.status(400).send(err)
            })

    },
    salesamountdetails(req, res) {
        Sales.aggregate([{
            $match: {
                isdeleted: 0,
                invoicedate: {
                    $gte: new Date(req.body.fromdate),
                    $lt: new Date(req.body.todate)
                },

            }
        },
        {
            $unwind: "$gstdetail"
        },
        {
            $group:
            {
                _id: null,
                totaltaxablevalue: { "$sum": "$gstdetail.taxablevalue" },
                totaltaxamount: { $sum: { $add: [{ "$sum": "$gstdetail.igst" }, { "$sum": "$gstdetail.sgst" }, { "$sum": "$gstdetail.cgst" }] } },
                totalvalue: { "$sum": "$gstdetail.itemtotal" }
            },
        },
        ])
            .then((data) => res.status(200).send(data))
            .catch((err) => res.status(400).send(err))

    },
    purchasecount(req, res) {
        Purchase.aggregate([{
            $match: {
                isdeleted: 0,
                purchasedate: {
                    $gte: new Date(req.body.fromdate),
                    $lt: new Date(req.body.todate)
                }
            }
        },
        { $count: "myCount" }

        ])
            .then((data) => res.status(200).send(data))
            .catch((err) => res.status(400).send(err))
    },
    salescount(req, res) {

        Sales.aggregate([{
            $match: {
                isdeleted: 0,
                invoicedate: {
                    $gte: new Date(req.body.fromdate),
                    $lt: new Date(req.body.todate)
                }
            }
        },
        { $count: "myCount" }

        ])
            .then((data) => res.status(200).send(data))
            .catch((err) => res.status(400).send(err))
    }
}