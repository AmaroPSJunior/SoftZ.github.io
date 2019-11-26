"use strict";

var Login = (function () {

    function init() {
        bindFunctions();
    }

    function bindFunctions() {
        
        $('#go').click(function () {
            authenticate();
        });
    }
    
    function authenticate() {
        var url = 'http://localhost:3001/auth/authenticate';

        var data = {
            email: "leandro@leandro",
            password: "123"
        };

        var data1 = JSON.stringify({ person:{ email: "leandro@leandro", password: "123" } });
        var data2 = JSON.stringify({ person:{ data } });
        var data3 = JSON.stringify({ data });
        

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                console.log(data);
                alert(data);
            },
            error: function (request, status, errorThrown) {
                alert(status);
            }
        });

        $.ajax({
            type: "POST",
            url: url,
            data: data1,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                console.log(data);
                alert(data);
            },
            error: function (request, status, errorThrown) {
                alert(status);
            }
        });

        $.ajax({
            type: "POST",
            url: url,
            data: data2,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                console.log(data);
                alert(data);
            },
            error: function (request, status, errorThrown) {
                alert(status);
            }
        });

        $.ajax({
            type: "POST",
            url: url,
            data: data3,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                console.log(data);
                alert(data);
            },
            error: function (request, status, errorThrown) {
                alert(status);
            }
        });

    


        // new GCS().setObj({
        //     type: 'GET',
        //     processData: true,
        //     contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        //     url: url,
        //     data: {
        //         "email": "leandro@leandro",
        //         "password": "123"
        //     },
        //     showLoad: false,
        //     success: function (data) {

        //        console.log(data);
        //        alert(data);
                
        //     }
        // }).executar();


        // $.post( "ajax/test.html", function( data ) {
        //     $( ".result" ).html( data );
        // });

        
    }

    return {
        init: init
    };

})();

$(Login.init);

