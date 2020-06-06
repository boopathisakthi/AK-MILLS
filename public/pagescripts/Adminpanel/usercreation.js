$(document).ready(function () {
    LoadData();
    validationuser();
    BindddlData('#ddlrole', '/Adminpanel/roleddllist');

    //    $('#ddlbranch').empty('');



})
var ddllist = []
function BindddlDataBranch(element, Url) {
    ddllist = '';
    if (ddllist.length == 0) {
        $.ajax({
            type: "GET",
            url: Url,
            success: function (data) {
                ddllist = data.data;
                renderdatabranch(element);
             

            }
        })
    }
    else {
        //render catagory to the element
        renderdatabranch(element);
    }
}
function renderdatabranch(element) {
    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').val('').text('Select'));
    //  $(element).append('<option value="0"> Select </option>');
    $.each(ddllist, function (i, val) {
        $ele.append($('<option/>').val(val._id).text(val.name));
    })
    $(element).val('').selectpicker('refresh');
}

var validationuser = function () {
   
    $("#kt_form_3").validate({
        // define validation rules
        rules: {
            //= Client Information(step 3)
            // Billing Information
            name: {
                required: true
            },
            mobile: {
                required: true,
                number: true,
                minlength: 10,
                maxlength: 10
            },
            // email: {                
            //     email: true,
            //     minlength: 10
            // },  
            username: {
                required: true
            },
            password: {
                required: true
            },
            role: {
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
                   
                    let branch=$('#ddlbranch').val().toString().split(',')
                   
                  
                    var data = new FormData();
                    var file = $("#imguserpic")[0].files[0];
                    data.append("_id", $('#hf_id').val());
                    data.append("name", $('#txtname').val());
                    data.append("mobile", $('#txtmobile').val());
                    data.append("email", $('#txtemail').val());
                    data.append("username", $('#txtusername').val());
                    data.append("password", $('#txtpassword').val());
                    data.append("branchid",  branch[0]);
                    data.append("BranchDetail",branch);
                    if (file === undefined)
                        data.append("profilepic", $('#showimg').attr('src'));
                    else
                        data.append("profilepic", file, CurrentDatetime() + file.name);

                    data.append("roleid", $('#ddlrole').val());

                    $.ajax({
                        type: 'post',
                        url: '/Adminpanel/usercreation',
                        data: data,
                        contentType: false,
                        processData: false,
                        success: function (result) {
                            if (result.status == 'success') {
                                toastr.success(result.message);
                                LoadData();
                                cleardata();
                                $('#kt_modal_4_2').modal('hide');

                            } else {
                                if (result.Message == '' || result.Message == null) {
                                    toastr.error('Something Went wrong');
                                } else {
                                    toastr.error(result.Message);
                                }
                            }
                        },
                        error: function (errormessage) {
                            toastr.error(errormessage.responseText);
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

            return false;
        }
    });
}

function LoadData() {
    $('#gvlist').dataTable().fnDestroy();
    var table = $('#gvlist');
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
        ajax: '/Adminpanel/usercreationlist',
        columns: [
            //{ data: 'sno', },
            { data: 'profilepic' },
            { data: 'name', name: 'name' },
            { data: 'mobile', name: 'mobile' },
            { data: 'email', name: 'email' },
            { data: 'username', name: 'username' },
            { data: 'password', name: 'password' },
            { data: 'Role' },
            { data: '_id', responsivePriority: -1 },
        ],
        order: [0, "desc"],
        // columnDefs: [{
        //     targets: -6,
        //     title: 'sno',
        //     orderable: false,
        //     render: function (data, type, full, meta) {
        //         sno = sno + 1;
        //         return sno;
        //     }
        // }],
        dom: '<"top">rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        columnDefs: [{
            targets: -1,
            title: 'Action',
            orderable: false,
            render: function (data, type, full, meta) {

                return `
                    <button onclick='btnedit("` + data + `")'  type="button" class="btn btn-sm btn-primary btn-icon  btn-icon btn-icon-sm" data-skin="dark" data-toggle="kt-tooltip" data-placement="top" title="View / Edit">
                    <i class ="la la-edit"></i>
                  </button>    
                  <a onclick= 'btndeleted("` + data + `")'  type="button" class="btn btn-sm  btn-icon  btn-icon btn-icon-sm" title="Delete" >
                  <i class ="la la-trash"></i>
                </a>`
            },
        },
        {
            targets: -2,
            title: 'Role',
            orderable: false,
            render: function (data, type, full, meta) {
                return data.rolename;
            },
        },
        {
            targets: -8,
            title: 'UserImage',
            orderable: false,
            render: function (data, type, full, meta) {
                output = '<a href="#" class="kt-media kt-media--md kt-media--circle">\
                    <img src="' + data + '" alt="image">\
                </a>';

                return output;
            },
        },

        ],
    });
}

function btnedit(_id) {

    editassignvalue('/Adminpanel/userlist/' + _id)
    $('#kt_modal_4_2').modal('show');
}

function assignvalue(data) {
    console.log(data)
    $('#txtname').val(data[0].name)
    $('#txtmobile').val(data[0].mobile)
    $('#txtemail').val(data[0].email)
    $('#txtusername').val(data[0].username)
    $('#txtpassword').val(data[0].password)
    $('#ddlrole').val(data[0].roleid)
    $('#ddlbranch').val(data[0].branchid)
    $('#hf_id').val(data[0]._id)
    $('#showimg').attr('src', data[0].profilepic);
}

function cleardata() {
    $('#txtname').val('')
    $('#txtmobile').val('')
    $('#txtemail').val('')
    $('#txtusername').val('')
    $('#txtpassword').val('')
    $('#ddlrole').val('')
    $('#ddlbranch').val('')
    $('#hf_id').val('')
    $('#showimg').attr('src', '/appfiles/CompanyImages/default.png');
}

function btndeleted(id) {

    deletedata('/adminpanel/userdelete/' + id);
}

function afterdelete() {

    LoadData();
}
function show() {

    BindddlDataBranch($('#ddlbranch'), '/Adminpanel/branchdropdownoverall')
    $('#kt_modal_4_2').modal('show')
}