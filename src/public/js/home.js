"use strict"

let Home = (function () {

    function init() {
        bindFunctions()
    }

    function bindFunctions() {

        let 
            url = window.location.href,
            email = url.substring(url.lastIndexOf('&'), url.lastIndexOf('email=') + 'email='.length),
            password = url.substring(url.lastIndexOf('password=') + 'password='.length),
            urlIframe = url.substring(0 , url.indexOf('/home')),
            iframeCadastroDados = `${urlIframe}/cadastro?type=dados&email=${email}&password=${password}`,
            iframeCadastroLogin = `${urlIframe}/cadastro?type=login&email=${email}&password=${password}`
        ;
        authenticate(email, password)
        
        $('#Dados-Pessoais').click(function () {
            renderIframe(iframeCadastroDados)
        })
        
        $('#Dados-Login').click(function () {
            
            renderIframe(iframeCadastroLogin)
            //window.location.href = `cadastro?type=login${dataUrl}`
        })
    }
    
    function renderIframe(element) {
        
        let 
            html = `<iframe class="" src=${element} frameborder="0" style="width: 100% !important;height: 100% !important;position: relative;"></iframe>`
        ;

        $('#home').html(html)
        $('.button-collapse').sideNav('destroy')
    }

    function authenticate(email = '', password = '') {
    
        axios.post('http://localhost:3001/auth/authenticate', {
            email,
	        password
        })

        .then(function (response) {
            let 
                { img, name } = response.data.user
            ;
            
            $('body').show()
            loadData(name, img)
        })
        
        .catch(function (error) {
            window.location.href = "login"
        })
    }

    const loadData = (nome = 'usuário', img) => {

        $(document).ready(() => {
            
            nome = nome.toLowerCase()
            let user = nome.substring(nome[0], nome.indexOf(' '))

            $('.nome').html(user)
            $("nav i").sideNav()
            $('.foto-perfil').attr('src', `/img/${img}`)

            $('#img_perfil').change(function () {
                let 
                    img = this.files[0],
                    reader = new FileReader()
                ;
    
                reader.onload = function (e) {
    
                    $('.elementoRender').attr('src', e.target.result)
                }

                reader.readAsDataURL(img)
            })
        })
    }
      


    return {
        init: init
    }

})()

$(Home.init)

