require('../config/db');

var express = require('express');
var router = express();
var engine = require('ejs-locals');
router.engine('ejs', engine);
router.set('view engine', 'ejs');
var Purchase = mongoose.model('Purchase');
var RoleMappingModal = mongoose.model('RoleMapping');


router.get('/dashboard', function (req, res, next) {
    if (req.session.usrid) {
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;
            branchid = req.session.branchid;


            console.log(roledetails)
            res.render('./Dashboard/index', { roledetails: roledetails, branchid: branchid});
        })
    }

    // res.render('./Dashboard/index', { title: 'excel' });


    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});


router.get('/excel', function (req, res, next) {
    res.render('./excelreport/index.ejs', { title: 'excel' });
})
router.get('/stockreport', function (req, res, next) {
    if (req.session.usrid) {
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;
            branchid = req.session.branchid;


            res.render('./report/stock', { roledetails: roledetails, branchid: branchid });

        })
    }
    else {
        res.render('./Adminpanel/login/login', { title: 'Login' });
    }


})
router.get('/purchasereport', function (req, res, next) {
    if (req.session.usrid) {
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;
            branchid = req.session.branchid;
            res.render('./report/product', { roledetails: roledetails, branchid: branchid });
            // res.render('./report/stock',  { roledetails: roledetails });

        })
    }
    else {
        res.render('./Adminpanel/login/login', { title: 'Login' });
    }


})

router.get('/customeroutstanding', function (req, res, next) {
    if (req.session.usrid) {
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;
            branchid = req.session.branchid;
            // res.render('./report/stock',  { roledetails: roledetails });
            res.render('./report/customeroutstanding', { roledetails: roledetails, branchid: branchid });
        })
    }
    else {
        res.render('./Adminpanel/login/login', { title: 'Login' });
    }

})

router.get('/supplieroutstanding', function (req, res, next) {
    if (req.session.usrid) {
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;
            branchid = req.session.branchid;
            res.render('./report/supplioeroutstanding', { roledetails: roledetails, branchid: branchid });
        })


    }
    else {
        res.render('./Adminpanel/login/login', { title: 'Login' });
    }

})
router.get('/salesreport', function (req, res, next) {
    if (req.session.usrid) {
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;
            branchid = req.session.branchid;
            res.render('./report/sales', { roledetails: roledetails, branchid: branchid });

        })


    }
    else {
        res.render('./Adminpanel/login/login', { title: 'Login' });
    }


})

router.get('/', function (req, res, next) {
    res.render('./Adminpanel/login/login', { title: 'Login' });
});

router.get('/custsup', function (req, res, next) {
    if (req.session.usrid) {
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;
            branchid = req.session.branchid;
            res.render('./Master/cds/index', { roledetails: roledetails, branchid: branchid });
        })
    }

    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});
router.get('/expense', function (req, res, next) {
    if (req.session.usrid) {
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;
            branchid = req.session.branchid;
            res.render('./Master/expanse/index.ejs', { roledetails: roledetails, branchid: branchid });

        })
    }

    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});
router.get('/expanseentry', function (req, res, next) {
    if (req.session.usrid) {
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            let roledetails = data;
            branchid = req.session.branchid;
            res.render('./Master/expansemain/index.ejs', { roledetails: roledetails, branchid: branchid });

        })
    }

    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});
//master bank router
router.get('/bank', function (req, res, next) {
    if (req.session.usrid) {
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;
            branchid = req.session.branchid;
            res.render('./Master/bank/index.ejs', { roledetails: roledetails, branchid: branchid });
        })
    }


    // res.render('./Master/bank/index.ejs', { title: GetRoleMapDetails() });
    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});
//masrer tax router
router.get('/tax', function (req, res, next) {
    if (req.session.usrid) {
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;
            branchid = req.session.branchid;
            res.render('./Master/tax/index.ejs', { roledetails: roledetails, branchid: branchid });
        })
        // res.render('./Master/tax/index.ejs', { title: 'tax' });
    }

    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});

// master dept router
router.get('/department', function (req, res, next) {
    if (req.session.usrid) {
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;
            branchid = req.session.branchid;
            res.render('./Master/department/index.ejs', { roledetails: roledetails, branchid: branchid });
        })
        // res.render('./Master/department/index.ejs', { title: 'department' });
    }

    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});

// master employee router
router.get('/employee', function (req, res, next) {
    if (req.session.usrid) {
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;
            branchid = req.session.branchid;
            res.render('./Master/employee/index.ejs', { roledetails: roledetails, branchid: branchid });
            //   res.render('./Master/department/index.ejs', { roledetails: roledetails });
        })
    }

    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});
// master Product router

router.get('/product', function (req, res, next) {
    if (req.session.usrid) {
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;
            branchid = req.session.branchid;
            res.render('./Master/product/index.ejs', { roledetails: roledetails, branchid: branchid });

        })
    }
    else {
        res.render('./Adminpanel/login/login', { title: 'Login' });

    }


});
router.get('/stocktransfer', function (req, res, next) {
    if (req.session.usrid) {
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;
            branchid = req.session.branchid;

            res.render('./Stocktransfer/index', { roledetails: roledetails, branchid: branchid });
        })
    }
    else {
        res.render('./Adminpanel/login/login', { title: 'Login' });

    }


});
// master Category router
router.get('/category', function (req, res, next) {
    if (req.session.usrid) {
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            let roledetails = '';
            roledetails = data;
            branchid=req.session.branchid;
            res.render('./Master/Category/index.ejs', { roledetails: roledetails,branchid:branchid });
           // res.render('./sales/SalesEntry/index.ejs', { roledetails: roledetails,branchid:branchid });
        })
    }

    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
   
});
// master subcategory router
router.get('/subcategory', function (req, res, next) {
    res.render('./Master/subcategory/index.ejs', { title: 'subcategory' });
});
var BankModal = mongoose.model('MasterBank');
router.get('/banklist', function (req, res) {

    BankModal.aggregate([
        {

            $lookup: {
                from: "rolemappings",
                "let": { "id": new mongoose.Types.ObjectId(req.session.roleid) },
                "pipeline": [{
                    "$match": {
                        isdeleted: 0,
                        pagename: "Bank",
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
            $project: {
                _id: 0,
                "roledetails.pagename": 1
            }
        }


    ]).then((data) => res.status(200).send(data))

})

router.get('/sample', function (req, res) {
    console.log('sample')
    res.render('./Purchase/PurchaseReturn/index.ejs', { title: 'PurchaseEntry' });
    // logger.info('hai hello')

})

router.post('/getpagedetails', function (req, res) {
    RoleMappingModal.find({ roleid: req.session.roleid, pagename: req.body.pagename })
        .then((data) => {
            //  roledetails = data;
            return res.status(200).send(data)

        })
        .catch((err) => res.status(400).send(err))
})
router.get('/invoicebill', function (req, res, next) {
    res.render('./sales/SalesEntry/invoice.ejs', { title: 'unit' });
});



// master unit router
router.get('/unit', function (req, res, next) {
    res.render('./Master/unit/index.ejs', { title: 'unit' });
});
router.get('/test', function (req, res, next) {
    res.render('./Master/test/index.ejs', { title: 'unit' });
});
const MasterCompany = require('../Controllers').MasterCompany;
const RoleMapping = require('../Controllers').RoleMapping;
const Sales = require('../Controllers').Sales;
const Bank = require('../Controllers').Bank;


const Tax = require('../Controllers').Tax;
const Department = require('../Controllers').Department;
const Employee = require('../Controllers').Employee;




// const category=require('../Controllers').category;
//const subcategory=require('../Controllers').subcategory;
const Product = require('../Controllers').Product;

const Attribute = require('../Controllers').Attribute;
const subcategory = require('../Controllers').subcategory;
const unit = require('../Controllers').unit;

//master Attribute
router.post('/master/attributeinsert', Attribute.insert);
router.get('/master/attributelist', Attribute.list);
router.get('/master/attributeedit/:_id', Attribute.edit);
router.post('/master/attributedelete/:_id', Attribute.deleterecord);



// master catrgory
router.post('/admin/rolemapping', RoleMapping.insert);
router.get('/rolemap/list', RoleMapping.list);
router.get('/rolemap/edit/:_id', RoleMapping.edit);


//master bank
router.post('/master/bankinstert', Bank.insert);
router.get('/master/banklist', Bank.list);
router.get('/master/bankangularlist', Bank.angularlist);
router.get('/master/banklistddl', Bank.ddllist);
router.get('/master/angularbanklistddl', Bank.angularddllist);
router.get('/master/bankedit/:_id', Bank.edit);
router.post('/master/bankdelete/:_id', Bank.deleterecord);

//master tax
router.post('/master/taxinstert', Tax.insert);
router.get('/master/taxlist', Tax.list);
router.get('/master/angularlist', Tax.angularlist);

router.get('/master/taxedit/:_id', Tax.edit);
router.post('/master/taxdelete/:_id', Tax.deleterecord);
router.get('/master/taxdropdown', Tax.dropdownlist);
router.get('/master/taxangulardropdown', Tax.angulardropdown);

//master department
router.post('/master/deptinstert', Department.insert);
router.get('/master/deptlist', Department.list);
router.get('/master/deptangularlist', Department.angularlist);
router.get('/master/deptedit/:_id', Department.edit);
router.post('/master/deptdelete/:_id', Department.deleterecord);
router.get('/master/deptdropdown', Department.dropdown);
router.get('/master/deptangulardropdown', Department.angulardropdown);

//master employee
router.post('/master/empinstert', Employee.insert);
router.get('/master/emplist', Employee.list);
router.get('/master/empangularlist', Employee.angularlist);
router.get('/master/empedit/:_id', Employee.getedit);
router.post('/master/empdelete/:_id', Employee.deleterecord);




//master subcategory
router.post('/master/subcategoryinsert', subcategory.insert);
router.get('/master/subcategorylist', subcategory.list);
router.get('/master/subcategoryedit/:_id', subcategory.edit);
router.post('/master/subcategorydelete/:_id', subcategory.deleterecord);
router.get('/master/subcategoryddllist/:categoryid', subcategory.dropdown);
router.get('/master/angularsubcategoryddllist/:categoryid', subcategory.angulardropdown);
const category = require('../Controllers').Category;
// master catrgory
router.post('/master/categoryinsert', category.insert);
router.get('/master/categorylist', category.list);
router.get('/master/categoryedit/:_id', category.edit);
router.post('/master/categorydelete/:_id', category.deleterecord);
router.get('/master/categoryddllist', category.dropdownlist);
router.get('/master/categoryangulardropdown', category.angulardropdownlist);

// master unit
router.post('/master/unitinsert', unit.insert);
router.get('/master/unitlist', unit.list);
router.get('/master/unitedit/:_id', unit.edit);
router.post('/master/unitdelete/:_id', unit.deleterecord);
router.get('/master/unitdropdown/', unit.dropdown);


//Master bank
router.post('/master/bankinstert', Bank.insert);
router.get('/master/banklist', Bank.list);
router.get('/master/bankedit/:_id', Bank.edit);
router.post('/master/bankdelete/:_id', Bank.deleterecord);


router.post('/master/taxinstert', Tax.insert);
router.get('/master/taxlist', Tax.list);
router.get('/master/taxedit/:_id', Tax.edit);
router.post('/master/taxdelete/:_id', Tax.deleterecord);
router.get('/master/taxdropdown', Tax.dropdownlist);


router.post('/master/deptinstert', Department.insert);
router.get('/master/deptlist', Department.list);
router.get('/master/deptedit/:_id', Department.edit);
router.post('/master/deptdelete/:_id', Department.deleterecord);
router.get('/master/deptdropdown', Department.dropdown);

router.post('/master/empinstert', Employee.insert);
router.get('/master/emplist', Employee.list);
router.get('/master/empedit/:_id', Employee.getedit);
router.post('/master/empdelete/:_id', Employee.deleterecord);
router.get('/master/employeeddl/', Employee.employeeddllist);


//master product
router.post('/master/productinstert', Product.insert);
router.get('/master/produtlist', Product.list);
router.get('/master/productedit/:_id', Product.edit);
router.post('/master/productdelete/:_id', Product.deleterecord);
router.get('/master/productdropdown', Product.dropdownlist);
router.get('/master/productdetails/:_id', Product.productdetailswithattributes);
router.get('/master/productsdetail', Product.productdetails);
router.get('/master/productitemcode', Product.itemcodeno);
router.get('/master/productangularlist', Product.angularlist);

//stocktransfer
const Stocktransfer = require('../Controllers').Stocktransfer;
router.post('/stocktransfer/insertupdate', Stocktransfer.insert)
router.get('/stocktransfer/list', Stocktransfer.list);
router.get('/stocktransfer/edit/:_id', Stocktransfer.edit);
router.post('/stocktransfer/delete/:_id', Stocktransfer.delete);

router.post('/api/sales', Sales.insert);
router.get('/api/saleslist', Sales.list);
router.get('/api/salesamount', Sales.sumofamount);


router.post('/api/company', MasterCompany.add);
router.get('/api/list', MasterCompany.list);
router.post('/api/update/:id', MasterCompany.update);

router.get('/test', function (req, res, next) {
    res.render('./templates/home', { title: 'Login' });
});
router.get('/usercreation', function (req, res, next) {
    if (req.session.usrid) {
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;

            branchid = req.session.branchid;
            res.render('./Adminpanel/Usercreation/index', { roledetails: roledetails, branchid: branchid });

        })
    }

    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});
router.get('/role', function (req, res, next) {
    if (req.session.usrid) {
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;

            branchid = req.session.branchid;
            res.render('./Adminpanel/Role/index',  { roledetails: roledetails, branchid: branchid });

        })
    }

    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});
router.get('/company', function (req, res, next) {
    if (req.session.usrid){
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;

            branchid = req.session.branchid;
            res.render('./company/index',  { roledetails: roledetails, branchid: branchid,roleid: req.session.roleid });

        })
    }
    
      
    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});
router.get('/branch', function (req, res, next) {
    if (req.session.usrid) {
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;
            branchid = req.session.branchid;
            res.render('./Adminpanel/Branch/index', { roledetails: roledetails, branchid: branchid });

        })
    }

    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});
router.get('/role_entry', function (req, res, next) {
    if (req.session.usrid) {
        let roledetails = '';
        RoleMappingModal.find({ roleid: req.session.roleid }).then((data) => {
            roledetails = data;
            branchid = req.session.branchid;
            res.render('./Adminpanel/RoleMapping/index', { roledetails: roledetails, branchid: branchid });
        })
    }
    //  if (req.session.usrid)

    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});

module.exports = router;