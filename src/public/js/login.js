"use strict"

//import Helper from './Helper';

const Login = (function () {

    function init() {
        bindFunctions()
    }

    function bindFunctions() {
        
        $('#go').click(function () {
            let 
                email = $('#email').val(),
                password = $('#txtpsw').val()
            ;
            authenticate(email, password)
        })

        $('#cadastrar').click(function () { window.location.href = `cadastro` })
        //Helper.OpenAlert({ title: "Ops", msg: 'Preencha os campos obrigatórios!', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
      
    }
    
    function authenticate(email = '', password = '') {
    
        axios.post('http://localhost:3001/auth/authenticate', {
            email,
	        password
        })
    
        .then((response) => {
            console.log(response)

            let 
                hashEmail,
                hashPassword
            ;

            // $(hashEmail).$.MD5($(email));
            // $(hashPassword).$.MD5($(password));

            window.location.href = `home?email=${email}&password=${password}`
        })
        .catch(function (error) {
            console.log(error.response.data.error)
            alert(error.response.data.error)
        })
    }

    return {
        init: init
    }

})()

$(Login.init)

