"use strict";
var Cadastro = (function () {

    function init() {
        bindFunctions();
    }

    function bindFunctions() {
        carregarDadosUsuario();
        wizard();
        carregaExistente();
        maskInputs();
        sugestaoUsuario();
        visualizarSenha();
        acoesFormulario();
        enviarDados();
        enviarDadosLogin();

        
        $(document).ready(function(){
            $("a[href='#cadastro-usuario-dados-usuario']").click();

            $('.datepicker').pickadate({
                selectMonths: true, // Creates a dropdown to control month
                selectYears: 15, // Creates a dropdown of 15 years to control year,
                today: 'Today',
                clear: 'Clear',
                close: 'Ok',
                closeOnSelect: false // Close upon selecting a date,
                //container: undefined, // ex. 'body' will append picker to body
              });
        });
    }

    function validaFormulario() {

        var retornoValidaForumlario;
       
        var fotoPerfil = $("#foto-perfil").val();
        var nome = $("#nome").val();
        var nomeSplit = nome.split(' ');
        var lengthNome = nomeSplit.length;
        var email = $("#email").val();
        var telefone = $("#telefone").val();

        function validarEmail(email) {
            var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            return emailReg.test(email);
        }

        var camposObrigatorios = $('.campoObrigatorio').length;
        var valoresCamposObrigatorio = $('.campoObrigatorio').filter(function () {
            return this.value != '';
        });

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
            Helper.OpenAlert({ title: "Ops", msg: 'Preencha os campos obrigatórios!', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
        } else if (validaFormulario() == "Error-CPFInvalido") {
            $("#cpf").attr("style", "border-bottom: 2px solid #f00;");
            Helper.OpenAlert({ title: "Ops", msg: 'CPF inválido!', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
        } else if (validaFormulario() == "Error-EmailInvalido") {
            $("#email").attr("style", "border-bottom: 2px solid #f00;");
            Helper.OpenAlert({ title: "Ops", msg: 'E-mail inválido!', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
        } else if (validaFormulario() == "Error-NomeCompleto") {
            $("#nome").attr("style", "border-bottom: 2px solid #f00;");
            Helper.OpenAlert({ title: "Ops", msg: 'Informe o nome completo', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
        }
    }

    function validaLogin() {
        var retornoValidaLogin;
        var usuario = $("#usuario").val();
        var novaSenha = $("#nova-senha").val();
        var confSenha = $("#confirmar-senha").val();
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
            Helper.OpenAlert({ title: "Ops", msg: 'Prreencha os dados de login!', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
        } else if (validaLogin() == "Error-SenhasError") {
            Helper.OpenAlert({ title: "Ops", msg: 'Senhas não coincidem!', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
        }
    }
 
    function carregaExistente() {
        $("#cpf").on("keyup", function () {
            if (!$("#meuperfil").val()) {
                if ($(this).val().length == 14 && $(this).val().indexOf('_') == -1) {
                    var cpf = $("#cpf").val().replace(/\./g, "").replace("-", "");
                    $.getJSON(ExisteUsuario + "?cpf=" + cpf, function (data) {
                        if (data['status'] == true) {
                            var codpessoa = data['codpessoa'];
                            window.location.replace("?codpessoa=" + codpessoa);
                        }
                    });
                } else {

                }
            }
        });
    }

    function maskInputs() {
        //$.mask.definitions['~'] = "[+-]";
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
            var nome = $('#nome').val().split(' ');
            var length = nome.length;
            var last = length - 1;
            var login = "" + nome[0] + "." + nome[last] + "";
            login = login.toLowerCase();
            $("#usuario").val(login);
        });
    }

    function wizard() {
        var status = 'usuario';
        function avancarWizard() {
            $(document).on("click", ".acao-avancar-toLogin", function () {
                if (status == 'usuario') {
                    if (validaFormulario() == true) {
                        status = 'login';
                        $("#col-wizard-usuario").addClass("col-wizard-usuario-color");
                        $(".wizard-cadastro-status").removeClass("wizard-active");
                        $("#cadastro-usuario-dados-login").addClass("wizard-active");
                        //
                        $(".progress-dados-usuario").attr("style", "width: 100%; background: #00CBB5;");
                        $(".dados-usuario-wizard-btn").attr("style", "background: #00CBB5;");
                        //
                        setTimeout(function () {
                            $("#col-wizard-login").removeClass("col-wizard-login-color");
                            $(".progress-dados-login").attr("style", "width: 50%;");
                            $(".dados-login-wizard-btn").removeClass("wizard-btn-disabled");
                        }, 500);
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
            var codpessoa = $("#cadastro-usuario-formulario").attr("data-codpessoa");
            codpessoa = !codpessoa ? 0 : codpessoa;

            if (validaFormulario() == true) {
                var obj = {
                    codpessoa: codpessoa,
                    nomecompleto: $("#nome").val(),
                    datanascimento: dataNascimento,
                    email: $("#email").val(),
                    telefone: telefone,
                    dddtelefone: dddtelefone,
                    ExtensaoFotoPessoa: extensao,
                    base64FotoPessoa: fotoBase64
                };

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
            $("a[href='#cadastro-usuario-dados-login']").parent().removeClass('disabled');
            $("a[href='#cadastro-usuario-dados-login']").click();

            $(".progress-dados-usuario").addClass('progress-concluido');
            $(".progress-dados-login").addClass('progress-iniciado');
            $(".center-wizard-btn span").removeClass('wizard-btn-disabled');

        });
    }

    function enviarDadosLogin() {
        $("#salvar-usuario").on("click", function () {
            if (validaLogin() == true) {
                var obj = {
                    codpessoa: $("#cadastro-usuario-formulario").attr("data-codpessoa"),
                    login: $("#usuario").val(),
                    senha: $("#nova-senha").val()
                };

                //ajax
                new GCS().setObj({
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(obj),
                    url: SalvarDadosLogin,
                    success: function (data) {
                        console.log(data);
                        if (data['status'] == true) {
                            if (window.location.href.toUpperCase().indexOf("MEUPERFIL") != -1) {
                                window.location.replace("MeuPerfil");
                            } else if (!data.permissaoListagemPerfil) {
                                window.location.replace("CadastrarUsuario");
                            } else {
                                window.location.replace("index");
                            } 


                        } else if (data['status'] == false) {
                            if (data['messageUser'] == 'O login não pode ser alterado pois já está cadastrado.') {
                                Helper.OpenAlert({ title: "Ops", msg: 'Nome de usuário já existe.', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                            }
                        }
                        //
                    },
                    error: function (data) {
                        Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }
                }).executar();
            } else {
                MSGerroValidacaoLogin();
            }
        });
    }

    function carregarDadosUsuario() {
        if ($("#cadastro-usuario-formulario").attr("data-codpessoa") > 0) {
            var codpessoa = $("#cadastro-usuario-formulario").attr("data-codpessoa");
            $.getJSON(LoadDadosUsuario + "?codpessoa=" + codpessoa, function (data) {
                var fotoPerfil = data['dadosUsuario']['arquivo'];
                var cpf = data['dadosUsuario']['cpf'];
                var datanascimento = data['dadosUsuario']['datanascimentoformatada'];
                var nomecompleto = data['dadosUsuario']['nomecompleto'];
                var nomesocial = data['dadosUsuario']['nomesocial'];
                var rg = data['dadosUsuario']['identidade'];
                var sexo = data['dadosUsuario']['sexo'];
                var email = data['dadosUsuario']['email'];
                var dddtelefone = data['dadosUsuario']['dddtelefone'];
                var telefone = data['dadosUsuario']['telefone'];
                var dddcelular = data['dadosUsuario']['dddcelular'];
                var celular = data['dadosUsuario']['celular'];
                var cep = data['dadosUsuario']['cep'];
                var rua = data['dadosUsuario']['logradouro'];
                var numerocasa = data['dadosUsuario']['numerocasa'];
                var complemento = data['dadosUsuario']['complemento'];
                var bairro = data['dadosUsuario']['bairro'];
                var uf = data['dadosUsuario']['uf'];
                var cidade = data['dadosUsuario']['cidade'];


                if (fotoPerfil != "") {
                    $("#cam-i-foto-perfil").hide();
                    $("#alterar-foto-perfil").show();
                    $("#remover-foto-perfil").show();
                    $('.image-input').attr('data-base64', fotoPerfil);
                    $('.image-input').attr('style', 'background: url(' + fotoPerfil + '); background-size: cover;');
                }

                $("#cpf").val(cpf);
                $("#nome").val(nomecompleto);
                $("#nomesocial").val(nomesocial);
                $("#rg").val(rg);
                $("#nascimento").val(datanascimento);

                if (sexo == "M") {
                    $(".with-gap").removeAttr("checked");
                    $("#masculino").attr("checked", "checked");
                } else if(sexo == "F") {
                    $(".with-gap").removeAttr("checked");
                    $("#feminino").attr("checked", "checked");
                }
                

                $("#email").val(email);
                if (telefone != "") {
                    telefone = dddtelefone + telefone;
                    $("#telefone").val(telefone);
                }
                $("#celular").val(dddcelular+celular);
                $("#cep").val(cep);
                $("#rua").val(rua);
                $("#numero").val(numerocasa);
                $("#complemento").val(complemento);
                $("#bairro").val(bairro);
                $("#uf").val(uf);
                $("#cidade").val(cidade);
  
                maskInputs();


                $(".acao-avancar-toLogin").on("click", function () {
                    $.getJSON(LoadDadosLogin + "?codpessoa=" + codpessoa, function (data) {
                        console.log(data);
                        var login = data['dadosLoginVModel']['login'];
                        $("#usuario").val(login);
                    });
                });


            });
        }
    }


    return {
        init: init
    };

})();

$(Cadastro.init);

