$(document).ready(function () {
    var currentDate = new Date();
    $("#txtinvoicedate").datepicker().datepicker("setDate", currentDate);
    localStorage.clear();
    typeHeadcustomer();
    $('#hfcustomerid').val('5ede58eb85c16929acfcb3b6')
    $('#txtcustomer').val('Walkin')


    Addthead();
    // // Cal_Duedate()
     LoadData()
    Close();
    // SalesNo();
    // pagerolebasedaction();


})

function Cal_Duedate() {
    if ($('#ddlduedays').val() != 'Custom') {
        var currentDate = new Date();
        $("#txtduedate").datepicker().datepicker("setDate", addDays(currentDate, $('#ddlduedays').val()));
    }
    else {
        var currentDate = new Date();
        $("#txtduedate").val('');

    }
    $("#txtinvoicedate").datepicker().datepicker("setDate", currentDate);

}
function addDays(theDate, days) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
}
function getproductname(id) {
    $.ajax({
        url: '/master/productsdetail/',
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
                row = row + `<td class="td-nopad" style="width:400px">
                <div class="typeahead">
                 <input class="form-control ddl disabled="disabled"" id="ddlproduct type="text" dir="ltr" onblur="getproductdetails(this)"  placeholder="Enter Productname">
                </div>
                <input type="hidden" class="hfinvoicedetail_id"></input>
                <input type="hidden" class="hfproductname"></input>
                </td>`;
                break
            // case 'Sale Qty':
            //     row = row + '<td class="td-nopad"><input type="text" disabled="disabled" class=" form-control  form-control saleqty">  ';
            //     break
            case 'HSN/SAC':
                row = row + '<td class="td-nopad"><input type="text" disabled="disabled" class="form-control  form-control hsc">  ';
                break
            // case 'AvailableQty':
            //     row = row + '<td><input disabled="disabled" type="text" class="availableqty form-control form-control"></input><input type="hidden" class="hfdetailsysid"></input><input class="productid" type="hidden"></input></td>';
            //     break
            case 'Qty':
                row = row + '<td><input onkeyup="Cal_Amount()" type="text" class="numerickey qty form-control form-control"></input><input type="hidden" class="hfdetailsysid"></input><input class="productid" type="hidden"></input></td>';
                break
            case 'UNIT':
                row = row + '<td  class="td-nopad" style="width:100px"><select class="form-control form-control ddlunit"><option>Nos</option><option>box</option></select></td>';
                break
            case 'Rate':
                row = row + '<td class="td-nopad"><input type="text" onkeyup="Cal_Amount()"  class="rate form-control form-control rate"></td>';
                break
            case 'DISCOUNTRs%':
                row = row + '<td class="td-nopad"><input type="text"  onkeyup="Cal_Amount()" value="0" class="form-control discountvalue form-control"></td>';
                break
            case 'Amount':
                row = row + '<td class="td-nopad" ><input type="text" onblur="Cal_Amount()"   value="0" class="amount form-control form-control"></td>';
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
    $(row).find('.typeahead').empty("");
    $(row).find('.typeahead').append(`<input class="form-control ddl" onblur="getproductdetails(this)"  type="text" dir="ltr" placeholder="Enter Productname">`);
    $(row).find('.hfdetailsysid').val("");
    $("td input:text", row).val("");
    $('td .lbldel', row).attr("style", "display: none;");
    $("td button[type=button]", row).val('Delete');
    $("td button[type=button]", row).attr("style", "display: block");
    $("td input[type=date]", row).val('');
    $("td input[type=time]", row).val('');
    getproductname($(row).find('.ddl'))
    BindddlData($(row).find('.ddlunit'), '/master/unitdropdown/')
    $(row).find('.discountvalue').val("0");
    $(row).find('.amount').val("0");
    $(row).find('.productid').val("");
    $(row).find('.hfproductname').val("");
}
function Addthead() {
    var amount = `Amount`;
    var hsn = ($("#chhsn").is(":checked") ? 1 : 0) ? `<th>HSN/SAC</th>` : '';
    var unit = ($("#chunit").is(":checked") ? true : false) ? `<th>UNIT</th>` : '';
    var discount = ($("#chdiscount").is(":checked") ? true : false) ? `<th>DISCOUNT<select id="ddldiscount" class="discount" ><option  value="rupee">Rs</option><option value="percentage">%<option></select></th>` : '';
    var settings = `<a class="nav-link dropdown-toggle" data-toggle="modal" data-target="#kt_modal_4"><i class="flaticon2-gear"></i></i></a>`
    var head = "<th>S.No</th><th>Product</th>" + hsn + "<th>Qty</th>" + unit + "<th>Rate</th>" + discount + "<th>" + amount + "</th><th>" + settings + "</th>"; // add resources
    $("#detailsTable thead tr").append(head);
    Rowappend();
    //  BindSelect2('.ddl', '/master/productdropdown');
}
function Changetable() {
    $("#detailsTable").empty();
    $("#detailsTable").append('<thead><tr></tr></thead><tbody class="trbody"></tbody>');
    Addthead()
    $('#kt_modal_4').modal('toggle');
}
function getproductdetails(ctrl) {

    let productdetails = productnameArray.filter(element => element.name == $(ctrl).val())

    if (productdetails.length == 0 || productdetails.length == undefined || productdetails.length == '') {
        // toastr.error('product Details  not availble')
    }
    else if (productdetails.length == 1) {
        $(ctrl).closest('tr').find('.qty').focus();
        $(ctrl).closest('tr').find('.availableqty').val(productdetails[0].availbleqty);
        $(ctrl).closest('tr').find('.qty').val(1);
        $(ctrl).closest('tr').find('.rate').val(productdetails[0].salesprice);
        $(ctrl).closest('tr').find('.hsc').val(productdetails[0].hsnorsac_code);
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
    }
    else {
        toastr.error('Duplicate Product Invalid to Process')
    }
}
function Deletecolumn() {


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
            }
            else {
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
                         
                            $('.amount', this).val(parseFloat($('.amount', this).val()) - (($('.discountvalue', this).val() / 100) * $('.amount', this).val()))
                            $('.amount', this).val(parseFloat($('.amount', this).val()).toFixed(2))
                        }
                    } else {
                        $('.discountvalue', this).val('0')
                        toastr.error('discount percentage should be less or equal than 100')
                        return false;
                    }
                } else {
                   
                    $('.amount', this).val(parseFloat($('.amount', this).val()) - (parseFloat($('.discountvalue', this).val())))
                    $('.amount', this).val(parseFloat($('.amount', this).val()).toFixed(2))
                }
            } else {
                if ($('.rate', this).val() != '' && $('.qty', this).val() != '') {

                    // $('.amount', this).val(parseFloat($('.rate', this).val()) * parseFloat($('.qty', this).val()))
                    $('.amount', this).val(parseFloat($('.amount', this).val()).toFixed(2))
                }
            }

            total = parseFloat(total) + parseFloat($('.amount', this).val());
        }
    })




    $('#txtsubtotal').text(parseFloat(total).toFixed(2))
    $('#txttotal').text(parseFloat(total).toFixed(2))

    $('#txtpayamount').val(parseFloat(total).toFixed(2))



}
// let OldinvoiceDetail=[];
function save_process() {
    // let invoiceDetail=[];
    let invoiceReturnDetail = [];
    if ($('#hfcustomerid').val() == '') {
        toastr.error('Invalid Customer Deatils  Unable to Process');
        return false;
    }
   

    $('#detailsTable tbody tr').each(function (i, e) {
        // if ($('.qty',this).val()>$('.availableqty',this).val()) {
        //     toastr.error('Please Check and give Valid Input');
        //     return false;
        // }
        if ($('.productid', this).val() != '') {

            let invoiceReturn = {
                productid: $('.productid', this).val(),
                productname:$('.hfproductname',this).val(),
                qty: $('.qty', this).val(),
                rate: $('.rate', this).val(),
                discount: $('.discount', this).val(),
                amount: $('.amount', this).val(),
                purchasedetail_id: $('.hfinvoicedetail_id', this).val(),
                saleqty: $('.saleqty').val()
            };

            if ($('.hfinvoicedetail_id', this).val() != '') {
                invoiceReturn.invoicedetail_id = $('.hfinvoicedetail_id', this).val()
            }

            if ($('.unit', this).val() != undefined) {
                invoiceReturn.unitid = $('.unitid').val()
            }
            if ($('.discountvalue', this).val() != undefined) {
                invoiceReturn.discount = $('.discountvalue', this).val()
            }

            invoiceReturnDetail.push(invoiceReturn);
        }
    })
    if (invoiceReturnDetail.length == 0) {
        toastr.error('Inavalid invoice Deatil Unable to Process');
        return false;
    }


    var data = {
        _id: $('#hf_id').val(),
        invoicereturnno:   $('.lblinvoicereturn_no').html(),
        invoicedate: Converdate($('#txtinvoicedate').val()),
        customerid: $('#hfcustomerid').val(),
        invoiceReturnDetail: invoiceReturnDetail,
        gstdetail: Gstdetail,
        subtotal: $('#txtsubtotal').text(),
        roundoff: 10,
        total: $('#txttotal').text(),
        hsncolumn: $("#chhsn").is(":checked") ? 1 : 0,
        unitcolumn: $("#chunit").is(":checked") ? 1 : 0,
        discountcolumn: $("#chdiscount").is(":checked") ? 1 : 0,
        discountype: $("#ddldiscount").val(),
        taxtype: $("#taxtype").val(),
    }
    insertupdate(data, '/salesreturn/insertupdate');
    // alert($('#hfsupplierid').val())

}
function afterinsertupdatefunction(result) {
    getsalesreturnno();
    cleardata();


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
        lengthMenu: [[5, 10, 25, 50, 100], [5, 10, 25, 50, 100]],
        ajax: '/salesreturn/list',
        columns: [
           
            { data: 'invoicereturn_no', name: 'invoicereturn_no' },

            { data: 'invoicedate', name: 'invoicedate' },
           
            { data: 'customer.name', name: 'customer' },
            { data: 'total', name: 'total' },
          
            { data: '_id', responsivePriority: -1 },
        ],
        order: [0, "desc"],
        dom: '<"top" f>rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        columnDefs: [
            {
                targets: -1,
                title: 'Actions',
                orderable: false,
                render: function (data, type, full, meta) {
                    let value = data.split('-');


                    let editbutton = $.trim(value[1]) == 'true' ? `
                    <button onclick='btneditinvoicereturn("` + value[0] + `")'  type="button" class="btn  btn-sm btn-primary btn-icon  btn-icon btn-icon-sm" data-skin="dark" data-toggle="kt-tooltip" data-placement="top" title="View / Edit">
                      <i class ="la la-edit"></i>
                    </button>`: '';
                    let deletebutton = value[2] == 'true' ? ` <a onclick= 'btndeletesalesreturn("` + value[0] + `")'  type="button" class="btn  btn-sm btn-delete-red btn-icon  btn-icon btn-icon-sm" title="Delete" >
                    <i class ="la la-trash"></i>
                  </a>`: '';

                    return editbutton + deletebutton;
                    // return `<div class="btn-group ptb-5">
                    // <button type="button" class="btn btn-sm btn-outline-success">
                    //     Print
                    // </button>
                    // <button type="button"
                    //     class="btn btn-sm btn-outline-success dropdown-toggle dropdown-toggle-split"
                    //     data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    //     <span class="sr-only">Print</span>
                    // </button>
                    // <div class="dropdown-menu" style="">
                    //     <a class="dropdown-item" onclick='btndeletesalesreturn("`+ data + `")'>Delete</a>
                    //     <a class="dropdown-item" onclick='btneditinvoicereturn("`+ data + `")'>Edit Invoice Return</a>
                    // </div>
                    // </div>`;                   
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
}
function Show() {

    $('.list').hide();
    $('.entry').show();
    $('#kt_modal_4').modal('toggle');
    getsalesreturnno()
    cleardata();

}
function saveexit() {
    save_process();
    Close();
}
function cleardata() {
    $('#hf_id').val('');

    var currentDate = new Date();
    $("#txtinvoicedate").datepicker().datepicker("setDate", currentDate);
    localStorage.clear();
    typeHeadcustomer();
    $('#hfcustomerid').val('5ede58eb85c16929acfcb3b6');
    $('#txtcustomer').val('Walkin')
    $('#txttotal').text("0")
    $('#txtsubtotal').text("0")
   
    $("#detailsTable tbody").find("tr:gt(2)").remove();
    $('#detailsTable tbody tr').each(function (i, e) {
        $('.ddl', this).val('')
        $('.qty', this).val('');
        $('.saleqty', this).val('');
        $('.rate', this).val('');
        $('.discount', this).val('');
        $('.hfproductname',this).val('');
        $('.amount', this).val('');
        $('.hfdetailsysid', this).val('');
    })
    $('.supplierdetails').hide();
    $('.gstdetails').empty();
    localStorage.clear();
    getsalesreturnno();

}
function SalesNo() {
    var bestPictures = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: '/sales/invoicenolist'
    });
    $('#txtinvoiceno').typeahead(null, {
        name: 'best-pictures',
        display: 'name',
        source: bestPictures,
        highlight: true,
        width: '500px',
        templates: {
            empty: [
                `<button type="button" class="btn btn-sm btn-secondary"><i class="fa fa-plus-circle"> Add Invoice</i></button>`
            ].join('\n'),
            suggestion: Handlebars.compile('<div><strong>{{name}}</strong></div>'),
        },
    });
}
$('#txtinvoiceno').bind('typeahead:select', function (ev, suggestion) {
    saledetails(suggestion.id);


});

function Disabled_Field() {
    $('#ddlcompanystate').attr("disabled", "disabled");
    $("#txtgstno").attr("disabled", "disabled");
    $('#txtinvoicedate').attr("disabled", "disabled");
    $('#txtinvoiceno').attr("disabled", "disabled");
    $('#txttotal').attr("disabled", "disabled");
    // $('#txtreference').attr("disabled", "disabled"); 
    $('#txtcustomer').attr("disabled", "disabled");
    $('.supplierdetails').show();
    $('#txtgstno').attr("disabled", "disabled");;
    $('#ddlcompanystate').attr("disabled", "disabled");
   


}
function getsalesreturnno() {
    $.ajax({
        type: "GET",
        url: '/salesreturn/salesretrunno',
        success: function (data) {
            $('.lblinvoicereturn_no').html('IVR' + data.billno)

            $('#hfinvoiceno').val(data.billno)
        },
        error: function (errormessage) {
            toastr.error(errormessage.responseText);
        }
    })
    return false
}
function btneditinvoicereturn(id) {
    editassignvalue('/sales/return/' + id)
}

function pagerolebasedaction() {
    let data = {
        pagename: 'Sales Return'
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

function Cal_Roundoff() {
    if ($('#ddlroundofftype').val() == "plus") {
        let nettotal = parseFloat($('#txtsubtotal').text()) + parseFloat($('#txtrounoffvalue').val())
        $('#txttotal').text(parseFloat(nettotal).toFixed(2))
    } else {
        let nettotal = parseFloat($('#txtsubtotal').text()) - parseFloat($('#txtrounoffvalue').val())
        $('#txttotal').text(parseFloat(nettotal).toFixed(2))
    }

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