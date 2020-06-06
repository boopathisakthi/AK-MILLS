$(document).ready(() => {
    $('.banks_main_list').show();
    $('.banks_side_list').hide();
    Cal_days();
    loadlist()
   
})
function loadlist(){
    $.ajax({
        url: '/bankslist',
        success: function (res) {
            console.log(res.data)
            $('#bankslist tbody').empty();
            $.each(res.data, (i, v) => {
                let row = ''
                row = `<tr><td onclick="getbankdetails(this)"><input type="hidden" class="bankid" value=` + v._id + `>` + v.bankname + `</td>
                <td onclick="getbankdetails(this)">savings</td><td onclick="getbankdetails(this)">`+ v.account + `</td>
                <td onclick="getbankdetails(this)"><i class="la la-rupee"></i> `+ v.balance + `</td></t>`;
                $('#bankslist tbody').append(row);
            })
        }

    })
}
function getbankdetails(ctrl) {

    let bankid = $(ctrl).closest('tr').find('.bankid').val()
    $('.banks_main_list').hide();
    $('.banks_side_list').show();
    $.ajax({
        url: '/bankslist',
        success: function (res) {
            console.log(res.data)
            $('#bankslist2 tbody').empty();
            $.each(res.data, (i, v) => {

                if (v._id == bankid) {
                    let row = ''
                    row = `<tr class="kt-nav" style="padding:0 !important">
                    <td class="kt-nav__item kt-nav__item--active" onclick="getbankdetails(this)">
                    <input type="hidden" class="bankid" value=`+ v._id + `>
                    <a href="#" class="kt-nav__link" data-action="list" data-type="inbox">
                        <span class="kt-nav__link-text">
                       
                        `+ v.bankname + `
                        </span>
                     
                    </a>
             
                  
                    </td>
                    </tr>`;
                    gettransactiondetails(bankid)
                    $('#bankslist2 tbody').append(row);
                }
                else {
                    let row = ''
                    row = `<tr class="kt-nav" style="padding:0 !important">
                    <td class="kt-nav__item" onclick="getbankdetails(this)">
                    <input type="hidden" class="bankid" value=`+ v._id + `>
                    
                    <a href="#" class="kt-nav__link" data-action="list" data-type="inbox">
                    <span class="kt-nav__link-text">
                   
                    `+ v.bankname + `
                    </span>
                 
                   </a>
                    </td>
                    </t>`;
                    $('#bankslist2 tbody').append(row);
                }

            })
        }

    })
}
function Close() {
    $('.banks_main_list').show();
    $('.banks_side_list').hide();
}
function changemonth() {
    gettransactiondetails($('#hfbankid').val())
}
function gettransactiondetails(bankid) {
    
    //  getbeforetransactiondetails(bankid)
    if(bankid)
    {
        let previous_amount = 0;
        $('#hfbankid').val(bankid)
        let FilterParameter = {
            fromdate: Converdate($('#txtfromdate').val()),
            todate: Converdate($('#txttodate').val()),
        };
    
        $.ajax({
            url: '/banksbeforetransaction/' + bankid,
            dataType: "json",
            type: "post",
            data: FilterParameter,
            success: function (res) {
               
                $('#transactiondetails tbody').empty();
                $.each(res.data, (i, v) => {
                    let row = ''
                    row = `<tr><td> </td><td>  B/F</td> <td>  </td>
                    <td>   </td> <td><i class="la la-rupee"></i> ` + v.balance + ` </td>  </tr>`;
                    previous_amount = v.balance;
                    $('#transactiondetails tbody').append(row);
                })
    
                $.ajax({
                    url: '/bankstransaction/' + bankid,
                    dataType: "json",
                    type: "post",
                    data: FilterParameter,
                    success: function (res) {
                        if (res.data.length != 0 && res.data.length != undefined) {
                            $.each(res.data, (i, v) => {
                              
                                if (v.type == 'supplier' ) {
                                   
                                    previous_amount = previous_amount - v.withdrawl;
                                }
                                else if(v.type=='customer') {
                                    previous_amount = previous_amount + v.deposit;
                                }
                                else if(v.type=='bank') {
                                   if(v.typeid== $('#hfbankid').val())
                                   {
                                    previous_amount = previous_amount + v.deposit;
                                   }
                                   else
                                   {
                                    previous_amount = previous_amount - v.withdrawl;
                                   }
                                    
                                }
                                let name=v.name==''?v.bankname:v.name;
                                if (v.type == 'expense' ) {
                                   
                                    previous_amount = previous_amount - v.withdrawl;
                                    name='expense';
                                }
    
                                let row = ''
                               
                               if(v.deposit==0)
                               {
                                row = `<tr><td>` + v.billdate + ` </td><td> To  ` +name + ` </td> <td><i class="la la-rupee"></i> ` + v.withdrawl + ` </td>
                                <td><i class="la la-rupee"></i> `+ v.deposit + `  </td> <td><i class="la la-rupee"></i> ` + previous_amount + ` </td>  </tr>`;
                               }
                               else
                               {
                                row = `<tr><td>` + v.billdate + ` </td><td> By  ` +name + ` </td> <td><i class="la la-rupee"></i> ` + v.withdrawl + ` </td>
                                <td><i class="la la-rupee"></i> `+ v.deposit + `  </td> <td><i class="la la-rupee"></i> ` + previous_amount + ` </td>  </tr>`;
                               }
                               
                                $('#transactiondetails tbody').append(row);
                            })
    
                        }
    
    
                    }
                })
    
            }
        })

    }
  




}

function Cal_days() {

    $('#ddldays').empty();
    let value = `
        <option value="01">January</option> <option value="02">Febuary</option>  <option value="03">March</option>
        <option value="04">April</option> <option value="05">May</option>  <option value="06">June</option>
        <option value="07">July</option> <option value="08">Augest</option>  <option value="09">September</option>
        <option value="10">Octember</option> <option value="11">November</option>  <option value="12">December</option>
        `;
    $('#ddldays').append(value)


    bind_date()
}
function bind_date() {
    let currentdate = new Date();
    let date = ($('#ddldays').val() + '-01-' + currentdate.getFullYear());
    var currentTime = new Date(date);
    // First Date Of the month 
    var startDateFrom = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1);
    //last date of month
    let y = currentTime.getFullYear();
    let m = currentTime.getMonth();
    var lastDateofmonth = new Date(y, m + 1, 0);
    $("#txtfromdate").datepicker().datepicker("setDate", startDateFrom);
    $("#txttodate").datepicker().datepicker("setDate", lastDateofmonth);
    changemonth()
}
function show() {
    $('#modelpaymentdetails').modal('show');
    bidpaymode($('#ddlpaymode'), '/master/banklistddl',$('#hfbankid').val());
    var currentDate = new Date();
    $("#txt_transaction_date").datepicker().datepicker("setDate", currentDate);
    $('#txtpaidamount').val('');
  
    $('#txtnote').val('');
  //  $('#ddlpaymode').val($('#hfbankid').val())
   
}
function banklist(element, Url) {

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
                   if($('#ddlpaymode').val() !=val._id)
                   {
                    $ele.append($('<option/>').val(val._id).text(val.bankname));
                   } 
                  


                })
                //  $(element).val('5e958ea823874e15ec070792');


            }

        })

    } else {

    }
}
function bidpaymode(element, Url,id) {

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
              
                $ele.val(id)
                transactiontype()
            }

        })

    } else {

    }
}
function transactiontype() {

    if ($('#ddlpaymode').val() == '5e958ea823874e15ec070792') {
        $('#ddltransactiontype').empty();
        $('#ddltransactiontype').append($('<option/>').val('paid').text('Paid'));
        $('#ddltransactiontype').append($('<option/>').val('received').text('Received'));

    }
    else {
        $('#ddltransactiontype').empty();
        $('#ddltransactiontype').append($('<option/>').val('withdraw').text('Withdraw'));
        $('#ddltransactiontype').append($('<option/>').val('deposit').text('Deposit'));
    }
    Fn_type()
}
function Fn_type() {

    if ($('#ddltransactiontype').val() == 'paid' || $('#ddltransactiontype').val() == 'withdraw') {
        $('#ddltype').empty();
        $('#ddltype').append($('<option/>').val('paymenttosupplier').text('Payment to Supplier'));
        $('#ddltype').append($('<option/>').val('cash/contra').text('Cash/Contra'));
        $('#ddltype').append($('<option/>').val('journal').text('Journal'));
        $('#ddltype').append($('<option/>').val('refundtocustomer').text('Refund To Customer'));
        $('#ddltype').append($('<option/>').val('payment/expensenongst').text('Payment/Expense Non Gst'));
    }
    else {
        $('#ddltype').empty();
        $('#ddltype').append($('<option/>').val('refundfromsupplier').text('Refund from Supplier'));
        $('#ddltype').append($('<option/>').val('cash/contra').text('Cash/Contra'));
        $('#ddltype').append($('<option/>').val('journal').text('Journal'));
        $('#ddltype').append($('<option/>').val('receiptfromcustomer').text('Receipt from Customer'));

    }
    Fn_Loadcontacts()

}
function Fn_Loadcontacts() {
    localStorage.clear();
    if ($('#ddltransactiontype').val() == 'paid' || $('#ddltransactiontype').val() == 'withdraw') {
        if ($('#ddltype').val() == 'paymenttosupplier') {
            $('#paymentdetails tbody').empty();
            $('.customersupplierfields').show()
            $('.typeheadcustomers').hide()
            $('.typeheadsupplier').show()
            $('.ddlaccounts').hide()
            typeHeadsupplier()
        }
        else if ($('#ddltype').val() == 'refundtocustomer') {
            $('#paymentdetails tbody').empty();
            $('.customersupplierfields').show()
            $('.typeheadsupplier').hide()
            $('.typeheadcustomers').show()
            $('.ddlaccounts').hide()
            typeHeadcustomer()
        }
        else {
            $('.customersupplierfields').hide()
            $('.typeheadsupplier').hide()
            $('.typeheadcustomers').hide()
            $('.ddlaccounts').show()
            banklist($('#ddlaccounts'), '/master/banklistddl')

        }
    }
    else {
        if ($('#ddltype').val() == 'refundfromsupplier') {
            $('#paymentdetails tbody').empty();
            $('.typeheadcustomers').hide()
            $('.typeheadsupplier').show()
            $('.ddlaccounts').hide()
            $('.customersupplierfields').show()
            typeHeadsupplier()
        }
        else if ($('#ddltype').val() == 'receiptfromcustomer') {
            $('#paymentdetails tbody').empty();
            $('.customersupplierfields').show()
            $('.typeheadsupplier').hide()
            $('.typeheadcustomers').show()
            $('.ddlaccounts').hide()
            typeHeadcustomer()
        }
        else {
            $('.customersupplierfields').hide()
            $('.typeheadsupplier').hide()
            $('.typeheadcustomers').hide()
            $('.ddlaccounts').show()
            banklist($('#ddlaccounts'), '/master/banklistddl')

        }

    }

}

function typeHeadsupplier() {

    var bestPictures = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: '/master/supplierdopdown'
    });
    $('#txtsuppliers').typeahead(null, {
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
function typeHeadcustomer() {

    var bestPictures = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: '/master/customerdopdown'
    });
    $('#txtcustomers').typeahead(null, {
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

$('#txtsuppliers').bind('typeahead:select', function (ev, suggestion) {
    supplierdetails(suggestion.id)
});

function supplierdetails(id) {
    $('#hfsupplierid').val(id);
    $('.transactiondetails').show()
    $.ajax({
        type: "GET",
        url: '/balancepayment/supplierbalance/' + id,
        success: function (data) {
            $('#paymentdetails tbody ').empty();
            var row = '';
            let i = 1;
            // $('#paymentdetails tbody .trbody').empty();
            data.forEach(ele => {
                if (ele.balance > 0) {
                    row = `<tr><td><label class="sno">` + i + `</label>
                    <td><input onchange="CheckboxEventPurchase(this)" class="chbx" type="checkbox"><input type="hidden" class="purchaseid" value=` + ele._id + `></td>
                    <td><label class="purchasedate">` + ele.purchasedate + `</label></td>
                    <td><label class="purchaseorderno">` + ele.purchaseorderno + `</label></td>
                    <td><label class="payedamount"><label></td>
                    <td><span><i class="la la-rupee"></i><span>
                    <input type="hidden" class="hfbalance" value=` + ele.balance + `></input><label class="balance">` + ele.balance + `<label></td>`;
                    $('#paymentdetails tbody').append(row);
                    i++;
                }
            });

        },
        error: function (errormessage) {
            toastr.error(errormessage.responseText);
        }
    })

}
function CheckboxEventPurchase(ctrl) {

    if ($('#txtpaidamount').val() > 0) {
        let status = $(ctrl).is(':checked');
        let spendamount = 0;

        $('#paymentdetails tbody tr').each(function (i, e) {
            if ($('.purchaseid', this).val() != undefined && $('.purchaseid', this).val() != '') {
                if ($('.chbx', this).is(':checked') == true) {
                    spendamount = parseFloat((spendamount)) + parseFloat($('.payedamount', this).text());
                }
            }
        })


        let usedamount = parseFloat($('#txtpaidamount').val()) - parseFloat(spendamount);

        if (usedamount <= 0) {
            $(ctrl).prop('checked', false);
            swal.fire({
                "title": "",
                "text": "You Already Used  Your Amount",
                "type": "error",
                "confirmButtonClass": "btn btn-secondary",
                "onClose": function (e) {
                    console.log('on close event fired!');
                }
            });
            return false;
        }

        if ($(ctrl).is(':checked') == false) {

            if ($(ctrl).closest("tr").find(".hfid").val()) {

                $(ctrl).closest("tr").find(".balance").text(parseFloat($(ctrl).closest("tr").find(".payedamount").text()) + parseFloat($(ctrl).closest("tr").find(".hfbalance").val()));
                $(ctrl).closest("tr").find(".payedamount").text('0');
            } else {
                $(ctrl).closest("tr").find(".payedamount").text('0');
                $(ctrl).closest("tr").find(".balance").text($(ctrl).closest("tr").find(".hfbalance").val());
            }
        } else {

            if (usedamount >= $(ctrl).closest("tr").find(".hfbalance").val()) {
                $(ctrl).closest("tr").find(".payedamount").text($(ctrl).closest("tr").find(".hfbalance").val());
                $(ctrl).closest("tr").find(".balance").text('0');
            } else {
                // alert($(ctrl).closest("tr").find(".hfbalance").val())
                $(ctrl).closest("tr").find(".payedamount").text(parseFloat(usedamount).toFixed(2));
                $(ctrl).closest("tr").find(".balance").text($(ctrl).closest("tr").find(".hfbalance").val() - usedamount);

            }

        }
    } else {
        $(ctrl).prop('checked', false);
        toastr.error('Invalid Paid amount');
    }

}
function Closing_Purchase() {

    if ($('#txtpaidamount').val() > 0) {

        var paidamount = $('#txtpaidamount').val();

        let spendamount = 0;
        $('#paymentdetails tbody tr').each(function (i, e) {

            $('.payedamount', this).text('0');
            $('.balance', this).text($('.hfbalance', this).val())
            $('.chbx').prop('checked', false);
        })

        let usedamount = $('#txtpaidamount').val() - spendamount;
        if (usedamount == 0) {
            $('#paymentdetails tbody tr').each(function (i, e) {
                if ($('.balance', this).text() != '') {

                    if (parseFloat(paidamount) != 0) {
                        if (parseFloat($('.balance', this).text()) <= paidamount) {

                            paidamount = parseFloat(paidamount) - parseFloat($('.balance', this).text());
                            $('.payedamount', this).text(parseFloat($('.balance', this).text()).toFixed(2));
                            $('.balance', this).text('0')
                            // paidamount=paidamount-payedamount;
                            $('.chbx', this).prop('checked', true);
                        } else {

                            let balance = parseFloat($('.balance', this).text()) - parseFloat(paidamount);
                            $('.balance', this).text(parseFloat(balance).toFixed(2))
                            $('.payedamount', this).text(parseFloat(paidamount).toFixed(2));
                            paidamount = parseFloat($('.payedamount', this).text()) - paidamount;
                            $('.chbx', this).prop('checked', true);
                        }
                    }


                }

            })
        } else {
            $('#paymentdetails tbody tr').each(function (i, e) {
                if ($('.balance', this).text() != '') {
                    // alert('data')
                    if (parseFloat(usedamount) != 0) {
                        if (parseFloat($('.balance', this).text()) <= usedamount) {

                            usedamount = parseFloat(usedamount) - parseFloat($('.balance', this).text());
                            $('.payedamount', this).text(parseFloat($('.balance', this).text()).toFixed(2));
                            $('.balance', this).text('0')
                            // paidamount=paidamount-payedamount;
                            $('.chbx', this).prop('checked', true);
                        } else {

                            let balance = parseFloat($('.balance', this).text()) - parseFloat(usedamount);
                            $('.balance', this).text(parseFloat(balance).toFixed(2))
                            $('.payedamount', this).text(parseFloat(usedamount).toFixed(2));
                            usedamount = parseFloat($('.payedamount', this).text()) - usedamount;
                            $('.chbx', this).prop('checked', true);
                        }
                    }


                }

            })

        }
    } else {


        toastr.error('Invalid Paid amount');
    }


}

$('#txtcustomers').bind('typeahead:select', function (ev, suggestion) {

    customerPendingdetails(suggestion.id);
    $('#hfcustomerid').val(suggestion.id);

});

function customerPendingdetails(id) {
    $('#hfcustomerid').val(id);
  
    $.ajax({
        type: "GET",
        url: '/receipt/customerbalance/' + id,
        success: function (data) {

            var row = '';
            let i = 1;
            $('#paymentdetails tbody').empty();
            data.forEach(ele => {
                if (ele.balance > 0) {
                    row = `<tr><td><label class="sno">` + i + `</label><td>
                    <input class="chbx" onchange="CheckboxEventSales(this)" type="checkbox"><input type="hidden" class="sale_id" value=` + ele._id + `></td>
                    <td><label class="invoicedate">` + ele.invoicedate + `</label></td>
                    <td><label class="invoiceno">` + ele.invoiceno + `</label></td>
                    <td><label class="payedamount"><label></td>
                    <td><span><i class="la la-rupee"></i><span>
                    <input type="hidden" class="hfbalance" value=` + ele.balance + `></input>
                    <label class="balance">` + ele.balance + `<label></td>`;
                    $('#paymentdetails tbody').append(row);
                    i++;
                }
            });

        },
        error: function (errormessage) {
            toastr.error(errormessage.responseText);
        }
    })

}
function CheckboxEventSales(ctrl) {

    if ($('#txtpaidamount').val() > 0) {
        let status = $(ctrl).is(':checked');
        let spendamount = 0;

        $('#paymentdetails tbody tr').each(function (i, e) {
            if ($('.sale_id', this).val() != undefined && $('.sale_id', this).val() != '') {
                if ($('.chbx', this).is(':checked') == true) {


                    spendamount = parseFloat((spendamount)) + parseFloat($('.payedamount', this).text());
                }
            }
        })


        let usedamount = parseFloat($('#txtpaidamount').val()) - parseFloat(spendamount);

        if (usedamount <= 0) {
            $(ctrl).prop('checked', false);
            swal.fire({
                "title": "",
                "text": "You Already Used  Your Amount",
                "type": "error",
                "confirmButtonClass": "btn btn-secondary",
                "onClose": function (e) {
                    console.log('on close event fired!');
                }
            });
            return false;
        }

        if ($(ctrl).is(':checked') == false) {

            if ($(ctrl).closest("tr").find(".hfid").val()) {

                $(ctrl).closest("tr").find(".balance").text(parseFloat($(ctrl).closest("tr").find(".hfpayedamount").val()) + parseFloat($(ctrl).closest("tr").find(".hfbalance").val()));
                $(ctrl).closest("tr").find(".payedamount").text('0');
            } else {
                $(ctrl).closest("tr").find(".payedamount").text('0');
                $(ctrl).closest("tr").find(".balance").text($(ctrl).closest("tr").find(".hfbalance").val());
            }

        } else {

            if (usedamount >= $(ctrl).closest("tr").find(".hfbalance").val()) {
                $(ctrl).closest("tr").find(".payedamount").text($(ctrl).closest("tr").find(".hfbalance").val());
                $(ctrl).closest("tr").find(".balance").text('0');
            } else {
                // alert($(ctrl).closest("tr").find(".hfbalance").val())
                $(ctrl).closest("tr").find(".payedamount").text(parseFloat(usedamount).toFixed(2));
                $(ctrl).closest("tr").find(".balance").text($(ctrl).closest("tr").find(".hfbalance").val() - usedamount);

            }

        }
    } else {
        $(ctrl).prop('checked', false);
        toastr.error('Invalid Paid amount');
    }

}

function Closing_Sales() {

    if ($('#txtpaidamount').val() > 0) {

        var paidamount = $('#txtpaidamount').val();

        let spendamount = 0;
        $('#paymentdetails tbody tr').each(function (i, e) {

            $('.payedamount', this).text('0');
            $('.balance', this).text($('.hfbalance', this).val())
            $('.chbx').prop('checked', false);
        })

        let usedamount = $('#txtpaidamount').val() - spendamount;
        if (usedamount == 0) {
            $('#paymentdetails tbody tr').each(function (i, e) {
                if ($('.balance', this).text() != '') {

                    if (parseInt(paidamount) != 0) {
                        if (parseInt($('.balance', this).text()) <= paidamount) {

                            paidamount = parseInt(paidamount) - parseInt($('.balance', this).text());
                            $('.payedamount', this).text(parseInt($('.balance', this).text()));
                            $('.balance', this).text('0')
                            // paidamount=paidamount-payedamount;
                            $('.chbx', this).prop('checked', true);
                        } else {

                            let balance = parseInt($('.balance', this).text()) - parseInt(paidamount);
                            $('.balance', this).text(balance)
                            $('.payedamount', this).text(paidamount);
                            paidamount = parseInt($('.payedamount', this).text()) - paidamount;
                            $('.chbx', this).prop('checked', true);
                        }
                    }


                }

            })
        } else {
            $('#paymentdetails tbody tr').each(function (i, e) {
                if ($('.balance', this).text() != '') {
                    // alert('data')
                    if (parseInt(usedamount) != 0) {
                        if (parseInt($('.balance', this).text()) <= usedamount) {

                            usedamount = parseInt(usedamount) - parseInt($('.balance', this).text());
                            $('.payedamount', this).text(parseInt($('.balance', this).text()));
                            $('.balance', this).text('0')
                            // paidamount=paidamount-payedamount;
                            $('.chbx', this).prop('checked', true);
                        } else {

                            let balance = parseInt($('.balance', this).text()) - parseInt(usedamount);
                            $('.balance', this).text(balance)
                            $('.payedamount', this).text(usedamount);
                            usedamount = parseInt($('.payedamount', this).text()) - usedamount;
                            $('.chbx', this).prop('checked', true);
                        }
                    }


                }

            })

        }
    } else {


        toastr.error('Invalid Paid amount');
    }
}

function Closing_Amount() {
    if ($('#ddltransactiontype').val() == 'paid' || $('#ddltransactiontype').val() == 'withdraw') {
        if ($('#ddltype').val() == 'paymenttosupplier') {
            Closing_Purchase();
        }
        else if ($('#ddltype').val() == 'refundtocustomer') {
            Closing_Sales();
        }

    }
    else {
        if ($('#ddltype').val() == 'refundfromsupplier') {
            Closing_Purchase();
        }
        else if ($('#ddltype').val() == 'receiptfromcustomer') {
            Closing_Sales();
        }


    }
}

function save_payment_process()
{
    if ($('#ddltransactiontype').val() == 'paid' || $('#ddltransactiontype').val() == 'withdraw') {
        if ($('#ddltype').val() == 'paymenttosupplier') {
            Supplier_Purchase_Saveprocess();
        }
        else if ($('#ddltype').val() == 'refundtocustomer') {
            swal.fire(
                'Under Construction',
                'Unable to Process :)',
                'error'
            )
        }
        else if($('#ddltype').val() == 'cash/contra')
        {
            Cash_Contra_Save_Process()
        }

    }
    else {
        if ($('#ddltype').val() == 'refundfromsupplier') {
            swal.fire(
                'Under Construction',
                'Unable to Process :)',
                'error'
            )
        }
        else if ($('#ddltype').val() == 'receiptfromcustomer') {
            Customer_Save_Process();
        }
        else if($('#ddltype').val() == 'cash/contra')
        {

        }


    }  
}

function Supplier_Purchase_Saveprocess()
{
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

            if ($('#hfsupplierid').val() == '' || $('#hfsupplierid').val() == undefined) {
                toastr.error('Invalid Supplierdetails');
                return false;
            }
         
            let sumofamount = 0;
            let PaymentDetail = [];
            let PaymodeDetail = [];
          
                let paymoderow = '';
                paymoderow = {
                    referencemode: $('#ddlrefercencemode').val(),
                    paidfrom: $('#ddlpaymode').val(),
                    reference: $('#txtnote').val(),
                    amount: $('#txtpaidamount').val()
                }
                PaymodeDetail.push(paymoderow)
          

            $('#paymentdetails tbody tr').each(function (i, e) {
                if ($('.purchaseid', this).val() != undefined && $('.purchaseid', this).val() != '') {
                    if ($('.chbx', this).is(':checked') == true) {
                        let paymentrow = '';

                        paymentrow = {
                            payedamount: parseFloat($('.payedamount', this).text()),
                            trans_no: $('.purchaseorderno', this).text(),
                            trans_id: $('.purchaseid', this).val(),
                            balance: $('.balance', this).text(),
                            trans_date: $('.purchasedate', this).text(),
                        }
                        PaymentDetail.push(paymentrow)
                      
                        sumofamount = parseFloat(sumofamount) + parseFloat($('.payedamount', this).text());

                    }
                }
            })
            if (sumofamount != $('#txtpaidamount').val()) {
                toastr.error('Please match your due Amount and paid Amount')
                return false;
            }
            var data = {
               // billno: $('#lblbillpaymentno').text(),
                billdate: Converdate($('#txt_transaction_date').val()),
                typeid: $('#hfsupplierid').val(),
                paidamount: $('#txtpaidamount').val(),
                PaymentDetail: PaymentDetail,
                PaymodeDetail: PaymodeDetail,
                _id: $('.hfid', this).val()
            }
            $.ajax({
                url: '/transaction_supplier_purchaseclose',
                data: JSON.stringify(data),
                type: 'post',
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (result) {
                    if (result.status == 'success') {

                        cleardata()
                        toastr.success(result.message);
                        


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
function Customer_Save_Process()
{

        swal.fire({
            title: 'Are you sure?',
            text: "You won't be save this file!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Save it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then(function(result) {
            if (result.value) {
    
                if ($('#hfcustomerid').val() == '' || $('#hfcustomerid').val() == undefined) {
                    toastr.error('Invalid CustomerDetails');
                    return false;
                }
               
                let sumofamount = 0;
                let PaymentDetail = [];
                let PaymodeDetail = [];
                let paymoderow = '';
                paymoderow = {
                    referencemode: $('#ddlrefercencemode').val(),
                    paidfrom: $('#ddlpaymode').val(),
                    reference: $('#txtnote').val(),
                    amount: $('#txtpaidamount').val()
                }
                PaymodeDetail.push(paymoderow)
    
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
                         
                            sumofamount = parseFloat(sumofamount) + parseFloat($('.payedamount', this).text());
                        }
                    }
                })
                if (sumofamount != $('#txtpaidamount').val()) {
                    toastr.error('Please match your due Amount and paid Amount')
                    return false;
                }
                var data = {
                    billno: $('#lblreceiptno').text(),
                    billdate: Converdate($('#txt_transaction_date').val()),
                    typeid: $('#hfcustomerid').val(),
                    paidamount: $('#txtpaidamount').val(),
                    PaymentDetail: PaymentDetail,
                    PaymodeDetail: PaymodeDetail,
                    _id: $('.hfid', this).val()
                }
                $.ajax({
                    url: '/transaction_receipt_insert',
                    data: JSON.stringify(data),
                    type: 'post',
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        if (result.status == 'success') {
                            cleardata()
                            toastr.success(result.message);
                           
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

function Cash_Contra_Save_Process()
{

        swal.fire({
            title: 'Are you sure?',
            text: "You won't be save this file!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Save it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then(function(result) {
            if (result.value) {
    
                
               
                let sumofamount = 0;
                let PaymentDetail = [];
                let PaymodeDetail = [];
                let paymoderow = '';
                paymoderow = {
                  //  referencemode: $('#ddlrefercencemode').val(),
                    paidfrom: $('#ddlpaymode').val(),
                   // reference: $('#txtnote').val(),
                    amount: $('#txtpaidamount').val()
                }
                PaymodeDetail.push(paymoderow)
    
               
                var data = {
                    billdate: Converdate($('#txt_transaction_date').val()),
                    typeid: $('#ddlaccounts').val(),
                    paidamount: $('#txtpaidamount').val(),
                   // PaymentDetail: PaymentDetail,
                    PaymodeDetail: PaymodeDetail,
                    _id: $('.hfid', this).val()
                }
                $.ajax({
                    url: '/cash_contra_insert',
                    data: JSON.stringify(data),
                    type: 'post',
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        if (result.status == 'success') {
                            cleardata()
                            toastr.success(result.message);
                           
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
function cleardata()
{
    $('#modelpaymentdetails').modal('toggle');
}