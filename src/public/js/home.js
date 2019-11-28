

"use strict";

let Home = (function () {

    function init() {
        bindFunctions();
    }

    function bindFunctions() {

        // let
        //     email = window.location.hash,
        //     email = window.location.hash
        // ;
        //authenticate();
        $('body').show();
        loadPage();
    }

    function loadPage() {

        $(document).ready(function(){
            let 
                nome = window.location.hash.replace('#','');
                result = nome.lastIndexOf('.')
            ;

            nome = nome.replace(nome.substr(result), '');	
            console.log(nome);

            $("nav i").sideNav();
    
            $('#img_perfil').change(function () {
                let 
                    img = this.files[0];
                    reader = new FileReader()
                ;
    
                reader.onload = function (e) {
    
                    $('.elementoRender').attr('src', e.target.result);
                }

                reader.readAsDataURL(img);
            });
        });
    }

    function authenticate(email = '', password = '') {
    
        axios.post('http://localhost:3001/auth/authenticate', {
            email,
	        password
        })
        
        .then(function (response) {
            console.log(response);
            $('body').show();
            loadPage();
        })
        
        .catch(function (error) {
            window.location.href = "erro"
        });   
    }
      


    return {
        init: init
    };

})();

$(Home.init);

