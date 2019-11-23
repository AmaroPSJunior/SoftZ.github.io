"use strict";

var Macrodesafio = (function () {

    function init() {
        functionBase();
        bindFunctions();
        addAnoSemestre();
        verificaExibicaoDivsAbas();
        chamaPrimeiraAba();
        
    }

    function functionBase() {
        marcarCheckboxes();
        $('#btnavancar').off().click(AvancarEtapa);
        checkAllMacroQuestoes();
        abrirModal();
        chamaParcialAbaMacroDesafio();
        $(".divs-abas").bind("DOMSubtreeModified", verificaExibicaoDivsAbas);
       
    }

    function AvancarEtapa() {
        var codunidadeaprendizagem = $('#codunidadeaprendizagem').val();
        var atualEtapaUA = parseInt($(".wizard_new .wizard_new--doing").data("etapa"));
        var proximaEtapaUA = atualEtapaUA+1;

        if (codunidadeaprendizagem) {
            new GCS().setObj({
                type: 'GET',
                url: urlFinalizarEtapaWizard + '?codUnidadeAprendizagem=' + codunidadeaprendizagem + '&etapaCadastroUnidadeAprendizagemEnum=' + atualEtapaUA,
                success: function (data) {
                    if (data && data.status) {
                        UnidadeAprendizagemListagemUas.vaiParaEtapa(proximaEtapaUA, codunidadeaprendizagem);
                    }
                },
                error: function (err) {
                    Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            }).executar();
        }
    }

    function chamaPrimeiraAba() {
        $('#cadastro-macrodesafio .abas-vertical .tabs-vertical li a').first().click();
    }

    function verificaExibicaoDivsAbas() {
        let divsAbas = $(".divs-abas");

        if (divsAbas.children().length > 0) {
            divsAbas.show();
        } else {
            divsAbas.hide();
        }
    }

    function bindFunctions() {
        $('select').material_select();
        $('ul.tabs').tabs();
        visualizarEnunciado();
        editar();
        excluir();
    }

    function chamaParcialAbaMacroDesafio() {
        $('#cadastro-macrodesafio .abas-vertical li a').off().click(function () {

            var ano = $(this).data('ano');
            var semestre = $(this).data('semestre');
            var codunidadeaprendizagem = $('#codunidadeaprendizagem').val();

            var obj = {
                codunidadeaprendizagem: codunidadeaprendizagem,
                ano: ano,
                semestre: semestre
            };

            if (ano && semestre && codunidadeaprendizagem) {

                new GCS().setObj({
                    contentType: 'text/html',
                    dataType: 'html',
                    url: urlListarMacrodesafioAnoSemestre,
                    data: obj,
                    type: 'GET',
                    processData: true,
                    success: function (data) {

                        $('#cadastro-macrodesafio '+'#' + ano + '-' + semestre).html(data);

                        listarQuestoesPorDescritorCollapse();
                        abrirModal();
                        bindFunctions();
                        
                        UnidadeAprendizagemListagemUas.desabilita();
                    },
                    showLoad: false,
                    error: function (data) {
                        console.log(data);
                    }
                }).executar();
            }
        });
    }

    function addAnoSemestre() {
        
        $('#cadastro-macrodesafio .btnAddAnoSemestre .btn').off().click(function () {
            
            var ano = $('#cadastro-macrodesafio .ano-semestre #ano').val();
            var semestre = $('#cadastro-macrodesafio .ano-semestre #semestre').val();
            if (ano && semestre) {
                var existe = verificaAbaExistente(ano, semestre);
                if (!existe) {

                    var li = ' <li class="tab col s3"><a data-ano="' + ano + '" data-semestre="' + semestre + '" href="#' + ano + '-' + semestre + '">' + ano + ' / ' + semestre + '</a></li>';
                    var div = ' <div id="' + ano + '-' + semestre + '" class="col s12"></div>';
                    $('.tabs-vertical').append(li);
                    $('.divs-abas').append(div);
                    setTimeout(function () {
                        chamaParcialAbaMacroDesafio();
                        $('#cadastro-macrodesafio .abas-vertical .tabs-vertical li a').last().click();
                    }, 100);
                } else {
                    Helper.OpenAlert({ title: "Ops", msg: 'O ano e semestre escolhido já se encontra cadastrado.', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            }
        });
    }

    function verificaAbaExistente(ano, semestre) {
        var abasExistentes = $('#cadastro-macrodesafio .abas-vertical .tabs-vertical li a');
        var existe = false;
        abasExistentes.each(function () {
            if (ano + '-' + semestre === $(this).data('ano') + '-' + $(this).data('semestre')) {
                existe = true;
            }
        });
        return existe;
    }

    function abrirModal() {
        $("#cadastro-macrodesafio .btn-addMicro").off().click(function () {
            
            var elemento = $(this);

            var tabsVertical = elemento.parent().parent().parent().parent().parent().find(".tabs-vertical a.active");
            var ano = tabsVertical.data("ano");
            var semestre = tabsVertical.data("semestre");

            var codunidadeaprendizagem = $('#codunidadeaprendizagem').val();
            $("#checkTrilha").val("");

            if (codunidadeaprendizagem) {
                new GCS().setObj({
                    type: 'GET',
                    contentType: 'text/html',
                    dataType: 'html',
                    url: urlLoadMacrodesafioItem + '?codunidadeaprendizagem=' + codunidadeaprendizagem + '&ano=' + ano + '&semestre=' + semestre,
                    success: function (data) {
                        $('#macro-modal').html(data);
                        $('#macro-modal').modal({ dismissible: false }).modal('open');
                        $('.collapsible').collapsible();
                        listarQuestoesPorDescritorCollapse();
                        
                        $('.macro-modal-content .salvar').off().click(function () {
                            $(this).attr('disabled', true);
                            salvarMacroItemModal();
                        });

                        $(".nome-microdesafio").text("Novo Macrodesafio");
                    },
                    error: function (err) {
                        Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }
                }).executar();
            }
        });
    }

    function pegaItensMacroModal() {
        var arr = [];

        var listaItem = $('#macro-modal .lista-disciplina--collapsible .collapsible-header').parent().find('.collapsible-body input[type="checkbox"]');
        listaItem.each(function () {
            var obj = {
                coditemmatriz: $(this).closest('.list-enunciados').data('coditemmatriz'),
                selecionado: $(this).is(':checked')
            };
            arr.push(obj);
        });
        return arr;
    }

    function salvarMacroItemModal() {        

        var ano = $('#cadastro-macrodesafio .abas-vertical .tabs-vertical li a.active').data('ano');
        var semestre = $('#cadastro-macrodesafio .abas-vertical .tabs-vertical li a.active').data('semestre');
        var codUnidadeAprendizagem = $('#codunidadeaprendizagem').val();
        var codItems = pegaItensMacroModal();
        var coddesafio = $('#coddesafio').val();
        var codunidadeaprendizagemtrilha = $("#macro-modal #codunidadeaprendizagemtrilha").val();
        var notificacao = '';

        $('#macro-modal .collapsible-body').each(function () {
            let quetoesSelecionadas = $(this).find('input[type="checkbox"]:checked').length;

            if (quetoesSelecionadas > 1) {
                notificacao = 'Existem mais de um Macrodasafio selecionado para uma habilidade!';
                return;
            }
        });

        var obj = {
            codUnidadeAprendizagem: codUnidadeAprendizagem,
            codItems: codItems,
            ano: ano,
            semestre: semestre,
            coddesafio: coddesafio,
            codunidadeaprendizagemtrilha: codunidadeaprendizagemtrilha
        };

        new GCS().setObj({
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(obj),
            url: urlSalvarMacrodesafio,
            success: function (data) {

                if (data.status) {
                    Helper.OpenAlert({
                        title: "Macrodesafio salvo com sucesso!",
                        msg: notificacao,
                        classtitle: "font-verde",
                        iconclass: "satisfaction",
                        icon: "fa-check-circle",
                        close: function () {

                            var etapaConclusao = $('.wizard_new .clickoption[data-href$="/UnidadeAprendizagem/LoadConclusao"]');
                            if (etapaConclusao.closest('li').hasClass('wizard_new--done')) {
                                $('.wizard_new a[data-href$="/UnidadeAprendizagem/LoadOrganizacao"]').click();
                            }

                            $("#cadastro-macrodesafio #macro-modal").modal('close');
                            AtualizaTabela();
                        }
                    });
                } else {
                    Helper.OpenAlert({ title: "Ops", msg: 'Ocorreu um erro ao salvar', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            },
            error: function (err) {
                Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            }
        }).executar();
    }

    function AtualizaTabela() {
        $('#cadastro-macrodesafio .abas-vertical .tabs-vertical li a.active').click();
    }

    function listarQuestoesPorDescritorCollapse() {
        $('#macro-modal .lista-disciplina--collapsible .collapsible-header').off().click(function () {
            
            var elemento = $(this);
            if (!$(this).hasClass('active') && elemento.parent().find('.collapsible-body input[type="checkbox"]').length == 0) {
                var codUnidadeAprendizagem = $('#codunidadeaprendizagem').val();
                var ano = $('#cadastro-macrodesafio .tabs-vertical li a.active').data('ano');
                var semestre = $('#cadastro-macrodesafio .tabs-vertical li a.active').data('semestre');
                var codhabilidade = $(this).data('codhabilidade');
                var codunidadeaprendizagemtrilha = $("#cadastro-macrodesafio #codunidadeaprendizagemtrilha").val();

                new GCS().setObj({
                    contentType: 'text/html',
                    dataType: 'html',
                    url: urlListarQuestoesSubjetivas,
                    data: { codUnidadeAprendizagem: codUnidadeAprendizagem, ano: ano, semestre: semestre, codhabilidade: codhabilidade, codunidadeaprendizagemtrilha: codunidadeaprendizagemtrilha, coddesafio: $('#coddesafio').val() },
                    type: 'GET',
                    processData: true,
                    success: function (data) {
                        
                        elemento.siblings('.collapsible-body').html(data);
                        elemento.closest('li').find('.check-descritor .check').removeClass('hide');
                        checkAllMacroQuestoes();
                        visualizarEnunciado();

                        var checks = elemento.parent().find('.collapsible-body .list-enunciados--check input[type="checkbox"]');
                        var collapsibleHeader = checks.parent().parent().parent().parent().find(".collapsible-header");

                        if (elemento.parent().find('.check-descritor input[type="checkbox"]:checked').length > 0) {
                            checks.prop("checked", true);

                            collapsibleHeader.attr("data-quantidadequestoesselecionadas", parseInt(collapsibleHeader.data("quantidadequestoestotal")));
                            collapsibleHeader.data("quantidadequestoesselecionadas", parseInt(collapsibleHeader.data("quantidadequestoestotal")));
                        }


                        collapsibleHeader.attr("data-preselecao", "");
                        collapsibleHeader.data("preselecao", "");
                        bindClickcancelarQuestao();
                        habilitaItensCollapseComPermissao(elemento);


                        $('#macro-modal .salvar').attr('disabled', false).prop('disabled', false).css('pointer-events', '');
                        $('#macro-modal .salvar').off().click(function () {
                            $(this).attr('disabled', true);
                            salvarMacroItemModal();
                            $("#macro-modal").modal('close');
                        });
                  
                    },
                    showLoad: false,
                    error: function (data) {            
                        console.log(data);
                    }
                }).executar();
            } else {
                if (elemento.parent().find('.collapsible-body input[type="checkbox"]').length == 0) {
                    //elemento.closest('li').find('.check-descritor .check').addClass('hide');
                } else {
                    elemento.closest('li').find('.check-descritor .check').removeClass('hide');
                }
            }
        });
    }

    function checkAllMacroQuestoes() {

        $("#cadastro-macrodesafio .checkbox-enunciado").off().change(function () {

            var elemento = $(this);
            let collasibleHeader = $(this).parent().parent().parent().find(".collapsible-header");

            if (this.checked) {
               
                elemento.closest('li').find('.collapsible-body input[type="checkbox"]').each(function () {

                    let item = $(this).closest('.list-enunciados');
                    if (item.data('foicancelado') === "False") {
                        $(this).prop('checked', true);
                    }
                });

                collasibleHeader.attr("data-quantidadequestoesselecionadas", parseInt(collasibleHeader.data("quantidadequestoestotal")));
                collasibleHeader.data("quantidadequestoesselecionadas", parseInt(collasibleHeader.data("quantidadequestoestotal")));

            } else {
                elemento.closest('li').find(".collapsible-body .checkbox-enunciado-item").each(function () {
                    this.checked = false;
                });

                collasibleHeader.attr("data-quantidadequestoesselecionadas", 0);
                collasibleHeader.data("quantidadequestoesselecionadas", 0);
            }

            if (collasibleHeader.data("preselecao")) {
                collasibleHeader.click();
            }

            collasibleHeader.attr("data-preselecao", "");
            collasibleHeader.data("preselecao", "");
        });

        $("#cadastro-macrodesafio .collapsible-body .checkbox-enunciado-item").off().change(function () {

            var elemento = $(this);
            let collasibleHeader = $(this).closest(".collapsible-header");
            if ($(this).is(":checked")) {
                var isAllChecked = 0;
                elemento.closest('li').find(".collapsible-body .checkbox-enunciado-item").each(function () {
                    if (!this.checked)
                        isAllChecked = 1;
                });
                if (isAllChecked === 0) { elemento.closest('li').find(".check-descritor .checkbox-enunciado").prop("checked", true); }

                collasibleHeader.attr("data-quantidadequestoesselecionadas", parseInt(collasibleHeader.data("quantidadequestoesselecionadas")) + 1);
                collasibleHeader.data("quantidadequestoesselecionadas", parseInt(collasibleHeader.data("quantidadequestoesselecionadas")) + 1);
            } else {
                elemento.closest('li').find(".check-descritor .checkbox-enunciado").prop("checked", false);

                collasibleHeader.attr("data-quantidadequestoesselecionadas", parseInt(collasibleHeader.data("quantidadequestoesselecionadas")) - 1);
                collasibleHeader.data("quantidadequestoesselecionadas", parseInt(collasibleHeader.data("quantidadequestoesselecionadas")) - 1);
            }
        });
    }

    function marcarCheckboxes() {
        $("#checkbox-todos").on("click", function () {
            if ($(this).is(":checked")) {
                $(".checkbox-enunciado").not(this).prop('checked', this.checked);
            } else {
                $(".checkbox-enunciado").prop('checked', false);
            }
        });
    }

    function visualizarEnunciado() {
        $("#cadastro-macrodesafio .icon-visualizar").off().on("click", function () {
            
            var coditemmatriz = $(this).closest('.list-enunciados').data('coditemmatriz');
            $('#macro-modal-visualiza').modal({
                dismissible: false,
                ready: function (modal, trigger) { 

                    new GCS().setObj({
                        type: "GET",
                        dataType: 'html',
                        contentType: 'text/html',
                        url: urlVisualizarMacrodesafio + '?coditemmatriz=' + coditemmatriz,
                        success: function (data) {

                            $('#macro-modal-visualiza').html(data);
                        }
                    }).executar();
                }
            }).modal('open');
        });
    }

    function editar() {
        $('#cadastro-macrodesafio .list-macrodesafios .editar').off().click(function () {
            
            var elemento = $(this);
            var tabsVertical = elemento.parent().parent().parent().parent().parent().parent().parent().find(".tabs-vertical a.active");
            var coddesafio = elemento.closest('.list-macrodesafios').data('coddesafio');
            var codunidadeaprendizagem = elemento.closest('.list-macrodesafios').data('codunidadeaprendizagem');
            var codunidadeaprendizagemtrilha = elemento.closest('.list-macrodesafios').data('codunidadeaprendizagemtrilha');
            var ano = tabsVertical.data("ano");
            var semestre = tabsVertical.data("semestre");
            var nomeMicrodesafio = $(elemento).closest(".list-macrodesafios").find(".text-microdesafios").text().trim();

            $("#checkTrilha").attr("value", codunidadeaprendizagemtrilha);
            if (codunidadeaprendizagem && codunidadeaprendizagemtrilha) {
                new GCS().setObj({
                    type: 'GET',
                    contentType: 'text/html',
                    dataType: 'html',
                    url: urlLoadMacrodesafioItem + '?codunidadeaprendizagem=' + codunidadeaprendizagem + '&ano=' + ano + '&semestre=' + semestre + '&codunidadeaprendizagemtrilha=' + codunidadeaprendizagemtrilha + '&coddesafio=' + coddesafio,
                    success: function (data) {
                        $('#macro-modal').html(data);
                        $('#macro-modal').modal({
                            dismissible: false,
                            complete: function () {
                                AtualizaTabela();
                            }
                        }).modal('open');
                        $('.collapsible').collapsible();
                        bindFunctions();
                        listarQuestoesPorDescritorCollapse();

                        $('.macro-modal-content .salvar').off().click(function () {
                            $(this).attr('disabled', true);
                            salvarMacroItemModal();
                        });

                        updateCheckBoxOnLoad();
                        UnidadeAprendizagemListagemUas.desabilita();
                        $(".nome-microdesafio").text(nomeMicrodesafio);
                    },
                    error: function (err) {
                        Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }
                }).executar();
            }
        });
    }

    function updateCheckBoxOnLoad() {
        $("#macro-modal .lista-disciplina--collapsible div.collapsible-header").each((x, elem) => {
            $(elem).parent().find('.check-descritor .check').removeClass('hide');
            if (elem.dataset["quantidadequestoestotal"] == elem.dataset["quantidadequestoesselecionadas"]) {
                $(elem).parent().find(".check-descritor .checkbox-enunciado").prop("checked", true);
                $(elem).attr("data-preselecao", "all");
                $(elem).data("preselecao", "all");
            } else {
                $(elem).attr("data-preselecao", "not-all");
                $(elem).data("preselecao", "not-all");
            }

            checkAllMacroQuestoes();
        });
    }

    function excluir() {
        $('#cadastro-macrodesafio .list-macrodesafios .excluir').off().click(function () {

            var elemento = $(this);
            var coddesafio = elemento.closest('.list-macrodesafios').data('coddesafio');
            var data = {
                coddesafio: coddesafio
            };
            if (coddesafio) {

                new GCS().setObj({
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    url: urlExcluirDesafio,
                    success: function (data) {
                        if (data.status) {
                            AtualizaTabela();
                            Helper.OpenAlert({ title: "Macrodesafio excluído com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                        } else {
                            Helper.OpenAlert({ title: "Ops", msg: 'Ocorreu um erro ao excluir', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                        }
                    },
                    error: function (err) {
                        Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }
                }).executar();
            }
        });
    }

    function bindClickcancelarQuestao() {
        $("#cadastro-macrodesafio .icon-cancel-macro").off().click(function () {
            
            var elemento = $(this);
            var codunidadeaprendizagem = $('#cadastro-macrodesafio .list-macrodesafios').data('codunidadeaprendizagem');
            var coddesafioitem = $(this).closest(".list-enunciados").data('coddesafioitem');
            var questoesSelecionadas = 0;

            elemento.closest('.collapsible-body').find('.list-enunciados').each(function () {

                if ($(this).data('selecionado') === 'True') {
                    questoesSelecionadas++;
                }
            });

            if (questoesSelecionadas > 1) {
                Helper.OpenConfirm({
                    title: "Atenção!",
                    msg: "<strong>Quaisquer envio já realizados para esta questão serão ignorados. <br><br>Deseja realmente realizar o cancelamento?",
                    classtitle: "font-vermelho",
                    yes: function () {
                        Helper.CloseConfirm();
                        abrirModalCancelarQuestao(coddesafioitem, codunidadeaprendizagem, elemento);
                    },
                    no: function () {
                        Helper.CloseConfirm();
                    }
                });
            } else {
                Helper.OpenAlert({
                    title: "Não será possível cancelar a questão!",
                    msg: `Selecione no minimo duas questões! <br><br>Caso já tenha selecionado mais de uma questão, salve a operação e tente novamente.`,
                    classtitle: "font-vermelho-claro",
                    iconclass: "dissatisfaction",
                    icon: "fa-exclamation-triangle"
                });
            }
        });
    }

    function abrirModalCancelarQuestao(coddesafioitem, codunidadeaprendizagem, elemento) {

        $("#modal-justificativa-cancelamento-questao-macro").modal({ dismissible: false }).modal('open');
        $("#modal-justificativa-cancelamento-questao-macro .justificativa").val("").focus();
        $('.btn_cancelar_questao').attr('disabled', false).prop('disabled', false).css('pointer-events', '').removeClass("disabled");


        $("#modal-justificativa-cancelamento-questao-macro .btn_cancelar_questao").off().click(function () {
            cancelarQuestao(coddesafioitem, codunidadeaprendizagem, elemento);
        });
    }

    function cancelarQuestao(coddesafioitem, codunidadeaprendizagem, elemento) {

        var justificativa = $("#modal-justificativa-cancelamento-questao-macro .justificativa").val();
        if (justificativa) {
            $("#modal-justificativa-cancelamento-questao-macro .btn_cancelar_questao").attr('disabled', true).prop('disabled', true).css('pointer-events', 'none');
            Helper.showLoad();

            new GCS().setObj({
                type: 'GET',
                contentType: 'application/json',
                url: urlCancelarQuestaoMacro + '?codunidadeaprendizagem=' + codunidadeaprendizagem + '&coddesafioitem=' + coddesafioitem + '&justificativa=' + justificativa,
                success: function (data) {
                    Helper.hideLoad();

                    if (data.status) {
                        let linhaDesafioItem = $(".list-enunciados").filter((x, elem) => $(elem).data("coddesafioitem") == coddesafioitem);
                        linhaDesafioItem.find("input[type='checkbox']").prop("checked", false);
                        linhaDesafioItem.find(".icon-cancel-macro").hide();
                        linhaDesafioItem.find("input[type='checkbox']").attr('disabled', true).prop('disabled', true).css('pointer-events', 'none');
                        elemento.closest('.list-enunciados').data('selecionado', "False").attr('selecionado', "False");
                        elemento.closest('.list-enunciados').data('foicancelado', "True").attr('foicancelado', "True");
                        $("#modal-justificativa-cancelamento-questao-macro").modal('close');
                        Helper.OpenAlert({ title: "Questão cancelada com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                        //AtualizaTabela();

                    } else {

                        var msg = data.msgUser ? data.msgUser : "Ocorreu um erro ao cancelar";
                        Helper.OpenAlert({ title: "Não foi possível cancelar a questão", msg: msg, classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });

                    }

                    $("#modal-justificativa-cancelamento-questao-macro .btn_cancelar_questao").attr('disabled', false).prop('disabled', false).css('pointer-events', '');
                },
                error: function (error) {
                    Helper.hideLoad();

                    $("#modal-justificativa-cancelamento-questao-macro .btn_cancelar_questao").attr('disabled', false).prop('disabled', false).css('pointer-events', '');

                }
            }).executar();
        } else {

            Helper.OpenAlert({ title: "Campo obrigatório", msg: "Preencha a justificativa", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
        }
    }

    function habilitaItensCollapseComPermissao(elemento) {

        var totalquestoes = elemento.data('quantidadequestoestotal');
        var questoesDisabled = elemento.next().find('input.disabled').length;

        if (totalquestoes === questoesDisabled) {
            elemento.prev().find('input').attr('disabled', true).prop('disabled', true).css('pointer-events', 'none').addClass("disabled").prop("checked", false);
        }
        elemento.next().find('input.disabled').attr('disabled', true).prop('disabled', true).css('pointer-events', 'none').addClass("disabled").prop("checked", false);
    }



    return {
        init: init
    };
})();

$(Macrodesafio.init);