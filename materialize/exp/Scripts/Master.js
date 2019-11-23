var Master = (function () {
    function init() {
        bindFunctions();
    }

    function bindFunctions() {
        
        $('form').on('submit', function () {
            if ($(this).valid()) {
                Master.showLoad();
            }
        });
    };

    function showLoad() {
        $('.page-loader').addClass('active');

    };

    function hideLoad() {
        $('.page-loader').removeClass('active');
    };

    function numberToReal(numero) {
        numero = numero.toFixed(2).split('.');
        numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join(',');
    };

    return {
        init: init,
        showLoad: showLoad,
        hideLoad: hideLoad,
        numberToReal: numberToReal
    };
})();

$(Master.init);
$(window).on('load', Master.hideLoad);