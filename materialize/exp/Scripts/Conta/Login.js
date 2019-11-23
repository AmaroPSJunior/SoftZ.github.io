"use strict";

var Login = (function () {

    var psw = '';

    function init() {
        bindFunctions();

    }

    function bindFunctions() {

        Logar();
        keypress();
    }

    /*function keypress() {

        $('#txtpsw').keyup(function (e) {

            var length = $(this).val().length;
            psw = psw + e.key;
            $(this).val('');

            for (var i = 0; i < length; i++) {

                $(this).val($(this).val() + '*');
            }
        });
    }

    function Logar() {

        $('#go').click(function () {

            $('#Password').val(psw);
            $('#frmLogin')[0].submit();
        });
    }*/

    return {
        init: init
    };

})();

$(Login.init);
