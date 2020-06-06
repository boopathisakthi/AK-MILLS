$(document).ready(function () {
    localStorage.clear();
    getsalesno();
    typeHeadcustomer();
    BindddlData('#ddlcompanystate', '/master/state');
    BindddlData('#ddlsalesrep', '/master/employeeddl');
    $('.supplierdetails').hide();
    Companystate()
    Addthead();
    Cal_Duedate()
    LoadData()
    Close();
    $('.printTable').hide();
    validationcustomer();
    pagerolebasedaction();
})


//#region  invoice no genarate
function getsalesno() {
    $.ajax({
        type: "GET",
        url: '/salesorder/invoiceno',
        success: function (data) {
            $('.lblinvoiceno').html(data.billno)
            $('#hfinvoiceno').val(data.billno)
        },
        error: function (errormessage) {
            toastr.error(errormessage.responseText);
        }
    })
    return false
}
//#endregion

//#region customer typehead process

function typeHeadcustomer() {

    var bestPictures = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: '/master/customerdopdown'
    });
    $('#txtcustomer').typeahead(null, {
        name: 'best-pictures',
        display: 'name',
        source: bestPictures,
        highlight: true,
        width: '500px',
        templates: {
            empty: [
                `<button type="button"  onclick="showcustomer()" class="btn btn-sm btn-secondary"><i class="fa fa-plus-circle"> Add Customer</i></button>`
            ].join('\n'),
            suggestion: Handlebars.compile('<div><strong>{{name}}</strong></div>'),
        },
    });
}

$('#txtcustomer').bind('typeahead:select', function (ev, suggestion) {

    $('#txtgstno').val(suggestion.gstin);
    $('#ddlcompanystate').val(suggestion.billingstate);
    $('#hfcustomerid').val(suggestion.id);
    if (suggestion.gstin) {
        $('.supplierdetails').show();
    }
    $('#hfcustomername').val(suggestion.name);
    $('#hfcustomertype').val(suggestion.customertype);
    $('#hfemail').val(suggestion.email);
    $('#hfshippingaddress').val(suggestion.shippingaddress);
    $('#hfbillingaddress').val(suggestion.billingaddress);
    $('#hfgstin').val(suggestion.gstin);
    $('#hfgsttype').val(suggestion.gsttype);
    $('#hfmobile').val(suggestion.mobile);
    $('#hfgstno').val(suggestion.gstno);

    $('#ddlduedays').val(suggestion.paymentterms)
    Cal_Duedate();

});
//#endregion
function btnprint(id) {

    $.ajax({
        url: '/salesorder/printinvoice/' + id,
        type: 'get',
         success: function (res) {
        
         var win = window.open('http://localhost:3000/appfiles/salesorder/' + res+'', '_blank');

        },
        error: function (errormessage) {
            toastr.error(errormessage.responseText);
        }
    });
    return false


}
function goback() {
    $(".tbody tr").remove();
    $('.printTable').hide();
    $('.list').show();
    LoadData();
    getsalesno();
}

function showcustomer() {
    $('#customermadal').modal('show');
}
var validationcustomer = function () {

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
                        pagetype: "customer",
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
                                    $('#txtcustomer').val(result.data.name),
                                    $('#hfcustomerid').val(result.data._id),
                                    $('#customermadal').modal('hide');
                            }
                            else {
                                toastr.error(result.message);
                            }
                        },
                        error: function (errormessage) {
                            toastr.error(errormessage.responseText);
                        }
                    });
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

var num = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" ");
var tens = "twenty thirty forty fifty sixty seventy eighty ninety".split(" ");

function number2words(n) {
    if (n < 20) return num[n];
    var digit = n % 10;
    if (n < 100) return tens[~~(n / 10) - 2] + (digit ? "-" + num[digit] : "");
    if (n < 1000) return num[~~(n / 100)] + " hundred" + (n % 100 == 0 ? "" : " " + number2words(n % 100));
    return number2words(~~(n / 1000)) + " thousand" + (n % 1000 != 0 ? " " + number2words(n % 1000) : "");
}

function Print() {
    $("#printarea").print();

}
function Cal_Roundoff() {
    if ($('#ddlroundofftype').val() == "plus") {
        let nettotal = parseFloat($('#txtactualtotal').val()) + parseFloat($('#txtrounoffvalue').val())
        $('#txttotal').text(parseFloat(nettotal).toFixed(2))
    } else {
        let nettotal = parseFloat($('#txtactualtotal').val()) - parseFloat($('#txtrounoffvalue').val())
        $('#txttotal').text(parseFloat(nettotal).toFixed(2))
    }

}
function Cal_Duedate() {
    if ($('#ddlduedays').val() != 'Custom') {
        $("#txtduedate").prop("disabled", true);
        var currentDate = new Date();
        $("#txtduedate").datepicker().datepicker("setDate", addDays(currentDate, $('#ddlduedays').val()));
    } else {
        var currentDate = new Date();
        $("#txtduedate").val('');
        $("#txtduedate").prop("disabled", false);
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
                row = row + `<td class="td-nopad" style="width:400px">
                <div class="typeahead">
                 <input class="form-control input-no-border ddl" id="ddlproduct" type="text" dir="ltr" onblur="getproductdetails(this)"  placeholder="Enter Productname">
                </div>
                </td>`;
                break
            case 'HSN/SAC':
                row = row + '<td class="td-nopad"><input type="text" disabled="disabled" class="form-control  form-control input-no-border hsc">  ';
                break
            // case 'AvailableQty':
            //     row = row + '<td><input disabled="disabled" type="text" class="availableqty form-control form-control input-no-border"></input></td>';
            //     break
            case 'Qty':
                row = row + '<td><input onblur="Cal_Amount()" type="text" class="qty numerickey form-control form-control input-no-border"></input><input type="hidden" class="hfdetailsysid input-no-border"></input><input class="productid input-no-border" type="hidden"></input><input type="hidden" class="hfqty"></input></td>';
                break
            case 'UNIT':
                row = row + '<td  class="td-nopad" style="width:20px"><select class="form-control form-control ddlunit input-no-border"><option>Nos</option><option>box</option></select></td>';
                break
            case 'Rate':
                row = row + '<td class="td-nopad"><input type="text" onkeyup="Cal_Amount()" onkeydown="Cal_Amount()" class=" form-control numerickey form-control rate input-no-border"></td>';
                break
            case 'DISCOUNT%Rs':
                row = row + '<td class="td-nopad"><input type="text"  onkeyup="Cal_Amount()" onkeydown="Cal_Amount()" value="0" class="form-control numerickey discountvalue form-control input-no-border"></td>';
                break
            case 'Amountinclusiveexclusive':
                row = row + '<td class="td-nopad" ><input type="text"  disabled="disabled" value="0" class="amount form-control form-control input-no-border"></td>';
                break
            default:
                row = row + '<td></td>';
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
    $(row).find('.discountvalue').val("0");
    $(row).find('.availableqty').val("0");
    $(row).find('.hfqty').val("0");
    $(row).find('.amount').val("0");
    $(row).find('.productid').val("");
}

function Addthead() {
    var amount = `Amount<select class="form-control kt-selectpicker taxtype" tabindex="-98" aria-label="Small" aria-describedby="inputGroup-sizing-sm" onchange="Cal_Amount()"><option value="inclusive">inclusive</option><option value="exclusive">exclusive</option></select>`;
    var hsn = ($("#chhsn").is(":checked") ? 1 : 0) ? `<th>HSN/SAC</th>` : '';
    var unit = ($("#chunit").is(":checked") ? true : false) ? `<th>UNIT</th>` : '';
    var discount = ($("#chdiscount").is(":checked") ? true : false) ? `<th>DISCOUNT<select id="ddldiscount" class="discount"  ><option value="percentage">%<option><option  value="rupee">Rs<option></select></th>` : '';
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
    } else if (productdetails.length == 1) {
        $(ctrl).closest('tr').find('.qty').focus();
        $(ctrl).closest('tr').find('.availableqty').val(productdetails[0].availbleqty);
        $(ctrl).closest('tr').find('.qty').val(1);
        $(ctrl).closest('tr').find('.rate').val(productdetails[0].salesprice);
        $(ctrl).closest('tr').find('.hsc').val(productdetails[0].hsnorsac_code);
        $(ctrl).closest('tr').find('.productid').val(productdetails[0].id);
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
    var discount, taxtype = '';
    var taxdesign0gst = '', taxdesign5gst = '',
        taxdesign12gst = '',
        taxdesign18gst = '',
        taxdesign28gst = '';
    var taxamount0gst = 0, taxamount5gst = 0,
        taxamount12gst = 0,
        taxamount18gst = 0,
        taxamount28gst = 0,
        taxtotalamount = 0,
        total = 0;

    var taxableamount0gst = 0, taxableamount5gst = 0,
        taxableamount12gst = 0,
        taxableamount18gst = 0,
        taxableamount28gst = 0,
        taxabletotalamount = 0

    $('.gstdetails').empty();
    $("table.table-bordered thead tr th ").each(function () {
        switch ($(this).text()) {
            case 'DISCOUNT%Rs':
                discount = $('.discount').val();
                break
            case 'Amountinclusiveexclusive':
                taxtype = $('.taxtype').val();
                break
        }
    })
    $('#detailsTable tbody tr').each(function (i, ele) {

        if ($('.productid', this).val() != '') {
            if (discount == 'percentage') {
                if ($('.rate', this).val() != '' && $('.qty', this).val() != '') {

                    $('.amount', this).val(parseFloat($('.rate', this).val()).toFixed(2) * parseFloat($('.qty', this).val()).toFixed(2))
                    $('.amount', this).val(parseFloat($('.amount', this).val()).toFixed(2) - (($('.discountvalue', this).val() / 100) * $('.amount', this).val()))
                }
            } else {
                $('.amount', this).val(parseFloat($('.rate', this).val()).toFixed(2) * parseFloat($('.qty', this).val()).toFixed(2))
                $('.amount', this).val(parseFloat($('.amount', this).val()).toFixed(2) - (parseFloat($('.discountvalue', this).val()).toFixed(2)))
            }
            //tax design
            var taxdetail = productnameArray.filter(ele => ele.id == $('.productid', this).val());
            let amount;

            taxdetail[0].tax.forEach(element => {

                if (taxtype == 'inclusive') {

                    if ($('#hf_companystate').val() == $('#ddlcompanystate').val()) {
                        switch (element.taxname) {
                            case "GST 18%":
                                taxdesign18gst = '';
                                taxableamount18gst = taxableamount18gst + parseFloat($('.amount', this).val())
                                taxamount18gst = taxamount18gst + parseFloat($('.amount', this).val()) * parseFloat(element.sgst + element.cgst) / (100 + parseFloat(element.sgst + element.cgst));
                                //  taxamount18gst=taxamount;
                                amount = taxamount18gst / 2;
                                taxdesign18gst = `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">SGST ` + element.sgst + ` % :</h6></div><div  class="col-sm-6"><h6 class="kt-font" > ` + parseFloat(amount).toFixed(2) + `</h6></div>`
                                taxdesign18gst = taxdesign18gst + `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">CGST ` + element.cgst + ` % :</h6></div><div  class="col-sm-6"><h6 class="kt-font" > ` + parseFloat(amount).toFixed(2) + `</h6></div>`
                                break
                            case "GST 28%":
                                taxdesign28gst = '';
                                taxableamount28gst = taxableamount28gst + parseFloat($('.amount', this).val())
                                taxamount28gst = taxamount28gst + parseFloat($('.amount', this).val()) * parseFloat(element.sgst + element.cgst) / (100 + parseFloat(element.sgst + element.cgst));
                                // taxamount28gst=taxamount;
                                amount = taxamount28gst / 2;
                                taxdesign28gst = `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">SGST ` + element.sgst + ` % :</h6></div><div  class="col-sm-6"><h6 class="kt-font" > ` + parseFloat(amount).toFixed(2) + `</h6></div>`
                                taxdesign28gst = taxdesign28gst + `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">CGST ` + element.cgst + ` % :</h6></div><div  class="col-sm-6"><h6 class="kt-font" > ` + parseFloat(amount).toFixed(2) + `</h6></div>`
                                break
                            case "GST 5%":
                                taxdesign5gst = '';
                                taxableamount5gst = taxableamount5gst + parseFloat($('.amount', this).val())
                                taxamount5gst = taxamount5gst + parseFloat($('.amount', this).val()) * parseFloat(element.sgst + element.cgst) / (100 + parseFloat(element.sgst + element.cgst));
                                // taxamount5gst=taxamount;
                                amount = taxamount5gst / 2;
                                taxdesign5gst = `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">SGST ` + element.sgst + ` % :</h6></div><div  class="col-sm-6"><h6 class="kt-font" > ` + parseFloat(amount).toFixed(2) + `</h6></div>`
                                taxdesign5gst = taxdesign5gst + `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">CGST ` + element.cgst + ` % :</h6></div><div  class="col-sm-6"><h6 class="kt-font" > ` + parseFloat(amount).toFixed(2) + `</h6></div>`
                                break
                            case "GST 12%":
                                taxdesign12gst = '';
                                taxableamount12gst = taxableamount12gst + parseFloat($('.amount', this).val())
                                taxamount12gst = taxamount12gst + parseFloat($('.amount', this).val()) * parseFloat(element.sgst + element.cgst) / (100 + parseFloat(element.sgst + element.cgst));
                                // taxamount12gst=taxamount12gst;
                                amount = taxamount12gst / 2;
                                taxdesign12gst = `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">SGST ` + element.sgst + ` % :</h6></div><div  class="col-sm-6"><h6 class="kt-font" > ` + parseFloat(amount).toFixed(2) + `</h6></div>`
                                taxdesign12gst = taxdesign12gst + `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">CGST ` + element.cgst + ` % :</h6></div><div  class="col-sm-6"><h6 class="kt-font" > ` + parseFloat(amount).toFixed(2) + `</h6></div>`
                                break
                            case "GST 0%":
                                taxdesign0gst = '';
                                gst0 = '';

                                taxableamount0gst = taxableamount0gst + parseFloat($('.amount', this).val());
                                taxamount0gst = taxamount0gst + 0
                                // taxamount28gst=taxamount;
                                amount = taxamount0gst / 2;
                                taxdesign0gst = `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">SGST 0% :</h6></div><div class="col-sm-6"><h6 class="kt-font"> 0</h6></div>`
                                taxdesign0gst = taxdesign0gst + `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">CGST 0% :</h6></div><div class="col-sm-6"><h6 class="kt-font"> 0</h6></div>`
                                break
                        }
                    }
                    else {
                        switch (element.taxname) {
                            case "GST 18%":
                                taxdesign18gst = '';
                                taxableamount18gst = taxableamount18gst + parseFloat($('.amount', this).val())
                                taxamount18gst = taxamount18gst + parseFloat($('.amount', this).val()) * parseFloat(element.igst) / (100 + parseFloat(element.igst));
                                taxdesign18gst = taxdesign18gst + `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">IGST ` + element.igst + ` % :</h6></div><div class="col-sm-6"><h6 class="kt-font"> ` + parseFloat(taxamount18gst).toFixed(2) + `</h6></div>`

                                break
                            case "GST 28%":
                                taxdesign28gst = '';
                                gst28 = '';
                                taxableamount28gst = taxableamount28gst + parseFloat($('.amount', this).val())
                                taxamount28gst = taxamount28gst + parseFloat($('.amount', this).val()) * parseFloat(element.igst) / (100 + parseFloat(element.igst));
                                taxdesign28gst = taxdesign28gst + `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">IGST ` + element.igst + ` % :</h6></div><div class="col-sm-6"><h6 class="kt-font"> ` + parseFloat(taxamount28gst).toFixed(2) + `</h6></div>`

                                break
                            case "GST 5%":
                                taxdesign5gst = '';
                                gst5 = '';
                                taxableamount5gst = taxableamount5gst + parseFloat($('.amount', this).val())
                                taxamount5gst = taxamount5gst + parseFloat($('.amount', this).val()) * parseFloat(element.igst) / (100 + parseFloat(element.igst));
                                taxdesign5gst = taxdesign5gst + `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">IGST ` + element.igst + ` % :</h6></div><div class="col-sm-6"><h6 class="kt-font"> ` + parseFloat(taxamount5gst).toFixed(2) + `</h6></div>`


                                break
                            case "GST 12%":
                                taxdesign12gst = '';
                                gst12 = '';
                                taxableamount12gst = taxableamount12gst + parseFloat($('.amount', this).val())
                                taxamount12gst = taxamount12gst + parseFloat($('.amount', this).val()) * parseFloat(element.igst) / (100 + parseFloat(element.igst));
                                taxdesign12gst = taxdesign12gst + `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">IGST ` + element.igst + ` % :</h6></div><div class="col-sm-6"><h6 class="kt-font"> ` + parseFloat(taxamount12gst).toFixed(2) + `</h6></div>`
                                break
                            case "GST 0%":
                                taxdesign0gst = '';
                                gst0 = '';
                                taxableamount0gst = taxableamount0gst + parseFloat($('.amount', this).val());
                                taxamount0gst = taxamount0gst + 0

                                taxdesign0gst = taxdesign0gst + `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">IGST 0% :</h6></div><div class="col-sm-6"><h6 class="kt-font"> 0</h6></div>`
                                break
                        }
                    }


                } else {
                    if ($('#hf_companystate').val() == $('#ddlcompanystate').val()) {
                        switch (element.taxname) {
                            case "GST 18%":
                                taxdesign18gst = '';
                                taxamount18gst = taxamount18gst + (parseFloat($('.amount', this).val()) * parseFloat(element.sgst + element.cgst) / 100);
                                taxableamount18gst = taxableamount18gst + parseFloat($('.amount', this).val())
                                amount = taxamount18gst / 2;
                                taxdesign18gst = `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">SGST ` + element.sgst + ` % :</h6></div><div  class="col-sm-6"><h6 class="kt-font" > ` + parseFloat(amount).toFixed(2) + `</h6></div>`
                                taxdesign18gst = taxdesign18gst + `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">CGST ` + element.cgst + ` % :</h6></div><div  class="col-sm-6"><h6 class="kt-font" > ` + parseFloat(amount).toFixed(2) + `</h6></div>`
                                break
                            case "GST 28%":
                                taxdesign28gst = '';
                                taxamount28gst = taxamount28gst + (parseFloat($('.amount', this).val()) * parseFloat(element.sgst + element.cgst) / 100);
                                taxableamount28gst = taxableamount28gst + parseFloat($('.amount', this).val())
                                amount = taxamount28gst / 2;
                                taxdesign28gst = `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">SGST ` + element.sgst + ` % :</h6></div><div  class="col-sm-6"><h6 class="kt-font" > ` + parseFloat(amount).toFixed(2) + `</h6></div>`
                                taxdesign28gst = taxdesign28gst + `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">CGST ` + element.cgst + ` % :</h6></div><div  class="col-sm-6"><h6 class="kt-font" > ` + parseFloat(amount).toFixed(2) + `</h6></div>`
                                break
                            case "GST 5%":
                                taxdesign5gst = '';
                                taxamount5gst = taxamount5gst + (parseFloat($('.amount', this).val()) * parseFloat(element.sgst + element.cgst) / 100);
                                taxableamount5gst = taxableamount5gst + parseFloat($('.amount', this).val())
                                amount = taxamount5gst / 2;
                                taxdesign5gst = `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">SGST ` + element.sgst + ` % :</h6></div><div  class="col-sm-6"><h6 class="kt-font" > ` + parseFloat(amount).toFixed(2) + `</h6></div>`
                                taxdesign5gst = taxdesign5gst + `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">CGST ` + element.cgst + ` % :</h6></div><div  class="col-sm-6"><h6 class="kt-font" > ` + parseFloat(amount).toFixed(2) + `</h6></div>`
                                break
                            case "GST 12%":
                                taxdesign12gst = '';
                                taxamount12gst = taxamount12gst + (parseFloat($('.amount', this).val()) * parseFloat(element.sgst + element.cgst) / 100);
                                taxableamount12gst = taxableamount12gst + parseFloat($('.amount', this).val())
                                amount = taxamount12gst / 2;
                                taxdesign12gst = `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">SGST ` + element.sgst + ` % :</h6></div><div  class="col-sm-6"><h6 class="kt-font" > ` + parseFloat(amount).toFixed(2) + `</h6></div>`
                                taxdesign12gst = taxdesign12gst + `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">CGST ` + element.cgst + ` % :</h6></div><div  class="col-sm-6"><h6 class="kt-font" > ` + parseFloat(amount).toFixed(2) + `</h6></div>`
                                break
                            case "GST 0%":
                                taxdesign0gst = '';
                                gst0 = '';
                                taxableamount0gst = taxableamount0gst + parseFloat($('.amount', this).val());
                                taxamount0gst = taxamount0gst + 0
                                // taxamount28gst=taxamount;
                                amount = taxamount0gst / 2;
                                taxdesign0gst = `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">SGST 0% :</h6></div><div class="col-sm-6"><h6 class="kt-font"> 0</h6></div>`
                                taxdesign0gst = taxdesign0gst + `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">CGST 0% :</h6></div><div class="col-sm-6"><h6 class="kt-font"> 0</h6></div>`
                                break
                        }

                    }
                    else {

                        switch (element.taxname) {
                            case "GST 18%":
                                taxdesign18gst = '';
                                taxableamount18gst = taxableamount18gst + parseFloat($('.amount', this).val())
                                taxamount18gst = taxamount18gst + (parseFloat($('.amount', this).val()) * (parseFloat(element.igst) / 100));
                                taxdesign18gst = taxdesign18gst + `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">IGST ` + element.igst + ` % :</h6></div><div class="col-sm-6"><h6 class="kt-font"> ` + parseFloat(taxamount18gst).toFixed(2) + `</h6></div>`

                                break
                            case "GST 28%":
                                taxdesign28gst = '';
                                gst28 = '';
                                taxableamount28gst = taxableamount28gst + parseFloat($('.amount', this).val())
                                taxamount28gst = taxamount28gst + (parseFloat($('.amount', this).val()) * (parseFloat(element.igst) / 100));
                                taxdesign28gst = taxdesign28gst + `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">IGST ` + element.igst + ` % :</h6></div><div class="col-sm-6"><h6 class="kt-font"> ` + parseFloat(taxamount28gst).toFixed(2) + `</h6></div>`

                                break
                            case "GST 5%":
                                taxdesign5gst = '';
                                gst5 = '';
                                taxableamount5gst = taxableamount5gst + parseFloat($('.amount', this).val())
                                taxamount5gst = taxamount5gst + (parseFloat($('.amount', this).val()) * (parseFloat(element.igst) / 100));
                                taxdesign5gst = taxdesign5gst + `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">IGST ` + element.igst + ` % :</h6></div><div class="col-sm-6"><h6 class="kt-font"> ` + parseFloat(taxamount5gst).toFixed(2) + `</h6></div>`


                                break
                            case "GST 12%":
                                taxdesign12gst = '';
                                gst12 = '';
                                taxableamount12gst = taxableamount12gst + parseFloat($('.amount', this).val())
                                taxamount12gst = taxamount12gst + (parseFloat($('.amount', this).val()) * (parseFloat(element.igst) / 100));
                                taxdesign12gst = taxdesign12gst + `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">IGST ` + element.igst + ` % :</h6></div><div class="col-sm-6"><h6 class="kt-font"> ` + parseFloat(taxamount12gst).toFixed(2) + `</h6></div>`
                                break
                            case "GST 0%":

                                taxdesign0gst = '';
                                gst0 = '';
                                taxableamount0gst = taxableamount0gst + parseFloat($('.amount', this).val());
                                taxamount0gst = taxamount0gst + 0

                                taxdesign0gst = taxdesign0gst + `</br><div class="col-sm-6"><h6 class="kt-font" style="margin-left: 7%;">IGST 0% :</h6></div><div class="col-sm-6"><h6 class="kt-font"> 0</h6></div>`
                                break
                        }
                    }



                }


            })
            total = parseFloat(total) + parseFloat($('.amount', this).val());
        }
    })

    $('.gstdetails').append(taxdesign0gst + taxdesign5gst + taxdesign12gst + taxdesign18gst + taxdesign28gst);
    if (taxamount18gst != '' && taxamount18gst != 0) {
        let gst18 = '';
        gst18 = {
            taxvalue: 18,
            percentage: '9',
            name: 'gst18',
        }
        if ($('#hf_companystate').val() == $('#ddlcompanystate').val()) {
            gst18.sgst = parseFloat(taxamount18gst / 2).toFixed(2),
                gst18.cgst = parseFloat(taxamount18gst / 2).toFixed(2)
        }
        else {
            gst18.igst = parseFloat(taxamount18gst).toFixed(2)
        }

        if (taxtype == 'inclusive') {
            gst18.itemtotal = parseFloat(taxableamount18gst).toFixed(2),
                gst18.taxablevalue = parseFloat(taxableamount18gst - taxamount18gst).toFixed(2)
        }
        else {
            gst18.itemtotal = parseFloat(taxableamount18gst + taxamount18gst).toFixed(2),
                gst18.taxablevalue = parseFloat(taxableamount18gst).toFixed(2)
        }



        Gstdetail.push(gst18)

    }
    if (taxamount5gst != '' && taxamount5gst != 0) {
        let gst5 = '';

        gst5 = {
            name: 'gst5',
            percentage: '2.5',

        }
        if ($('#hf_companystate').val() == $('#ddlcompanystate').val()) {
            gst5.sgst = parseFloat(taxamount5gst / 2).toFixed(2),
                gst5.cgst = parseFloat(taxamount5gst / 2).toFixed(2)
        }
        else {
            gst5.igst = parseFloat(taxamount5gst).toFixed(2)
        }

        if (taxtype == 'inclusive') {
            gst5.itemtotal = parseFloat(taxableamount5gst).toFixed(2),
                gst5.taxablevalue = parseFloat(taxableamount5gst - taxamount5gst).toFixed(2)
        }
        else {
            gst5.itemtotal = parseFloat(taxableamount5gst + taxamount5gst).toFixed(2),
                gst5.taxablevalue = parseFloat(taxableamount5gst).toFixed(2)
        }
        Gstdetail.push(gst5)
    }
    if (taxamount28gst != '' && taxamount28gst != 0) {
        let gst28 = '';

        gst28 =
        {
            name: 'gst28',
            percentage: '14',


        }
        if ($('#hf_companystate').val() == $('#ddlcompanystate').val()) {
            gst28.sgst = parseFloat(taxamount28gst / 2).toFixed(2),
                gst28.cgst = parseFloat(taxamount28gst / 2).toFixed(2)
        }
        else {
            gst28.igst = parseFloat(taxamount28gst).toFixed(2)
        }


        if (taxtype == 'inclusive') {
            gst28.itemtotal = parseFloat(taxableamount28gst).toFixed(2),
                gst28.taxablevalue = parseFloat(taxableamount28gst - taxamount28gst).toFixed(2)
        }
        else {
            gst28.itemtotal = parseFloat(taxableamount28gst + taxamount28gst).toFixed(2)
            gst28.taxablevalue = parseFloat(taxableamount28gst).toFixed(2)
        }

        Gstdetail.push(gst28)
    }
    if (taxamount12gst != '' && taxamount12gst != 0) {
        let gst12 = '';
        gst12 =
        {
            name: 'gst12',
            percentage: '6',
        }
        if ($('#hf_companystate').val() == $('#ddlcompanystate').val()) {
            gst12.sgst = parseFloat(taxamount12gst / 2).toFixed(2),
                gst12.cgst = parseFloat(taxamount12gst / 2).toFixed(2)
        }
        else {
            gst12.igst = parseFloat(taxamount12gst).toFixed(2)
        }

        if (taxtype == 'inclusive') {
            gst12.itemtotal = parseFloat(taxableamount12gst).toFixed(2),
                gst12.taxablevalue = parseFloat(taxableamount12gst - taxamount12gst).toFixed(2)
        }
        else {
            gst12.itemtotal = parseFloat(taxableamount12gst + taxamount12gst).toFixed(2)
            gst28.taxablevalue = parseFloat(taxableamount12gst).toFixed(2)
        }
        Gstdetail.push(gst12)
    }
    if (taxamount0gst == 0) {
        if (taxableamount0gst != 0) {


            let gst0 = '';

            gst0 = {
                name: 'gst0',
                percentage: '0',

            }
            if ($('#hf_companystate').val() == $('#ddlcompanystate').val()) {
                gst0.sgst = parseFloat(0).toFixed(2),
                    gst0.cgst = parseFloat(0).toFixed(2)
            }
            else {
                gst0.igst = parseFloat(0).toFixed(2)
            }

            if (taxtype == 'inclusive') {
                gst0.itemtotal = parseFloat(taxableamount0gst).toFixed(2),
                    gst0.taxablevalue = parseFloat(taxableamount0gst).toFixed(2)
            }
            else {
                gst0.itemtotal = parseFloat(taxableamount0gst).toFixed(2),
                    gst0.taxablevalue = parseFloat(taxableamount0gst).toFixed(2)
            }
            Gstdetail.push(gst0)
        }
    }
    if (taxtype == 'inclusive') {
        $('#subtotal').text(parseFloat(total - (parseFloat(taxamount5gst) + parseFloat(taxamount12gst) + parseFloat(taxamount18gst) + parseFloat(taxamount28gst))).toFixed(2));
        $('#txtactualtotal').val(parseFloat(total).toFixed(2))
        $('#txttotal').text(parseFloat(total).toFixed(2))
    } else {
        $('#subtotal').text(parseFloat(total).toFixed(2));

        let sum = parseFloat(total) + parseFloat(taxamount5gst) + parseFloat(taxamount12gst) + parseFloat(taxamount18gst) + parseFloat(taxamount28gst);

        $('#txtactualtotal').val(parseFloat(sum).toFixed(2));
        $('#txttotal').text(parseFloat(sum).toFixed(2));
    }

    if ($('#hf_id').val() != '' && $('#hf_id').val() != undefined) {
        Cal_Roundoff() 
    }

  

}

function save_process() {
    let CustomerDetail = [];
    let invoiceDetail = [];

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
    if ($('#ddlsalesrep').val() == '0') {
        toastr.error('Please select sales Repersentive');
        return false;
    }

    $('#detailsTable tbody tr').each(function (i, e) {
        if ($('.productid', this).val()) {
            if ($('.productid', this).val() != '') {

                if ($('.qty', this).val() > $('.availableqty', this).val()) {

                    toastr.error('Please Check and give Valid Input');
                    return false;
                }
                let detail = {

                    productid: $('.productid', this).val(),
                    qty: $('.qty', this).val(),
                    saleqty: $('.hfqty', this).val(),
                    rate: $('.rate', this).val(),
                    discount: $('.discount', this).val(),
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
    $('#tblpayment tbody tr').each(function (i, e) {
        if ($('.payamount', this).val() != '0') {

            let detail = {
                paidfrom: $('.paidfrom', this).val(),
                referencemode: $('.ddltype', this).find('option:selected').text(),
                amount: $('.payamount', this).val(),
                reference: $('.description', this).val()
            }
            PayModeDetails.push(detail);
            total = parseFloat(total) + parseFloat($('.payamount', this).val());
        }
    })
    if (invoiceDetail.length == 0) {
        toastr.error('Inavalid invoice Deatil Unable to Process');
        return false;
    }

    var data = {
        _id: $('#hf_id').val(),
        invoiceno: $('#hfinvoiceno').val(),
        invoicedate: Converdate($('#txtinvoicedate').val()),
        duedate: Converdate($('#txtduedate').val()),
        creditdays: IP_dateDiff($('#txtinvoicedate').val(), $('#txtduedate').val(), 'DD-MM-YYYY', false),
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
        // PaymodeDetail: PayModeDetails,
        transdate: $('#txtinvoicedate').val(),
        note: $('#txtnote').val(),
        termsandconditions: $('#txttermsandcondition').val(),
    }
    if ($('#ddlsalesrep').val()) {
        data.salesrep = $('#ddlsalesrep').val()
    }
    insertupdate(data, '/salesorder/insertupdate');
    // alert($('#hfsupplierid').val())

}

function afterinsertupdatefunction(res) {



    cleardata();
    btnprint(res.data._id);
    getsalesno();
    amountdateils()
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
        ajax: '/salesorder/list',
        columns: [
            // { data: 'sno', },
            { data: 'invoicedate', name: 'invoicedate' },
            { data: 'invoiceno', name: 'invoiceno' },
            { data: 'customer.name', name: 'customer' },
            { data: 'total', name: 'total' },
            // { data: 'balancedueamount', name: 'balancedueamount' },
            // { data: 'status', name: 'status' },

            { data: '_id', responsivePriority: -1 },
        ],
        order: [0, "desc"],
        dom: '<"top" f>rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        columnDefs: [{
            targets: -1,
            title: 'Actions',
            orderable: false,
            render: function (data, type, full, meta) {
                let value = data.split('-');

                let editbutton = $.trim(value[1]) == 'true' ? `
                <li class="kt-nav__item">
                <a class="kt-nav__link" onclick='btneditsalesorder("` + value[0] + `")'><i class="kt-nav__link-icon flaticon-edit-1"></i><span class="kt-nav__link-text">Edit</span></a>
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
                    <button type="button" onclick='btnprint("` + value[0] + `")' class="btn btn-sm btn-outline-success">
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
                    `+ deletebutton + `
                </ul>
                       
                    </div>
                    </div>`;
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
    $('#ddlduedays').val('7');
    Cal_Duedate();
    $('#txttotal').text("0")
    $('#subtotal').text("0.00")
    $('#txtcustomer').typeahead('val', '');
    $('#hfcustomerid').val("");
    $('#txtreference').val("");
    $("#detailsTable tbody").find("tr:gt(2)").remove();
    $('#detailsTable tbody tr').each(function (i, e) {
        $('.ddl', this).val('')
        $('.qty', this).val('');
        $('.availableqty', this).val('');
        $('.rate', this).val('');
        $('.discount', this).val('');
        $('.amount', this).val('');
        $('.hfdetailsysid', this).val('');
    })
    $('.supplierdetails').hide();
    $('.gstdetails').empty();
    LoadData();
    $('#txtnote').val('');
    $('#txttermsandcondition').val('');
    $('#hf_balancepayment').val('0');

    $('#txtactualtotal').val('0')
    $('#txtpayamount').val('0')
    $('#txtrounoffvalue').val('0');
    $('#lblbalance').text('0')
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
//#region delete and edit process
function btndeletesales(id) {
    deletedata('/salesorder/delete/' + id)
}
function afterdelete() {
    LoadData()
    amountdateils()
}
function btneditsalesorder(id) {
    editassignvalue('/salesorder/edit/' + id)
}
function assignvalue(data) {
    localStorage.clear();
    getproductname('');
    console.log(data)
    $('.list').hide();
    $('.entry').show();
    $('#hf_id').val(data[0]._id);
    $('#txtinvoicedate').val(data[0].invoicedate);

    $('#ddlduedays').val(data[0].creditdays);
    Cal_Duedate();
    $('#txttotal').text(data[0].total)
    $('#txtreference').val(data[0].reference)
    $('#txtcustomer').typeahead('val', data[0].customer.name);


    $('.supplierdetails').show();
    $('#hfcustomerid').val(data[0].customerid);
    $('#txtgstno').val(data[0].customer.gstin);
    $('#ddlcompanystate').val(data[0].customer.billingstate);
    $('#hfinvoiceno').text(data[0].invoiceno);
    $('.lblinvoiceno').text(data[0].invoiceno);
    $('#ddlsalesrep').val(data[0].salesrep);

    $('#hfcustomername').val(data[0].customer.name);
    $('#hfcustomertype').val(data[0].customer.customertype);
    $('#hfemail').val(data[0].customer.email);
    $('#hfshippingaddress').val(data[0].customer.shippingaddress);
    $('#hfbillingaddress').val(data[0].customer.billingaddress);
    $('#hfgstin').val(data[0].customer.gstin);
    $('#hfgsttype').val(data[0].customer.gsttype);
    $('#hfgstno').val(data[0].customer.gstno);

    $('#ddlroundofftype').val(data[0].roundofftype);
    $('#txtrounoffvalue').val(data[0].roundoff)
    $('#txtactualtotal').val(data[0].actualtotal)
    $('#txtpayamount').val(data[0].payamount)
    $('#txtnote').val(data[0].note)
    $('#txttermsandcondition').val(data[0].termsandconditions)
    $('#lblbalance').text(data[0].dueamount)


    $.each(data[0].invoiceDetail, function (j, v) {
        if (j <= 2) {
            $('#detailsTable tbody tr').each(function (i, e) {
                if (j == i) {
                    let productdetails = productnameArray.filter(element => element.id == v.productid);

                    $('.ddl', this).val(productdetails[0].name);
                    $('.productid', this).val(v.productid);
                    $('.qty', this).val(v.qty);
                    $('.hfqty', this).val(v.qty);
                    $('.availableqty', this).val(productdetails[0].availbleqty);
                    $('.rate', this).val(v.rate);
                    $('.discount', this).val(v.discount);
                    $('.amount', this).val(v.amount);
                    $('.hfdetailsysid', this).val(v._id);
                }
            })
        }
        else {
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
            getproductname($(row).find('.ddl'))
            $(row).find('.ddl').val(productdetails[0].name);
            $(row).find('.qty').val(v.qty);
            $(row).find('.hfqty').val(v.qty);
            $(row).find('.availableqty').val(productdetails[0].availbleqty);
            $(row).find('.rate').val(v.rate);
            $(row).find('.discountvalue').val(v.discount);
            $(row).find('.amount').val(v.amount);
            $(row).find('.productid').val(v.productid);
            $(row).find('.detailsysid').val(v._id);
            $('#detailsTable').append(row);
        }



    })
    let balancepayment = 0;


    Cal_Amount();

  
}
//#endregion