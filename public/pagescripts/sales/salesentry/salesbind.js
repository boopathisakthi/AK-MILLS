//#region  invoice no genarate
function getsalesno() {
    $.ajax({
        type: "GET",
        url: '/sales/invoiceno',
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

//#region delete and edit process
function btndeletesales(id) {
    deletedata('/sales/delete/' + id)
}
function afterdelete() {
    LoadData()
    amountdateils()
}
function btneditsales(id) {
    editassignvalue('/sales/edit/' + id)
}
function assignvalue(data) {
    localStorage.clear();
    getproductname('');
    console.log(data)
    $('.list').hide();
    $('.entry').show();
    $('#hf_id').val(data[0]._id);
    $('#txtinvoicedate').val(data[0].invoicedate);


    // $('#txtduedate').val(data[0].purchasedate)

    $('#txtreference').val(data[0].reference)
    $('#txtcustomer').typeahead('val', data[0].customer.name);


    $('.supplierdetails').show();
    $('#hfcustomerid').val(data[0].customerid);
    $('#txtgstno').val(data[0].customer.gstin);
    $('#ddlcompanystate').val(data[0].customer.billingstate);
    $('#hfinvoiceno').text(data[0].invoiceno);
    $('.lblinvoiceno').text(data[0].invoiceno);


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
    $('#txttotal').text(data[0].total)

    $('#txtnote').val(data[0].note)
    $('#txttermsandcondition').val(data[0].termsandconditions)
    $('#lblbalance').text(data[0].dueamount)
    $.each(data[0].invoiceDetail, function (j, v) {
        if (j <= 2) {
            $('#detailsTable tbody tr').each(function (i, e) {
                if (j == i) {
                    let productdetails = productnameArray.filter(element => element.id == v.productid);
                    BindddlDataele($('.ddlunit', this), '/master/unitdropdown/', v.unitid)
                    $('.hfproductname',this).val(productdetails[0].name);
                    $('.hfcategoryid',this).val(productdetails[0].categoryid),
                    $('.ddl', this).val(productdetails[0].name);
                    $('.productid', this).val(v.productid);
                    $('.qty', this).val(v.qty);
                    $('.hfqty', this).val(v.qty);
                    $('.availableqty', this).val(parseInt(productdetails[0].availbleqty));
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
            $(row).find$('.hfcategoryid').val("");

            $(row).find('.typeahead').empty("");
            $(row).find('.typeahead').append(`<input class="form-control ddl" onblur="getproductdetails(this)"  type="text" dir="ltr" placeholder="Enter Productname">`);
            $(row).find('.hfdetailsysid').val("");
            $("td input:text", row).val("");
            $('td .lbldel', row).attr("style", "display: none;");
            $("td button[type=button]", row).val('Delete');
            $("td button[type=button]", row).attr("style", "display: block");
            getproductname($(row).find('.ddl'))
            $(row).find('.hfproductname').val(productdetails[0].name);
            $(row).find('.ddl').val(productdetails[0].name);
            $(row).find('.qty').val(v.qty);
            $(row).find('.hfqty').val(v.qty);
            BindddlDataele($(row).find('.ddlunit'), '/master/unitdropdown/', v.unitid)
            $(row).find('.availableqty').val(parseInt(productdetails[0].availbleqty));
            $(row).find$('.hfcategoryid').val(productdetails[0].categoryid);
            $(row).find('.rate').val(v.rate);
            $(row).find('.discountvalue').val(v.discount);
            $(row).find('.amount').val(v.amount);
            $(row).find('.productid').val(v.productid);
            $(row).find('.detailsysid').val(v._id);
            $('#detailsTable').append(row);
        }



    })



    Cal_Amount();
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
//#endregion


function btnprint(id) {

    $.ajax({
        url: '/sales/invoicebill/' + id,
        // data: JSON.q(fieldvalue),
        type: 'post',
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (res) {
            console.log(res)
            $('.lblinvoiceno').html(res.invoice[0].invoiceno);


            $('.lblinvoicedate').html(res.invoice[0].invoicedate);
            $('.lblinvoiceto').html(res.invoice[0].customer[0].billingaddress);
            var discount = 0;
            let i = 1;
            $('.trbody').empty()
            $('#companyname').html(res.company.companyname);
            $('#companyaddress').html(res.company.address);
            $('#companycity').html("Salem");
            $('#companystate').html('Tamil Nadu')
            $('#companycountry').html('India')
            $('#companypincode').html(res.company.pincode)
            $('#companygstno').html(res.company.gstno)
            $('#companyemail').html(res.company.email)
            $('#companyphone').html(res.company.phone)

            $('#subcustomername').html(res.invoice[0].customer[0].name)
            $('#subcustomergstno').html(res.invoice[0].customer[0].gstin)
            $('#subcustomerstate').html(res.invoice[0].customer[0].shippingstate)


            $('#customername').html(res.invoice[0].customer[0].name)
            $('#customershippingaddress').html(res.invoice[0].customer[0].shippingaddress)
            $('#customercity').html('Salem')
            $('#customerpincode').html(res.invoice[0].customer[0].shippingpincode)
            $('#customermobile').html(res.invoice[0].customer[0].mobile)
            $('#customeremail').html(res.invoice[0].customer[0].customeremail)
            $('#customergstin').html(res.invoice[0].customer[0].gstin)
            $('#customeremail').html(res.invoice[0].customer[0].email)
            $('#customerstate').html(res.invoice[0].customer[0].shippingstate)
            $('#customerposstate').html(res.invoice[0].customer[0].shippingstate)
            $('#customercountry').html('India')
            $('#invoiceno').html(res.invoice[0].invoiceno)
            $('#invoicedate').html(res.invoice[0].invoicedate)

            $('#taxblevalue').html(res.invoice[0].subtotal)

            res.invoice.forEach((val) => {

                var rowspan = `<tr class="tbody">
                    <td width="6%" class="ac">`+ i + `</td>
                    <td class="" width="40%">`+ val.invoiceDetail.productdetail[0].productname + `</td>
                    <td  width="7%" class="ar">`+ val.invoiceDetail.qty + `</td>
                    <td  width="12%" class="ar">Rs.`+ val.invoiceDetail.rate + `/-</td>
                    <td width="15%" class="ar"> Rs.`+ val.invoiceDetail.amount + `/-</td>`;
                $('.trbody').append(rowspan);
                discount = discount + val.invoiceDetail.discount;
                i++;
            })

            $('#discountvalue').html(discount);
            $('#totalamount').html(res.invoice[0].total);
            $('.billgstdetails').empty();
            res.invoice[0].gstdetail.forEach((val) => {


                if (val.igst == 0 && val.sgst != 0) {
                    var rowspan = `
                    
                    <tr>
                   
                    <td  class="ar tax title wrp" colspan="2">SGST `+ val.percentage + `%: </small>
                   
                    </td>
                    <td class="ar tax value wrp"><b>`+ val.sgst + `</b></td>
                    </tr>
                    <tr> <td  borer="none"  class="ar tax title wrp" colspan="2">CGST `+ val.percentage + ` %: <small></small>
                    </td>
                    <td class="tax value wrp"><b>`+ val.cgst + `</b></td></tr>
                    `;

                }
                else {
                    if (val.igst != 0) {
                        var rowspan = `
                    
                        <tr>
                        <td></td> <td borer="none" class="ar tax title wrp" colspan="1">IGST `+ (val.percentage + val.percentage) + `%: </small>
                       
                        </td>
                        <td class="tax value wrp"><b>`+ val.igst + `</b></td>
                        <td></td></tr>
                       
                        `;
                    }

                }
                $('.billgstdetails').append(rowspan);

                i++;
            })
            let totalamount = `    <tr >
            <!-- td class="total value vam wrp" style="border-top: 0.5px solid #000000"><b>Total</b></td -->
            <td class="ar total value vam wrp npr" colspan="4" style="background-color:#9a9a9a">
                <small><b>Total&nbsp;&nbsp;&nbsp;</b></small><b style="margin-right:25%">Rs
                  `+ res.invoice[0].total + `</b></td>
        </tr>  `;
            $('.billgstdetails').append(totalamount);
            $('#totalamountinwords').html(number2words(res.invoice[0].total) + ' Only')

            $('.list').hide();
            $('.entry').hide();
            $('.printTable').show();

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