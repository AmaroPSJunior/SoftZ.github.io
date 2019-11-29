"use strict";

let Home = (function () {

    function init() {
        bindFunctions();
    }

    function bindFunctions() {

        let 
            url = window.location.href,
            email = url.substring(url.lastIndexOf('password'), url.lastIndexOf('email=') + 'email='.length),
            password = url.substring(url.lastIndexOf('password=') + 'password='.length)
        ;
        authenticate(email, password);
    }

    function authenticate(email = '', password = '') {
    
        axios.post('http://localhost:3001/auth/authenticate', {
            email,
	        password
        })

        .then(function (response) {
            let nome = response.data.user.name;
            
            $('body').show();
            loadData(nome);
        })
        
        .catch(function (error) {
            window.location.href = "login"
        });   
    }

    const loadData = (nome = 'usuário') => {

        $(document).ready(() => {
         
            $('.nome').html(nome)
            $("nav i").sideNav();
            console.log('nome: ', nome);

            $('#img_perfil').change(function () {
                let 
                    img = this.files[0],
                    reader = new FileReader()
                ;
    
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

