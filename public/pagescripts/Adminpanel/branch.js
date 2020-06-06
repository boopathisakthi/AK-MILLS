$(document).ready(() => {
    // KTContactsAdd2.init();
    validationbranch()
    LoadData();
    hide();
})


var validationbranch = function () {

    $("#kt_form_3").validate({
        // define validation rules
        rules: {

            companyname: {
                required: true
            },
            gstno: {
                required: true
            },
            panno: {
                required: true
            },
            address: {
                required: true
            },

            pincode: {
                required: true,
                number: true,
                minlength: 6,
                maxlength: 6
            },
            telephoneno: {
                required: true
            },
            mobile: {
                required: true,
                number: true,
                minlength: 10,
                maxlength: 10
            },
            email: {
                required: true,
                email: true
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
                        _id: $('#hf_id').val(),
                        companyname: $('#txtcompanyname').val(),
                        gstno: $('#txtgstno').val(),
                        panno: $('#txtpanno').val(),
                        email: $('#txtemail').val(),
                        telephoneno: $('#txtphone').val(),
                        mobile: $('#txtmobile').val(),
                        address: $('#txtaddress').val(),
                        city: $('#ddlcity').val(),
                        state: $('#ddlstate').val(),
                        pincode: $('#txtpincode').val()
                    }

                    insertupdate(data, '/Adminpanel/branchinsert');


                } else if (result.dismiss === 'cancel') {
                    swal.fire(
                        'Cancelled',
                        'Your file is safe :)',
                        'error'
                    )
                }
            })


        }
    });
}
function afterinsertupdatefunction() {
    LoadData();
    cleardata()
}
function LoadData() {
    $('#gvlist').dataTable().fnDestroy();
    var table = $('#gvlist');

    // begin first table
    table.DataTable({
        responsive: true,
        searchDelay: 500,

        processing: true,
        serverSide: false,
        ajax: '/Adminpanel/branchlist',

        columns: [

            { data: 'companyname', name: 'companyname' },
            { data: 'gstno', name: 'gstno' },
            { data: 'panno', name: 'panno' },
            { data: 'mobile', name: 'mobile' },
            { data: '_id', responsivePriority: -1 },
        ],
        order: [1, "desc"],
        dom: '<"top" f>rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        columnDefs: [{
            targets: -1,
            title: 'Action',
            orderable: false,
            render: function (data, type, full, meta) {
                return `   
                <button onclick='btnedit("` + data + `")'  type="button" class="btn btn-sm btn-primary btn-icon  btn-icon btn-icon-sm" data-skin="dark" data-toggle="kt-tooltip" data-placement="top" title="View / Edit">
                <i class ="la la-edit"></i>
              </button>    
              <a onclick= 'btndeleted("` + data + `")'  type="button" class="btn btn-sm btn-delete-red btn-icon  btn-icon btn-icon-sm" title="Delete" >
              <i class ="la la-trash"></i>
            </a>`
                    ;
            },
        }],
    });
    oTable = $(table).DataTable();
}

function btnedit(id) {
    editassignvalue('/adminpanel/branchedit/' + id)
}

function assignvalue(Item) {
    $('#kt_modal_4').modal('show')
    $('#hf_id').val(Item[0]._id);
    $('#txtcompanyname').val(Item[0].companyname);
    $('#txtgstno').val(Item[0].gstno);
    $('#txtpanno').val(Item[0].panno);
    $('#txtaddress').val(Item[0].address);
    $('#txtpincode').val(Item[0].pincode);
    $('#ddlcity').val(Item[0].city);
    $('#ddlstate').val(Item[0].state);
    $('#txtphone').val(Item[0].telephoneno);
    $('#txtmobile').val(Item[0].mobile);
    $('#txtemail').val(Item[0].email);


}

function btndeleted(id) {
    deletedata('/adminpanel/branchdelete/' + id);
}

function ShowImagePreview(imageUploader, previewImage) {

    if (imageUploader.files && imageUploader.files[0]) {

        var reader = new FileReader();
        reader.onload = function (e) {

            $(previewImage).attr('src', e.target.result);
        }
        reader.readAsDataURL(imageUploader.files[0]);
    }

}

function cleardata() {

    $('#hf_id').val('');
    $('#txtcompanyname').val('');
    $('#txtgstno').val('');
    $('#txtpanno').val('');
    $('#txtaddress').val('');
    $('#txtpincode').val('');
    $('#ddlcity').val('');
    $('#ddlstate').val('');
    $('#txtphone').val('');
    $('#txtmobile').val('');
    $('#txtemail').val('');
    $('#kt_modal_4').modal('toggle')

}

function show() {
    $('#kt_modal_4').modal('show')
    cleardata();
}

function hide() {
    $('.entry').hide();
    $('.list').show();

}
function afterdelete() {
    LoadData();
}