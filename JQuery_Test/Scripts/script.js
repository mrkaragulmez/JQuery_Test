$(document).ready(function () {
    var myObj;

    $.ajax({
        url: '/Home/GetData',
        type: "GET",
        success: function (result) {
            myObj = JSON.parse(result);
            getData();
            GetUserList();
        }
    });


    function getData() {

        $('<form>', { id: myObj.form.id, action: myObj.form.action }).appendTo("#area");
        $('<p>', { text: myObj.form.text, id: '_formname' }).appendTo('#' + myObj.form.id);

        /* $.each(myObj.forms.items, function (name, index) {}) */
        myObj.form.items.forEach(item => {
            $('<p>', { text: item.text, id: item.id }).appendTo('#' + myObj.form.id);
            item.required == true ? $('#_' + item.id).prop('required', true) : $('#_' + item.id).prop('required', false);

            if (item.controltype != null) {
                if (item.controltype == "text") {
                    $('#' + item.id).after($('<input>', { id: "txt_" + item.id, name: item.name, type: item.datatype, style: 'display:block' }));

                }
                else if (item.controltype == "multiline") {
                    $('#' + item.id).after($('<textarea>', { id: "txt_" + item.id, name: item.name, type: item.datatype, style: 'display:block' }));
                }
                else if (item.controltype == "combo") {
                    $('#' + item.id).after($('<select>', { id: "cmb_" + item.id, name: item.name, style: 'width:12.99%; min-width:8em' }));
                    $('#cmb_' + item.id).change(function () {
                        ClearCmbChildComponent(item, false)
                    })
                    if (item.dependency_stat == true) {
                        $('#cmb_' + item.dependency_cond).change(function () {
                            //$('#cmb_' + item.id).empty();
                            var selectedItem = $(this).val()
                            item.items.filter(x => x.parent_value == selectedItem || x.parent_value == "null").forEach(item2 => {
                                $('#cmb_' + item.id).append($('<option>', { value: item2.value, id: item2.id, text: item2.text }));
                            })
                        });
                    }
                    else {
                        item.items.forEach(item2 => {
                            $('#cmb_' + item.id).append($('<option>', { value: item2.value, id: item2.id, text: item2.text }));
                        })
                    }

                }
                else if (item.controltype == "checkbox") {
                    $('#' + item.id).after($('<input>', { id: "chk_" + item.id, name: item.name, type: item.datatype, style: '' }));
                    $('#chk_' + item.id).after($('<span>', { style: "margin-left:0.5em", id: "chk__", text: item.chkdesc }));
                    $('#chk__').after('<br>');
                }
            }
            else {
                if (item.datatype == "text" || item.datatype == "number") {

                    $('#' + item.id).after($('<input>', { id: "txt_" + item.id, name: item.name, type: item.datatype, style: 'display:block' }));
                }
            }

        });

        var visibiliysubmit = myObj.form.submit.visible == true ? 'visible' : 'hidden';
        var visibiliycancel = myObj.form.cancel.visible == true ? 'visible' : 'hidden';

        $('#new').before($('<input>', { type: "submit", id: myObj.form.submit.name, style: "margin-top:2em;visibility:" + visibiliysubmit, value: "Kaydet" }));

        $('#' + myObj.form.submit.name).after($('<input>', { type: "button", value: 'İptal', id: myObj.form.cancel.name, style: "margin-left:1em; visibility:" + visibiliycancel }));

        ////////////////////////////////////////////AJAX POST/////////////////////////////////////////////////


        $('#' + myObj.form.cancel.name).click(function (e) {
            window.location = "/Home/Kullanicilar";
        })

        $('#' + myObj.form.submit.name).click(function (e) {
            e.preventDefault();

            var jsondata = {}
            jsondata.User = {}
            //jsondata.User.Product = []

            $('#' + myObj.form.id).find('input, select, textarea').each(function (index, item) {
                if ($(this).prop("type") == "checkbox") {
                    jsondata.User[item.name] = $(this).prop("checked");
                }
                else {
                    jsondata.User[item.name] = $(this).val();
                }
            })


            $.ajax({
                type: 'POST',
                url: myObj.form.action,
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({ dataset: jsondata.User, isNew: true }),
                success: function (msg) {
                    alert(msg.message);
                },
                error: function (err) {
                    alert(err.error);
                }
            })
        })
        GetUrunler();
        EditUserKayit();
    };

    function ClearCmbChildComponent(item, isChild) {
        var current = $('#cmb_' + item.id)
        if (!$.isEmptyObject(item.haschild)) {
            var child = myObj.form.items.filter(x => x.id == item.haschild)[0]
            ClearCmbChildComponent(child, true)
        }
        if (isChild) {
            $(current).empty();
        }

    }

    function GetUserList() {
        $('#list').append($("<table>", { id: "userlist", class: "table table-responsive" }).append($("<thead>").append($("<tr>"))))
        $('#userlist thead tr').append($('<td>', { text: "ID" }))
        myObj.form.items.forEach(item => {
            $('#userlist thead tr').append($('<td>', { text: item.text }))
        })
        $('#userlist thead').after($('<tbody>'));

        var jsonlist;
        $.ajax({
            url: '/Home/GetUserList',
            type: "GET",
            success: function (result) {
                jsonlist = JSON.parse(result);
                $.each(jsonlist, function (index, item) {
                    $('#userlist tbody').append($("<tr>", {id: "row"+index}));
                    $.each(item, function (ind, itm) {

                        if (itm == "True") {
                            $("#row" + index).append($("<td>").append($("<p>", { text: "Aktif" })))
                        } else if (itm == "False") {
                            $("#row" + index).append($("<td>").append($("<p>", { text: "Pasif" })))
                        }
                        else {
                            if (ind != "Product") {
                                $("#row" + index).append($("<td>").append($("<p>", { text: itm })))
                            }
                        }

                    })
                    $("#row" + index).append($("<td>").append($("<a>", { href: "/Home/EditKullanici/" + item.ID }).append($("<img>", { src: "https://localhost:44391/Content/edit.png" })))).append($("<td>").append($("<a>", { href: "/Home/SilKullanici?UserId=" + item.ID }).append($("<img>", { src: "https://localhost:44391/Content/delete.png" }))))

                })
            }
        });
    }

    function GetUrunler() {
        $('head').append($('<style>', {
            text: `
                #usertable td, #usertable td input{
                text-align:center;
            }
            `
        })) //genel style 

        $('#urunler').append($('<table>', { class: "table", id: myObj.product.table.id }).append($('<tr>', { id: "headcolumn" })));

        var tablerow = $('#headcolumn');
        tablerow.append($('<td>', { class: "col-md-1 col-sm-1 col-lg-1 col-xs-1" }).append($('<img>', { src: "https://localhost:44391/Content/plus.png", id: "addproc" })));
        $.each(myObj.product.table.columns, function (index, item) {
            tablerow.append($('<td>', { text: item.text, class: "col-md-t col-sm-t col-lg-t col-xs-t".replaceAll("t", item.columngrid) }))
        })
        AddRowToProducts()        
    }

    function AddRowToProducts() {
        $("img#addproc").click(function () {
            setTimeout(() => {
                $('#' + myObj.product.table.id).append($('<tr>').append($('<td>', { class: "col-md-1 col-sm-1 col-lg-1 col-xs-1" }).append($('<img>', { src: "https://localhost:44391/Content/cancel.png", id: "removeprod" }).click(function () { $(this).parent().parent().remove() }))))

                $.each(myObj.product.table.columns, function (index, item) {
                    if (item.type == "combo") {
                        $('#' + myObj.product.table.id + " tr").last().append($('<td>', { class: "col-md-t col-sm-t col-lg-t col-xs-t".replaceAll("t", item.columngrid) }).append($('<select>', { name: item.name })))
                        $.each(item.prodlist, function (index, item) {
                            if (index == 0) {
                                $('#' + myObj.product.table.id + " select").last().append($('<option>', { text: item.text, value: item.value }).attr("disabled", true).attr("selected", true))
                            }
                            else {
                                $('#' + myObj.product.table.id + " select").last().append($('<option>', { text: item.text, value: item.value }))
                            }
                        })
                    }
                    else if (item.type == "textarea") {
                        $('#' + myObj.product.table.id + " tr").last().append($('<td>', { class: "col-md-t col-sm-t col-lg-t col-xs-t".replaceAll("t", item.columngrid) }).append($('<textarea>', { placeholder: item.text, name: item.name })))
                    }
                    else {
                        $('#' + myObj.product.table.id + " tr").last().append($('<td>', { class: "col-md-t col-sm-t col-lg-t col-xs-t".replaceAll("t", item.columngrid) }).append($('<input>', { type: item.type, placeholder: item.text, name: item.name })))
                    }
                })
            }, 50)
        });
    }

    function EditUserKayit() {

        var visibiliysave = myObj.form.save.visible == true ? 'visible' : 'hidden';
        var visibiliycancel = myObj.form.cancel.visible == true ? 'visible' : 'hidden';

        $('#urunler').after($('<input>', { type: "submit", id: myObj.form.save.name, style: "margin-top:2em;visibility:" + visibiliysave, value: "Kaydet" }));

        $('#' + myObj.form.save.name).after($('<input>', { type: "button", value: 'İptal', id: myObj.form.cancel.name, style: "margin-left:1em; visibility:" + visibiliycancel }));

        $('#' + myObj.form.save.name).click(function (e) {
            e.preventDefault();

            var urlPieces = window.location.href.split('/');
            var userId = urlPieces[urlPieces.length - 1];

            var jsondata = {}
            jsondata.User = {}
            jsondata.User.Product = []
            jsondata.User["ID"] = userId;
                
            $('#' + myObj.form.id).find('input, select, textarea').each(function (index, item) {
                if ($(this).prop("type") == "checkbox") {
                    jsondata.User[item.name] = $(this).prop("checked");
                }
                else {
                    jsondata.User[item.name] = $(this).val();
                }
            })


            $('#' + myObj.product.table.id + " >tr ").each(function (index, row) {
                if (index > 0) {
                    var jsonItem = {};
                    $(row).children().each(function (index, column) {
                        $(column).find('input,select,textarea').each(function (index, input) {
                            jsonItem[input.name] = $(input).val();
                        })
                    })

                    jsondata.User.Product.push(jsonItem);
                }
            })


            $.ajax({
                type: 'POST',
                url: myObj.form.action,
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({ dataset: jsondata.User, isNew: false }),
                success: function (msg) {
                    alert(msg.message);
                },
                error: function (err) {
                    alert(err.error);
                }
            })
        })

    }

});