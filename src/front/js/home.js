

"use strict";
var Home = (function () {

    function init() {
        bindFunctions();
    }

    function bindFunctions() {
        loadPage();
    }

    function loadPage() {

        $(document).ready(function(){
            var nome = window.location.hash.replace('#','');
            var result = nome.lastIndexOf('.');
            nome = nome.replace(nome.substr(result), '');	
            console.log(nome);

            $('.nome').html(nome);
            $("nav i").sideNav();
    
            $('#img_perfil').change(function () {
                var img = this.files[0];
                var reader = new FileReader();
    
                reader.onload = function (e) {
    
                    $('.elementoRender').attr('src', e.target.result);
                }
    
                reader.readAsDataURL(img);
            });
        });
    }
      


    return {
        init: init
    };

})();

$(Home.init);

