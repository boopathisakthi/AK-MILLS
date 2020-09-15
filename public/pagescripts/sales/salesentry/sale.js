$(document).ready(function () {
    localStorage.clear();
    getsalesno();
    typeHeadcustomer();
    $('#hfcustomerid').val('5ede58eb85c16929acfcb3b6')
    $('#txtcustomer').val('Walkin')
    var currentDate = new Date();
    $("#txtinvoicedate").datepicker().datepicker("setDate", currentDate);
    Companystate()
    Addthead();
    LoadData()
    Close();
    $('.printTable').hide();
    validationcustomer();
    pagerolebasedaction();
})

function Print() {
    $("#printarea").print();
}
function getproductname(id) {
    $.ajax({
        url: '/master/productsdetail/',
        dataType: "json",
        type: "get",
        success: function (data) {
            productnameArray = data;
            if (id) {
                ProductTypeheadMethod(id);
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
                `<button type="button" class="btn btn-sm btn-secondary"><i class="fa fa-plus-circle"> Add Product</i></button>`
            ].join('\n'),
            suggestion: Handlebars.compile('<div><strong>{{name}}</strong></div>')
        },

    });

}
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
                 <input class="form-control input-no-border ddl" id="ddlproduct" type="text" dir="ltr" onblur="getproductdetails(this)"  placeholder="Enter Productname">
                </div>
                </td>`;
                break
            case 'HSN/SAC':
                row = row + '<td class="td-nopad"><input type="text" disabled="disabled" class="form-control  form-control input-no-border hsc">  ';
                break
            case 'AvailableQty':
                row = row + '<td><input disabled="disabled" type="text" class="availableqty form-control form-control input-no-border"></input></td>';
                break
            case 'Qty':
                row = row + '<td><input onblur="Cal_Amount()" type="text" class="qty numerickey form-control form-control input-no-border"></input><input type="hidden" class="hfdetailsysid input-no-border"></input><input class="productid input-no-border" type="hidden"></input><input type="hidden" class="hfqty"></input><input type="hidden" class="hfproductname"></input><input type="hidden" class="hfcategoryid"></input></td>';
                break
            case 'UNIT':
                row = row + '<td  class="td-nopad" style="width:100px"><select class="form-control form-control ddlunit input-no-border"></select></td>';
                break
            case 'Rate':
                row = row + '<td class="td-nopad"><input type="text" onkeyup="Cal_Amount()" onkeydown="Cal_Amount()" class=" form-control numerickey form-control rate input-no-border"></td>';
                break
            case 'DISCOUNTRs%':
                row = row + '<td class="td-nopad"><input type="text"  onkeyup="Cal_Amount()" onkeydown="Cal_Amount()" value="0" class="form-control numerickey discountvalue form-control input-no-border"></td>';
                break
            case 'Amount':
                row = row + '<td class="td-nopad" ><input type="text"  disabled="disabled" value="0" class="amount form-control form-control input-no-border"></td>';
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
    $(firstrow).find('.typeahead').empty("");
    $(firstrow).find('.typeahead').append(`<input class="form-control ddl" onblur="getproductdetails(this)"  type="text" dir="ltr" placeholder="Enter Productname">`);
    BindddlData($(firstrow).find('.ddlunit'), '/master/unitdropdown/')
    getproductname($(firstrow).find('.ddl'))

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
                        $('.availableqty', this).val(v.availableqty);
                        $('.hfdetailsysid', this).val(v._id);
                        $('.discountvalue', this).val(v.discount == undefined ? "0" : v.discount);
                        BindddlDataele($('.ddlunit', this), '/master/unitdropdown/', v.unitid == undefined ? "0" : v.unitid)
                        $('.hsc', this).val(v.hsn == undefined ? "0" : v.hsn);
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
                $(row).find('.availableqty').val("")
                $(row).find('.ddlunit').val("");
                BindddlData($(row).find('.ddlunit'), '/master/unitdropdown/')
                getproductname($(row).find('.ddl'))

                $(row).find('.ddl').val(productdetails[0].name);
                $(row).find('.qty').val(v.qty);
                $(row).find('.rate').val(v.rate);
                $(row).find('.discountvalue').val(v.discount);
                $(row).find('.amount').val(v.amount);
                $(row).find('.productid').val(v.productid);
                $(row).find('.availableqty').val(v.availableqty)
                $(row).find('.detailsysid').val(v._id);
                $(row).find('.discountvalue', this).val(v.discount);
                BindddlDataele($('.ddlunit', this), '/master/unitdropdown/', v.unitid)
                $(row).find('.hsc', this).val(v.hsn);

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
var Tabledata = [];
function clear(row) {

    var sno = parseInt($(row).find('.sno').text()) + 1;
    $(row).find('.sno').text(sno);
    $(row).find('.sysid').val("");
    $(row).find('.typeahead').empty("");
    $(row).find('.typeahead').append(`<input class="form-control ddl" onblur="getproductdetails(this)"  type="text" dir="ltr" placeholder="Enter Productname">`);
    $(row).find('.hfdetailsysid').val("");
    $(row).find('.hfproductname').val("");
    $(row).find('.hfcategoryid').val("");
    $("td input:text", row).val("");
    $('td .lbldel', row).attr("style", "display: none;");
    $("td button[type=button]", row).val('Delete');
    $("td button[type=button]", row).attr("style", "display: block");
    $("td input[type=date]", row).val('');
    $("td input[type=time]", row).val('');
    getproductname($(row).find('.ddl'))
    $(row).find('.discountvalue').val("0");
    $(row).find('.availableqty').val("0");
    $(row).find('.hfqty').val("0");
    $(row).find('.amount').val("0");
    $(row).find('.productid').val("");
    BindddlData($(row).find('.ddlunit'), '/master/unitdropdown/')
}

function Addthead() {
    var amount = `Amount`;
    var hsn = ($("#chhsn").is(":checked") ? 1 : 0) ? `<th>HSN/SAC</th>` : '';
    var unit = ($("#chunit").is(":checked") ? true : false) ? `<th>UNIT</th>` : '';
    var discount = ($("#chdiscount").is(":checked") ? true : false) ? `<th>DISCOUNT<select id="ddldiscount" class="discount"><option value="rupee">Rs</option><option value="percentage">%<option></select></th>` : '';
    var settings = `<a class="nav-link dropdown-toggle" data-toggle="modal" data-target="#kt_modal_4"><i class="flaticon2-gear"></i></i></a>`
    var head = "<th>S.No</th><th>Product</th>" + hsn + "<th>AvailableQty</th><th>Qty</th>" + unit + "<th>Rate</th>" + discount + "<th>" + amount + "</th><th>" + settings + "</th>"; // add resources
    $("#detailsTable thead tr").append(head);
    Rowappend();
    //  BindSelect2('.ddl', '/master/productdropdown');
}

function Changetable() {
    Tabledata = [];
    $('#detailsTable tbody tr').each(function (i, e) {
        if ($('.productid', this).val() != '') {

            let detail = {
                availableqty: $('.availableqty', this).val(),
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
    Addthead()
    $('#kt_modal_4').modal('toggle');
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

function getproductdetails(ctrl) {

    let productdetails = productnameArray.filter(element => element.name == $(ctrl).val())

    if (productdetails.length == 0 || productdetails.length == undefined || productdetails.length == '') {
        // toastr.error('product Details  not availble')
    } else if (productdetails.length == 1) {
        $(ctrl).closest('tr').find('.qty').focus();
        $(ctrl).closest('tr').find('.availableqty').val(productdetails[0].availbleqty);
        $(ctrl).closest('tr').find('.qty').val(1);
        $(ctrl).closest('tr').find('.rate').val(productdetails[0].salesprice);
        $(ctrl).closest('tr').find('.hsc').val(productdetails[0].hsnorsac_code);

        $(ctrl).closest('tr').find('.hfcategoryid').val(productdetails[0].categoryid);
        $(ctrl).closest('tr').find('.productid').val(productdetails[0].id);
        $(ctrl).closest('tr').find('.hfproductname').val($(ctrl).val())
        $('.attributedetails').empty()
        var deatildesign = '';
        if (productdetails[0].attributes != 0) {
            $.each(productdetails[0].attributes, function (index, value) {
                switch (value.type) {
                    case 'text':
                        deatildesign = deatildesign + '<div class="row form-group"><label>' + value.attributename + '</label><input type="text" class="form-control form-control-sm" placeholder="enter ' + value.attributename + '"></div>'
                }
            });
            $('.dropdown').show();
            $('.attributedetails').append(deatildesign + "<input type='hidden' value='" + productdetails[0].id + "'>")
            // $('#kt_modal_5').modal('toggle');
        }
        if ($(ctrl).closest('tr').find('.sno').text() == $("#detailsTable tbody").find("tr").length) {
            for (i = 0; i < 3; i++) {
                Add_Row();
            }
        }
    } else {
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
var Gstdetail = [];
function Cal_Amount() {
    Gstdetail = [];
    var discount = '';

    total = 0;

    $('.gstdetails').empty();
    $("table.table-bordered thead tr th ").each(function () {
        switch ($(this).text()) {
            case 'DISCOUNTRs%':
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
    let saveprocess = "true";
    let CustomerDetail = [];
    let invoiceDetail = [];
    let PaymentDetails = [];
    let total = 0;
    if ($('#hfcustomerid').val() == '') {
        toastr.error('Invalid Customer Deatils  Unable to Process');
        return false;
    }
    let customer_details = {
        customername: $('#hfcustomername').val(),
        customertype: $('#hfcustomertype').val(),
        email: $('#hfemail').val(),
        mobile: $('#hfmobile').val(),
        shippingaddress: $('#hfshippingaddress').val(),
        billingaddress: $('#hfbillingaddress').val(),
        gstin: $('#hfgstin').val(),
        gsttype: $('#hfgsttype').val(),
        gstno: $('#hfgstno').val()

    }
    CustomerDetail.push(customer_details);


    $('#detailsTable tbody tr').each(function (i, e) {
        if ($('.productid', this).val()) {
            if ($('.productid', this).val() != '' && $('.hfcategoryid', this).val() != '') {

                if (parseInt($('.qty', this).val()) > parseInt($('.availableqty', this).val())) {
                    saveprocess = "false";
                    toastr.error('Please Check and give Valid Input');
                    return false;
                }

                let detail = {
                    productname: $('.hfproductname', this).val(),
                    productid: $('.productid', this).val(),
                    categoryid: $('.hfcategoryid', this).val(),
                    qty: $('.qty', this).val(),
                    saleqty: $('.hfqty', this).val(),
                    rate: $('.rate', this).val(),
                    discount: $('.discountvalue', this).val(),
                    amount: $('.amount', this).val()
                }
                if ($('.hfdetailsysid', this).val() != '') {
                    detail._id = $('.hfdetailsysid', this).val()
                }
                if ($('.unit', this).val() != undefined) {
                    detail.unitid = $('.unitid').val()
                }
                if ($('.discountvalue', this).val() != undefined) {
                    detail.discount = $('.discountvalue', this).val()
                }
                invoiceDetail.push(detail);
            }
        }

    })
    let PayModeDetails = [];
    let detail = {
        paidfrom: '5ee08225f3dd74330066241e',
        referencemode: 'Cash',
        amount: $('#txtpayamount').val(),
    }
    PayModeDetails.push(detail);

    if (invoiceDetail.length == 0) {
        toastr.error('Invalid invoice Deatil Unable to Process');
        return false;
    }
    else {
        var data = {
            _id: $('#hf_id').val(),
            invoiceno: $('#hfinvoiceno').val(),
            invoicedate: Converdate($('#txtinvoicedate').val()),
            reference: $('#txtreference').val(),
            customerid: $('#hfcustomerid').val(),
            invoiceDetail: invoiceDetail,
            subtotal: $('#subtotal').text(),
            roundoff: $('#txtrounoffvalue').val(),
            roundofftype: $('#ddlroundofftype').val(),
            actualtotal: $('#txtactualtotal').val(),
            paidamount: $('#txtpayamount').val(),
            balance: $('#lblbalance').text(),
            total: $('#txttotal').text(),
            hsncolumn: $("#chhsn").is(":checked") ? 1 : 0,
            unitcolumn: $("#chunit").is(":checked") ? 1 : 0,
            discountcolumn: $("#chdiscount").is(":checked") ? 1 : 0,
            discountype: $("#ddldiscount").val(),
            taxtype: $("#taxtype").val(),
            note: $('#txtnote').val(),
            CustomerDetail: CustomerDetail,
            gstdetail: Gstdetail,
            PaymodeDetail: PayModeDetails,
            transdate: $('#txtinvoicedate').val(),
            note: $('#txtnote').val(),
            termsandconditions: $('#txttermsandcondition').val(),
        }
        if (saveprocess == "true") {
            insertupdate(data, '/sales/insertupdate');
        }


    }








}

function afterinsertupdatefunction(res) {
    cleardata();
    getbob_invoice(res.data._id);
    getsalesno();
    amountdateils();


}
function LoadData() {
    $('#gvsaleslist').dataTable().fnDestroy();
    var table = $('#gvsaleslist');
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
        ajax: '/sales/list',
        columns: [
            // { data: 'sno', },
            { data: 'invoicedate', name: 'invoicedate' },
            { data: 'invoiceno', name: 'invoiceno' },
            { data: 'customer.name', name: 'customer' },
            { data: 'total', name: 'total' },
            { data: 'balancedueamount', name: 'balancedueamount' },
            { data: 'status', name: 'status' },

            { data: '_id', responsivePriority: -1 },
        ],
        order: [1, "desc"],
        dom: '<"top" f>rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        columnDefs: [{
            targets: -1,
            title: 'Actions',
            orderable: false,
            render: function (data, type, full, meta) {
                let value = data.split('-');

                let editbutton = $.trim(value[1]) == 'true' ? `
                <li class="kt-nav__item">
                <a class="kt-nav__link" onclick='btneditsales("` + value[0] + `")'><i class="kt-nav__link-icon flaticon-edit-1"></i><span class="kt-nav__link-text">Edit</span></a>
                </li>
                  `
                    : '';


                let deletebutton = $.trim(value[2]) == 'true' ? `
               <li class="kt-nav__item">
               <a class="kt-nav__link" onclick='btndeletesales("` + value[0] + `")'><i class="kt-nav__link-icon flaticon-delete"></i><span class="kt-nav__link-text">Delete</span></a>
               </li>
                 `
                    : '';

                return `<div class="btn-group ptb-5">
                    <button type="button" onclick='getbob_invoice("` + value[0] + `")' class="btn btn-sm btn-outline-success">
                        Print
                    </button>
                  
                    <button type="button"
                        class="btn btn-sm btn-outline-success dropdown-toggle dropdown-toggle-split"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="sr-only">Print</span>
                    </button>
                  
                    <div class="dropdown-menu" style="">
                    <ul class="kt-nav">
                  `+ editbutton + `
                  
                    <li class="kt-nav__item">
                        <a class="kt-nav__link" onclick='btnreceipt_process("` + value[0] + `")'><i class="kt-nav__link-icon  la la-rupee"></i> <span class="kt-nav__link-text">Receipt</span></a> 
                       
                    </li>
                    <li class="kt-nav__item">
                    <a class="kt-nav__link" onclick='btnsendmail_process("` + value[0] + `")'><i class="kt-nav__link-icon  la la-send"></i> <span class="kt-nav__link-text">Send</span></a> 
                   
                </li>
                    `+ deletebutton + `
                </ul>
                       
                    </div>
                    </div>`;
            },
        },
        {
            targets: -2,
            render: function (data, type, full, meta) {
                if (data == 'Due') {
                    return '<span class="kt-badge kt-badge--info  kt-badge--inline kt-badge--pill">' + data + '</span>';
                } else if (data == 'OverDue') {
                    return '<span class="kt-badge kt-badge--danger  kt-badge--inline kt-badge--pill">' + data + '</span>';
                } else {
                    return '<span class="kt-badge  kt-badge--success kt-badge--inline kt-badge--pill">' + data + '</span>';
                }

            },
        },

        ],
    });

}
function Close() {
    // cleardata();
    $('.list').show();
    $('.entry').hide();

    LoadData();
    amountdateils();
}
function Show() {

    $('.list').hide();
    $('.entry').show();
    $('#kt_modal_4').modal('toggle');

    cleardata();
    getsalesno();
    bidpaymode('.ddlpaymode', '/master/banklistddl');
}
function saveexit() {
    save_process();
    Close();
}
function cleardata() {
    $('#hf_id').val('');
    $('#txtpayamount').val("0")
    $('#txttotal').text("0")
    $('#txtsubtotal').text("0.00")
    $('#hfcustomerid').val('5ede58eb85c16929acfcb3b6')
    $('#txtcustomer').val('Walkin')
    $('#txtreference').val("");
    $("#detailsTable tbody").find("tr:gt(2)").remove();
    $('#detailsTable tbody tr').each(function (i, e) {
        $('.ddl', this).val('')
        $('.qty', this).val('');
        $('.availableqty', this).val('');
        $('.rate', this).val('');
        $('.discountvalue', this).val('0');
        $('.amount', this).val('');
        $('.hfdetailsysid', this).val('');
        $('.hfcategoryid', this).val('');
    })
    $('.supplierdetails').hide();
    $('.gstdetails').empty();
    LoadData();
    $('#txtnote').val('');
    $('#txttermsandcondition').val('');
    $('#hf_balancepayment').val('0');



    productnameArray = '';
    $.ajax({
        url: '/master/productsdetail/',
        dataType: "json",
        type: "get",
        success: function (data) {
            productnameArray = data;
            if (id) {
                ProductTypeheadMethod(id);
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
function btnreceipt_process(id) {

    try {
        $.ajax({
            type: "GET",
            url: '/receipt/receiptno',
            success: function (data) {
                $('#lblreceiptno').text('RE' + data.billno)
                var currentDate = new Date();
                $("#txtreceiptdate").datepicker("setDate", currentDate);
                $.ajax({
                    type: "GET",
                    url: '/sales/edit/' + id,
                    success: function (data) {


                        if (parseInt(data[0].dueamount) > 0) {

                            $('#receiptpaymentdetails').modal('show')
                            $('#hfcustomerid').val(data[0].customerid);
                            $('#paymentdetails').modal('show')
                            $('#txtreceipt_customer').val(data[0].customer.name).attr("disabled", "disabled")
                            $('#txt_bp_paidamount').val(data[0].dueamount)
                            let invoiceno = data[0].invoiceno;
                            bidpaymode('.ddlpaymode', '/master/banklistddl');
                            $('.transactiondetails').show()
                            $.ajax({
                                type: "GET",
                                url: '/receipt/customerbalance/' + $('#hfcustomerid').val(),
                                success: function (data) {
                                    $('#paymentdetails tbody').empty();
                                    var row = '';
                                    let i = 1;
                                    data.forEach(ele => {
                                        if (ele.balance > 0) {
                                            if (ele.invoiceno == invoiceno) {
                                                row = `<tr><td><label class="sno">` + i + `</label><td>
                                                <input class="chbx" onchange="CheckboxEvent(this)" checked type="checkbox"><input type="hidden" class="sale_id" value=` + ele._id + `></td>
                                                <td><label class="invoicedate">` + ele.invoicedate + `</label></td>
                                                <td><label class="invoiceno">` + ele.invoiceno + `</label></td>
                                                <td><label class="payedamount">` + ele.balance + `<label></td>
                                                <td><span><i class="la la-rupee"></i><span>
                                                <input type="hidden" class="hfbalance" value=` + ele.balance + `></input>
                                                <label class="balance">0<label></td>`;
                                                $('#paymentdetails tbody').append(row);
                                            } else {
                                                row = `<tr><td><label class="sno">` + i + `</label><td>
                                                <input class="chbx" onchange="CheckboxEvent(this)" type="checkbox"><input type="hidden" class="sale_id" value=` + ele._id + `></td>
                                                <td><label class="invoicedate">` + ele.invoicedate + `</label></td>
                                                <td><label class="invoiceno">` + ele.invoiceno + `</label></td>
                                                <td><label class="payedamount"><label></td>
                                                <td><span><i class="la la-rupee"></i><span>
                                                <input type="hidden" class="hfbalance" value=` + ele.balance + `></input>
                                                <label class="balance">` + ele.balance + `<label></td>`;
                                                $('#paymentdetails tbody').append(row);
                                            }

                                            i++;
                                        }
                                    });

                                },
                                error: function (errormessage) {
                                    toastr.error(errormessage.responseText);
                                }
                            })
                        } else {
                            swal.fire({
                                "title": "",
                                "text": "You Already Closed All Payment For this Invoice",
                                "type": "error",
                                "confirmButtonClass": "btn btn-secondary",
                                "onClose": function (e) {
                                    console.log('on close event fired!');
                                }
                            });

                        }
                    },
                    error: function (errormessage) {
                        toastr.error(errormessage.responseText);
                    }
                })

            },
            error: function (errormessage) {
                toastr.error(errormessage.responseText);
            }
        })
        return false
    } catch (err) {
        throw new err;
    }

}
function bidpaymode(element, Url) {

    paymode = '';
    if (paymode.length == 0) {
        //ajax function for fetch data    
        $.ajax({
            type: "GET",
            url: Url,
            success: function (data) {
                paymode = data;
                console.log(data)
                var $ele = $(element);
                $ele.empty();
                // $ele.append($('<option/>').val('').text('Select'));
                $.each(paymode.data, function (i, val) {

                    $ele.append($('<option/>').val(val._id).text(val.bankname));
                })
                $(element).val('5e4e20b8369a043bcc48e9eb');
            }

        })

    } else {

    }
}
function save_payment_process() {
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

            if ($('#hfcustomerid').val() == '' || $('#hfcustomerid').val() == undefined) {
                toastr.error('Invalid CustomerDetails');
                return false;
            }
            var totalrow = '';
            let sumofamount = 0;
            let PaymentDetail = [];
            let PaymodeDetail = [];
            $('#tblpayment_pay tbody tr').each(function (i, e) {
                let paymoderow = '';

                paymoderow = {
                    referencemode: $('.ddltype', this).val(),
                    paidfrom: $('.ddlpaymode', this).val(),
                    reference: $('.description', this).val(),
                    amount: $('.payamount', this).val()
                }
                PaymodeDetail.push(paymoderow)
            })

            $('#paymentdetails tbody tr').each(function (i, e) {
                if ($('.sale_id', this).val() != undefined && $('.sale_id', this).val() != '') {
                    if ($('.chbx', this).is(':checked') == true) {
                        let paymentrow = '';
                        paymentrow = {
                            payedamount: parseFloat($('.payedamount', this).text()),
                            trans_no: $('.invoiceno', this).text(),
                            trans_id: $('.sale_id', this).val(),
                            balance: $('.balance', this).text(),
                            trans_date: $('.invoicedate', this).text(),
                        }
                        PaymentDetail.push(paymentrow)
                        totalrow = $('.sno', this).text();
                        sumofamount = parseFloat(sumofamount) + parseFloat($('.payedamount', this).text());
                    }
                }
            })
            if (sumofamount != $('#txt_bp_paidamount').val()) {
                toastr.error('Please match your due Amount and paid Amount')
                return false;
            }
            var data = {
                billno: $('#lblreceiptno').text(),
                billdate: Converdate($('#txtreceiptdate').val()),
                typeid: $('#hfcustomerid').val(),
                paidamount: $('#txt_bp_paidamount').val(),
                PaymentDetail: PaymentDetail,
                PaymodeDetail: PaymodeDetail,
                _id: $('.hfid', this).val()
            }
            $.ajax({
                url: '/receipt/insertupdate',
                data: JSON.stringify(data),
                type: 'post',
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (result) {
                    if (result.status == 'success') {

                        LoadData();
                        $('#paymentdetails tbody').empty();
                        toastr.success(result.message);
                        amountdateils()

                        $('#receiptpaymentdetails').modal('toggle');
                        $('.modal-backdrop').remove();
                    } else {
                        toastr.error(result.message);
                        return false;
                    }
                },
                error: function (errormessage) {
                    toastr.error(errormessage.responseText);
                    return false;

                }
            });




        } else if (result.dismiss === 'cancel') {
            swal.fire(
                'Cancelled',
                'Your file is safe :)',
                'error'
            )
        }
    })



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
function pagerolebasedaction() {
    let data = {
        pagename: 'Sales Entry'
    }
    $.ajax({
        url: '/getpagedetails',
        data: JSON.stringify(data),
        type: 'post',
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            //  alert(JSON.stringify(result))

            if (result.length != 0) {
                if (result[0].insert == true) {
                    $('#btnsavegroup').show()
                }
                else {
                    $('#btnsavegroup').hide()
                }


            }

        },
        error: function (errormessage) {

            toastr.error(errormessage.responseText);
        }

    });
    return false

}
function btnsendmail_process(_id) {
    $('#hf_id').val(_id);
    //
    try {
        $.ajax({
            type: "GET",
            url: ' /sales/getmaildetails/' + _id,
            success: function (data) {
                $('#modal_email').modal('show')

                // btnprint(_id);

                $('#txtcustomermailaddress').val(data[0].customer.email)
            },
            error: function (errormessage) {
                toastr.error(errormessage.responseText);
            }
        })
        return false
    } catch (err) {
        throw new err;
    }



}
function send_mail_process() {

    let data = {
        customeremail: $('#txtcustomermailaddress').val(),
        mailcontent: $('#txtmailcontent').val(),
        subject: $('#txcustomertsubject').val(),
        _id: $('#hf_id').val()
    }
    $.ajax({
        type: "POST",
        url: '/sales/sendmailtocustomer/' + $('#hf_id').val(),
        data: data,
        success: function (data) {
            $('#hf_id').val('')
            $('#txtcustomermailaddress').val('')
            $('#txtmailcontent').val('')
            $('#txcustomertsubject').val('')
            toastr.success('Mail Sended Success')
            $('#modal_email').modal('hide')
        },
        error: function (errormessage) {
            toastr.error(errormessage.responseText);
        }

    })
}
function getbob_invoice(_id) {
    try {
        $.ajax({
            type: "GET",
            url: '/sales/getinvoicewithbob/' + _id,
            async: true,
            success: function (data) {
                setTimeout(function () {
                    // var win = window.open('http://localhost:3000/appfiles/salespdf/' + data + '', '_blank');
                    var win = window.open('http://localhost:3000/appfiles/salespdf/' + data + '', "myWindow", 'width=800,height=600');
                    alert(win)
                }, 3000)


            },
            error: function (errormessage) {
                toastr.error(errormessage.responseText);
            }
        })
        return false
    } catch (err) {
        throw new err;
    }

}
