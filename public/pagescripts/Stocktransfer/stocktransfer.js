$(document).ready(function () {
    localStorage.clear();
    var currentDate = new Date();
    $("#txtentrydate").datepicker().datepicker("setDate", currentDate);
    Binddlfrombranch($('#ddlfrombranch'), '/Adminpanel/samebranchdropdown')
    BindddlData($('#ddltobranch'), '/Adminpanel/otherbrachdropdown')
    LoadData();
    Rowappend()
    Close()
   
})
var Categoriesdata = []
function Binddlfrombranch(element, Url) {
    Categoriesdata = '';
    if (Categoriesdata.length == 0) {
        //ajax function for fetch data
        $.ajax({
            type: "GET",
            url: Url,
            success: function (data) {
                Categoriesdata = data;
                //console.log(data)
                //render catagory
                renderFromCategory(element);
            }
        })
    } else {
        //render catagory to the element
        renderFromCategory(element);
    }
}
function renderFromCategory(element) {
    var $ele = $(element);
    $ele.empty();
  console.log(Categoriesdata.data)
    $.each(Categoriesdata.data, function (i, val) {
        $ele.append($('<option/>').val(val._id).text(val.name));
    })
    //$ele.val(Categoriesdata.data[0]._id);
   
}
function Show() {
    $('.list').hide();
    $('.entry').show();
    cleardata();
    $('#btnsavegroup').show()
}
function Close() {
    $('.list').show();
    $('.entry').hide();
}
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
function Rowappend() {

    var row = '';
    $("#detailsTable thead tr th").each(function () {

        switch ($.trim($(this).text())) {

            case 'S.No':
                row = row + '<th style="width:10px"><label class="sno">1</label></th>';
                break
            case 'Product':
                row = row + `<td class="td-nopad" style="width:200px">
                <div class="typeahead">
                 <input class="form-control ddl" id="ddlproduct" onkeyup="getproductdetails(this)" type="text" dir="ltr"   placeholder="Enter Productname">
                </div>
                </td>`;
                break
            case 'HSN/SAC Code':
                row = row + '<td><input  type="text" disabled="disabled" class="hsncode numerickey form-control form-control"></input><input type="hidden" class="hfdetailsysid"></input><input class="productid" type="hidden"></input></td>';
                break
            case 'Qty':
                row = row + '<td><input  type="text" class="qty numerickey form-control form-control"></input><input type="hidden" class="hfdetailsysid"></input><input class="productid" type="hidden"></input></td>';
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

    getproductname($('.ddl'));
    $('#detailsTable tbody tr').each(function (i, e) {
        $('.sno', this).text(i + 1);
    })

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

    $("td input:text", row).val("");
    $('td .lbldel', row).attr("style", "display: none;");
    $("td button[type=button]", row).val('Delete');
    $("td button[type=button]", row).attr("style", "display: block");
    $("td input[type=date]", row).val('');
    $("td input[type=time]", row).val('');
    getproductname($(row).find('.ddl'))

    $(row).find('.productid').val("");
    $(row).find('.hsncode').val("");
    $(row).find('.hfdetailsysid').val("");
    $(row).find('.qty').val("");
}
function getproductdetails(ctrl) {
    if ($(ctrl).val() != '' && $(ctrl).val() != null && $(ctrl).val() != undefined) {
        let productdetails = productnameArray.filter(element => element.name == $(ctrl).val())

        if (productdetails.length == 0 || productdetails.length == undefined || productdetails.length == '') {
            toastr.error('product Details  not availble')
        } else if (productdetails.length == 1) {
            $(ctrl).closest('tr').find('.qty').focus();

            $(ctrl).closest('tr').find('.productid').val(productdetails[0].id);

            $(ctrl).closest('tr').find('.hsncode').val(productdetails[0].hsnorsac_code);
        }
        if ($(ctrl).closest('tr').find('.sno').text() == $("#detailsTable tbody").find("tr").length) {
            for (i = 0; i < 3; i++) {
                Add_Row();
                //Rowappend();
            }
        }
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

        $(currentRow).find('.productid').val("");
        $(currentRow).find('.qty').val("");
        $(currentRow).find('.hsncode').val("");

    } else {

        $(ctrl).closest('tr').remove();
        $('#detailsTable tbody tr').each(function (i, e) {


            $('.sno', this).text(i + 1);
        })

    }
    Cal_Amount();
    Cal_Balance();
}
function save_process() {
    let StocktransferDetail = [];
    $('#detailsTable tbody tr').each(function (i, e) {
        //  alert()

        if ($('.productid', this).val() != '') {


            let detail = {
                productid: $('.productid', this).val(),
                qty: $('.qty', this).val(),
                productname: $('.ddl', this).val()
            }
            if ($('.hfdetailsysid', this).val() != '') {
                detail._id = $('.hfdetailsysid', this).val()
            }

            if ($('.hsncode', this).val() != undefined) {

                detail.hsncode = $('.hsncode', this).val()
            }

            StocktransferDetail.push(detail);
        }
    })
    if (StocktransferDetail.length == 0) {
        toastr.error('Inavalid StocktransferDetail  Unable to Process');
        return false;
    }





    var data = {

        _id: $('#hf_id').val(),
        entrydate: Converdate($('#txtentrydate').val()),
        frombranchid: $('#ddlfrombranch').val(),
        tobranchid: $('#ddltobranch').val(),
        StocktransferDetail: StocktransferDetail
    }
    insertupdate(data, '/stocktransfer/insertupdate');
    //  alert(JSON.stringify(Gstdetail))

}
function afterinsertupdatefunction() {

    cleardata();
    LoadData();
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
        ajax: '/stocktransfer/list',
        columns: [

            { data: 'entrydate', name: 'entrydate' },
            { data: 'frombranchname', name: 'frombranchname' },
            { data: 'tobranchname', name: 'tobranchname' },
            { data: '_id', responsivePriority: -1 },
        ],
        order: [0, "desc"],
        dom: '<"top" f>rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        columnDefs: [{
            targets: -1,
            title: 'Action',
            orderable: false,
            render: function (data, type, full, meta) {
                let editbutton = `
                <button onclick='btneditprocess("` + data + `")'  type="button" class="btn  btn-sm btn-primary btn-icon  btn-icon btn-icon-sm" data-skin="dark" data-toggle="kt-tooltip" data-placement="top" title="View / Edit">
                  <i class ="la la-edit  ic-white"></i>
                </button>`;
                let deletebutton = ` <a onclick= 'btndeleteprocess("` + data + `")'  type="button" class="btn  btn-sm btn-delete-red btn-icon  btn-icon btn-icon-sm" title="Delete" >
                <i class ="la la-trash  ic-white"></i>
              </a>`;
                let previewbutton = `
              <button onclick='btnpreviewprocess("` + data + `")'  type="button" class="btn  btn-sm btn-success btn-icon  btn-icon btn-icon-sm" data-skin="dark" data-toggle="kt-tooltip" data-placement="top" title="View / Edit">
                <i class ="la la-eye  ic-white"></i>
              </button>`;

                return previewbutton + editbutton + deletebutton;
            },
        },

        ],
    });

}
function btneditprocess(id) {
    editassignvalue('/stocktransfer/edit/' + id)
}
function btnpreviewprocess(id) {
    try {
        $.ajax({
            url: '/stocktransfer/edit/' + id,

            dataType: "json",
            type: "get",
            contentType: "application/json; charset=utf-8",
            success: function (data) {

                assignvalue(data);
                $('#btnsavegroup').hide()

            },
            error: function (response) {
                var parsed = JSON.parse(response.responseText);
                toastr.error(parsed.Message);
                d.resolve();
            },
            failure: function (response) {
                var parsed = JSON.parse(response.responseText);
                toastr.error(parsed.Message);

                d.resolve();
            }
        });
    } catch (e) {

    }


}
function assignvalue(data) {
    $('.list').hide();
    $('.entry').show();

    $('#btnsavegroup').show()


    $('#hf_id').val(data[0]._id);
    $('#txtentrydate').val(data[0].entrydate);
    $('#ddlfrombranch').val(data[0].frombranchid);
    $('#ddltobranch').val(data[0].tobranchid);


    $.each(data[0].StocktransferDetail, function (j, v) {
        if (j <= 2) {
            $('#detailsTable tbody tr').each(function (i, e) {
                if (j == i) {

                    let productdetails = productnameArray.filter(element => element.id == v.productid);

                    $('.ddl', this).val(productdetails[0].name);
                    $('.productid', this).val(v.productid);
                    $('.qty', this).val(v.qty);

                    $('.hfdetailsysid', this).val(v._id);


                    $('.hsncode', this).val(v.hsncode);
                    $('#detailsTable tbody').append(row);
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

            getproductname($(row).find('.ddl'))

            $(row).find('.ddl').val(productdetails[0].name);
            $(row).find('.qty').val(v.qty);


            $(row).find('.productid').val(v.productid);
            $(row).find('.detailsysid').val(v._id);


            $(row).find('.hsncode', this).val(v.hsncode);

            $('#detailsTable tbody').append(row);
        }
    })

}
function btndeleteprocess(id) {

    deletedata('/stocktransfer/delete/' + id)
}
function afterdelete() {

    LoadData();

}
function cleardata() {
    $("#detailsTable tbody").empty();
    Rowappend()
    localStorage.clear();
    var currentDate = new Date();
    $("#txtentrydate").datepicker().datepicker("setDate", currentDate);
    $('#hf_id').val("");
    Binddlfrombranch($('#ddlfrombranch'), '/Adminpanel/samebranchdropdown')
    BindddlData($('#ddltobranch'), '/Adminpanel/otherbrachdropdown')

}