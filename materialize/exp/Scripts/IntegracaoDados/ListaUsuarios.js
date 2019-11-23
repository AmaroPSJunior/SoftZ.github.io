var ListaUsuarios = (function () {

    function init() {
        initCmps();
    }

    function initCmps() {
        $('select').material_select();
        $('.tooltipped').tooltip({ delay: 50 });
        Grid.init();
    }

    return {
        init: init
    };

})();

//$(ListaUsuarios.init);