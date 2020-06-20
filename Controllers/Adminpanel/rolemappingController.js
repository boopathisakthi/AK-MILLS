var mongoose = require('mongoose');

const RoleMapping = mongoose.model('RoleMapping');
var each = require('promise-each');
require("datejs");

module.exports = {
    async insert(req, res) {

        try {
            if (req.body.process != 'update') {
                RoleMapping.find(
                    { isdeleted: 0, roleid: req.body.details[0].roleid },

                )
                    .then((data) => {
                        if (data.length == 0) {
                            Promise.resolve(req.body.details).then(each((ele) => {

                                RoleMapping.create({
                                    roleid: ele.roleid,
                                    pagename: ele.pagename,
                                    viewrights: ele.viewrights,
                                    insert: ele.insert,
                                    edit: ele.edit,
                                    delete: ele.delete,
                                }).then((data) => {

                                })

                            }))
                            return res.status(200).send({
                                status: 'success', message: 'Record Insert SuccessFully'
                            })

                        }
                        else {
                            return res.status(404).send(
                               'Rolename is Already Used'
                            );

                        }

                    })

            }
            else {

                RoleMapping.find(
                    { isdeleted: 0, roleid: req.body.details[0].roleid },

                )
                    .then((data) => {

                        Promise.resolve(data).then(each((eledata) => {

                            req.body.details.forEach((elebody) => {

                                if (eledata.pagename == elebody.pagename) {

                                    RoleMapping.findById(eledata._id).then((data5) => {
                                        data5.updateOne({
                                            roleid: elebody.roleid,
                                            pagename: elebody.pagename,
                                            viewrights: elebody.viewrights,
                                            insert: elebody.insert,
                                            edit: elebody.edit,
                                            delete: elebody.delete

                                        }).then((data033) => {

                                        })
                                    })
                                }
                              
                            })



                        })).then((data3) => {
                            return res.status(200).send({
                                status: 'success', message: 'Record Updated SuccessFully'
                            })
                        })

                    })


            }


        }
        catch (error) {
            res.status(400).send(error);
        }
    },
    list(req, res) {

        console.log(req.url);
        var queryString = url.parse(req.url, true);
        var urlparms = queryString.query;
        var searchStr = { isdeleted: 0 };
        var recordsTotal = 0;
        var recordsFiltered = 0;
        RoleMapping.count(
            {
                isdeleted: 0,
            }, function (err, c) {
                recordsTotal = c;
                console.log('total count ' + c);
                RoleMapping.count(searchStr, function (err, c) {
                    recordsFiltered = c;
                    console.log('record fliter count ' + c);
                    console.log('start ' + urlparms.start);
                    console.log('length ' + urlparms.length);
                    RoleMapping.aggregate(
                        [
                            {
                                $match: { "isdeleted": 0 }
                            },

                            {
                                $lookup:
                                {
                                    from: "roles",
                                    "localField": "roleid",
                                    "foreignField": "_id",
                                    as: "Role"
                                }
                            },
                            {
                                $unwind: "$Role"
                            },
                            {
                                $group: {
                                    _id: { roleid: "$roleid", "rolename": "$Role.rolename" }
                                }
                            },
                            {
                                $project: {
                                    "_id": "$_id.roleid",
                                    "rolename": "$_id.rolename",

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

        RoleMapping.find(
            { isdeleted: 0, roleid: req.params.id }

        )
            .then((data) => {
                return res.status(200).send(data)
            })
            .catch((error) => {
                return res.status(400).send(error)
            })
    },
    edit(req, res) {

        RoleMapping.find(
            { isdeleted: 0, roleid: req.params._id },

        )
            .then((data) => {

                return res.status(200).send(data)
            })
            .catch((error) => {
                return res.status(400).send(error)
            })
    },

}
