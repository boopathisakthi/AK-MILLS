$(document).ready(function () {

    BindddlData('#ddlrole', '/Adminpanel/roleddllist');
    LoadData()
    Close()
})

function save_process() {
    let details = [];
    $('#detailsTable tbody tr').each(function (i, e) {
        let row = '';

        row = {
            roleid: $('#ddlrole').val(),
            pagename: $('.lblpagename', this).text(),
            viewrights: $('.viewrights', this).is(':checked'),
            insert: $('.insert', this).is(':checked'),
            edit: $('.edit', this).is(':checked'),
            delete: $('.delete', this).is(':checked')
        }

        details.push(row)

    })
    let data = {
        details: details,
        process:$('#hfprocess').val()
    }
 
    insertupdate(data, '/admin/rolemapping');
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
        ajax: '/rolemap/list',
        columns: [

            { data: 'rolename', name: 'empname' },

            { data: '_id', responsivePriority: -1 },
        ],
        order: [0, "desc"],
        dom: '<"top"f>rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        columnDefs: [{
            targets: -1,
            title: 'Action',
            orderable: false,
            render: function (data, type, full, meta) {

                return `
                        <a onclick='btnedit("` + data + `")' type="button" class="btn btn-sm btn-primary btn-icon  btn-icon btn-icon-sm" title="View / Edit">
                          <i class ="la la-edit"></i>
                        </a>
                              <a onclick= 'btndeleted("` + data + `")' type="button" class="btn btn-sm btn-delete-red btn-icon  btn-icon btn-icon-sm" title="Delete">
                          <i class ="la la-trash"></i>
                        </a>`;
            },
        },


        ],
    });

}
function btnedit(id) {

    editassignvalue('/rolemap/edit/' + id)
}

function assignvalue(data) {
    $('.entry').show();
    $('.list').hide()
    $.each(data, function (i, v) {

        $('#detailsTable tbody tr').each(function (i, e) {
            if (v.pagename == $('.lblpagename', this).text()) {
                $('.viewrights', this).prop("checked", v.viewrights)
                $('.insert', this).prop("checked", v.insert)
                $('.edit', this).prop("checked", v.edit)
                $('.delete', this).prop("checked", v.delete)
            }

        })
    })
    $('#hfprocess').val('update')
    $('#ddlrole').val(data[0].roleid)
}

function btndeleted(id) {
    deletedata('/adminpanel/roledelete/' + id);
}
function Show() {
    cleardata()
    $('.entry').show();
    $('.list').hide()
}

function cleardata() {
    $('#detailsTable tbody tr').each(function (i, e) {

        $('.viewrights', this).prop("checked", false)
        $('.insert', this).prop("checked", false)
        $('.edit', this).prop("checked", false)
        $('.delete', this).prop("checked", false)


    })
    BindddlData('#ddlrole', '/Adminpanel/roleddllist');
}

function afterinsertupdatefunction() {
   
    cleardata()
}
function Close(){
    LoadData()
    $('.entry').hide();
    $('.list').show();
}
