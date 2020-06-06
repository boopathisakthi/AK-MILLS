function assigninvoiceejs(res) {
  
    console.log(res.invoice[0].invoiceno)
    $('.lblinvoiceno').html(res.invoice[0].invoiceno);
alert(res.company.companyname)

    $('.lblinvoicedate').html(res.invoice[0].invoicedate);
    $('.lblinvoiceto').html(res.invoice[0].customer[0].billingaddress);
    var discount = 0;
    let i = 1;
    $('.trbody').empty()
    $('#companyname25').html(res.company.companyname);
    $('#companyaddress').html(res.company.address);
    $('#companycity').html("Salem");
    $('#companystate').html('Tamil Nadu')
    $('#companycountry').html('India')
    $('#companypincode').html(res.company.pincode)
    $('#companygstno').html(res.company.gstno)
    $('#companyemail').html(res.company.email)
    $('#companyphone').html(res.company.phone)

    $('#subcustomername').html(res.invoice[0].customer[0].name)
    $('#subcustomergstno').html(res.invoice[0].customer[0].gstin)
    $('#subcustomerstate').html(res.invoice[0].customer[0].shippingstate)


    $('#customername').html(res.invoice[0].customer[0].name)
    $('#customershippingaddress').html(res.invoice[0].customer[0].shippingaddress)
    $('#customercity').html('Salem')
    $('#customerpincode').html(res.invoice[0].customer[0].shippingpincode)
    $('#customermobile').html(res.invoice[0].customer[0].mobile)
    $('#customeremail').html(res.invoice[0].customer[0].customeremail)
    $('#customergstin').html(res.invoice[0].customer[0].gstin)
    $('#customeremail').html(res.invoice[0].customer[0].email)
    $('#customerstate').html(res.invoice[0].customer[0].shippingstate)
    $('#customerposstate').html(res.invoice[0].customer[0].shippingstate)
    $('#customercountry').html('India')
    $('#invoiceno').html(res.invoice[0].invoiceno)
    $('#invoicedate').html(res.invoice[0].invoicedate)

    $('#taxblevalue').html(res.invoice[0].subtotal)

    res.invoice.forEach((val) => {

        var rowspan = `<tr class="tbody">
            <td width="6%" class="ac">`+ i + `</td>
            <td class="" width="40%">`+ val.invoiceDetail.productdetail[0].productname + `</td>
            <td  width="7%" class="ar">`+ val.invoiceDetail.qty + `</td>
            <td  width="12%" class="ar">Rs.`+ val.invoiceDetail.rate + `/-</td>
            <td width="15%" class="ar"> Rs.`+ val.invoiceDetail.amount + `/-</td>`;
        $('.trbody').append(rowspan);
        discount = discount + val.invoiceDetail.discount;
        i++;
    })

    $('#discountvalue').html(discount);
    $('#totalamount').html(res.invoice[0].total);
    $('.billgstdetails').empty();
    res.invoice[0].gstdetail.forEach((val) => {


        if (val.igst == 0 && val.sgst != 0) {
            var rowspan = `
            
            <tr>
           
            <td  class="ar tax title wrp" colspan="2">SGST `+ val.percentage + `%: </small>
           
            </td>
            <td class="ar tax value wrp"><b>`+ val.sgst + `</b></td>
            </tr>
            <tr> <td  borer="none"  class="ar tax title wrp" colspan="2">CGST `+ val.percentage + ` %: <small></small>
            </td>
            <td class="tax value wrp"><b>`+ val.cgst + `</b></td></tr>
            `;

        }
        else {
            if (val.igst != 0) {
                var rowspan = `
            
                <tr>
                <td></td> <td borer="none" class="ar tax title wrp" colspan="1">IGST `+ (val.percentage + val.percentage) + `%: </small>
               
                </td>
                <td class="tax value wrp"><b>`+ val.igst + `</b></td>
                <td></td></tr>
               
                `;
            }

        }
        $('.billgstdetails').append(rowspan);

        i++;
    })
    let totalamount = `    <tr >
    <!-- td class="total value vam wrp" style="border-top: 0.5px solid #000000"><b>Total</b></td -->
    <td class="ar total value vam wrp npr" colspan="4" style="background-color:#9a9a9a">
        <small><b>Total&nbsp;&nbsp;&nbsp;</b></small><b style="margin-right:25%">Rs
          `+ res.invoice[0].total + `</b></td>
</tr>  `;
    $('.billgstdetails').append(totalamount);
    $('#totalamountinwords').html(number2words(res.invoice[0].total) + ' Only')
 
    // $('.list').hide();
}