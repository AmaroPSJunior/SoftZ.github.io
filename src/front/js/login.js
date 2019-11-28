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
        

        // // $.ajax({
        // //     type: "POST",
        // //     url: url,
        // //     data: data,
        // //     dataType: "json",
        // //     contentType: "application/json; charset=utf-8",
        // //     success: function (data) {
        // //         console.log(data);
        // //         alert(data);
        // //     },
        // //     error: function (request, status, errorThrown) {
        // //         alert(status);
        // //     }
        // // });
    }

    return {
        init: init
    };

})();

$(Login.init);

