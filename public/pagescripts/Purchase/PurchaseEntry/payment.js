
function btnpayment_process(id) {
    $.ajax({
        type: "GET",
        url: '/balancepayment/billno',
        success: function (data) {
            $('#lblbillpaymentno').text('BP' + data.billno)
            $.ajax({
                type: "GET",
                url: '/purchase/edit/' + id,
                success: function (data) {
                    if (parseInt(data[0].dueamount) > 0) {
                        $('#hfsupplierid').val(data[0].supplierid);
                        $('#modelpaymentdetails').modal('show')
                        $('#txtpaymentsupplier').val(data[0].Supplier.name).attr("disabled", "disabled")
                        $('#txt_bp_paidamount').val(data[0].dueamount)
                        let purchaseno = data[0].purchaseorderno;
                        bidpaymode('.ddlpaymode', '/master/banklistddl');
                        $('.transactiondetails').show()
                        $.ajax({
                            type: "GET",
                            url: '/balancepayment/supplierbalance/' + $('#hfsupplierid').val(),
                            success: function (data) {
                               
                                $('#paymentdetails tbody .trbody').empty();
                                var row = '';
                                let i = 1;
                                data.forEach(ele => {
                                    if (ele.balance > 0) {
                                        if (ele.purchaseorderno == purchaseno) {
                                            row = `<tr><td><label class="sno">` + i + `</label>
                                            <td><input onchange="CheckboxEvent(this)" class="chbx" checked type="checkbox"><input type="hidden" class="purchaseid" value=` + ele._id + `></td>
                                            <td><label class="purchasedate">` + ele.purchasedate + `</label></td>
                                            <td><label class="purchaseorderno">` + ele.purchaseorderno + `</label></td>
                                            <td><label class="payedamount">` + ele.balance + `<label></td>
                                            <td><span><i class="la la-rupee"></i><span>
                                            <input type="hidden" class="hfbalance" value=` + ele.balance + `></input><label class="balance">0<label></td>`;
                                            $('#paymentdetails tbody').append(row);
                                        } else {
                                            row = `<tr><td><label class="sno">` + i + `</label>
                                            <td><input onchange="CheckboxEvent(this)" class="chbx" type="checkbox"><input type="hidden" class="purchaseid" value=` + ele._id + `></td>
                                            <td><label class="purchasedate">` + ele.purchasedate + `</label></td>
                                            <td><label class="purchaseorderno">` + ele.purchaseorderno + `</label></td>
                                            <td><label class="payedamount"><label></td>
                                            <td><span><i class="la la-rupee"></i><span>
                                            <input type="hidden" class="hfbalance" value=` + ele.balance + `></input><label class="balance">` + ele.balance + `<label></td>`;
                                            $('#paymentdetails tbody').append(row);
                                        }

                                        i++;
                                    }
                                });
                                var currentDate = new Date();
                                $("#txtpymentdate").datepicker("setDate", currentDate);
                                $('#tblpayment_pay tbody tr').each(function (i, e) {
          
                                    $('.payamount',this).val($('#txt_bp_paidamount').val())
                                   
                                })

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
                $(element).val('5e71cedfb448ba375c84b94d');
            }

        })

    } else {

    }
}
function ddleditpaymode(element, Url, id) {

    paymode = '';
    if (paymode.length == 0) {
        //ajax function for fetch data    
        $.ajax({
            type: "GET",
            url: Url,
            success: function (data) {
                paymode = data;

                var $ele = $(element);
                $ele.empty();
                // $ele.append($('<option/>').val('').text('Select'));
                $.each(paymode.data, function (i, val) {

                    $ele.append($('<option/>').val(val._id).text(val.bankname));
                })
                $(element).val(id);
            }

        })

    } else {

    }
}
function CheckboxEvent(ctrl) {

    if ($('#txt_bp_paidamount').val() > 0) {
        let status = $(ctrl).is(':checked');
        let spendamount = 0;

        $('#paymentdetails tbody tr').each(function (i, e) {
            if ($('.purchaseid', this).val() != undefined && $('.purchaseid', this).val() != '') {
                if ($('.chbx', this).is(':checked') == true) {
                    spendamount = parseFloat((spendamount)) + parseFloat($('.payedamount', this).text());
                }
            }
        })


        let usedamount = parseFloat($('#txt_bp_paidamount').val()) - parseFloat(spendamount);

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
                $(ctrl).closest("tr").find(".balance").text(parseFloat($(ctrl).closest("tr").find(".hfbalance").val()));
            }
        } else {

            if (usedamount >= $(ctrl).closest("tr").find(".hfbalance").val()) {
                $(ctrl).closest("tr").find(".payedamount").text(parseFloat($(ctrl).closest("tr").find(".hfbalance").val()).toFixed(2));
                $(ctrl).closest("tr").find(".balance").text('0');
            } else {
                // alert($(ctrl).closest("tr").find(".hfbalance").val())
                $(ctrl).closest("tr").find(".payedamount").text(parseFloat(usedamount).toFixed(2));
                $(ctrl).closest("tr").find(".balance").text(parseFloat($(ctrl).closest("tr").find(".hfbalance").val() - usedamount).toFixed(2));

            }

        }
    } else {
        $(ctrl).prop('checked', false);
        toastr.error('Invalid Paid amount');
    }

}
function Closing_Purchase() {
    alert($('#txt_bp_paidamount').val())
    if ($('#txt_bp_paidamount').val() > 0) {

        var paidamount = $('#txt_bp_paidamount').val();

        let spendamount = 0;
        $('#paymentdetails tbody tr').each(function (i, e) {

            $('.payedamount', this).text('0');
            $('.balance', this).text($('.hfbalance', this).val())
            $('.chbx').prop('checked', false);
        })

        let usedamount = $('#txt_bp_paidamount').val() - spendamount;
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

            if ($('#hfsupplierid').val() == '' || $('#hfsupplierid').val() == undefined) {
                toastr.error('Invalid Supplierdetails');
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
                billno: $('#lblbillpaymentno').text(),
                billdate: Converdate($('#txtpymentdate').val()),
                typeid: $('#hfsupplierid').val(),
                paidamount: $('#txt_bp_paidamount').val(),
                PaymentDetail: PaymentDetail,
                PaymodeDetail: PaymodeDetail,
                _id: $('.hfid', this).val()
            }
            $.ajax({
                url: '/balancepayment/insert',
                data: JSON.stringify(data),
                type: 'post',
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (result) {
                    if (result.status == 'success') {

                        
                        toastr.success(result.message);
                      
                        $('#modelpaymentdetails').modal('toggle')
                        LoadData();
                        amountdateils();

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

            // })

        } else if (result.dismiss === 'cancel') {
            swal.fire(
                'Cancelled',
                'Your file is safe :)',
                'error'
            )
        }
    })
}
function Cal_BP_Balance() {
    let total = 0

    $('#tblpayment_pay tbody tr').each(function (i, ele) {
        total = parseFloat(total) + parseFloat($('.payamount', this).val());
    })

    $('#txt_bp_paidamount').val(total);
    Closing_Purchase();


}
function Add_BP_paymentRow()
{
    var row = $("#tblpayment_pay tbody tr").last().clone();
    // clear(row);
     $(row).find('.payamount').val('0');
     $(row).find('.description').val('0');
     $(row).find('.description').val('0');
     $(row).find('.hfpaymentid').val('');
     bidpaymode($(row).find('.ddlpaymode'), '/master/banklistddl');
     $('#tblpayment_pay').append(row);
     return false;
}