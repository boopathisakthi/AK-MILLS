$(document).ready(function () {
    amountdateils()
    localStorage.clear();
    var currentDate = new Date();
    $("#txtpurchasedate").datepicker().datepicker("setDate", currentDate);
    BindddlData('#ddlcompanystate', '/master/state');
    $('#txtsupplier').val('Walkin');
    $('#hfsupplierid').val('5ede58fb85c16929acfcb3b7');
    Addthead();
    typeHeadsupplier()
    LoadData()
    Close();
    Getpurchaseno();

    // validationsupplier();
})

function getproductname(id) {
    // /master/productsdetail/
    $.ajax({

        url: '/master/productsdetail',
        dataType: "json",
        type: "get",
        success: function (data) {

            productnameArray = data;
            ProductTypeheadMethod(id);
        },
        error: function (response) {
            var parsed = JSON.parse(response.responseText);
            Error_Msg(parsed.Message);
            d.resolve();
        },
        failure: function (response) {
            var parsed = JSON.parse(response.responseText);
            Error_Msg(parsed.Message);
            d.resolve();
        }
    });

}
var productnameArray = '';
function ProductTypeheadMethod(id) {

    var bestPictures = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        // prefetch: moviedetails
        local: productnameArray
    });
    $(id).typeahead(null, {
        name: 'best-pictures',
        display: 'name',
        source: bestPictures,
        templates: {
            empty: [
                `<button type="button" onclick="showproductentry()" class="btn btn-sm btn-secondary"><i class="fa fa-plus-circle"> Add Product</i></button>`
            ].join('\n'),
            suggestion: Handlebars.compile('<div><strong>{{name}}</strong></div>')
        },

    });

}
var Tabledata = [];
function Rowappend() {

    var row = '';
    $("#detailsTable thead tr th").each(function () {

        switch ($(this).text()) {

            case 'S.No':
                row = row + '<th style="width:10px"><label class="sno">1</label></th>';
                break
            case 'Product':
                row = row + `<td class="td-nopad" style="width:200px">
                <div class="typeahead">
                 <input class="form-control ddl" id="ddlproduct" type="text" dir="ltr" onblur="getproductdetails(this)"  placeholder="Enter Productname">
                </div>
                </td>`;
                break

            case 'Qty':
                row = row + '<td><input onkeyup="Cal_Amount()" type="text" class="qty numerickey form-control form-control"></input><input type="hidden" class="hfdetailsysid"></input><input class="productid" type="hidden"></input><input type="hidden" class="hfproductname"></input><input type="hidden" class="hfcategoryid"></input></td>';
                break
            case 'UNIT':
                row = row + '<td  class="td-nopad" style="width:100px"><select class="ddlunit form-control form-control"></select></td>';
                break
            case 'Rate':
                row = row + `<td class="td-nopad">
                <input type="hidden" class="hfoldpurchaseprice"/>
                <input type="hidden" class="hfpurchase_productid"/>
                <input type="text" onkeyup="Cal_Amount()"  class="rate form-control form-control rate"></td>`;
                break

            case 'DISCOUNTRs%':
                row = row + '<td class="td-nopad"><input type="text" onkeyup="Cal_Amount()" value="0" class="form-control discountvalue form-control"></td>';
                break
            case 'Amount':
                row = row + '<td class="td-nopad" ><input type="text"  disabled="disabled" value="0" class="amount form-control form-control"></td>';
                break
            default:
                row = row + '<td><i class="la la-trash" onclick="DeleteRow(this)" style="margin-left: 30%"></i></td>';
                break

        }

    });
    $('#detailsTable').append('<tr>' + row + '</tr>');
    for (i = 0; i < 2; i++) {
        Add_Row();
    }
    var firstrow = $("#detailsTable .trbody tr").first();
    // onblur="getproductdetails(this)"
    $(firstrow).find('.typeahead').empty("");
    $(firstrow).find('.typeahead').append(`<input class="form-control ddl" id="ddlproduct" onblur="getproductdetails(this)"  type="text" dir="ltr" placeholder="Enter Productname">`);
    getproductname($(firstrow).find('.ddl'))
    BindddlData($(firstrow).find('.ddlunit'), '/master/unitdropdown/')
    getproductname($('.ddl'));
    $('#detailsTable tbody tr').each(function (i, e) {
        $('.sno', this).text(i + 1);
    })
    // alert(Tabledata.length)
    if (Tabledata.length != 0) {
        $.each(Tabledata, function (j, v) {
            if (j <= 2) {
                $('#detailsTable tbody tr').each(function (i, e) {
                    if (j == i) {
                        let productdetails = productnameArray.filter(element => element.id == v.productid);
                        $('.ddl', this).val(productdetails[0].name);
                        $('.productid', this).val(v.productid);
                        $('.qty', this).val(v.qty);
                        $('.rate', this).val(v.rate);
                        $('.amount', this).val(v.amount);
                        $('.hfdetailsysid', this).val(v._id);
                        $('.discountvalue', this).val(v.discount == undefined ? "0" : v.discount);
                        BindddlDataele($('.ddlunit', this), '/master/unitdropdown/', v.unitid == undefined ? "0" : v.unitid)

                    }
                })
            } else {
                let productdetails = productnameArray.filter(element => element.id == v.productid);
                var row = $("#detailsTable .trbody tr").last().clone();
                var sno = parseInt($(row).find('.sno').text()) + 1;
                $(row).find('.sno').text(sno);

                $(row).find('.typeahead').empty("");
                $(row).find('.typeahead').append(`<input class="form-control ddl" onblur="getproductdetails(this)"  type="text" dir="ltr" placeholder="Enter Productname">`);
                $(row).find('.hfdetailsysid').val("");
                $("td input:text", row).val("");
                $('td .lbldel', row).attr("style", "display: none;");
                $("td button[type=button]", row).val('Delete');
                $("td button[type=button]", row).attr("style", "display: block");
                $(row).find('.discountvalue').val("0");
                $(row).find('.amount').val("0");
                $(row).find('.productid').val("");
                $(row).find('.ddlunit').val("");
                BindddlData($(row).find('.ddlunit'), '/master/unitdropdown/')
                getproductname($(row).find('.ddl'))

                $(row).find('.ddl').val(productdetails[0].name);
                $(row).find('.qty').val(v.qty);
                $(row).find('.rate').val(v.rate);
                $(row).find('.discountvalue').val(v.discount);
                $(row).find('.amount').val(v.amount);
                $(row).find('.productid').val(v.productid);
                $(row).find('.detailsysid').val(v._id);
                $(row).find('.discountvalue', this).val(v.discount);
                BindddlDataele($('.ddlunit', this), '/master/unitdropdown/', v.unitid)


                $('#detailsTable').append(row);
            }
        })
    }

}
function Add_Row() {
    var row = $("#detailsTable .trbody tr").last().clone();
    clear(row);
    $('#detailsTable').append(row);
    return false;
}
function clear(row) {

    var sno = parseInt($(row).find('.sno').text()) + 1;
    $(row).find('.sno').text(sno);
    $(row).find('.sysid').val("");
    $(row).find('.hfproductname').val("");
    $(row).find('.typeahead').empty("");
    $(row).find('.typeahead').append(`<input class="form-control ddl" onblur="getproductdetails(this)"  type="text" dir="ltr" placeholder="Enter Productname">`);
    $(row).find('.hfdetailsysid').val("");
    $(row).find('.hfcategoryid').val("");

    $("td input:text", row).val("");
    $('td .lbldel', row).attr("style", "display: none;");
    $("td button[type=button]", row).val('Delete');
    $("td button[type=button]", row).attr("style", "display: block");
    $("td input[type=date]", row).val('');
    $("td input[type=time]", row).val('');
    getproductname($(row).find('.ddl'))
    $(row).find('.discountvalue').val("0");
    $(row).find('.amount').val("0");
    $(row).find('.productid').val("");
    $(row).find('.ddlunit').val("");
    $(row).find('.salesprice').val("0");
    $(row).find('.hfoldpurchaseprice').val("0");
    $(row).find('.hfoldsalesprice').val("0");
    $(row).find('.hfpurchase_productid').val("0");
    BindddlData($(row).find('.ddlunit'), '/master/unitdropdown/')
}
function Addthead() {


    var amount = `Amount`;

    var unit = ($("#chunit").is(":checked") ? true : false) ? `<th>UNIT</th>` : '';
    var discount = ($("#chdiscount").is(":checked") ? true : false) ? `<th>DISCOUNT<select id="ddldiscount" class="discount"  style="display:block;margin-left: 15px;height: 19px;"><option  value="rupee">Rs</option><option value="percentage">%<option></select></th>` : '';
    var settings = `<a class="nav-link dropdown-toggle" data-toggle="modal" data-target="#kt_modal_4"><i class="flaticon2-gear"></i></i></a>`
    var head = "<th>S.No</th><th>Product</th><th>Qty</th>" + unit + "<th>Rate</th>" + discount + "<th>" + amount + "</th><th>" + settings + "</th>"; // add resources
    $("#detailsTable thead tr").append(head);


    Rowappend();
    Cal_Amount();


    //  BindSelect2('.ddl', '/master/productdropdown');
}
function Changetable() {
    $('#detailsTable tbody tr').each(function (i, e) {
        if ($('.productid', this).val() != '') {

            let detail = {

                productid: $('.productid', this).val(),
                qty: $('.qty', this).val(),
                rate: $('.rate', this).val(),
                discount: $('.discount', this).val(),
                amount: $('.amount', this).val()
            }
            if ($('.hfdetailsysid', this).val() != '') {
                detail._id = $('.hfdetailsysid', this).val()
            }
            if ($('.ddlunit', this).val() != undefined) {
                detail.unitid = $('.ddlunit', this).val()
            }
            if ($('.discountvalue', this).val() != undefined) {
                detail.discount = $('.discountvalue', this).val()
            }
            if ($('.hsc', this).val() != undefined) {

                detail.hsn = $('.hsc', this).val()
            }

            Tabledata.push(detail);
        }
    })


    $("#detailsTable").empty();
    $("#detailsTable").append('<thead><tr></tr></thead><tbody class="trbody"></tbody>');
    Addthead(Tabledata)
    $('#kt_modal_4').modal('toggle');
}

function getproductdetails(ctrl) {

    $('#hf_ctrl').val(ctrl)
    let productdetails = productnameArray.filter(element => element.name == $(ctrl).val())

    if (productdetails.length == 0 || productdetails.length == undefined || productdetails.length == '') {
        toastr.error('product Details  not availble')
    } else if (productdetails.length == 1) {
        $(ctrl).closest('tr').find('.qty').focus();
        $(ctrl).closest('tr').find('.rate').val(productdetails[0].purchaseprice);
        $(ctrl).closest('tr').find('.hsc').val(productdetails[0].hsnorsac_code);
        $(ctrl).closest('tr').find('.productid').val(productdetails[0].id);
        $(ctrl).closest('tr').find('.ddlunit').val(productdetails[0].unitid);
        $(ctrl).closest('tr').find('.salesprice').val(productdetails[0].salesprice);
        $(ctrl).closest('tr').find('.hfoldsalesprice').val(productdetails[0].salesprice);
        $(ctrl).closest('tr').find('.purchaseprice').val(productdetails[0].purchaseprice);
        $(ctrl).closest('tr').find('.hfoldpurchaseprice').val(productdetails[0].purchaseprice);
        $(ctrl).closest('tr').find('.hfpurchase_productid').val(productdetails[0].purchase_productid);

        $(ctrl).closest('tr').find('.hfcategoryid').val(productdetails[0].categoryid)
        $(ctrl).closest('tr').find('.hfproductname').val($(ctrl).val());
        $('.attributedetails').empty();
        var deatildesign = '';

        if ($(ctrl).closest('tr').find('.sno').text() == $("#detailsTable tbody").find("tr").length) {
            for (i = 0; i < 3; i++) {
                Add_Row();
            }
        }
    } else {
        $('#hf_ctrl').val(ctrl)
        toastr.error('Duplicate Product Invalid to Process')
    }
}
function Deletecolumn() {

    // $('#detailsTable th:nth-child(4),#detailsTable td:nth-child(4)').remove();
    var someRow = "<th>text1</th><th>text2</th>"; // add resources
    $("#detailsTable thead tr").append(someRow);
}
function attributedetails(ctrl) {
    $.ajax({
        url: '/master/productdetails/' + $(ctrl).closest('tr').find('.ddl').val(),
        dataType: "json",
        type: "get",
        success: function (data) {
            $('.productdetail').empty()
            var deatildesign = '';
            if (data.data[0].attributes) {
                $.each(data.data[0].attributes, function (index, value) {
                    switch (value.type) {
                        case 'text':
                            deatildesign = deatildesign + '<div class="row form-group"><label>' + value.attributename + '</label><input type="text" class="form-control form-control-sm" placeholder="enter ' + value.attributename + '"></div>'
                    }
                });
                $(ctrl).closest('tr').find('.ddl').append(deatildesign)
                $('#kt_modal_5').modal('toggle');
            } else {
                toastr.errormessage('there no attribute');
            }
        },
        error: function (response) {
            var parsed = JSON.parse(response.responseText);
            Error_Msg(parsed.Message);
            d.resolve();
        },
        failure: function (response) {
            var parsed = JSON.parse(response.responseText);
            Error_Msg(parsed.Message);
            d.resolve();
        }
    });




}

function typeHeadsupplier() {
    var bestPictures = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: '/master/supplierdopdown'
    });
    $('#txtsupplier').typeahead(null, {
        name: 'best-pictures',
        display: 'name',
        source: bestPictures,
        highlight: true,
        width: '500px',
        templates: {
            empty: [
                `<button type="button" onclick="showsupplier()" class="btn btn-sm btn-secondary"><i class="fa fa-plus-circle"> Add Supplier</i></button>`
            ].join('\n'),
            suggestion: Handlebars.compile('<div><strong>{{name}}</strong></div>'),
        },
    });


}
$('#txtsupplier').bind('typeahead:select', function (ev, suggestion) {

    $('#hfsupplierid').val(suggestion.id)
});
var Gstdetail = [];

function Cal_Amount() {
    Gstdetail = [];
    var discount = '';

    total = 0;

    $('.gstdetails').empty();
    $("table.table-bordered thead tr th ").each(function () {
        switch ($(this).text()) {
            case 'DISCOUNT%Rs':
                discount = $('.discount').val();
                break

        }
    })
    $('#detailsTable tbody tr').each(function (i, ele) {
        if ($('.productid', this).val() != '') {

            if (discount != undefined && discount != '') {

                if (discount == 'percentage') {
                    if ($('.discountvalue', this).val() <= 100) {
                        if ($('.rate', this).val() != '' && $('.qty', this).val() != '') {
                            $('.amount', this).val(parseFloat($('.rate', this).val()) * parseFloat($('.qty', this).val()))
                            $('.amount', this).val(parseFloat($('.amount', this).val()) - (($('.discountvalue', this).val() / 100) * $('.amount', this).val()))
                            $('.amount', this).val(parseFloat($('.amount', this).val()).toFixed(2))
                        }
                    } else {
                        $('.discountvalue', this).val('0')
                        toastr.error('discount percentage should be less or equal than 100')
                        return false;
                    }
                } else {
                    $('.amount', this).val(parseFloat($('.rate', this).val()) * parseFloat($('.qty', this).val()))
                    $('.amount', this).val(parseFloat($('.amount', this).val()) - (parseFloat($('.discountvalue', this).val())))
                    $('.amount', this).val(parseFloat($('.amount', this).val()).toFixed(2))
                }
            } else {
                if ($('.rate', this).val() != '' && $('.qty', this).val() != '') {

                    $('.amount', this).val(parseFloat($('.rate', this).val()) * parseFloat($('.qty', this).val()))
                    $('.amount', this).val(parseFloat($('.amount', this).val()).toFixed(2))
                }
            }

            total = parseFloat(total) + parseFloat($('.amount', this).val());
        }
    })




    $('#txtsubtotal').text(parseFloat(total).toFixed(2))
    $('#txttotal').text(parseFloat(total).toFixed(2))

    $('#txtpayamount').val(parseFloat(total).toFixed(2))

    if ($('#hf_id').val()) {
        Cal_Balance()
    }

}

function save_process() {
    let PurchaseDeatil = [];
    let SupplierDetail = [];
    let PayModeDetails = [];

    let ProductDetails = [];
    let total = 0;
    if ($('#hfsupplierid').val() == '') {
        toastr.error('Invalid Supplier Deatils  Unable to Process');
        return false;
    }
    let supplier_details = {
        suppliername: $('#hfsuppliername').val(),
        suppliertype: $('#hfsuppliertype').val(),
        email: $('#hfemail').val(),
        shippingaddress: $('#hfshippingaddress').val(),
        billingaddress: $('#hfbillingaddress').val(),
        gstin: $('#hfgstin').val(),
        gsttype: $('#hfgsttype').val(),
        gstno: $('#txtgstno').val()
    }
    SupplierDetail.push(supplier_details)

    $('#detailsTable tbody tr').each(function (i, e) {
        //  alert()

        if ($('.productid', this).val() != '') {
            if ($('.hfoldpurchaseprice', this).val() != $('.rate', this).val() || $('.hfoldsalesprice', this).val() != $('.salesprice', this).val()) {
                var product = productnameArray.filter(ele => ele.id == $('.productid', this).val());

                let productdetail = {
                    purchaseprice: $('.rate', this).val(),
                    categoryid: $('.hfcategoryid', this).val(),
                    salesprice: $('.salesprice', this).val(),
                    productid: $('.productid', this).val(),
                    productname: product[0].name,
                    unitid: product[0].unitid,
                    hsnorsac_code: product[0].unitid,
                    taxid: product[0].taxid

                }

                if ($('.discountvalue', this).val() != undefined) {
                    productdetail.discount = $('.discountvalue', this).val()
                }
                if ($('.hsc', this).val() != undefined) {

                    productdetail.hsnorsac_code = $('.hsc', this).val()
                }
                if ($('.hfoldsalesprice', this).val() != $('.salesprice', this).val()) {
                    productdetail.saleschanged = 'changed';
                }
                if ($('.hfoldpurchaseprice', this).val() != $('.rate', this).val()) {
                    productdetail.purchasechanged = 'changed';
                }
                ProductDetails.push(productdetail)
            }
            let detail = {
                productid: $('.productid', this).val(),
                categoryid: $('.hfcategoryid', this).val(),
                productname: $('.hfproductname', this).val(),
                qty: $('.qty', this).val(),
                rate: $('.rate', this).val(),
                discount: $('.discount', this).val(),
                amount: $('.amount', this).val(),
                purchase_productid: $('.hfpurchase_productid', this).val(),
                salesprice: $('.salesprice', this).val(),
            }
            if ($('.hfdetailsysid', this).val() != '') {
                detail._id = $('.hfdetailsysid', this).val()
            }
            if ($('.ddlunit', this).val() != undefined) {
                detail.unitid = $('.ddlunit', this).val()
            }
            if ($('.discountvalue', this).val() != undefined) {
                detail.discount = $('.discountvalue', this).val()
            }
            if ($('.hsc', this).val() != undefined) {

                detail.hsn = $('.hsc', this).val()
            }

            PurchaseDeatil.push(detail);
        }
    })
    if (PurchaseDeatil.length == 0) {
        toastr.error('Invalid Purchase Deatil Unable to Process');
        return false;
    }

    if (parseInt($('#txttotal').text()) <= 0) {
        toastr.error('Inavalid  Deatil Unable to Process');
        return false;
    }

    let detail = {
        paidfrom: '5eb63777182c7e03c4a3958b',
        referencemode: 'Cash',
        amount: $('#txtpayamount').val(),

    }
    PayModeDetails.push(detail);


    var data = {

        _id: $('#hf_id').val(),
        purchaseorderno: $('#lblpurchaseno').text(),
        purchasedate: Converdate($('#txtpurchasedate').val()),

        reference: $('#txtreference').val(),
        supplierid: $('#hfsupplierid').val(),
        purchaseDetail: PurchaseDeatil,
        subtotal: $('#subtotal').text(),
        roundofftype: $('#ddlroundofftype').val(),
        roundoff: $('#txtrounoffvalue').val(),
        actualtotal: $('#txtactualtotal').val(),
        total: $('#txttotal').text(),
        paidamount: $('#txtpayamount').val(),
        balance: $('#lblbalance').text(),
        hsncolumn: $("#chhsn").is(":checked") ? 1 : 0,
        unitcolumn: $("#chunit").is(":checked") ? 1 : 0,
        discountcolumn: $("#chdiscount").is(":checked") ? 1 : 0,
        discountype: $("#ddldiscount").val(),
        taxtype: $("#taxtype").val(),
        note: $('#txtnote').val(),
        PaymodeDetail: PayModeDetails,
        transdate: $('#txtpurchasedate').val(),
        gstdetail: Gstdetail,
        SupplierDetail: SupplierDetail,
        ProductDetails: ProductDetails
    }
    insertupdate(data, '/purchase/insertupdate');
    //  alert(JSON.stringify(Gstdetail))

}

function afterinsertupdatefunction(result) {
    Getpurchaseno();
    cleardata();


}

function LoadData() {
    $('#gvpurchaselist').dataTable().fnDestroy();
    var table = $('#gvpurchaselist');
    //let sno=0;
    // begin first table
    table.DataTable({
        responsive: true,
        searchDelay: 500,
        processing: true,
        serverSide: true,
        pageLength: 5,
        lengthMenu: [
            [5, 10, 25, 50, 100],
            [5, 10, 25, 50, 100]
        ],
        ajax: '/purchase/list',
        columns: [
            // { data: 'sno', },
            { data: 'purchasedate', name: 'productname' },
            { data: 'purchaseorderno', name: 'itemcode' },
            { data: 'Supplier.name', name: 'type' },

            { data: 'total', name: 'type' },

            { data: '_id', responsivePriority: -1 },
        ],
        order: [0, "desc"],
        dom: '<"top" f>rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        columnDefs: [{
            targets: -1,
            title: 'Action',
            orderable: false,
            render: function (data, type, full, meta) {
                let value = data.split('-');

                let editbutton = $.trim(value[1]) == 'true' ? `
             
                    <button type="button" onclick='btneditpurchase("` + value[0] + `")' class="btn btn-sm btn-outline-success">
                        Edit
                    </button>
              
                  `
                    : '';

                let deletebutton = value[2] == 'true' ? `
                <li class="kt-nav__item">
                <a class="kt-nav__link" onclick='btndeletepurchase("` + value[0] + `")'><i class="kt-nav__link-icon flaticon2-trash"></i><span class="kt-nav__link-text">Delete</span></a>
                </li>
               `: '';
                console.log(deletebutton)
                return `<div class="btn-group ptb-5">
                 `+ editbutton + `
                    <button type="button"
                        class="btn btn-sm btn-outline-success dropdown-toggle dropdown-toggle-split"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="sr-only">Print</span>
                    </button>
                    <div class="dropdown-menu" style="">
                    <ul class="kt-nav">
                       `+ deletebutton + `
                        <li class="kt-nav__item">
                            <a class="kt-nav__link" onclick='btnpayment_process("` + value[0] + `")'><i class="kt-nav__link-icon  la la-rupee"></i> <span class="kt-nav__link-text">Payment</span></a> 
                           
                        </li>
                    </ul>
                     
                     
                    </div>
                    </div>`;
                // return `


                //     <a onclick='btneditpurchase("` + data + `")' type="button" class="btn btn-sm btn-primary btn-icon  btn-icon btn-icon-sm" title="View / Edit" >
                //       <i class ="la la-edit ic-white"></i>
                //     </a>
                //           <a onclick= 'btndeletepurchase("` + data + `")' type="button" class="btn btn-sm btn-delete-red btn-icon  btn-icon btn-icon-sm" title="Delete">

                //       <i class ="la la-trash ic-white"></i>
                //     </a>`;
            },
        },

        ],
    });
    // table.on( 'order.dt search.dt', function () {
    //     t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
    //         cell.innerHTML = i+1;
    //     } );
    // } ).draw();
}

function btneditpurchase(id) {
    editassignvalue('/purchase/edit/' + id)
}

function btndeletepurchase(id) {

    deletedata('/purchase/delete/' + id)
}

function afterdelete() {

    LoadData();
    amountdateils();
}

function assignvalue(data) {
    $('.list').hide();
    $('.entry').show();
    if (data[0].discountcolumn == 1) {

        $('#chdiscount').prop('checked', true);
    }
    if (data[0].unitcolumn == 1) {

        $('#chunit').prop('checked', true);
    }
    if (data[0].hsncolumn == 1) {
        $('#chhsn').prop('checked', true);
    }
    $("#detailsTable thead tr").empty('');
    $("#detailsTable tbody").empty('');
    Addthead();
    $("#ddldiscount").val(data[0].discountype);
    $("#taxtype").val(data[0].taxtype);
    $('#hf_id').val(data[0]._id);
    $('#txtpurchasedate').val(data[0].purchasedate);
    $('#ddlduedays').val(data[0].creditdays);
    //Cal_Duedate();
    $('#txttotal').text(data[0].total)
    $('#txtreference').val(data[0].reference)
    $('#txtsupplier').typeahead('val', data[0].Supplier.name);
    $('.supplierdetails').show();
    $('#txtgstno').val(data[0].Supplier.gstin);
    $('#ddlcompanystate').val(data[0].Supplier.billingstate);
    $('#hfsupplierid').val(data[0].supplierid);
    $('#lblpurchaseno').text(data[0].purchaseorderno)
    $('#ddlroundofftype').val(data[0].roundofftype);
    $('#txtrounoffvalue').val(data[0].roundoff)
    $('#txtactualtotal').val(data[0].actualtotal)
    $('#txtpayamount').val(data[0].payamount)
    $('#lblbalance').text(data[0].dueamount)
    $('#txtnote').val(data[0].note)
    $('#hfsuppliername').val(data[0].Supplier.suppliername);
    $('#hfsuppliertype').val(data[0].Supplier.customertype);
    $('#hfemail').val(data[0].Supplier.email);
    $('#hfshippingaddress').val(data[0].Supplier.shippingaddress);
    $('#hfbillingaddress').val(data[0].Supplier.billingaddress);
    $('#hfgstin').val(data[0].Supplier.gstin);
    $('#hfgsttype').val(data[0].Supplier.gsttype);

    $.each(data[0].purchaseDetail, function (j, v) {
        if (j <= 2) {
            $('#detailsTable tbody tr').each(function (i, e) {
                if (j == i) {
                    let productdetails = productnameArray.filter(element => element.id == v.productid);
                    $('.ddl', this).val(productdetails[0].name);
                    $('.productid', this).val(v.productid);
                    $('.hfcategoryid', this).val(v.categoryid);
                    $('.hfproductname', this).val(productdetails[0].name);
                    $('.qty', this).val(v.qty);
                    $('.rate', this).val(v.rate);
                    $('.amount', this).val(v.amount);
                    $('.hfdetailsysid', this).val(v._id);
                    $('.discountvalue', this).val(v.discount);
                    BindddlDataele($('.ddlunit', this), '/master/unitdropdown/', v.unitid)
                    $('.salesprice', this).val(v.salesprice)
                    $('.hsc', this).val(v.hsn);
                    $('.hfoldsalesprice').val(v.salesprice);
                    $('.hfoldpurchaseprice').val(v.purchaseprice);
                    $('.hfpurchase_productid').val(v.purchase_productid);
                }
            })
        } else {
            let productdetails = productnameArray.filter(element => element.id == v.productid);
            var row = $("#detailsTable .trbody tr").last().clone();
            var sno = parseInt($(row).find('.sno').text()) + 1;
            $(row).find('.sno').text(sno);

            $(row).find('.typeahead').empty("");
            $(row).find('.typeahead').append(`<input class="form-control ddl" onblur="getproductdetails(this)"  type="text" dir="ltr" placeholder="Enter Productname">`);
            $(row).find('.hfdetailsysid').val("");
            $("td input:text", row).val("");
            $('td .lbldel', row).attr("style", "display: none;");
            $("td button[type=button]", row).val('Delete');
            $("td button[type=button]", row).attr("style", "display: block");
            $(row).find('.discountvalue').val("0");
            $(row).find('.amount').val("0");
            $(row).find('.productid').val("");
            $(row).find('.ddlunit').val("");
            BindddlData($(row).find('.ddlunit'), '/master/unitdropdown/')
            getproductname($(row).find('.ddl'))
            $(row).find('.ddl').val(productdetails[0].name);
            $(row).find('.hfproductname', this).val(productdetails[0].name);
            $(row).find('.hfcategoryid').val(v.categoryid);
            $(row).find('.qty').val(v.qty);
            $(row).find('.rate').val(v.rate);
            $(row).find('.discountvalue').val(v.discount);
            $(row).find('.amount').val(v.amount);
            $(row).find('.productid').val(v.productid);
            $(row).find('.detailsysid').val(v._id);
            $(row).find('.discountvalue', this).val(v.discount);
            BindddlDataele($('.ddlunit', this), '/master/unitdropdown/', v.unitid)
            $(row).find('.hsc', this).val(v.hsn);
            $(row).find('.salesprice', this).val(v.salesprice);
            $(row).find('.hfoldsalesprice').val(v.salesprice);
            $(row).find('.hfoldpurchaseprice').val(v.purchaseprice);
            $(row).find('.hfpurchase_productid').val(v.purchase_productid);
            $('#detailsTable').append(row);
        }
    })
    let balancepayment = 0;



    Cal_Amount();
}

function Close() {
    cleardata();
    $('.list').show();
    $('.entry').hide();
    amountdateils();
    LoadData();

}

function Show() {
    $('.list').hide();
    $('.entry').show();
    $('#kt_modal_4').modal('toggle');
    Getpurchaseno();
    // $("#detailsTable").empty();
    // $("#detailsTable").append('<thead><tr></tr></thead><tbody class="trbody"></tbody>');
    // Addthead();
    // BindddlData($('#ddlunit'), '/master/unitdropdown/')
    Companystate()
    bidpaymode('.ddlpaymode', '/master/banklistddl');

}

function saveexit() {
    save_process();
    Close();
}

function cleardata() {
    $('#hf_id').val('');
    $('#txtsupplier').val('Walkin');
    $('#hfsupplierid').val('5ede58fb85c16929acfcb3b7');
    $('#txttotal').text("0");
    $('#subtotal').text("0");

    $('#txtreference').val("");
    $('#tblpayment tbody').find("tr:gt()").remove();
    $('#tblpayment tbody tr').each(function (i, e) {


        $('.ddltype', this).val('Cash').removeAttr("disabled");
        $('.payamount', this).val('0').removeAttr("disabled");
        $('.description', this).val('').removeAttr("disabled");
        $('.hfpaymentid', this).val('').removeAttr("disabled");

        ddleditpaymode($('.ddlpaymode', this), '/master/banklistddl', '5e71cedfb448ba375c84b94d')
    })
    $("#detailsTable thead tr").empty();
    $("#detailsTable tbody").empty();

    $('.supplierdetails').hide();

    $('#ddlroundofftype').val('plus');
    $('#txtrounoffvalue').val('0')
    $('#txtactualtotal').val('0');
    $('#chdiscount').prop('checked', true);
    $('#chunit').prop('checked', false);
    $('#chhsn').prop('checked', false);
    $('#lblbalance').text('0');
    $('#txtpayamount').val('0');
    $('#txtnote').val('');
    Tabledata = [];
    localStorage.clear();
    Addthead();
    $('#hf_balancepayment').val('0');
}

function Getpurchaseno() {
    $.ajax({
        type: "GET",
        url: '/purchase/purchaseno',
        success: function (data) {

            $('#lblpurchaseno').text('PE' + data.billno)
        },
        error: function (errormessage) {
            toastr.error(errormessage.responseText);
        }
    })
    return false
}

function DeleteRow(ctrl) {
    var currentRow = $(ctrl).closest("tr");

    if (parseInt($(currentRow).find('.sno').text()) <= 3) {
        $(currentRow).find('.typeahead').empty("");
        $(currentRow).find('.typeahead').append(`<input class="form-control ddl" onblur="getproductdetails(this)"  type="text" dir="ltr" placeholder="Enter Productname">`);
        $(currentRow).find('.hfdetailsysid').val("");
        $("td input:text", $(currentRow)).val("");
        $('td .lbldel', $(currentRow)).attr("style", "display: none;");
        $("td button[type=button]", $(currentRow)).val('Delete');
        $("td button[type=button]", $(currentRow)).attr("style", "display: block");
        $("td input[type=date]", $(currentRow)).val('');
        $("td input[type=time]", $(currentRow)).val('');
        getproductname($(currentRow).find('.ddl'))
        $(currentRow).find('.discountvalue').val("0");
        $(currentRow).find('.amount').val("0");
        $(currentRow).find('.productid').val("");
        $(currentRow).find('.ddlunit').val("");
        BindddlData($(currentRow).find('.ddlunit'), '/master/unitdropdown/')
    } else {

        $(ctrl).closest('tr').remove();
        $('#detailsTable tbody tr').each(function (i, e) {


            $('.sno', this).text(i + 1);
        })

    }
    Cal_Amount();
    Cal_Balance();
}

function Fn_OverallDiscount_Cal() {
    $('#txttotal').text(parseFloat($('#txttotal').text() - $('#txtoveralldiscount').val()).toFixed(2))
}
function showsupplier() {
    $('#customermadal').modal('show');
    var validationsupplier = function () {
        $("#formcustsub").validate({
            // define validation rules
            rules: {
                name: {
                    required: true
                },
                mobile: {
                    required: true
                },
            },
            //display error alert on form submit
            invalidHandler: function (event, validator) {
                swal.fire({
                    "title": "",
                    "text": "There are some errors in your submission. Please correct them.",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary",
                    "onClose": function (e) {
                        console.log('on close event fired!');
                    }
                });

                event.preventDefault();
            },

            submitHandler: function (form) {
                swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be save this file!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, Save it!',
                    cancelButtonText: 'No, cancel!',
                    reverseButtons: true
                }).then(function (result) {
                    if (result.value) {
                        var data = {
                            name: $('#txtname').val(),
                            mobile: $('#txtmobile').val(),
                            pagetype: "supllier",
                            id: "",
                        };
                        $.ajax({
                            url: '/master/custsup',
                            data: JSON.stringify(data),
                            type: 'post',
                            contentType: "application/json;charset=utf-8",
                            dataType: "json",
                            success: function (result) {
                                if (result.status == 'success') {
                                    toastr.success(result.message);
                                    $('#txtname').val(''),
                                        $('#txtmobile').val(''),
                                        $('#hfsupplierid').val(result.data._id);
                                    $('#txtsupplier').val(result.data.name);
                                    $('#hfsuppliername').val(result.data.name);
                                    $('#customermadal').modal('hide');
                                } else {
                                    toastr.error(result.message);
                                }
                            },
                            error: function (errormessage) {
                                toastr.error(errormessage.responseText);
                            }
                        })

                        return false

                    } else if (result.dismiss === 'cancel') {
                        swal.fire(
                            'Cancelled',
                            'Your data is safe :)',
                            'error'
                        )
                    }
                })
            }
        });
    }
}
function Cal_Roundoff() {
    if ($('#ddlroundofftype').val() == "plus") {
        let nettotal = parseFloat($('#txtsubtotal').text()) + parseFloat($('#txtrounoffvalue').val())
        $('#txttotal').text(parseFloat(nettotal).toFixed(2))
        $('#txtpayamount').val(parseFloat(nettotal).toFixed(2))
        Cal_Balance()
    } else {
        let nettotal = parseFloat($('#txtsubtotal').text()) - parseFloat($('#txtrounoffvalue').val())
        $('#txttotal').text(parseFloat(nettotal).toFixed(2))
        $('#txtpayamount').val(parseFloat(nettotal).toFixed(2))
        Cal_Balance()
    }

}
function Cal_Balance() {

    // $('#txtpayamount').val(parseFloat(parseFloat(total) + parseFloat($('#hf_balancepayment').val() == '' ? '0' : $('#hf_balancepayment').val())).toFixed(2))
    $('#lblbalance').text((parseFloat($('#txttotal').text()) - parseFloat($('#txtpayamount').val())))

}
function amountdateils() {
    $.ajax({
        url: '/purchase/amountdateils',
        success: function (data) {

            $('#lblpurchaseamount').text(parseFloat(data[0].totalpurchase).toFixed(2))
            $('#lbltotalpaidamount').text(parseFloat(data[0].totalpay).toFixed(2))
            $('#lbltotaldueamount').text(parseFloat(data[0].dueamount).toFixed(2))
            $('#lbltotaloverdueamount').text(parseFloat(data[0].overdue).toFixed(2))
        }

    })

}
function Add_paymentRow() {
    var row = $("#tblpayment tbody tr").last().clone();
    // clear(row);
    $(row).find('.payamount').val('0');
    $(row).find('.description').val('0');
    $(row).find('.description').val('0');
    $(row).find('.hfpaymentid').val('');
    bidpaymode($(row).find('.ddlpaymode'), '/master/banklistddl');
    $('#tblpayment').append(row);
    return false;
}
function Companystate() {
    $.ajax({
        url: '/Adminpanel/companystate',
        dataType: "json",
        type: "get",
        success: function (data) {

            $('#hf_companystate').val(data[0].state)
        },
        error: function (response) {
            var parsed = JSON.parse(response.responseText);
            Error_Msg(parsed.Message);
            d.resolve();
        },
        failure: function (response) {
            var parsed = JSON.parse(response.responseText);
            Error_Msg(parsed.Message);
            d.resolve();
        }
    });
}

