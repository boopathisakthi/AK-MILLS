var mongoose = require('mongoose');
const Branch = mongoose.model('Branch');
const MasterCompany = mongoose.model('MasterCompany');
require("datejs");
var count = 0;
module.exports = {
  insert(req, res) {
    console.log(req.body)
    try {
      if (req.body._id) {
        Branch.findById(req.body._id)
          .then(data => {

            if (!data) {
              return res.status(400).send({
                message: 'Branch Not Found',
              });
            }
            data.updateOne({
              companyname: req.body.companyname,
              gstno: req.body.gstno,
              panno: req.body.panno,
              email: req.body.email,
              telephoneno: req.body.telephoneno,
              mobile: req.body.mobile,
              address: req.body.address,
              city: req.body.city,
              state: req.body.state,
              pincode: req.body.pincode,
              updatedby: 1,
              updateddate: (new Date()).toString("yyyy-MM-dd"),
              companyid: req.session.companyid,
            })
              .then((data1) => {

                res.status(200).send({
                  status: 'success',
                  message: 'record updated successfully'
                })
              })

          })
          .catch((error) => res.status(400).send(error));

      }
      else {
        Branch.create({
          companyname: req.body.companyname,
          gstno: req.body.gstno,
          panno: req.body.panno,
          email: req.body.email,
          telephoneno: req.body.telephoneno,
          mobile: req.body.mobile,
          address: req.body.address,
          city: req.body.city,
          state: req.body.state,
          pincode: req.body.pincode,
          createdby: '1',
          createddate: (new Date()).toString("yyyy-MM-dd"),
          isdeleted: '0',
          type: 'sub',
          creditdays: req.body.creditdays,
          companyid: req.session.companyid,

        })
          .then((data) => {
            res.status(200).send({
              status: 'success',
              message: 'record added successfully'
            })
          })
          .catch((error) => res.status(400).send({
            status: 'Error',
            message: error
          }))
      }



    }
    catch (error) {
      res.status(400).send(error);
    }
  },
  list(req, res) {
    Branch.find(
      { "isdeleted": 0, type: 'sub' },
      { "_id": 1, "companyname": 1, "mobile": 1, "gstno": 1, "panno": 1, "type": 1 },

    )
      .then((data) => { res.status(200).send({ data: data }); })
      .catch((error) => res.status(400).send(error));
  },
  edit(req, res) {
    Branch.find({ _id: req.params.id })
      .then((data) => {
        if (!data) {
          return res.status(404).send({
            message: 'Data is Not Found',
          });
        }
        return res.status(200).send(data);
      })
      .catch((error) => res.status(400).send(error));
  },
  update(req, res) {
    try {
      Branch.findById(req.body._id)
        .then(data => {

          if (!data) {
            return res.status(400).send({
              message: 'Branch Not Found',
            });
          }
          data.updateOne({
            companyname: req.body.companyname,
            gstno: req.body.gstno,
            panno: req.body.panno,
            address: req.body.address,
            pincode: req.body.pincode,
            city: req.body.city,
            state: req.body.state,
            telephoneno: req.body.telephoneno,
            mobile: req.body.mobile,
            email: req.body.email,
            bankname: req.body.bankname,
            branchname: req.body.branchname,
            accountholdername: req.body.accountholdername,
            accountnumber: req.body.accountnumber,
            ifsccode: req.body.ifsccode,
            billcode: req.body.billcode,
            companyweblogo: Imagedetails(req.body.file1, data.companyweblogo, req.files),
            companymobilelogo: Imagedetails(req.body.file2, data.companymobilelogo, req.files),
            companyreportlogo: Imagedetails(req.body.file3, data.companyreportlogo, req.files),
            updatedby: 1,
            updateddate: (new Date()).toString("yyyy-MM-dd"),
            companyid: req.session.companyid,
          })
            .then((data1) => {

              res.status(200).send({
                status: 'success',
                message: 'record updated successfully'
              })
            })

        })
        .catch((error) => res.status(400).send(error));
    }
    catch (error) {
      return res.status(400).send(error);
    }
  },
  softdelete(req, res) {

    Branch.findById(req.params.id)
      .then(data => {
        if (!data) {
          return res.status(400).send({
            message: 'Branch Not Found',
          });
        }
        data.updateOne({
          isdeleted: 1
        })
          .then((data1) => res.status(200).send({ status: 'success', message: 'Record deleted SuccessFully', data1 }))
          .catch((error) => res.status(400).send(error));
      })

  },
  dropdownlist(req, res) {
    Branch.aggregate([{
      $match: {
        "isdeleted": 0,
        type: 'sub'
      }
    },
    {
      $project: {
        _id: 1,

        name: "$companyname"
      }
    }
    ])
      .then((data) => {
        console.log(data)
        res.status(200).send({ data: data });
      })
      .catch((error) => res.status(400).send(error));
  },
  samebranchdropdownlist(req, res) {
   
    Branch.aggregate([{
      $match: {
        "isdeleted": 0,
        _id: new mongoose.Types.ObjectId(req.session.branchid)
      }
    },
    {
      $project: {
        _id: 1,

        name: "$companyname"
      }
    }
    ])
      .then((data) => {
        console.log(data)
        res.status(200).send({ data: data });
      })
      .catch((error) => res.status(400).send(error));
  },
  otherbranchdropdwon(req,res){
    
    Branch.aggregate([{
      $match: {
        "isdeleted": 0,
        _id:{ $ne:  new mongoose.Types.ObjectId(req.session.branchid) },
       
      }
    },
    {
      $project: {
        _id: 1,
      
        name: "$companyname"
      }
    }
    ])
      .then((data) => {
        console.log(data)
        res.status(200).send({ data: data });
      })
      .catch((error) => res.status(400).send(error));

  },
 dropdwon(req,res){
    
    Branch.aggregate([{
      $match: {
        "isdeleted": 0,
      }
    },
    {
      $project: {
        _id: 1,
      
        name: "$companyname"
      }
    }
    ])
      .then((data) => {
        console.log(data)
        res.status(200).send({ data: data });
      })
      .catch((error) => res.status(400).send(error));

  }
}
function Imagedetails(filevalue, val, file) {

  var path = '/appfiles/CompanyImages/';

  if (filevalue == 'nofile') {
    return val;
  }
  else {
    var filedata = path + file[count].filename;
    count = count + 1;
    return filedata;
  }

}