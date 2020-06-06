$(document).ready(() => {
    BindddlData('#ddlcategories', '/master/categoryddllist');
    BindddlData('#ddlattributescategory', '/master/categoryddllist');
    $('.dropdownvalues').hide()
    BindddlData('#ddltax', '/master/taxdropdown');
    BindddlData('#ddlunit', '/master/unitdropdown/')
   
   
   
   
    getitemcode()

})
function getitemcode()
{
  
        $.ajax({
            type: "GET",
            url: '/master/productitemcode',
            success: function (data) {
  
                $('#txtitemcode').val(data.itemcode)
            },
            error: function (errormessage) {
                toastr.error(errormessage.responseText);
            }
        })
        return false
    
}
function showproductentry()
{
    alert($('#hf_ctrl').val())
    $('#modelproductdetails').modal('show')
        
}
function producttype()
{
  
    if ($('#ddlproducttype').val() == 'goods') {
      
        $('.goods').show()
    }
    else  {
      
        $('.goods').hide()
    }
}

function productcleardata() {
   
    $('#hf_id').val('');
    $('#txtproductname').val('');
    $('#txtitemcode').val('');
    $('#ddlunit').val('')
    $("#ddlproducttype").val('goods')
    $('#chbxtaxinclusive').val('false')
    $('#txtsaleprice').val('')
    $('#txtpurchaseprice').val('')
    $('#txtmrp').val('')
    $('#ddltax').val('')
    $('#txthsn_sac_code').val('')
    $('#ddlcategories').val('')
    $('#ddlsubcategories').val('')
    $('#txtminimumstock').val('')
    $('#txtopeningstock').val('')
    getitemcode()
}

function saveproduct_process()
{
    if ($('#txtproductname').val() == '') {
        toastr.error('Invalid productname ')
        return false;
    }
    if ($('#ddlunit').val() == '') {
        toastr.error('Invalid unit')
        return false;
    }
    if ($('#txthsn_sac_code').val() == '') {
        toastr.error('Invalid hsn_sac code')
        return false;
    }
    if ($('#txtsalesprice').val() == '') {
        toastr.error('Invalid sales price')
        return false;
    }
  
    if ($("#ddlproducttype").val() == "goods") {
       
        if ($('#txtpurchaseprice').val() == '') {
            toastr.error('Invalid purchase price')
            return false;
        }
      
      
        if ($('#txtminimumstock').val() == '') {
            toastr.error('Invalid minimumstock')
            return false;
        }
        if ($('#txtopeningstock').val() == '') {
            toastr.error('Invalid Openingstoc ')
            return false;
        }
        
        if ($('#txtmrp').val() == '') {
            toastr.error('Invalid MRP price')
            return false;
        }
        if (parseInt($('#txtpurchaseprice').val()) > parseInt($('#txtsaleprice').val())) {
            toastr.error('sales price  must greater than purchase price')
            return false;
        }
        if (parseInt($('#txtsaleprice').val()) > parseInt($('#txtmrp').val())) {
            toastr.error('MRP price  must greater than sale price')
            return false;
        }
    }



    var data = {
        _id: $('#hf_id').val(),
        productname: $('#txtproductname').val(),
        itemcode: $('#txtitemcode').val(),
        unitid: $('#ddlunit').val(),
        type:$("#ddlproducttype").val() ,
        salesprice: $('#txtsaleprice').val(),
        purchaseprice: $('#txtpurchaseprice').val(),
        mrp: $('#txtmrp').val(),
        taxid: $('#ddltax').val(),
        hsnorsac_code: $('#txthsn_sac_code').val(),
        categoryid: $('#ddlcategories').val(),
        subcategoryid: $('#ddlsubcategories').val(),
        minimumstock: $('#txtminimumstock').val(),
        openingstock: $('#txtopeningstock').val(),
    }
    $.ajax({
        url: '/master/productinstert',
        data: JSON.stringify(data),
        type: 'post',
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function(result) {
            if (result.status == 'success') {
                toastr.success(result.message);
                let ctrl=$('#hf_ctrl').val()
                alert(ctrl)
                ctrl.closest('tr').find('.qty').text('20');
                ctrl.closest('tr').find('.qty').focus();
                $('.goods').show()
                close_product()
            } else {
                toastr.error(result.message);
            }
        },
        error: function(errormessage) {
            toastr.error(errormessage.responseText);
        }
    });
    return false
}
function bindsubcategory() {
    BindddlData('#ddlsubcategories', '/master/subcategoryddllist/' + $('#ddlcategories').val());
}

function close_product()
{
    productcleardata()
    $('#modelproductdetails').modal('toggle');
    //getproductname(id)
}