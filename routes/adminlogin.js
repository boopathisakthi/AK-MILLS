require('../config/db');

var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const UserCreation = mongoose.model('UserCreation');
const MasterCompany = mongoose.model('MasterCompany');
const RoleMapping = mongoose.model('RoleMapping');

router.post('/login', function (req, res) {
    try {

        UserCreation.findOne(
            { username: req.body.uname, password: req.body.pass }
        )
            .then((data1) => {


                if (!data1) {
                    return res.status(400).send('Login Credentials Failed');
                }
                req.session.companyid = data1.companyid;
                req.session.roleid = data1.roleid;
                req.session.usrid = data1._id;

                req.session.branchid = data1.branchid;
                if (req.session.roleid=='5e2a94260962271c344bdcfa') {
                    res.status(200).send({
                        status: 'success',
                        message: 'valid user',
                        url: '/dashboard',
                        data1
                    })

                }
                else
                {
                    res.status(200).send({
                        status: 'success',
                        message: 'valid user',
                        url: '/sales',
                        data1
                    })
                }

                console.log('companyid in session  :' + req.session.companyid)
                console.log('roleid in session  :' + req.session.roleid)

            })
            .catch((error) => { res.status(400).send(error) });

    } catch (e) {

        return res.status(400).send(e)
    }
});
router.post('/sessionverify', function (req, res) {
    console.log('companyid in session  :' + req.session.companyid)
    console.log('roleid in session  :' + req.session.roleid)

    res.status(200).send(req.session);
})
router.post('/setsession', function (req, res) {
    req.session.companyid = 55225;
    res.send(200);
})
router.get('/signout', function (req, res) {
    console.log('one')
    req.session.companyid = '';
    req.session.roleid = '';
    req.session.usrid = '';
    req.session.branchid = '';
    res.redirect('/');
})
router.post('/branchvalidation', function (req, res) {

    UserCreation.aggregate(
        [
            {
                $match: { _id: new mongoose.Types.ObjectId(req.session.usrid), isdeleted: 0, "BranchDetail.branchid": new mongoose.Types.ObjectId(req.body.branchid) }
            },
        ])
        .then((data) => {

            if (data.length == 0 || data == null) {
                console.log('branch not validted');
            }
            else {
                req.session.branchid = req.body.branchid;
            }
            return res.status(200).send(data);
        })
        .catch((error) => { res.status(400).send(error) });


})

module.exports = router;