"use strict";

var PrazosConfiguracoes = (function () {

    function init() {
        functionBase();
        bindFunctions();
    }

    function functionBase() {

    }

    function bindFunctions() {
        $(document).ready(function () {
            $('ul.tabs').tabs();
        });
    }


    return {
        init: init
    };
})();

$(PrazosConfiguracoes.init);

