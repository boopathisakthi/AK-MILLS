$(document).ready(function () {

    Cal_days();
    loadgstdetail();
    
    
});
function Cal_days() {
    if ($('#ddltype').val() == "Monthly") {
        $('#ddldays').empty();
        let value = `
        <option value="01">January</option> <option value="02">Febuary</option>  <option value="03">March</option>
        <option value="04">April</option> <option value="05">May</option>  <option value="06">June</option>
        <option value="07">July</option> <option value="08">Augest</option>  <option value="09">September</option>
        <option value="10">Octember</option> <option value="11">November</option>  <option value="12">December</option>
        `;
        $('#ddldays').append(value)
    }
    else {
        $('#ddldays').empty();
        let value = `
        <option value="04-06">April-to-June</option> 
        <option value="07-09">July-to-September</option> 
        <option value="10-12">Octember-to-December</option>
        <option value="01-03">January-to-March</option> 
        `;
        $('#ddldays').append(value)

    }
    bind_date()
}
function bind_date() {
    if ($('#ddltype').val() == "Monthly") {
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
      

    }
    else {

        let months = $('#ddldays').val().split("-");


        let currentdate = new Date();
        let first_year = months[0] == "01" ? currentdate.getFullYear() + 1 : currentdate.getFullYear();
        let date = (months[0] + '-01-' + first_year);

        var currentTime = new Date(date);
        // First Date Of the month in quaterly
        var startDateFrom = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1);
        $("#txtfromdate").datepicker().datepicker("setDate", startDateFrom);


        //last date of selected month in quaterly
        let lasttdate = new Date();
        let last_date_year = months[1] == "03" ? lasttdate.getFullYear() + 1 : lasttdate.getFullYear();
        let last_firstdate = (months[1] + '-01-' + last_date_year);
        var currentlastTime = new Date(last_firstdate);
        // First Date Of the month 
        let y = currentlastTime.getFullYear();
        let m = currentlastTime.getMonth();
        var lastDateofmonth = new Date(y, m + 1, 0);
        $("#txttodate").datepicker().datepicker("setDate", lastDateofmonth);
    }
    loadgstdetail();
  
}
function loadgstdetail() {
    var data = [];
    data[0] = "invoiceno";
    data[1] = "invoicedate";
    data[2] = "total";
    data[3] = "customername";
    data[4] = "gstno";
    data[5] = "taxablevalue";
    data[6] = "itemtotal";
    data[7] = "name";
    data[8] = "igst";
    data[9] = "sgst";
    data[10] = "cgst";

    var FilterParameter = {
        fromdate: Converdate($('#txtfromdate').val()),
        todate: Converdate($('#txttodate').val()),
        type: 'list',
    };
    binddatareportwithdata("#gvsalesgstlist", "/gstsalesreport", data, FilterParameter)
    salesgstdownload();
    getinvoicecount();
    getinvoicecamountdetails();
    loadgstzerodetail();
    

}
function  salesgstdownload(){
        
    var FilterParameter = {
        fromdate: Converdate($('#txtfromdate').val()),
        todate: Converdate($('#txttodate').val()),
        type: 'Download',
    };

    $.ajax({
        url: '/gstsalesreport',
        dataType: "json",
        type: "post",
        data: FilterParameter,
        success: function (data) {
            dataone = data.data
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

    var dataone;
    var $btnDLtoExcel = $('#DLtoExcel');
            $btnDLtoExcel.on('click', function () {
                $("#dvjson").excelexportjs({
                    containerid: "dvjson",
                    datatype: 'json',
                    dataset: dataone,
                    columns: getColumns(dataone)
                });
            });

            var $btnDLtoExcel = $('#DLtoExcel-2');
            $btnDLtoExcel.on('click', function () {
                $("#tableData").excelexportjs({
                    containerid: "tableData",
                    datatype: 'table'
                });
            });

}
function getinvoicecount()
{
    let FilterParameter = {
        fromdate: Converdate($('#txtfromdate').val()),
        todate: Converdate($('#txttodate').val()),
    };

    $.ajax({
        url: '/gstsalescount',
        dataType: "json",
        type: "post",
        data: FilterParameter,
        success: function (data) {
           
           if(data.length==0)
           {
            $('#lblinvoice_count').text("0")

           }else{
          $('#lblinvoice_count').text(data[0].myCount)
            
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
function getinvoicecamountdetails()
{
    let FilterParameter = {
        fromdate: Converdate($('#txtfromdate').val()),
        todate: Converdate($('#txttodate').val()),
    };

    $.ajax({
        url: '/gstsalesamountdetails',
        dataType: "json",
        type: "post",
        data: FilterParameter,
        success: function (data) {
            if(data.length==0)
            {
                $('#lbltotaltaxablevalue').text("0")
                $('#lbltaxamount').text("0")
                $('#lbltotalvalue').text("0")
            }
            else
            {
                
                $('#lbltotaltaxablevalue').text(parseFloat(data[0].totaltaxablevalue).toFixed(2) )
                $('#lbltaxamount').text(parseFloat(data[0].totaltaxamount).toFixed(2))
                $('#lbltotalvalue').text(parseFloat(data[0].totalvalue).toFixed(2))
               
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

function loadgstzerodetail() {
    var data = [];
    data[0] = "invoiceno";
    data[1] = "invoicedate";
    data[2] = "total";
    data[3] = "customername";
    data[4] = "gstno";
    data[5] = "taxablevalue";
    data[6] = "itemtotal";
    data[7] = "name";
    data[8] = "igst";
    data[9] = "sgst";
    data[10] = "cgst";

    var FilterParameter = {
        fromdate: Converdate($('#txtfromdate').val()),
        todate: Converdate($('#txttodate').val()),
        type: 'list',
    };
    binddatareportwithdata("#gvsalesgstzerolist", "/gstzerosalesreport", data, FilterParameter)
    salesgstdownload();
    getinvoicecount();
    getinvoicecamountdetails();
    

}



