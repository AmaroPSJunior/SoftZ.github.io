//const axios = require('axios');

const Login = (function () {

    function init() {
        bindFunctions();
    }

    function bindFunctions() {
        
        $('#go').click(function () {
            let 
                email = $('#email').val(),
                password = $('#txtpsw').val()
            ;
            
            authenticate(email, password);
        });
    }
    
    function authenticate(email = '', password = '') {
    
        axios.post('http://localhost:3001/auth/authenticate', {
            email,
	        password
        })
    
        .then((response) => {
            console.log(response);

            let 
                hashEmail,
                hashPassword
            ;

            // $(hashEmail).$.MD5($(email));
            // $(hashPassword).$.MD5($(password));

            window.location.href = `home?email=${email}password=${password}`
        })
        .catch(function (error) {
            console.log(error);
            alert('erro: ', error);
        });   
    }

    return {
        init: init
    };

})();

$(Login.init);

