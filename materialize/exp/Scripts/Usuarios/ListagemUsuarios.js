"use strict";

var ListagemUsuarios = (function () {

    function init() {
        bindFunctions();
    }

    function bindFunctions() {
        modalPerfis();
        checkboxes();
        pesquisar();
        salvar();
        $('.dropdown-button').dropdown();
    }

    function salvar(self) {

        $('.botao-salvar button').click(function () {
            var model = {
                codpessoa: $("#perfis-do-usuario-partial").data('codpessoa'),
                listaperfisusuario: []
            };

            $('.permissao-checkbox').each((x, elem) => {
                model.listaperfisusuario.push({
                    codperfil: $(elem).closest('tr').data('codperfil'),
                    codperfilusuario: $(elem).closest('tr').data('codperfilusuario'),
                    descricao: $(elem).closest('tr').find('td:first-child').text(),
                    permissoes: $(elem).closest('tr').find('td:nth-child(2)').text(),
                    selecionado: $(elem).is(':checked')
                });
            });

            new GCS().setObj({
                type: 'POST',
                url: urlSalvarPerfisUsuario,
                data: JSON.stringify(model),
                success: function (data) {
                    if (data.status) {
                        var perfilValue = $('.permissao-checkbox').filter((x, elem) => $(elem).is(":checked")).map((x, elem) => $(elem).closest("tr").find("td")[0].innerText).toArray().join(', ');
                        var codpessoaTr = $("#perfis-do-usuario-partial").data("codpessoa");
                        $($("#listagem-usuarios-partial-table table")[1]).find("tbody tr").filter((x, elem) => $(elem).find("td.acao.dropdown-button").data("codpessoa") == codpessoaTr).find("td")[2].innerText = perfilValue;

                        Helper.OpenAlert({ title: "Perfil cadastrado com sucesso", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                    } else {
                        //erro
                        console.log(data);
                    }
                    $('#perfis-modal').modal('close');
                },
                Error: function () {
                    $('#perfis-modal').modal('close');
                    alert('Erro');
                }

            }).executar();
        });
    }

    function modalPerfis() {
        $(".editar-perfis-acesso").off().click(function () {
            var codPessoa = $(this).closest('tr').find('.acao').data('codpessoa');
            var self = $(this);
            new GCS().setObj({
                type: 'GET',
                url: urlLoadPerfisUsuario + '?codpessoa=' + codPessoa,
                contentType: 'text/html',
                dataType: 'html',
                success: function (data) {
                    if (Helper.isJSON(data)) {
                        if (!data.status) {
                            //error
                        }
                    } else {
                        $('.modal-perfil-acesso').html(data);
                        $('#perfis-modal').modal({ dismissible: true }).modal('open');

                    }
                    modalPerfis();
                    checkboxes();
                    salvar(self);
                },
                error: function (error) {
                    console.log(error);
                }
            }).executar();
        });
    }

    function checkboxes() {
        $(".permissao-checkbox").change(function () {
            if (this.checked) {
                $(this).siblings(".status-permissao").text("Permitido");
            } else {
                $(this).siblings(".status-permissao").text("Negado");
            }
        });
    }

    function pesquisar() {
        $(".btn-pesquisa-usuario button").off().click(function () {

            var campo = $(".listagem-usuario-filtro-select input").val();
            var valor = $(".listagem-usuario-filtro-input input").val();

            var email = campo == "E-mail" ? valor : "";
            var usuario = campo == "Usuário" ? valor : "";
            var cpf = campo == "CPF" ? valor : "";

            new GCS().setObj({
                type: 'POST',
                contentType: false,
                dataType: 'html',
                url: `${urlListarUsuarios}?email=${email}&usuario=${usuario}&cpf=${cpf}`,
                success: function (data) {
                    $('#listagem-usuarios-partial-table').html(data);
                    bindFunctions();
                }
            }).executar();

        });
    }

   
    return {
        init: init
    };

})();

$(ListagemUsuarios.init);

