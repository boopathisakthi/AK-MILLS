$(document).ready(function () {
    Close()
    bidpaymode('.ddlpaymode', '/master/banklistddl');
    GetBillno()
    var currentDate = new Date();
    $("#txtpymentdate").datepicker().datepicker("setDate", currentDate);
    LoadData();
    amountdateils()
    pagerolebasedaction()
})

function Close() {
    cleardata();
    $('.list').show();
    $('.entry').hide();

    LoadData();
    amountdateils();
}

function Show() {
    localStorage.clear();
    $('.list').hide();
    $('.entry').show();
    GetBillno()
    bidpaymode('.ddlpaymode', '/master/banklistddl');
    typeHeadsupplier();
    $('.transactiondetails').hide();
    $('#kt_modal_4').modal('hide');
    $('#btnsavegroup').show()
    $('.deletedetails').hide();
    pagerolebasedaction();
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

            }

        })

    } else {

    }
}
function bankidpaymode(element, Url, id) {

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
            }

        })

    } else {

    }
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
                `<button type="button" class="btn btn-sm btn-secondary"><i class="fa fa-plus-circle"> Add Supplier</i></button>`
            ].join('\n'),
            suggestion: Handlebars.compile('<div><strong>{{name}}</strong></div>'),
        },
    });


}
$('#txtsupplier').bind('typeahead:select', function (ev, suggestion) {


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
                    <td><input onchange="CheckboxEvent(this)" class="chbx" type="checkbox"><input type="hidden" class="purchaseid" value=` + ele._id + `></td>
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

function CheckboxEvent(ctrl) {

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

function save_process() {
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
            $('#tblpayment tbody tr').each(function (i, e) {
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
            if (sumofamount != $('#txtpaidamount').val()) {
                toastr.error('Please match your due Amount and paid Amount')
                return false;
            }
            var data = {
                billno: $('#lblbillpaymentno').text(),
                billdate: Converdate($('#txtpymentdate').val()),
                typeid: $('#hfsupplierid').val(),
                paidamount: $('#txtpaidamount').val(),
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

                        cleardata()
                        toastr.success(result.message);
                        GetBillno()


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

function GetBillno() {
    $.ajax({
        type: "GET",
        url: '/balancepayment/billno',
        success: function (data) {
            $('#lblbillpaymentno').text('BP' + data.billno)
        },
        error: function (errormessage) {
            toastr.error(errormessage.responseText);
        }
    })
    return false
}

function cleardata() {
    $('#txtpaidamount').val('0');
    $('#paymentdetails tbody ').empty();
    $('#lblbillpaymentno').text('');
    var currentDate = new Date();
    $("#txtpymentdate").datepicker().datepicker("setDate", currentDate);
    $('#hfsupplierid').val('')
    $('.paidfrom').val('')
    $('.referncemode').val('')
    $('#txtreference').val('')
    $('.transactiondetails').hide()
    $('#txtsupplier').val('');
    $('#txtsupplier').removeAttr('disabled')
    localStorage.clear();
    bidpaymode('.ddlpaymode', '/master/banklistddl');

    $('#tblpayment tbody').find("tr:gt()").remove();
    $('#tblpayment tbody tr').each(function (i, e) {

        $('.ddltype', this).val('Cash').removeAttr("disabled");
        $('.payamount', this).val('0').removeAttr("disabled");
        $('.description', this).val('').removeAttr("disabled");
        $('.hfpaymentid', this).val('').removeAttr("disabled");

        bankidpaymode($('.ddlpaymode', this), '/master/banklistddl', '5e71cedfb448ba375c84b94d')
    })
    // typeHeadsupplier()
}

function LoadData() {
    $('#gvbillpayemntlist').dataTable().fnDestroy();
    var table = $('#gvbillpayemntlist');

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
        ajax: '/balancepayment/list',
        columns: [
            // { data: 'sno', },
            { data: '_id', responsivePriority: -6 },
            { data: '_id', responsivePriority: -5 },
            { data: '_id', responsivePriority: -4 },
            { data: '_id', responsivePriority: -3 },
            { data: '_id', responsivePriority: -2 },
            { data: '_id', responsivePriority: -1 },
        ],
        order: [0, "desc"],
        dom: '<"top" f>rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        columnDefs: [
            {
                targets: -1,
                title: 'Action',
                orderable: false,
                render: function (data, type, full, meta) {

                    let deletebutton = $.trim(data.role_delete) == 'true' ? `
               <a onclick= 'btndelete("` + data.suppliername + '/' + data._id + '/' + data.paidamount + '/' + data.billno +  `")' type="button" class="btn btn-sm btn-delete-red btn-icon  btn-icon btn-icon-sm" title="Delete">
               <i class ="la la-trash ic-white"></i>
             </a>
               ` : '';

               let editbutton=$.trim(data.role_edit)=='true'?`
               <a onclick='btnedit("` + data._id + `")' type="button" class="btn btn-sm btn-primary btn-icon  btn-icon btn-icon-sm" title="View / Edit">
               <i class ="fa flaticon-eye"></i>  
             </a>
               `:'';
                    let notdelete = `
                    `+ editbutton + `
                    `+ deletebutton + `
                          `;
                    let deletedata = `
                    <a onclick='btndeleted("` + data._id + `")' type="button" class="btn btn-sm btn-primary btn-icon  btn-icon btn-icon-sm" title="View / Edit">
                      <i class ="fa flaticon-eye"></i>
                    </a>
                         `;

                    let design = data.isdeleted == 0 ? notdelete : deletedata;
                    return design
                },
            },
            {
                targets: -2,

                orderable: false,
                render: function (data, type, full, meta) {
                    let design = data.isdeleted == 0 ? `<label>` + data.entrythrough + `</label>` : `<strike>` + data.entrythrough + `</strike>`;

                    return design;


                },
            },
            {
                targets: -3,
                title: 'Paid Amount',
                orderable: false,
                render: function (data, type, full, meta) {
                    let design = data.isdeleted == 0 ? `<label>` + data.paidamount + `</label>` : `<strike>` + data.paidamount + `</strike>`;

                    return design;


                },
            },

            {
                targets: -4,
                orderable: false,
                render: function (data, type, full, meta) {
                    let design = data.isdeleted == 0 ? `<label>` + data.suppliername + `</label>` : `<strike>` + data.suppliername + `</strike>`;
                    return design;
                },

            },
            {
                targets: -5,
                orderable: false,
                render: function (data, type, full, meta) {
                    let design = data.isdeleted == 0 ? `<label>` + data.billno + `</label>` : `<strike>` + data.billno + `</strike>`;
                    return design;
                },
            },
            {
                targets: -6,

                orderable: false,
                render: function (data, type, full, meta) {

                    let design = data.isdeleted == 0 ? `<label>` + data.billdate + `</label>` : `<strike>` + data.billdate + `</strike>`;

                    return design;

                },

            },
        ],
    }
    );
    // table.on( 'order.dt search.dt', function () {
    //     t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
    //         cell.innerHTML = i+1;
    //     } );
    // } ).draw();
}

function btnedit(_id) {
    editassignvalue('/balancepayment/edit/' + _id)
}
function assignvalue(data) {
    $('.list').hide();
    $('.entry').show();
    $('#btnsavegroup').hide()
    $('.deletedetails').hide();
    $('#txtsupplier').val(data[0].Supplier[0].name).attr("disabled", "disabled").css('background', '#fff');
    $('#lblbillpaymentno').text(data[0].billno);
    $('#txtpymentdate').val(data[0].billpaymentdate).attr("disabled", "disabled").css('background', '#fff');
    $('#txtpaidamount').val(data[0].paidamount).attr("disabled", "disabled").css('background', '#fff');;
    $('.transactiondetails').show()
    $('#paymentdetails tbody tr').empty();
    var rowdesign = '';
    let i = 1;
    data[0].PaymentDetail.forEach((ele) => {
        if (ele.trans_no) {
            let balance = parseFloat(ele.balance) + parseFloat(ele.payedamount);
            rowdesign = `<tr><td><label class="sno">` + i + `</label><td>
            <input type="hidden" class="hfid" value=` + ele._id + `></input>
            <input class="chbx" disabled="disabled"  type="checkbox" checked>
            <input type="hidden" class="purchaseid" value=` + ele.purchase_id + `></td>
            <td><label class="purchasedate">` + ele.trans_date + `</label></td>
            <td><label class="purchaseorderno">` + ele.trans_no + `</label></td>
            <td><input type="hidden" class="hfpayedamount" value=` + ele.payedamount + ` + ><label class="payedamount">` + ele.payedamount + `<label></td>
            <td><span><i class="la la-rupee"></i><span>
            <input type="hidden" class="hfbalance" value=` + ele.balance + ` +></input><label class="balance">` + ele.balance + `<label></td>`;
            $('#paymentdetails tbody').append(rowdesign);
            i++;
        }

    })
    $.each(data[0].PaymodeDetail, function (i, v) {
        if (i == 0) {

            $('#tblpayment tbody tr').each(function (i, e) {
                $('.ddltype option[value=' + v.referencemode + ']', this).attr("selected", "selected");
                $('.ddltype', this).attr("disabled", "disabled").css('background', '#fff')
                $('.payamount', this).val(v.amount).attr("disabled", "disabled").css('background', '#fff');
                $('.description', this).val(v.description).attr("disabled", "disabled").css('background', '#fff');
                ddleditpaymode($('.ddlpaymode', this), '/master/banklistddl', v.paidfrom)
            })
        } else {

            var row = $("#tblpayment tbody tr").last().clone();
            $("td input:text", row).val("");
            $('td .lbldel', row).attr("style", "display: none;");
            $("td button[type=button]", row).val('Delete');
            $("td button[type=button]", row).attr("style", "display: block");
            ddleditpaymode($(row).find('.ddlpaymode'), '/master/banklistddl', v.paidfrom)

            $(row).find('.ddltype option[value=' + v.referencemode + ']', this).attr("selected", "selected");
            $(row).find('.ddltype').attr("disabled", "disabled").css('background', '#fff');
            $(row).find('.payamount').val(v.amount).attr("disabled", "disabled").css('background', '#fff');
            $(row).find('.description').val(v.description).attr("disabled", "disabled").css('background', '#fff');


            $('#tblpayment').append(row);
        }


    })


    


}
function btndelete(data) {
    let data2 = data.split("/");
    $('#kt_modal_4').modal('show');
    $('#hf_id').val(data2[1])

    $('#lblsuppliertext').text(data2[0]);
    $('#lblbillno').text(data2[3]);
    $('#lblpaidamount').text(data2[2]);
}
function btndeleted(_id) {

    $.ajax({
        url: ' /balancepayment/findcancelperson/' + _id,
        dataType: "json",
        type: "get",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $('.deletedetails').show();
            // $('#previewdetails').modal('show');
            $('.list').hide()
            $('.entry').show()
            // $('#lblheader').text('Delete Payment Entry')
            $('#txt_previewname').val(data[1].name);
            $('#txt_previewdate').val(data[1].date);
            $('#txt_previewnote').val(data[1].note);

            $('#txtsupplier').val(data[0].Supplier[0].name).attr("disabled", "disabled").css('background', '#fff');
            $('#lblbillpaymentno').text(data[0].billno);
            $('#txtpymentdate').val(data[0].billpaymentdate).attr("disabled", "disabled").css('background', '#fff');
            $('#txtpaidamount').val(data[0].paidamount).attr("disabled", "disabled").css('background', '#fff');;
            $('.transactiondetails').show()
            $('#paymentdetails tbody tr').empty();
            var rowdesign = '';
            let i = 1;
            data[0].PaymentDetail.forEach((ele) => {
                if (ele.trans_no) {
                    let balance = parseFloat(ele.balance) + parseFloat(ele.payedamount);
                    rowdesign = `<tr><td><label class="sno">` + i + `</label><td>
                    <input type="hidden" class="hfid" value=` + ele._id + `></input>
                    <input class="chbx" disabled="disabled"  type="checkbox" checked>
                    <input type="hidden" class="purchaseid" value=` + ele.purchase_id + `></td>
                    <td><label class="purchasedate">` + ele.trans_date + `</label></td>
                    <td><label class="purchaseorderno">` + ele.trans_no + `</label></td>
                    <td><input type="hidden" class="hfpayedamount" value=` + ele.payedamount + ` + ><label class="payedamount">` + ele.payedamount + `<label></td>
                    <td><span><i class="la la-rupee"></i><span>
                    <input type="hidden" class="hfbalance" value=` + ele.balance + ` +></input><label class="balance">` + ele.balance + `<label></td>`;
                    $('#paymentdetails tbody').append(rowdesign);
                    i++;
                }

            })
            $.each(data[0].PaymodeDetail, function (i, v) {
                if (i == 0) {

                    $('#tblpayment tbody tr').each(function (i, e) {
                        $('.ddltype', this).val(v.referencemode).attr("disabled", "disabled").css('background', '#fff');
                        $('.payamount', this).val(v.amount).attr("disabled", "disabled").css('background', '#fff');
                        $('.description', this).val(v.description).attr("disabled", "disabled").css('background', '#fff');
                        bankidpaymode($('.ddlpaymode', this), '/master/banklistddl', v.paidfrom)
                    })
                } else {

                    var row = $("#tblpayment tbody tr").last().clone();
                    $("td input:text", row).val("");
                    $('td .lbldel', row).attr("style", "display: none;");
                    $("td button[type=button]", row).val('Delete');
                    $("td button[type=button]", row).attr("style", "display: block");
                    bankidpaymode($(row).find('.ddlpaymode'), '/master/banklistddl', v.paidfrom)
                    $(row).find('.ddltype').val(v.referencemode).attr("disabled", "disabled").css('background', '#fff');
                    $(row).find('.payamount').val(v.amount).attr("disabled", "disabled").css('background', '#fff');
                    $(row).find('.description').val(v.description).attr("disabled", "disabled").css('background', '#fff');


                    $('#tblpayment').append(row);
                }


            })


            $('#btnsavegroup').hide()

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
function savenote() {
    alert($('#hf_id').val())
    if ($('#txtnote').val() != '') {
        data = {
            _id: $('#hf_id').val(),
            note: $('#txtnote').val()
        }
        $.ajax({
            url: '/balancepayment/delete/',
            data: JSON.stringify(data),
            type: 'post',
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.status == 'success') {
                    toastr.success(result.message);
                    LoadData();
                    $('#txtnote').val('');
                    $('#hf_billno').val('');
                    $('#kt_modal_4').modal('hide');
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

    }
    else {
        toastr.error('Invalid Note Unable To Delete')
    }
}
function amountdateils() {
    $.ajax({
        url: '/purchase/amountdateils',
        success: function (data) {

            $('#lblpurchaseamount').text(parseFloat(data[0].totalpurchase).toFixed(2))
            $('#lbltotalpaidamount').text(parseFloat(data[0].totalpay).toFixed(2))
            $('#lbltotaldueamount').text(parseFloat(data[0].dueamount).toFixed(2))
            $('#lbloverdueamount').text(parseFloat(data[0].overdue).toFixed(2))
            // $('#lbltotaloverdueamount').text(parseFloat(data[0].overdue).toFixed(2))
        }

    })

}
function Add_paymentRow() {

    var row = $("#tblpayment tbody tr").last().clone();
    //clear(row);
    $(row).find('.payamount').val('0');
    $(row).find('.description').val('0');
    $(row).find('.description').val('0');
    $(row).find('.hfpaymentid').val('');
    bidpaymode($(row).find('.ddlpaymode'), '/master/banklistddl');
    $('#tblpayment').append(row);
    return false;
}
function Cal_Balance() {
    let total = 0
    $('#tblpayment tbody tr').each(function (i, ele) {
        total = parseFloat(total) + parseFloat($('.payamount', this).val());
    })
    $('#txtpaidamount').val(parseFloat(total));
    Closing_Purchase();
}


function pagerolebasedaction() {
    let data = {
        pagename: 'Balance Payment Entry'
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
function ddleditpaymode(element, Url, id) {

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
            }

        })

    } else {

    }
}