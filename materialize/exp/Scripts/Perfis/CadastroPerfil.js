"use strict";

var ListagemUsuarios = (function () {

    function init() {
        bindFunctions();
    }

    function bindFunctions() {
        salvar();
        validaCheck();
        carregamentoPag();
    }

    function carregamentoPag() {

        $(document).ready(function () {
            $('.collapsible .collapsible-body input[type = "checkbox"]').each(function () {
                var todosSelecionados = $(this).closest("ul").find("li").find("input[type='checkbox']").map((x, elem) => elem.checked).toArray().every(x => x);
                var checkTodos = $(this).closest('li').closest('ul').closest('li').find('.formulario-header input[type = "checkbox"]');
                var checkTodosParcial = $(this).closest('li').closest('ul').closest('li').find('.formulario-header label');

                if (todosSelecionados) {

                    checkTodos.prop('checked', true);
                } else {
                    checkTodos.prop('checked', false);
                    checkTodosParcial.addClass('.selecao-parcial');
                }
            });

            var data = $('.formulario-nome-perfil').data('codperfil');
            
            if (data) {
                $('.footer .btn').text('Salvar Perfil');

            }
        });
    }

    function validaCheck() {
        $('.collapsible .formulario-header input[type = "checkbox"]').change(function () {

            $('.collapsible .formulario-header input[type = "checkbox"]').each((x, elem) => {

                if ($(elem).is(':checked')) {
                    $(elem).closest('li').find('.collapsible-body input[type = "checkbox"]').prop('checked', true);
                } else {
                    $(elem).closest('li').find('.collapsible-body input[type = "checkbox"]').prop('checked', false);
                }
            });
        });

        $('.collapsible .collapsible-body input[type = "checkbox"]').change(function () {
            var linha = $(this).parent();
            var li = linha.parent();
            var collapsibleBody = li.find("div.collapsible-body");
            var collapsibleHeader = linha.parent().parent().parent().parent().find(".collapsible-header.active");

            var isBaseItensNovoCadastro = ($($(collapsibleHeader)[0]).text().trim().toUpperCase() == "BASE DE ITENS" && $($(collapsibleHeader)[1]).text().trim().toUpperCase() == "NOVO CADASTRO");
            var isUsuariosCadastrarUsuario = ($($(collapsibleHeader)[0]).text().trim().toUpperCase() == "USUÁRIOS" && $($(collapsibleHeader)[1]).text().trim().toUpperCase() == "CADASTRAR USUÁRIO")
            var isPerfisCadastrarPerfis = ($($(collapsibleHeader)[0]).text().trim().toUpperCase() == "PERFIS DE ACESSO" && $($(collapsibleHeader)[1]).text().trim().toUpperCase() == "CADASTRAR PERFIL")

            if (collapsibleHeader.length > 1 && (isBaseItensNovoCadastro || isUsuariosCadastrarUsuario || isPerfisCadastrarPerfis) && linha.text().trim().toUpperCase() != 'LEITURA') {
                if (linha.find("input[type='checkbox']").prop("checked")) {
                    collapsibleBody.filter((x, elem) => $(elem).text().trim().toUpperCase() == 'LEITURA').find("input[type='checkbox']").prop('checked', true);
                }
                else {
                    collapsibleBody.each((x, elem) => $(elem).find("input[type='checkbox']").prop("checked", false))
                }

            } else {
                if (linha.text().trim().toUpperCase() != 'LEITURA' && linha.find("input[type='checkbox']").prop("checked")) {
                    collapsibleBody.filter((x, elem) => $(elem).text().trim().toUpperCase() == 'LEITURA').find("input[type='checkbox']").prop('checked', true);

                } else if (linha.text().trim().toUpperCase() == 'LEITURA' && !linha.find("input[type='checkbox']").prop("checked")) {
                    collapsibleBody.each((x, elem) => $(elem).find("input[type='checkbox']").prop("checked", false))
                }
            }


            var todosSelecionados = $(this).closest("ul").find("li").find("input[type='checkbox']").map((x, elem) => elem.checked).toArray().every(x => x);
            var checkTodos = $(this).closest('li').closest('ul').closest('li').find('.formulario-header input[type = "checkbox"]');
            var checkTodosParcial = $(this).closest('li').closest('ul').closest('li').find('.formulario-header label');

            if (todosSelecionados) {

                checkTodos.prop('checked', true);
            } else {
                checkTodos.prop('checked', false);
                checkTodos.addClass('.selecao-parcial');
            }
        });

    }
   
    function salvar() {
      
        $('.footer .btn').off().click(function () {
            
            var perfil = {
                perfil: $('#nomeperfil').val(),
                codperfil: $('#nomeperfil').parent().data('codperfil'),
                formularioPai: []
            };

            $('.formulario-header').each((x, elem) => {
                perfil.formularioPai.push({
                    codformulariopai: $(elem).data('codformulariopai'),
                    formularioPai: $(elem).text().trim(),
                    perfilPermissao: []
                });
            });

            $('.collapsible-header.filho').each((x, elem) => {
                var codformulariopai = $(elem).closest(".collapsible-body").closest("li").find(".formulario-header").data('codformulariopai');

                perfil.formularioPai.forEach(p => {
                    if (p.codformulariopai === codformulariopai) {
                        p.perfilPermissao.push({
                            formulario: $(elem).text().trim(),
                            codformulario: $(elem).data('codformulario'),
                            funcaoFormularioVModel: []
                        });
                    }
                });
            });

            $('.collapsible-body').each((x, elem) => {
                var codformulario = $(elem).closest('li').find('.collapsible-header.filho').data('codformulario');
                var checado = $(elem).find("input:checked").length > 0;

                perfil.formularioPai.forEach(p => {

                    p.perfilPermissao.forEach(y => {

                        if (y.codformulario === codformulario) {

                            if ($(elem).data('codfuncao')) {
                                y.funcaoFormularioVModel.push({
                                    funcao: $(elem).text().trim(),
                                    codfuncao: $(elem).data('codfuncao'),
                                    selecionado: checado
                                });
                            }
                        }
                    });
                });
            });

            var nomeNovoPerfil = $('#nomeperfil').val();
            if (nomeNovoPerfil !== '') {
                new GCS().setObj({
                    type: 'POST',
                    url: urlSalvarNovoPerfil,
                    data: JSON.stringify(perfil),
                    success: function (data) {
                        if (data.status) {
                            Helper.OpenAlert({ title: "Perfil cadastrado com sucesso", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                            var caminhoRedirecionar = "/Perfis/Index";
                            if (!data.permissaoListagemPerfis) {
                                caminhoRedirecionar = "/Perfis/CadastroPerfil"
                            }
                            setTimeout(function () { window.location.href = caminhoRedirecionar; }, 1100);
                        } 
                    },
                    Error: function () {
                        alert('Erro');
                    }
                }).executar();
            } else {
                Helper.OpenAlert({
                    title: "Ops",
                    msg: 'Preencha campos obrigatórios!',
                    classtitle: "font-vermelho-claro",
                    iconclass: "dissatisfaction",
                    icon: "fa-exclamation-triangle"
                });
            }
        });
    }

    return {
        init: init
    };

})();

$(ListagemUsuarios.init);