$(document).ready(function () {
    Close()
    bidpaymode('.ddlpaymode', '/master/banklistddl');
    GetBillno()
    var currentDate = new Date();
    $("#txtpymentdate").datepicker().datepicker("setDate", currentDate);
    LoadData();
    amountdateils();
    pagerolebasedaction();
})

function Close() {
    cleardata();
    $('.list').show();
    $('.entry').hide();
    amountdateils()
    LoadData();

}

function Show() {
    localStorage.clear();

    $('.list').hide();
    $('.entry').show();
    GetBillno()
    bidpaymode('.ddlpaymode', '/master/banklistddl');
    typeHeadcustomer()
    $('.transactiondetails').hide()
    $('.referncemode').val('Cash');
    $('.btnsave').show()
    $('.deletedetails').hide();
    $('#kt_modal_4').modal('hide');

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
                `<button type="button" class="btn btn-sm btn-secondary"><i class="fa fa-plus-circle"> Add Supplier</i></button>`
            ].join('\n'),
            suggestion: Handlebars.compile('<div><strong>{{name}}</strong></div>'),
        },
    });
}

$('#txtcustomer').bind('typeahead:select', function (ev, suggestion) {

    customerPendingdetails(suggestion.id);
    $('#hfcustomerid').val(suggestion.id);

});

function customerPendingdetails(id) {
    $('#hfcustomerid').val(id);
    $('.transactiondetails').show()
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
                    <input class="chbx" onchange="CheckboxEvent(this)" type="checkbox"><input type="hidden" class="sale_id" value=` + ele._id + `></td>
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

function CheckboxEvent(ctrl) {

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

            if ($('#hfcustomerid').val() == '' || $('#hfcustomerid').val() == undefined) {
                toastr.error('Invalid CustomerDetails');
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
            if (sumofamount != $('#txtpaidamount').val()) {
                toastr.error('Please match your due Amount and paid Amount')
                return false;
            }
            var data = {
                billno: $('#lblreceiptno').text(),
                billdate: Converdate($('#txtreceiptdate').val()),
                typeid: $('#hfcustomerid').val(),
                paidamount: $('#txtpaidamount').val(),
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
        url: '/receipt/receiptno',
        success: function (data) {
            $('#lblreceiptno').text('RE' + data.billno)
        },
        error: function (errormessage) {
            toastr.error(errormessage.responseText);
        }
    })
    return false
}

function cleardata() {


    GetBillno();

    $('#paymentdetails tbody ').empty();

    var currentDate = new Date();
    $("#txtreceiptdate").datepicker().datepicker("setDate", currentDate);
    $('#txtcustomer').val('');
    $('#hfcustomerid').val('')
    $('.paidfrom').val('')
    $('.referncemode').val('Cash')
    $('#txtreference').val('')
    $('#txtpaidamount').val('')
    $('.transactiondetails').hide()
    $('#txtcustomer').removeAttr('disabled')
    localStorage.clear();
    bidpaymode('.ddlpaymode', '/master/banklistddl');
    typeHeadcustomer()
    $('#tblpayment tbody').find("tr:gt()").remove();
    $('#tblpayment tbody tr').each(function (i, e) {

        $('.ddltype', this).val('Cash').removeAttr("disabled");
        $('.payamount', this).val('0').removeAttr("disabled");
        $('.description', this).val('').removeAttr("disabled");
        $('.hfpaymentid', this).val('').removeAttr("disabled");

        ddleditpaymode($('.ddlpaymode', this), '/master/banklistddl', '5e71cedfb448ba375c84b94d')
    })

}

function LoadData() {
    $('#gvreceiptlist').dataTable().fnDestroy();
    var table = $('#gvreceiptlist');
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
        ajax: '/receipt/list',
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
                    <a onclick= 'btndelete("` + data.customername + '/' + data._id + '/' + data.paidamount + '/' + data.billno + `")' type="button" class="btn btn-sm btn-delete-red btn-icon  btn-icon btn-icon-sm" title="Delete">
                    <i class ="la la-trash ic-white"></i>
                  </a>
                    ` : '';
                    let editbutton = $.trim(data.role_edit) == 'true' ? `
                    <a onclick='btnedit("` + data._id + `")' type="button" class="btn btn-sm btn-primary btn-icon  btn-icon btn-icon-sm" title="View / Edit">
                    <i class ="fa flaticon-eye"></i>  
                  </a>
                    `: '';
                    let notdelete = `
                    `+ editbutton + `
                    `+ deletebutton + `
                    <a onclick='btnprintreceipt("` + data._id + `")' type="button" class="btn btn-sm btn-success btn-icon  btn-icon btn-icon-sm" title="View / Edit">
                    <i class ="icon-2x text-dark-50 flaticon2-fax"></i>  
                  </a>
                        `;
                    let deletedata = `
                    <a onclick='btndeleted("` + data._id + `")' type="button" class="btn btn-sm btn-primary btn-icon  btn-icon btn-icon-sm" title="View / Edit">
                      <i class ="fa flaticon-eye"></i>
                    </a>
                    <a onclick='btnprintreceipt("` + data._id + `")' type="button" class="btn btn-sm btn-success btn-icon  btn-icon btn-icon-sm" title="View / Edit">
                    <i class ="icon-2x text-dark-50 flaticon2-fax"></i>  
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
                    let design = data.isdeleted == 0 ? `<label>` + data.customername + `</label>` : `<strike>` + data.customername + `</strike>`;
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
    editassignvalue('/receipt/edit/' + _id)
}

function assignvalue(data) {
    $('.list').hide();
    $('.entry').show();

    $('#lblreceiptno').text(data[0].billno);
    $('#txtcustomer').val(data[0].customers[0].name)
    $('#txtreceiptdate').val(data[0].billpaymentdate);
    $('#hfcustomerid').val(data[0].customerid);
    $('.paidfrom').val(data[0].paidfrom);
    $('.referncemode').val(data[0].referencemode);
    $('#txtreference').val(data[0].reference);
    $('#txtpaidamount').val(data[0].paidamount);
    $('.transactiondetails').show()
    $('#paymentdetails tbody tr').empty();
    var rowdesign = '';
    let i = 1;
    data[0].PaymentDetail.forEach((ele) => {

        rowdesign = `<tr><td><label class="sno">` + i + `</label><td>
        <input type="hidden" class="hfid" value=` + ele._id + `></input>
        <input class="chbx" onchange="CheckboxEvent(this)" type="checkbox" checked>
        <input type="hidden" class="sale_id" value=` + ele.trans_id + `></td>
        <td><label class="invoicedate">` + ele.trans_date + `</label></td>
        <td><label class="invoiceno">` + ele.trans_no + `</label></td>
        <td> <input type="hidden" class="hfpayedamount" value=` + ele.payedamount + ` +></input><label class="payedamount">` + ele.payedamount + `<label></td>
        <td><span><i class="la la-rupee"></i><span>  <input type="hidden" class="hfbalance" value=` + ele.balance + ` +></input><label class="balance">` + ele.balance + `<label></td>`;
        $('#paymentdetails tbody').append(rowdesign);
        i++;
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
    $('.btnsave').hide()
    $('.deletedetails').hide()
    // $('#txtcustomer').attr('disabled', 'disabled')
    // $('#txtpaidamount').attr('disabled', 'disabled')


}

// function btndelete(receiptno) {
//     deletedata('/receipt/delete/' + receiptno)
// }

function afterdelete() {
    LoadData();
}
function amountdateils() {
    $.ajax({
        url: '/sales/amountdetails',
        success: function (data) {
            $('#lblpurchaseamount').text(data[0].totalsales)
            $('#lbltotalpaidamount').text(data[0].totalpay)
            $('#lbltotaldueamount').text(parseFloat(data[0].dueamount).toFixed(2))
            $('#lbloverdueamount').text(parseFloat(data[0].overdue).toFixed(2))
        }
    })
}
function Add_paymentRow() {
    var row = $("#tblpayment tbody tr").last().clone();
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
function btndelete(data) {
    let data2 = data.split("/");
    $('#kt_modal_4').modal('show');
    $('#hf_id').val(data2[1])
    $('#lblsuppliertext').text(data2[0]);
    $('#lblbillno').text(data2[3]);
    $('#lblpaidamount').text(data2[2]);
}
function savenote() {
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

function btndeleted(_id) {

    $.ajax({
        url: ' /receipt/deletedetail/' + _id,
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

            $('#txtcustomer').val(data[0].Customer[0].name).attr("disabled", "disabled").css('background', '#fff');
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
                    <input type="hidden" class="purchaseid" value=` + ele.trans_id + `></td>
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
                        ddleditpaymode($('.ddlpaymode', this), '/master/banklistddl', v.paidfrom)
                    })
                } else {

                    var row = $("#tblpayment tbody tr").last().clone();
                    $("td input:text", row).val("");
                    $('td .lbldel', row).attr("style", "display: none;");
                    $("td button[type=button]", row).val('Delete');
                    $("td button[type=button]", row).attr("style", "display: block");
                    ddleditpaymode($(row).find('.ddlpaymode'), '/master/banklistddl', v.paidfrom)
                    $(row).find('.ddltype').val(v.referencemode).attr("disabled", "disabled").css('background', '#fff');
                    $(row).find('.payamount').val(v.amount).attr("disabled", "disabled").css('background', '#fff');
                    $(row).find('.description').val(v.description).attr("disabled", "disabled").css('background', '#fff');


                    $('#tblpayment').append(row);
                }


            })


            $('.btnsave').hide();

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
        pagename: 'Receipt Entry'
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

function btnprintreceipt(_id){
  
     $.ajax({
         type: "get",
         url: '/receipt/downloadreceipt/'+ _id,
        
       
            success: function (result) {

                var win = window.open('http://localhost:3000/appfiles/receipt/' + result+'', '_blank');
                
    
                
    
          },
         error: function (errormessage) {
             toastr.error(errormessage.responseText);
         }
 
     })

}