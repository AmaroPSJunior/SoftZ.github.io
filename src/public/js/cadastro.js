"use strict";
var Cadastro = (function () {

    function init() {
        bindFunctions();
    }

    function bindFunctions() {
        wizard();
        maskInputs();
        sugestaoUsuario();
        visualizarSenha();
        acoesFormulario();
        enviarDados();
        sendDataLogin();

        
        $(document).ready(function(){
            $("a[href='#cadastro-usuario-dados-usuario']").click();

            $('.datepicker').pickadate({
                selectMonths: true,
                selectYears: 15,
                today: 'Today',
                clear: 'Clear',
                close: 'Ok',
                closeOnSelect: false 
              });
        });
    }

    function validaFormulario() {
        let
            retornoValidaForumlario,
            nome = $("#nome").val(),
            nomeSplit = nome.split(' '),
            lengthNome = nomeSplit.length,
            email = $("#email").val(),
            camposObrigatorios = $('.campoObrigatorio').length,
            valoresCamposObrigatorio = $('.campoObrigatorio').filter(function () {
                return this.value != '';
            })
        ;

        function validarEmail(email) {
            let emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            return emailReg.test(email);
        }

        if (valoresCamposObrigatorio.length >= 0 && (valoresCamposObrigatorio.length !== camposObrigatorios)) {
            retornoValidaForumlario = "Error-CamposObrigatorios";
        } else if (lengthNome <= 1) {
            retornoValidaForumlario = "Error-NomeCompleto";
        } else if (!validarEmail(email)) {
            retornoValidaForumlario = "Error-EmailInvalido";
        } else {
            retornoValidaForumlario = true;
        }

        return retornoValidaForumlario;
    }

    function MSGerroValidacaoForumulario() {
        $(".campoObrigatorio").attr("style", "border-bottom: 1px solid #ccc");
        if (validaFormulario() == "Error-CamposObrigatorios") {
            $('.campoObrigatorio').each(function () {
                $(this).attr("style", "border-bottom: 1px solid #ccc");
                if ($(this).val() == "") {
                    $(this).attr("style", "border-bottom: 2px solid #f00;");
                }
            });

            alert('Preencha os campos obrigatórios!');
        } else if (validaFormulario() == "Error-CPFInvalido") {
            $("#cpf").attr("style", "border-bottom: 2px solid #f00;");
            alert('CPF inválido!');
        } else if (validaFormulario() == "Error-EmailInvalido") {
            $("#email").attr("style", "border-bottom: 2px solid #f00;");
            alert('E-mail inválido!');
        } else if (validaFormulario() == "Error-NomeCompleto") {
            $("#nome").attr("style", "border-bottom: 2px solid #f00;");
            alert('Informe o nome completo');
        }
    }

    function validaLogin() {
        let
            retornoValidaLogin,
            usuario = $("#usuario").val(),
            novaSenha = $("#nova-senha").val(),
            confSenha = $("#confirmar-senha").val()
        ;

        if (usuario == "" || novaSenha == "" || confSenha == "") {
            retornoValidaLogin = "Error-CamposLogin";
        } else if (novaSenha != confSenha) {
            retornoValidaLogin = "Error-SenhasError";
        } else {
            retornoValidaLogin = true;
        }
        return retornoValidaLogin;
    }

    function MSGerroValidacaoLogin() {
        if (validaLogin() == "Error-CamposLogin") {
            alert('Prreencha os dados de login!');
        } else if (validaLogin() == "Error-SenhasError") {
            alert('Senhas não coincidem!');
        }
    }

    function maskInputs() {
        $("#nascimento").mask("99/99/9999");
        $("#telefone").mask("(99) 9999-9999");

        $(".masked-inputs").on("focus click", function () {
            if ($(this).val().indexOf('_') > -1) {
                $(this)[0].setSelectionRange(0, 0);
            }
        });
    }
    
    function sugestaoUsuario() {
        $(".acao-avancar-toLogin").on("click", function () {
            let 
                nome = $('#nome').val().split(' '),
                length = nome.length,
                last = length - 1,
                login = "" + nome[0] + "." + nome[last] + ""
            ;

            login = login.toLowerCase();
            $("#usuario").val(login);
        });
    }

    function wizard() {
        function avancarWizard() {
            var status = 'usuario';
            $(document).on("click", ".acao-avancar-toLogin", function () {
                if (status == 'usuario') {
                    if (validaFormulario() == true) {
                        status = 'login';
                    } else {
                        MSGerroValidacaoForumulario();
                    }
                }
            });
        }
        
        function retornarWizard() {
            $(document).on("click", ".dados-usuario-wizard-btn", function () {
                if (status == 'login') {
                    $("#col-wizard-login").addClass("col-wizard-login-color");
                    $(".wizard-cadastro-status").removeClass("wizard-active");
                    $("#cadastro-usuario-dados-usuario").addClass("wizard-active");
                    //
                    $(".progress-dados-login").attr("style", "width: 0; background: #3d7ae8;");
                    $(".dados-login-wizard-btn").addClass("wizard-btn-disabled");
                    //
                    setTimeout(function () {
                        $("#col-wizard-usuario").removeClass("col-wizard-usuario-color");
                        $(".dados-usuario-wizard-btn").attr("style", "background: #3d7ae8;");
                        $(".progress-dados-usuario").attr("style", "width: 50%; background: #3d7ae8;");
                    }, 500);
                    status = 'usuario';
                }
            });
        }
        avancarWizard();
        retornarWizard();
    }

    function visualizarSenha() {
        $(".eye-senha").on("click", function () {
            if ($(this).attr("data-type") == "password") {
                $(this).siblings("input").attr("type", "text");
                $(this).attr("data-type", "text");
                $(this).find("i").attr("class", "far fa-eye-slash");
            } else {
                $(this).siblings("input").attr("type", "password");
                $(this).attr("data-type", "password");
                $(this).find("i").attr("class", "far fa-eye");
            }
        });
    }

    function acoesFormulario() {
        //foto perfil
        function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('.image-input').attr('data-base64', e.target.result);
                    $('.image-input').attr('style', 'background: url(' + e.target.result + '); background-size: cover;');

                }
                reader.readAsDataURL(input.files[0]);
            }
        }
        $("#foto-perfil").on("change", function () {
            var acceptExtension = $(this).attr("accept");
            acceptExtension = acceptExtension.split(',');
            var extensao = $(this).val().substr(($(this).val().lastIndexOf('.') + 1));
            extensao = "." + extensao;
            if ($.inArray(extensao, acceptExtension) == -1) {
                $("#foto-perfil").val('');
                $('.image-input').attr('style', '');
                $('.image-input').attr('data-base64', '');
                $("#cam-i-foto-perfil").show();
                $("#remover-foto-perfil").hide();
                $("#alterar-foto-perfil").hide();
                Helper.OpenAlert({ title: "Ops", msg: 'Arquivo não permitido.', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            } else {
                readURL(this);
                $("#cam-i-foto-perfil").hide();
                $("#alterar-foto-perfil").show();
                $("#remover-foto-perfil").show();
            } 
            
        });
        $("#remover-foto-perfil").on("click", function () {
            $("#foto-perfil").val('');
            $('.image-input').attr('style', '');
            $('.image-input').attr('data-base64', '');
            $("#cam-i-foto-perfil").show();
            $(this).hide();
            $("#alterar-foto-perfil").hide();
        });
    }

    function enviarDados() {
        
        $("#salvar-dados").on("click", function () {

            var fotoPerfil = $("#foto-perfil").val();
            var extensao = fotoPerfil.substr((fotoPerfil.lastIndexOf('.') + 1));
            var fotoBase64 = $(".image-input").attr("data-base64");
            if (fotoBase64) {
                var fotoBase64split = fotoBase64.split('base64,');
                var base64type = fotoBase64split[0];
                base64type = base64type + "base64,";
                fotoBase64 = fotoBase64.replace(base64type, "");
            }

            var dataNascimento = $("#nascimento").val();
            var telefone = $("#telefone").val();
            var regExp = /\(([^)]+)\)/;

            if (telefone != "") {
                var dddtelefone = regExp.exec(telefone);
                dddtelefone = dddtelefone[1];
                telefone = telefone.substring(5).replace("-","");
            }

            if (validaFormulario() == true) {
                
                $("a[href='#cadastro-usuario-dados-login']").parent().removeClass('disabled');
                $("a[href='#cadastro-usuario-dados-login']").click();

                $(".progress-dados-usuario").addClass('progress-concluido');
                $(".progress-dados-login").addClass('progress-iniciado');
                $(".center-wizard-btn span").removeClass('wizard-btn-disabled');
                
                // var obj = {
                //     codpessoa: codpessoa,
                //     nomecompleto: $("#nome").val(),
                //     datanascimento: dataNascimento,
                //     email: $("#email").val(),
                //     telefone: telefone,
                //     dddtelefone: dddtelefone,
                //     ExtensaoFotoPessoa: extensao,
                //     base64FotoPessoa: fotoBase64
                // };

                //ajax
                // new GCS().setObj({
                //     type: 'POST',
                //     contentType: 'application/json',
                //     data: JSON.stringify(obj),
                //     url: SalvarDadosUsuario,
                //     success: function (data) {                  
                //         var codpessoa = data['codpessoa'];
                //         $("#cadastro-usuario-formulario").attr("data-codpessoa", codpessoa);
                //     },
                //     error: function (data) {
                //         Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                //     }
                // }).executar();

            } else {
                MSGerroValidacaoForumulario();
            }
        });
    }

    function sendDataLogin() {
        $("#salvar-usuario").on("click", function () {
            if (validaLogin() == true) {

                let params = {
                    img: 'teste', //$('.image-input').data('base64'),
                    name: $("#nome").val(),
                    email: $("#email").val(),
                    date: $("#nascimento").val(),
                    telephone: $("#telefone").val(),
                    user: $("#usuario").val(),
                    password: $("#nova-senha").val()
                };

                register(params);

            } else {
                MSGerroValidacaoLogin();
            }
        });
    }

    function register(params) {

        const {img, name, email, date, telephone, user, password} = params;

        axios.post('http://localhost:3001/auth/register', 
            {
                img,
                name,
                email,
                date,
                telephone,
                user,
                password
            }
        )

        .then(function (response) {

            window.location.href = `home?email=${params.email}password=${params.password}`
        })
        
        .catch(function (error) {
            window.location.href = "login"
        });   
    }

    function loadDate() {
                
    }


    return {
        init: init
    };

})();

$(Cadastro.init);

