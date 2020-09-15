$(document).ready(function () {

    var start = moment().startOf('month');
    var end = moment().endOf('month');
    $('#txtdaterange').val(start.format('DD-MM-YYYY') + ' / ' + end.format('DD-MM-YYYY'));
    loaddashboard();


});

function loaddashboard() {

  //  totalprofit()
   // totalsales()
    //totalpurchase()
   // totalexpense()
    totalcustomer()
    totalsupplier()
    saleschart();
    purchasechart();
    purchaseamountdetails();
    salesamountdetails();
    incomeexpenselist()
    totalsupplieroutstanding();
    totalcustomeroutstanding();

    top3salesproduct();
    saleslist();
    purchaselist()
    //   top3expenses()
    top10salesproduct();
    incomemusthfirmethod()

}


function saleschart() {

    let daterange_from_to = $('#txtdaterange').val().split('/');

    let data = {
        fromdate: Converdate(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        todate: Converdate(moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        datecount: IP_dateDiff(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY"), moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY"), 'DD-MM-YYYY', false)
    }
    $.ajax({
        url: '/dashboard/saleschart',
        dataType: "json",
        type: "post",
        data: data,
        success: function (data) {
            let heading = [];
            let total = [];
            if (IP_dateDiff(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY"), moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY"), 'DD-MM-YYYY', false) <= 31) {
                $.each(data, function (j, v) {

                    heading.push(v.invoicedate)
                    total.push(v.total)
                })

            }
            else {

                $.each(data, function (j, v) {

                    switch (v.invoicedate) {
                        case 1:
                            month = 'January'
                            break
                        case 2:
                            month = 'February'
                            break
                        case 3:
                            month = 'March'
                            break
                        case 4:
                            month = 'April'
                            break
                        case 5:
                            month = 'May'
                            break
                        case 6:
                            month = 'June'
                            break
                        case 7:
                            month = 'July'
                            break
                        case 8:
                            month = 'Augest'
                            break
                        case 9:
                            month = 'September'
                            break
                        case 10:
                            month = 'Octember'
                            break
                        case 11:
                            month = 'November'
                            break
                        case 12:
                            month = 'December'
                            break
                    }
                    heading.push(month)
                    total.push(v.total)
                })
            }

            salesStats(heading, total)

        }

    })

}
function purchasechart() {

    let daterange_from_to = $('#txtdaterange').val().split('/');

    let data = {
        fromdate: Converdate(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        todate: Converdate(moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        datecount: IP_dateDiff(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY"), moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY"), 'DD-MM-YYYY', false)
    }
    $.ajax({
        url: '/dashboard/purchasechart',
        dataType: "json",
        type: "post",
        data: data,
        success: function (data) {
            let heading = [];
            let total = [];
            if (IP_dateDiff(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY"), moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY"), 'DD-MM-YYYY', false) <= 31) {
                $.each(data, function (j, v) {

                    heading.push(v.purchasedate)
                    total.push(v.total)
                })

            }
            else {

                $.each(data, function (j, v) {

                    switch (v.purchasedate) {
                        case 1:
                            month = 'January'
                            break
                        case 2:
                            month = 'February'
                            break
                        case 3:
                            month = 'March'
                            break
                        case 4:
                            month = 'April'
                            break
                        case 5:
                            month = 'May'
                            break
                        case 6:
                            month = 'June'
                            break
                        case 7:
                            month = 'July'
                            break
                        case 8:
                            month = 'Augest'
                            break
                        case 9:
                            month = 'September'
                            break
                        case 10:
                            month = 'Octember'
                            break
                        case 11:
                            month = 'November'
                            break
                        case 12:
                            month = 'December'
                            break
                    }
                    heading.push(month)
                    total.push(v.total)
                })
            }

            purchase_chart_bind(heading, total)

        }

    })

}
function purchase_chart_bind(heading, total) {
    $('#purchasechartcontent').empty()
    $('#purchasechartcontent').append('<canvas id="purchasechart" style="height: 160px; display: block; width: 355px;" width="479" height="215" class="chartjs-render-monitor"></canvas>');

    if (!KTUtil.getByID('purchasechart')) {
        return;
    }

    var config = {
        type: 'line',
        data: {
            // labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",
            //     "January", "February", "March", "April"
            // ],
            labels: heading,
            datasets: [{
                label: "Amount",
                borderColor: KTApp.getStateColor('brand'),
                borderWidth: 2,
                //pointBackgroundColor: KTApp.getStateColor('brand'),
                backgroundColor: KTApp.getStateColor('brand'),
                pointBackgroundColor: Chart.helpers.color('#ffffff').alpha(0).rgbString(),
                pointBorderColor: Chart.helpers.color('#ffffff').alpha(0).rgbString(),
                pointHoverBackgroundColor: KTApp.getStateColor('danger'),
                pointHoverBorderColor: Chart.helpers.color(KTApp.getStateColor('danger')).alpha(0.2).rgbString(),
                data: total
                // data: [
                //     10, 20, 16,
                //     18, 12, 40,
                //     35, 30, 33,
                //     34, 45, 40,
                //     60, 55, 70,
                //     65, 75, 62
                // ]
            }]
        },
        options: {
            title: {
                display: false,
            },
            tooltips: {
                intersect: false,
                mode: 'nearest',
                xPadding: 10,
                yPadding: 10,
                caretPadding: 10
            },
            legend: {
                display: false,
                labels: {
                    usePointStyle: false
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            hover: {
                mode: 'index'
            },
            scales: {
                xAxes: [{
                    display: false,
                    gridLines: false,
                    scaleLabel: {
                        display: true,
                        labelString: 'Month'
                    }
                }],
                yAxes: [{
                    display: false,
                    gridLines: false,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            },

            elements: {
                point: {
                    radius: 3,
                    borderWidth: 0,

                    hoverRadius: 8,
                    hoverBorderWidth: 2
                }
            }
        }
    };

    var chart = new Chart(KTUtil.getByID('purchasechart'), config);
}

function salesStats(heading, total) {

    $('#saleschartcontent').empty()
    $('#saleschartcontent').append('<canvas id="saleschart" style="height: 160px; display: block; width: 355px;" width="479" height="215" class="chartjs-render-monitor"></canvas>');

    var config = '';
    if (!KTUtil.getByID('saleschart')) {
        return;
    }


    config = {
        type: 'line',
        data: {
            // labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",
            //     "January", "February", "March", "April"
            // ],
            labels: heading,
            datasets: [{
                label: "Amount",
                borderColor: KTApp.getStateColor('brand'),
                borderWidth: 2,
                //pointBackgroundColor: KTApp.getStateColor('brand'),
                backgroundColor: KTApp.getStateColor('brand'),
                pointBackgroundColor: Chart.helpers.color('#ffffff').alpha(0).rgbString(),
                pointBorderColor: Chart.helpers.color('#ffffff').alpha(0).rgbString(),
                pointHoverBackgroundColor: KTApp.getStateColor('danger'),
                pointHoverBorderColor: Chart.helpers.color(KTApp.getStateColor('danger')).alpha(0.2).rgbString(),
                data: total
                // data: [
                //     10, 20, 16,
                //     18, 12, 40,
                //     35, 30, 33,
                //     34, 45, 40,
                //     60, 55, 70,
                //     65, 75, 62
                // ]
            }]
        },
        options: {
            title: {
                display: false,
            },
            tooltips: {
                intersect: false,
                mode: 'nearest',
                xPadding: 10,
                yPadding: 10,
                caretPadding: 10
            },
            legend: {
                display: false,
                labels: {
                    usePointStyle: false
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            hover: {
                mode: 'index'
            },
            scales: {
                xAxes: [{
                    display: false,
                    gridLines: false,
                    scaleLabel: {
                        display: true,
                        labelString: 'Month'
                    }
                }],
                yAxes: [{
                    display: false,
                    gridLines: false,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            },

            elements: {
                point: {
                    radius: 3,
                    borderWidth: 0,
                    hoverRadius: 8,
                    hoverBorderWidth: 2
                }
            }
        }
    };


    var chart = new Chart(KTUtil.getByID('saleschart'), config);
}
function totalsales() {
    salesamt = 0;
    let daterange_from_to = $('#txtdaterange').val().split('/');

    let data = {
        fromdate: Converdate(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        todate: Converdate(moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
    }
    $.ajax({
        url: '/dashboard/gettotalsales',
        dataType: "json",
        type: "post",
        data: data,
        success: function (data) {
            if (data.length == 0) {

                $('#lblsales').text("0")
            }
            else {

                $('#lblsales').text(parseFloat(data[0].totalsales).toFixed(2))
              //  $('#lblsales_income_expense').text(parseFloat(data[0].totalsales).toFixed(2))
            }


        }

    })


}
function totalpurchase() {

    let daterange_from_to = $('#txtdaterange').val().split('/');

    let data = {
        fromdate: Converdate(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        todate: Converdate(moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
    }
    $.ajax({
        url: '/dashboard/gettotalpurchase',
        dataType: "json",
        type: "post",
        data: data,
        success: function (data) {
            if (data.length == 0) {

                $('#lblpurchase').text("0")
            }
            else {

                $('#lblpurchase').text(parseFloat(data[0].totalpurchase).toFixed(2))
            }


        }

    })


}
function totalexpense() {

    let daterange_from_to = $('#txtdaterange').val().split('/');

    let data = {
        fromdate: Converdate(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        todate: Converdate(moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
    }
    $.ajax({
        url: '/dashboard/gettotalpurchase',
        dataType: "json",
        type: "post",
        data: data,
        success: function (purchasedata) {

            if (purchasedata.length == 0) {

                $('#lblpurchase').text("0");
                $.ajax({
                    url: '/dashboard/gettotalexpense',
                    dataType: "json",
                    type: "post",
                    data: data,
                    success: function (expensedata) {
                        if (expensedata.length == 0) {

                            $('#lblexpense').text("0");
                            $('#lblexpense_income_expense').text(parseFloat(parseFloat(0)).toFixed(2))
                        }
                        else {

                            $('#lblexpense').text(parseFloat(expensedata[0].totalamt).toFixed(2));


                            $('#lblexpense_income_expense').text(parseFloat(parseFloat(expensedata[0].totalamt)).toFixed(2))
                            // $('#lblprofit').text(parseFloat(profitamt).toFixed(2));
                        }


                    }

                })
            }
            else {

                $.ajax({
                    url: '/dashboard/gettotalexpense',
                    dataType: "json",
                    type: "post",
                    data: data,
                    success: function (expensedata) {
                        if (expensedata.length == 0) {

                            $('#lblexpense').text("0");
                         //   $('#lblexpense_income_expense').text(parseFloat(parseFloat(purchasedata[0].totalpurchase)).toFixed(2))
                        }
                        else {

                            $('#lblexpense').text(parseFloat(expensedata[0].totalamt).toFixed(2));


                          //  $('#lblexpense_income_expense').text(parseFloat(parseFloat(expensedata[0].totalamt) + parseFloat(purchasedata[0].totalpurchase)).toFixed(2))
                            // $('#lblprofit').text(parseFloat(profitamt).toFixed(2));
                        }


                    }

                })


            }


        }
    })



}
function totalprofit() {

    let daterange_from_to = $('#txtdaterange').val().split('/');

    let data = {
        fromdate: Converdate(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        todate: Converdate(moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
    }
    $.ajax({
        url: '/dashboard/gettotalprofit',
        dataType: "json",
        type: "post",
        data: data,
        success: function (data) {

            if (data.length == 0) {

                $('#lblprofit').text("0")
            }
            else {


                $('#lblprofit').text(parseFloat(data.data).toFixed(2));
             //   $('#lblrevenue_income_expense').text(parseFloat(data.data).toFixed(2))
            }


        }

    })


}
function totalsupplier() {

    let daterange_from_to = $('#txtdaterange').val().split('/');

    let data = {
        fromdate: Converdate(daterange_from_to[0]),
        todate: Converdate(daterange_from_to[1])
    }
    $.ajax({
        url: '/dashboard/gettotalsupplier',
        dataType: "json",
        type: "post",
        data: data,
        success: function (data) {

            if (data.length == 0) {

                $('#lblsupplier').text("0")
            }
            else {

                $('#lblsupplier').text(data[0].suppliercount)

            }


        }

    })


}
function totalcustomer() {

    let daterange_from_to = $('#txtdaterange').val().split('/');

    let data = {
        fromdate: Converdate(daterange_from_to[0]),
        todate: Converdate(daterange_from_to[1])
    }
    $.ajax({
        url: '/dashboard/gettotalcustomer',
        dataType: "json",
        type: "post",
        data: data,
        success: function (data) {

            if (data.length == 0) {

                $('#lblcustomer').text("0")
            }
            else {

                $('#lblcustomer').text(data[0].customercount)

            }


        }

    })


}
function totalcustomeroutstanding() {

    let daterange_from_to = $('#txtdaterange').val().split('/');

    let data = {
        fromdate: Converdate(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        todate: Converdate(moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
    }
    $.ajax({
        url: '/dashboard/gettotaloutstandingcustomer',
        dataType: "json",
        type: "post",
        data: data,
        success: function (data) {
            if (data.length == 0) {

                $('#lblpendingamount').text("0")
            }
            else {

                $('#lblpendingamount').text(parseFloat(data[0].pendingamount).toFixed(2))
            }


        }

    })


}
function totalsupplieroutstanding() {

    let daterange_from_to = $('#txtdaterange').val().split('/');

    let data = {
        fromdate: Converdate(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        todate: Converdate(moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
    }
    $.ajax({
        url: '/dashboard/gettotaloutstandingsupplier',
        dataType: "json",
        type: "post",
        data: data,
        success: function (data) {
            if (data.length == 0) {

                $('#lblbalancepaidamount').text("0")
            }
            else {

                $('#lblbalancepaidamount').text(parseFloat(data[0].pendingamount).toFixed(2))
            }


        }

    })


}
function Purchase() {
    if (!KTUtil.getByID('kt_chart_purchase_dashboard')) {
        return;
    }

    var config = {
        type: 'line',
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",
                "January", "February", "March", "April"
            ],
            datasets: [{
                label: "Sales Stats",
                borderColor: KTApp.getStateColor('brand'),
                borderWidth: 2,
                //pointBackgroundColor: KTApp.getStateColor('brand'),
                backgroundColor: KTApp.getStateColor('brand'),
                pointBackgroundColor: Chart.helpers.color('#ffffff').alpha(0).rgbString(),
                pointBorderColor: Chart.helpers.color('#ffffff').alpha(0).rgbString(),
                pointHoverBackgroundColor: KTApp.getStateColor('danger'),
                pointHoverBorderColor: Chart.helpers.color(KTApp.getStateColor('danger')).alpha(0.2).rgbString(),
                data: [
                    10, 20, 16,
                    18, 12, 40,
                    35, 30, 33,
                    34, 45, 40,
                    60, 55, 70,
                    65, 75, 62
                ]
            }]
        },
        options: {
            title: {
                display: false,
            },
            tooltips: {
                intersect: false,
                mode: 'nearest',
                xPadding: 10,
                yPadding: 10,
                caretPadding: 10
            },
            legend: {
                display: false,
                labels: {
                    usePointStyle: false
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            hover: {
                mode: 'index'
            },
            scales: {
                xAxes: [{
                    display: false,
                    gridLines: false,
                    scaleLabel: {
                        display: true,
                        labelString: 'Month'
                    }
                }],
                yAxes: [{
                    display: false,
                    gridLines: false,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            },

            elements: {
                point: {
                    radius: 3,
                    borderWidth: 0,

                    hoverRadius: 8,
                    hoverBorderWidth: 2
                }
            }
        }
    };

    var chart = new Chart(KTUtil.getByID('kt_chart_sales_stats'), config);
}

function purchaseamountdetails() {
    let daterange_from_to = $('#txtdaterange').val().split('/');

    let data = {
        fromdate: Converdate(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        todate: Converdate(moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
    }
    $.ajax({
        url: '/dashboard/purchaseamountdetails',
        dataType: "json",
        type: "post",
        data: data,
        success: function (data) {

            $('#txttotal_purchaseamount').text(parseFloat(data[0].totalpurchase).toFixed(2))
            $('#txtpaid_purchaseamount').text(parseFloat(data[0].totalpay).toFixed(2))
            $('#txtdue_purchaseamount').text(parseFloat(data[0].dueamount).toFixed(2))
            $('#txtoverdue_purchaseamount').text(parseFloat(data[0].overdue).toFixed(2))


        }

    })


}

function salesamountdetails() {
    let daterange_from_to = $('#txtdaterange').val().split('/');

    let data = {
        fromdate: Converdate(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        todate: Converdate(moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
    }
    $.ajax({
        url: '/dashboard/salesamountdetails',
        dataType: "json",
        type: "post",
        data: data,
        success: function (data) {

            $('#txttotal_salesamount').text(parseFloat(data[0].totalsales).toFixed(2))
            $('#txtpaid_salesamount').text(parseFloat(data[0].totalpay).toFixed(2))
            $('#txtdue_salesamount').text(parseFloat(data[0].dueamount).toFixed(2))
            $('#txtoverdue_salesamount').text(parseFloat(data[0].overdue).toFixed(2))


        }

    })


}
function CustomerOutstandinglist() {

    let daterange_from_to = $('#txtdaterange').val().split('/');

    let data = {
        fromdate: Converdate(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        todate: Converdate(moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
    }
    $.ajax({
        url: '/dashboard/customeroutstanding',
        dataType: "json",
        type: "post",
        data: data,
        success: function (data) {

            $('#gvCustomerbalancelist tbody').empty();

            let color = 1;
            $.each(data.data, (i, v) => {
                let row = '';
                switch (color) {
                    case 1:
                        row = `<tr  class="kt-datatable__row" ><td  class="kt-datatable__cell">
                        <span>
                       <div class="kt-user-card-v2">
                       <div class="kt-user-card-v2__pic">
                         <div class="kt-badge kt-badge--xl kt-badge--success">`+ v.name.slice(0, 1).toUpperCase() + `</div>
                             </div>		
                    <div class="kt-user-card-v2__details">	
                   <a href="#" class="kt-user-card-v2__name">`+ v.name + `</a>
                 
                   </div>			
                               </div>
                               </span>
                               </td>
                               <td class="kt-datatable__cell">`+ v.mobile + `</td>
                               <td class="kt-datatable__cell">`+ v.pendingamount + `</td>
                             
                               </tr>`;
                        break;
                    case 2:
                        row = `<tr  class="kt-datatable__row" ><td  class="kt-datatable__cell">
                        <span>
                       <div class="kt-user-card-v2">
                       <div class="kt-user-card-v2__pic">
                         <div class="kt-badge kt-badge--xl kt-badge--danger">`+ v.name.slice(0, 1).toUpperCase() + `</div>
                             </div>		
                    <div class="kt-user-card-v2__details">	
                   <a href="#" class="kt-user-card-v2__name">`+ v.name + `</a>
                 
                   </div>			
                               </div>
                               </span>
                               </td>
                               <td class="kt-datatable__cell">`+ v.mobile + `</td>
                               <td class="kt-datatable__cell">`+ v.pendingamount + `</td>
                             
                               </tr>`;
                        break;
                    case 3:
                        row = `<tr  class="kt-datatable__row" ><td  class="kt-datatable__cell">
                        <span>
                       <div class="kt-user-card-v2">
                       <div class="kt-user-card-v2__pic">
                         <div class="kt-badge kt-badge--xl kt-badge--primary">`+ v.name.slice(0, 1).toUpperCase() + `</div>
                             </div>		
                    <div class="kt-user-card-v2__details">	
                   <a href="#" class="kt-user-card-v2__name">`+ v.name + `</a>
                 
                   </div>			
                               </div>
                               </span>
                               </td>
                               <td class="kt-datatable__cell">`+ v.mobile + `</td>
                               <td class="kt-datatable__cell">`+ v.pendingamount + `</td>
                             
                               </tr>`;
                        break;
                    case 4:
                        row = `<tr  class="kt-datatable__row" ><td  class="kt-datatable__cell">
                        <span>
                       <div class="kt-user-card-v2">
                       <div class="kt-user-card-v2__pic">
                         <div class="kt-badge kt-badge--xl kt-badge--warning">`+ v.name.slice(0, 1).toUpperCase() + `</div>
                             </div>		
                    <div class="kt-user-card-v2__details">	
                   <a href="#" class="kt-user-card-v2__name">`+ v.name + `</a>
                 
                   </div>			
                               </div>
                               </span>
                               </td>
                               <td class="kt-datatable__cell">`+ v.mobile + `</td>
                               <td class="kt-datatable__cell">`+ v.pendingamount + `</td>
                             
                               </tr>`;
                        break;
                }
                color++;
                if (color == 4) {
                    color = 1;
                }

                $('#gvCustomerbalancelist tbody').append(row);
            })


        }

    })
}
function SupplierOutstandinglist() {

    let daterange_from_to = $('#txtdaterange').val().split('/');

    let data = {
        fromdate: Converdate(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        todate: Converdate(moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
    }
    $.ajax({
        url: '/dashboard/supplieroutstanding',
        dataType: "json",
        type: "post",
        data: data,
        success: function (data) {

            $('#gvsupplierbalancelist tbody').empty();
            let color = 1;
            $.each(data.data, (i, v) => {
                let row = '';
                switch (color) {
                    case 1:
                        row = `<tr  class="kt-datatable__row" ><td  class="kt-datatable__cell">
                        <span>
                       <div class="kt-user-card-v2">
                       <div class="kt-user-card-v2__pic">
                         <div class="kt-badge kt-badge--xl kt-badge--success">`+ v.name.slice(0, 1).toUpperCase() + `</div>
                             </div>		
                    <div class="kt-user-card-v2__details">	
                   <a href="#" class="kt-user-card-v2__name">`+ v.name + `</a>
                 
                   </div>			
                               </div>
                               </span>
                               </td>
                               <td class="kt-datatable__cell">`+ v.mobile + `</td>
                               <td class="kt-datatable__cell">`+ v.pendingamount + `</td>
                             
                               </tr>`;
                        break;
                    case 2:
                        row = `<tr  class="kt-datatable__row" ><td  class="kt-datatable__cell">
                        <span>
                       <div class="kt-user-card-v2">
                       <div class="kt-user-card-v2__pic">
                         <div class="kt-badge kt-badge--xl kt-badge--danger">`+ v.name.slice(0, 1).toUpperCase() + `</div>
                             </div>		
                    <div class="kt-user-card-v2__details">	
                   <a href="#" class="kt-user-card-v2__name">`+ v.name + `</a>
                 
                   </div>			
                               </div>
                               </span>
                               </td>
                               <td class="kt-datatable__cell">`+ v.mobile + `</td>
                               <td class="kt-datatable__cell">`+ v.pendingamount + `</td>
                             
                               </tr>`;
                        break;
                    case 3:
                        row = `<tr  class="kt-datatable__row" ><td  class="kt-datatable__cell">
                        <span>
                       <div class="kt-user-card-v2">
                       <div class="kt-user-card-v2__pic">
                         <div class="kt-badge kt-badge--xl kt-badge--primary">`+ v.name.slice(0, 1).toUpperCase() + `</div>
                             </div>		
                    <div class="kt-user-card-v2__details">	
                   <a href="#" class="kt-user-card-v2__name">`+ v.name + `</a>
                 
                   </div>			
                               </div>
                               </span>
                               </td>
                               <td class="kt-datatable__cell">`+ v.mobile + `</td>
                               <td class="kt-datatable__cell">`+ v.pendingamount + `</td>
                             
                               </tr>`;
                        break;
                    case 4:
                        row = `<tr  class="kt-datatable__row" ><td  class="kt-datatable__cell">
                        <span>
                       <div class="kt-user-card-v2">
                       <div class="kt-user-card-v2__pic">
                         <div class="kt-badge kt-badge--xl kt-badge--warning">`+ v.name.slice(0, 1).toUpperCase() + `</div>
                             </div>		
                    <div class="kt-user-card-v2__details">	
                   <a href="#" class="kt-user-card-v2__name">`+ v.name + `</a>
                 
                   </div>			
                               </div>
                               </span>
                               </td>
                               <td class="kt-datatable__cell">`+ v.mobile + `</td>
                               <td class="kt-datatable__cell">`+ v.pendingamount + `</td>
                             
                               </tr>`;
                        break;
                }
                color++;
                if (color == 4) {
                    color = 1;
                }

                $('#gvsupplierbalancelist tbody').append(row);
            })


        }

    })
}
function top3salesproduct() {
    let daterange_from_to = $('#txtdaterange').val().split('/');

    let data = {
        fromdate: Converdate(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        todate: Converdate(moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
    }
    $.ajax({
        url: '/dashboard/top3productsales',
        dataType: "json",
        type: "post",
        data: data,
        success: function (data) {

            let total = data.totalsalesqtydeatils[0].itemsSold;

            let piechartvalues = [];
            let piechartlables = [];


            if (data.salesproductdetails.length == 3) {


                piechartvalues.push(parseFloat((data.salesproductdetails[0].saleqty / total) * 100).toFixed(2), parseFloat((data.salesproductdetails[1].saleqty / total) * 100).toFixed(2), parseFloat((data.salesproductdetails[2].saleqty / total) * 100).toFixed(2))
                piechartlables.push(data.salesproductdetails[0].name, data.salesproductdetails[1].name, data.salesproductdetails[2].name)
                $('#product1').html((data.salesproductdetails[0].saleqty) + ' ' + data.salesproductdetails[0].name)
                $('#product2').html(((data.salesproductdetails[1].saleqty)) + ' ' + data.salesproductdetails[1].name)
                $('#product3').html(((data.salesproductdetails[2].saleqty)) + ' ' + data.salesproductdetails[2].name)
                top3salesproductchart(piechartvalues, piechartlables)
            }
            if (data.salesproductdetails.length == 2) {
                piechartvalues.push(parseFloat((data.salesproductdetails[0].saleqty / total) * 100).toFixed(2), parseFloat((data.salesproductdetails[1].saleqty / total) * 100).toFixed(2))
                piechartlables.push(data.salesproductdetails[0].name, data.salesproductdetails[1].name)
                $('#product1').html(parseFloat((data.salesproductdetails[0].saleqty / total) * 100).toFixed(2) + '% ' + data.salesproductdetails[0].name)
                $('#product2').html(parseFloat((data.salesproductdetails[1].saleqty / total) * 100).toFixed(2) + '% ' + data.salesproductdetails[1].name)

                top3salesproductchart(piechartvalues, piechartlables)
                $('#product2').hide()
                $('#product2bullet').hide()
            }
            if (data.salesproductdetails.length == 1) {
                piechartvalues.push(parseFloat((data.salesproductdetails[0].saleqty / total) * 100).toFixed(2))
                piechartlables.push(data.salesproductdetails[0].name)
                $('#product1').html(parseFloat((data.salesproductdetails[0].saleqty / total) * 100).toFixed(2) + '% ' + data.salesproductdetails[0].name)

                top3salesproductchart(piechartvalues, piechartlables)
                $('#product2').hide()
                $('#product2bullet').hide()
                $('#product2').hide()
                $('#product2bullet').hide()
                $('#product3').hide()
                $('#product3bullet').hide()
            }





        }


    })

}
function top3salesproductchart(piechartvalues, piechartlables) {
    if (!KTUtil.getByID('top3_profit_share')) {
        return;
    }

    var randomScalingFactor = function () {
        return Math.round(Math.random() * 100);
    };

    var config = {
        type: 'doughnut',
        data: {
            datasets: [{
                // data: [
                //     35, 30, 35
                // ],
                data: piechartvalues,
                backgroundColor: [
                    KTApp.getStateColor('success'),
                    KTApp.getStateColor('danger'),
                    KTApp.getStateColor('brand')
                ]
            }],
            // labels: [
            //     'Angular',
            //     'CSS',
            //     'HTML'
            // ]
            labels: piechartlables
        },
        options: {
            cutoutPercentage: 75,
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: false,
                text: 'Technology'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            },
            tooltips: {
                enabled: true,
                intersect: false,
                mode: 'nearest',
                bodySpacing: 5,
                yPadding: 10,
                xPadding: 10,
                caretPadding: 0,
                displayColors: false,
                backgroundColor: KTApp.getStateColor('brand'),
                titleFontColor: '#ffffff',
                cornerRadius: 4,
                footerSpacing: 0,
                titleSpacing: 0
            }
        }
    };

    var ctx = KTUtil.getByID('top3_profit_share').getContext('2d');
    var myDoughnut = new Chart(ctx, config);
}
function top3expenses() {
    let daterange_from_to = $('#txtdaterange').val().split('/');

    let data = {
        fromdate: Converdate(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        todate: Converdate(moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
    }
    $.ajax({
        url: '/dashboard/top3expenses',
        dataType: "json",
        type: "post",
        data: data,
        success: function (data) {

            let piechartvalues = [];
            let piechartlables = [];

            let total = data.expenseamount;


            if (data.expensedata.length == 3) {
                piechartvalues.push(parseFloat((data.expensedata[0].expenseamount / total) * 100).toFixed(2), parseFloat((data.expensedata[1].expenseamount / total) * 100).toFixed(2), parseFloat((data.expensedata[2].expenseamount / total) * 100).toFixed(2))
                piechartlables.push(data.expensedata[0].name, data.expensedata[1].name, data.expensedata[2].name)
                $('#expense1').html(data.expensedata[0].name)
                $('#expense2').html(data.expensedata[1].name)
                $('#expense3').html(data.expensedata[2].name)

                $('#expense1amount').html(data.expensedata[0].expenseamount)
                $('#expense2amount').html(data.expensedata[1].expenseamount)
                $('#expense3amount').html(data.expensedata[2].expenseamount)
                top3expenseschart(piechartvalues, piechartlables)

            }

            if (data.expensedata.length == 2) {
                piechartvalues.push(parseFloat((data.expensedata[0].expenseamount / total) * 100).toFixed(2), parseFloat((data.expensedata[1].expenseamount / total) * 100).toFixed(2))
                piechartlables.push(data.expensedata[0].name, data.expensedata[1].name)
                $('#expense1').html(data.expensedata[0].name)
                $('#expense2').html(data.expensedata[1].name)


                $('#expense1amount').html(data.expensedata[0].expenseamount)
                $('#expense2amount').html(data.expensedata[1].expenseamount)


                $('#expense3').hide()
                $('#expense3bullet').hide()
                top3expenseschart(piechartvalues, piechartlables)

            }
            if (data.expensedata.length == 1) {

                piechartvalues.push(parseFloat((data.expensedata[0].expenseamount / total) * 100).toFixed(2))
                piechartlables.push(data.expensedata[0].name, data)
                $('#expense1').html(data.expensedata[0].name)



                $('#expense1amount').html(data.expensedata[0].expenseamount)



                $('#expense2').hide()
                $('#expense3').hide()
                $('#expense3bullet').hide()
                $('#expense2bullet').hide()
                top3expenseschart(piechartvalues, piechartlables)

            }


        }


    })

}
function top3expenseschart(piechartvalues, piechartlables) {

    if (!KTUtil.getByID('top3_expense_chart')) {
        return;
    }

    var randomScalingFactor = function () {
        return Math.round(Math.random() * 100);
    };

    var config = {
        type: 'doughnut',
        data: {
            datasets: [{
                // data: [
                //     35, 30, 35
                // ],
                data: piechartvalues,
                backgroundColor: [
                    KTApp.getStateColor('success'),
                    KTApp.getStateColor('danger'),
                    KTApp.getStateColor('brand')
                ]
            }],
            // labels: [
            //     'Angular',
            //     'CSS',
            //     'HTML'
            // ]
            labels: piechartlables
        },
        options: {
            cutoutPercentage: 75,
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: false,
                text: 'Technology'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            },
            tooltips: {
                enabled: true,
                intersect: false,
                mode: 'nearest',
                bodySpacing: 5,
                yPadding: 10,
                xPadding: 10,
                caretPadding: 0,
                displayColors: false,
                backgroundColor: KTApp.getStateColor('danger'),
                titleFontColor: '#ffffff',
                cornerRadius: 4,
                footerSpacing: 0,
                titleSpacing: 0
            }
        }
    };

    var ctx = KTUtil.getByID('top3_expense_chart').getContext('2d');
    var myDoughnut = new Chart(ctx, config);
}
function saleslist() {
    let daterange_from_to = $('#txtdaterange').val().split('/');

    let data = {
        fromdate: Converdate(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        todate: Converdate(moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
    }
    $.ajax({
        url: '/dashboard/saleslist',
        dataType: "json",
        type: "post",
        data: data,
        success: function (data) {

            $('#gvCustomerbalancelist tbody').empty();

            let color = 1;
            $.each(data.data, (i, v) => {

                let row = '';
                let duestatuscolum = '';
                let duedays = '';
                if (v.duedays > 0) {
                    duedays = '<span class="kt-widget4__number kt-font-brand">' + v.duedays + '</span>'
                }
                else {
                    duedays = '<span class="kt-widget4__number kt-font-danger">' + v.duedays + '</span>'
                }

                if (v.status == 'Due') {
                    duestatuscolum = '<span style="color: #fff;"  class="kt-badge kt-badge--info  kt-badge--inline kt-badge--pill">' + v.status + '</span>';
                } else if (v.status == 'OverDue') {
                    duestatuscolum = '<span style="color: #fff;"  class="kt-badge kt-badge--danger  kt-badge--inline kt-badge--pill">' + v.status + '</span>';
                }
                switch (color) {
                    case 1:
                        row = `<tr><td>
                        <span>
                       <div class="kt-user-card-v2">
                       <div class="kt-user-card-v2__pic">
                         <div class="kt-badge kt-badge--xl kt-badge--success">`+ v.customer.name.slice(0, 1).toUpperCase() + `</div>
                             </div>		
                    <div class="kt-user-card-v2__details">	
                   <a href="#" class="kt-user-card-v2__name">`+ v.customer.name + `</a>
                 
                   </div>			
                               </div>
                               </span>
                               </td>
                               <td >`+ v.invoiceno + `</td>
                               <td >`+ duedays + `</td>
                               <td >`+ v.balancedueamount + `</td>
                             
                               <td >`+ duestatuscolum + `</td>
                               </tr>`;
                        break;
                    case 2:
                        row = `<tr><td>
                        <span>
                       <div class="kt-user-card-v2">
                       <div class="kt-user-card-v2__pic">
                         <div class="kt-badge kt-badge--xl kt-badge--danger">`+ v.customer.name.slice(0, 1).toUpperCase() + `</div>
                             </div>		
                    <div class="kt-user-card-v2__details">	
                   <a href="#" class="kt-user-card-v2__name">`+ v.customer.name + `</a>
                 
                   </div>			
                               </div>
                               </span>
                               </td>
                               <td >`+ v.invoiceno + `</td>
                               <td >`+ duedays + `</td>
                               <td >`+ v.balancedueamount + `</td>
                             
                               <td >`+ duestatuscolum + `</td>
                               </tr>`;
                        break;
                    case 3:
                        row = `<tr><td>
                        <span>
                       <div class="kt-user-card-v2">
                       <div class="kt-user-card-v2__pic">
                         <div class="kt-badge kt-badge--xl kt-badge--primary">`+ v.customer.name.slice(0, 1).toUpperCase() + `</div>
                             </div>		
                    <div class="kt-user-card-v2__details">	
                   <a href="#" class="kt-user-card-v2__name">`+ v.customer.name + `</a>
                 
                   </div>			
                               </div>
                               </span>
                               </td>
                               <td >`+ v.invoiceno + `</td>
                               <td >`+ duedays + `</td>
                               <td >`+ v.balancedueamount + `</td>
                             
                               <td >`+ duestatuscolum + `</td>
                               </tr>`;
                        break;
                    case 4:

                        row = `<tr><td>
                        <span>
                       <div class="kt-user-card-v2">
                       <div class="kt-user-card-v2__pic">
                         <div class="kt-badge kt-badge--xl kt-badge--warning">`+ v.customer.name.slice(0, 1).toUpperCase() + `</div>
                             </div>		
                    <div class="kt-user-card-v2__details">	
                   <a href="#" class="kt-user-card-v2__name">`+ v.customer.name + `</a>
                   </div>			
                               </div>
                               </span>
                               </td>
                               <td >`+ v.invoiceno + `</td>
                               <td >`+ duedays + `</td>
                               <td >`+ v.balancedueamount + `</td>
                               <td >`+ duestatuscolum + `</td>
                               </tr>`;
                        break;
                }
                color++;
                if (color == 5) {
                    color = 1;
                }

                $('#gvCustomerbalancelist tbody').append(row);
            })


        }

    })
}
function purchaselist() {
    let daterange_from_to = $('#txtdaterange').val().split('/');

    let data = {
        fromdate: Converdate(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        todate: Converdate(moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
    }
    $.ajax({
        url: '/dashboard/purchaselist',
        dataType: "json",
        type: "post",
        data: data,
        success: function (data) {

            $('#gvsupplierbalancelist tbody').empty();

            let color = 1;
            $.each(data.data, (i, v) => {

                let row = '';
                let duedays = '';
                if (v.duedays > 0) {
                    duedays = '<span class="kt-widget4__number kt-font-brand">' + v.duedays + '</span>'
                }
                else {
                    duedays = '<span class="kt-widget4__number kt-font-danger">' + v.duedays + '</span>'
                }
                let duestatuscolum = '';
                if (v.status == 'Due') {
                    duestatuscolum = '<span style="color: #fff;"  class="kt-badge kt-badge--info  kt-badge--inline kt-badge--pill">' + v.status + '</span>';
                } else if (v.status == 'OverDue') {
                    duestatuscolum = '<span style="color: #fff;"  class="kt-badge kt-badge--danger  kt-badge--inline kt-badge--pill">' + v.status + '</span>';
                }
                switch (color) {
                    case 1:
                        row = `<tr  class="kt-datatable__row" ><td  class="kt-datatable__cell">
                        <span>
                       <div class="kt-user-card-v2">
                       <div class="kt-user-card-v2__pic">
                         <div class="kt-badge kt-badge--xl kt-badge--success">`+ v.Supplier.name.slice(0, 1).toUpperCase() + `</div>
                             </div>		
                    <div class="kt-user-card-v2__details">	
                   <a href="#" class="kt-user-card-v2__name">`+ v.Supplier.name + `</a>
                 
                   </div>			
                               </div>
                               </span>
                               </td>
                               <td class="kt-datatable__cell">`+ v.purchaseorderno + `</td>
                               <td class="kt-datatable__cell">`+ duedays + `</td>
                               <td class="kt-datatable__cell">`+ v.dueamount + `</td>
                             
                               <td class="kt-datatable__cell">`+ duestatuscolum + `</td>
                               </tr>`;
                        break;
                    case 2:
                        row = `<tr  class="kt-datatable__row" ><td  class="kt-datatable__cell">
                        <span>
                       <div class="kt-user-card-v2">
                       <div class="kt-user-card-v2__pic">
                         <div class="kt-badge kt-badge--xl kt-badge--danger">`+ v.Supplier.name.slice(0, 1).toUpperCase() + `</div>
                             </div>		
                    <div class="kt-user-card-v2__details">	
                   <a href="#" class="kt-user-card-v2__name">`+ v.Supplier.name + `</a>
                 
                   </div>			
                               </div>
                               </span>
                               </td>
                               <td class="kt-datatable__cell">`+ v.purchaseorderno + `</td>
                               <td class="kt-datatable__cell">`+ duedays + `</td>
                               <td class="kt-datatable__cell">`+ v.dueamount + `</td>
                               <td class="kt-datatable__cell">`+ duestatuscolum + `</td>
                               </tr>`;
                        break;
                    case 3:
                        row = `<tr  class="kt-datatable__row" ><td  class="kt-datatable__cell">
                        <span>
                       <div class="kt-user-card-v2">
                       <div class="kt-user-card-v2__pic">
                         <div class="kt-badge kt-badge--xl kt-badge--primary">`+ v.Supplier.name.slice(0, 1).toUpperCase() + `</div>
                             </div>		
                    <div class="kt-user-card-v2__details">	
                   <a href="#" class="kt-user-card-v2__name">`+ v.Supplier.name + `</a>
                 
                   </div>			
                               </div>
                               </span>
                               </td>
                               <td class="kt-datatable__cell">`+ v.purchaseorderno + `</td>
                               <td class="kt-datatable__cell">`+ duedays + `</td>
                               <td class="kt-datatable__cell">`+ v.dueamount + `</td>
                             
                               <td class="kt-datatable__cell">`+ duestatuscolum + `</td>
                               </tr>`;
                        break;
                    case 4:

                        row = `<tr  class="kt-datatable__row" ><td  class="kt-datatable__cell">
                        <span>
                       <div class="kt-user-card-v2">
                       <div class="kt-user-card-v2__pic">
                         <div class="kt-badge kt-badge--xl kt-badge--warning">`+ v.Supplier.name.slice(0, 1).toUpperCase() + `</div>
                             </div>		
                    <div class="kt-user-card-v2__details">	
                   <a href="#" class="kt-user-card-v2__name">`+ v.Supplier.name + `</a>
                 
                   </div>			
                               </div>
                               </span>
                               </td>
                               <td class="kt-datatable__cell">`+ v.purchaseorderno + `</td>
                               <td class="kt-datatable__cell">`+ duedays + `</td>
                               <td class="kt-datatable__cell">`+ v.dueamount + `</td>
                             
                               <td class="kt-datatable__cell">`+ duestatuscolum + `</td>
                               </tr>`;
                        break;
                }
                color++;
                if (color == 5) {
                    color = 1;
                }

                $('#gvsupplierbalancelist tbody').append(row);
            })


        }

    })
}
function incomeexpenselist() {
    var daterange_from_to = $('#txtdaterange').val().split('/');
    let data = {
        fromdate: Converdate(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        todate: Converdate(moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        datecount: IP_dateDiff(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY"), moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY"), 'DD-MM-YYYY', false)
    }

    $.ajax({
        url: '/dashboard/incomevsexpense',
        dataType: "json",
        type: "post",
        data: data,
        success: function (data) {
            console.log(data)

            if (IP_dateDiff(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY"), moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY"), 'DD-MM-YYYY', false) <= 31) {
                let DateNames = [];
                let Expenses = [];
                let Incomes = [];

                let month = '';
                let expenseamount = '';
                let incomeamount = '';
                (function () {
                    if (typeof Object.defineProperty === 'function') {
                        try { Object.defineProperty(Array.prototype, 'sortBy', { value: sb }); } catch (e) { }
                    }
                    if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

                    function sb(f) {
                        for (var i = this.length; i;) {
                            var o = this[--i];
                            this[i] = [].concat(f.call(o, o, i), o);
                        }
                        this.sort(function (a, b) {
                            for (var i = 0, len = a.length; i < len; ++i) {
                                if (a[i] != b[i]) return a[i] < b[i] ? -1 : 1;
                            }
                            return 0;
                        });
                        for (var i = this.length; i;) {
                            this[--i] = this[i][this[i].length - 1];
                        }
                        return this;
                    }
                })();
                $.each(data.expensedata, (i, v) => {
                    let date = {
                        date: v.entrydate
                    }
                    DateNames.push(date);
                })

                $.each(data.purchasedata, (i, v) => {
                    let datematched = DateNames.find(element => (element.date) == (v.purchasedate))
                    if (datematched == undefined) {
                        let date = {
                            date: v.purchasedate
                        }
                        DateNames.push(date);

                    }

                })
                $.each(data.salesdata, (i, v) => {
                    let datematched = DateNames.find(element => element.date == v.invoicedate)
                    if (datematched == undefined) {

                        let date = {
                            date: v.invoicedate
                        }
                        DateNames.push(date);

                    }

                })
                $.each(DateNames, (i, v) => {

                    let dateToFormat = v.date;

                    DateNames[i].date = moment(moment(v.date, 'DD-MM-YYYY')).format("YYYY-MM-DD")
                })
                let sample = DateNames.sortBy(function () { return this.date });

                let DateLabels = [];
                $.each(sample, (i, v) => {

                    let dateToFormat = v.date;

                    let date = moment(moment(v.date, 'YYYY-MM-DD')).format("DD-MM-YYYY")
                    DateLabels.push(date)
                })

                $.each(data.purchasedata, (i, v) => {
                    $.each(DateLabels, (j, z) => {

                        let expensedetails = data.expensedata.find(element => element.formated_date == z)


                        if (v.formated_date == z) {

                            Expenses[j] = v.total + (expensedetails == undefined ? 0 : expensedetails.total);
                        }
                        else {
                            if (expensedetails != undefined) {
                                if (expensedetails.formated_date == z) {

                                    Expenses[j] = expensedetails == undefined ? 0 : expensedetails.total;
                                }
                            }

                        }


                    })


                })

                $.each(data.salesdata, (i, v) => {
                    $.each(DateLabels, (j, z) => {
                        if (v.formated_date == z) {
                            Incomes[j] = v.total;
                        }
                    })

                })
                $.each(Incomes, (i, v) => {
                    if (v == null) {
                        Incomes[i] = 0;
                    }
                })
                $.each(Expenses, (i, v) => {
                    if (v == null) {
                        Expenses[i] = 0;
                    }
                })


                let largestamount = 0;
                let smallestamount = 0;

                if (Math.max.apply(Math, Expenses) > Math.max.apply(Math, Incomes)) {
                    largestamount = Math.max.apply(Math, Expenses);
                    smallestamount = Math.min.apply(Math, Incomes);
                }
                else {
                    largestamount = Math.max.apply(Math, Incomes);
                    smallestamount = Math.min.apply(Math, Incomes);
                }





                console.log(DateLabels)


                incomevsexpensechart(DateLabels, Expenses, Incomes, largestamount, smallestamount)
            }
            else {

                let Monthnames = [];
                let Expenses = [];
                let Incomes = [];
                let month = '';
                let expenseamount = '';
                let incomeamount = '';
                $.each(data.purchasedata, (i, v) => {

                    let expensedata = data.expensedata.find(element => element.month === v.month);
                    let salesdata = data.salesdata.find(element => element.month === v.month)
                    switch (v.month) {
                        case 1:
                            month = 'January'
                            expenseamount = v.total + (expensedata == undefined ? 0 : expensedata.total);
                            incomeamount = salesdata == undefined ? 0 : salesdata.total
                            break
                        case 2:
                            month = 'February'
                            expenseamount = v.total + (expensedata == undefined ? 0 : expensedata.total);
                            incomeamount = salesdata == undefined ? 0 : salesdata.total
                            break
                        case 3:
                            month = 'March'
                            expenseamount = v.total + (expensedata == undefined ? 0 : expensedata.total);
                            incomeamount = salesdata == undefined ? 0 : salesdata.total

                            break
                        case 4:
                            month = 'April'
                            expenseamount = v.total + (expensedata == undefined ? 0 : expensedata.total);
                            incomeamount = salesdata == undefined ? 0 : salesdata.total
                            break
                        case 5:
                            month = 'May'
                            expenseamount = v.total + (expensedata == undefined ? 0 : expensedata.total);
                            incomeamount = salesdata == undefined ? 0 : salesdata.total
                            break
                        case 6:
                            month = 'June'
                            expenseamount = v.total + (expensedata == undefined ? 0 : expensedata.total);
                            incomeamount = salesdata == undefined ? 0 : salesdata.total
                            break
                        case 7:
                            month = 'July'
                            expenseamount = v.total + (expensedata == undefined ? 0 : expensedata.total);
                            incomeamount = salesdata == undefined ? 0 : salesdata.total
                            break
                        case 8:
                            month = 'Augest'
                            expenseamount = v.total + (expensedata == undefined ? 0 : expensedata.total);
                            incomeamount = salesdata == undefined ? 0 : salesdata.total
                            break
                        case 9:
                            month = 'September'
                            expenseamount = v.total + (expensedata == undefined ? 0 : expensedata.total);
                            incomeamount = salesdata == undefined ? 0 : salesdata.total
                            break
                        case 10:
                            month = 'Octember'
                            expenseamount = v.total + (expensedata == undefined ? 0 : expensedata.total);
                            incomeamount = salesdata == undefined ? 0 : salesdata.total
                            break
                        case 11:
                            month = 'November'
                            expenseamount = v.total + (expensedata == undefined ? 0 : expensedata.total);
                            incomeamount = salesdata == undefined ? 0 : salesdata.total
                            break
                        case 12:
                            month = 'December'
                            expenseamount = v.total + (expensedata == undefined ? 0 : expensedata.total);
                            incomeamount = salesdata == undefined ? 0 : salesdata.total
                            break
                    }
                    Monthnames.push(month)
                    Expenses.push(expenseamount)
                    Incomes.push(incomeamount)


                })
                let largestamount = 0;
                let smallestamount = 0;

                if (Math.max.apply(Math, Expenses) > Math.max.apply(Math, Incomes)) {
                    largestamount = Math.max.apply(Math, Expenses);
                    smallestamount = Math.min.apply(Math, Incomes);
                }
                else {
                    largestamount = Math.max.apply(Math, Incomes);
                    smallestamount = Math.min.apply(Math, Incomes);
                }


                incomevsexpensechart(Monthnames, Expenses, Incomes, largestamount, smallestamount)
            }

        }

    })
}
function incomevsexpensechart(Monthnames, Expenses, Incomes, largestamount, smallestamount) {

    $('#chart_income_expense_content').empty()
    $('#chart_income_expense_content').append(' <canvas id="chart_income_expense" width="1594" height="375" class="chartjs-render-monitor" style="display: block; height: 250px; width: 1063px;"></canvas>');

    var container = KTUtil.getByID('chart_income_expense');

    if (!container) {
        return;
    }


    var color = Chart.helpers.color;
    var barChartData = {
        labels: Monthnames,
        datasets: [
            {
                //income
                fill: true,

                //borderWidth: 0,
                backgroundColor: color(KTApp.getStateColor('brand')).alpha(0.6).rgbString(),
                borderColor: color(KTApp.getStateColor('brand')).alpha(0).rgbString(),
                pointHoverRadius: 4,
                pointHoverBorderWidth: 12,
                pointBackgroundColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
                pointBorderColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
                pointHoverBackgroundColor: KTApp.getStateColor('brand'),
                pointHoverBorderColor: Chart.helpers.color('#000000').alpha(0.1).rgbString(),

                // data: [20, 30, 20, 40, 30, 60, 30]
                data: Incomes
            },
            {

                //expense
                fill: true,
                //borderWidth: 0,
                backgroundColor: color(KTApp.getStateColor('danger')).alpha(0.2).rgbString(),
                borderColor: color(KTApp.getStateColor('danger')).alpha(0).rgbString(),
                pointHoverRadius: 4,
                pointHoverBorderWidth: 12,
                pointBackgroundColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
                pointBorderColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
                pointHoverBackgroundColor: KTApp.getStateColor('danger'),
                pointHoverBorderColor: Chart.helpers.color('#000000').alpha(0.1).rgbString(),
                // data: [15, 40, 15, 30, 40, 30, 50]
                data: Expenses
            }
        ]
    };

    var ctx = container.getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: barChartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: false,
            scales: {
                xAxes: [{
                    categoryPercentage: 0.35,
                    barPercentage: 0.70,
                    display: true,
                    scaleLabel: {
                        display: false,
                        labelString: 'Month'
                    },
                    gridLines: false,
                    ticks: {
                        display: true,
                        beginAtZero: true,
                        fontColor: KTApp.getBaseColor('shape', 3),
                        fontSize: 13,
                        padding: 10
                    }
                }],
                yAxes: [{
                    categoryPercentage: 0.35,
                    barPercentage: 0.70,
                    display: true,
                    scaleLabel: {
                        display: false,
                        labelString: 'Value'
                    },
                    gridLines: {
                        color: KTApp.getBaseColor('shape', 2),
                        drawBorder: false,
                        offsetGridLines: false,
                        drawTicks: false,
                        borderDash: [3, 4],
                        zeroLineWidth: 1,
                        zeroLineColor: KTApp.getBaseColor('shape', 2),
                        zeroLineBorderDash: [3, 4]
                    },
                    ticks: {
                        max: largestamount + (largestamount * 10 / 100),
                        // largestamount                          
                        stepSize: (smallestamount + largestamount) / 5,
                        display: true,
                        beginAtZero: true,
                        fontColor: KTApp.getBaseColor('shape', 3),
                        fontSize: 13,
                        padding: 10
                    }
                }]
            },
            title: {
                display: false
            },
            hover: {
                mode: 'index'
            },
            tooltips: {
                enabled: true,
                intersect: false,
                mode: 'nearest',
                bodySpacing: 5,
                yPadding: 10,
                xPadding: 10,
                caretPadding: 0,
                displayColors: false,
                backgroundColor: KTApp.getStateColor('brand'),
                titleFontColor: '#ffffff',
                cornerRadius: 4,
                footerSpacing: 0,
                titleSpacing: 0
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 5,
                    bottom: 5
                }
            }
        }
    });
}
function top10salesproduct() {
    let daterange_from_to = $('#txtdaterange').val().split('/');

    let data = {
        fromdate: Converdate(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        todate: Converdate(moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
    }
    $.ajax({
        url: '/dashboard/top10sellingproducts',
        dataType: "json",
        type: "post",
        data: data,
        success: function (data) {
            console.log(data)
            console.log(data.salesproductdetails[0])
            console.log(data.salesproductdetails[0].name)
            $('#gvtop10productlist tbody').empty();


            $.each(data.salesproductdetails, (i, v) => {
                let sno = i + 1
                let row = '';
                row = `<tr>
                <td >`+ sno + `</td>
                <td> `+ v.name + `</td>
                <td >`+ v.saleqty + `</td>
                </tr>`;
                $('#gvtop10productlist tbody').append(row);
            })

        }
    })

}
function incomemusthfirmethod() {
    let daterange_from_to = $('#txtdaterange').val().split('/');

    let data = {
        fromdate: Converdate(moment(moment(daterange_from_to[0], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
        todate: Converdate(moment(moment(daterange_from_to[1], 'DD-MM-YYYY')).format("DD-MM-YYYY")),
    }
    $.ajax({
        url: '/dashboard/profit_musthifr_method2',
        dataType: "json",
        type: "post",
        data: data,
        success: function (data) {
            var totalpurchasenew= 0;
            var totalsalesnew= 0;
            var totalclosingstocknew= 0;
            $.each(data, (i, v) => {
               
                totalpurchasenew = totalpurchasenew +  (v.purchaseprice * v.openingstock);
                totalsalesnew = totalsalesnew + (v.salesprice * v.salesqty);
                totalclosingstocknew = totalclosingstocknew + (v.purchaseprice * v.closingstock)
            })
           
           
            
            $('#lblexpense_income_expense').text(parseFloat(totalpurchasenew).toFixed(2))   
            $('#lblsales_income_expense').text(parseFloat(totalsalesnew+totalclosingstocknew).toFixed(2)) 
            $('#lblrevenue_income_expense').text(parseFloat((totalsalesnew+totalclosingstocknew)-totalpurchasenew).toFixed(2)) 
              
        }
    })

}