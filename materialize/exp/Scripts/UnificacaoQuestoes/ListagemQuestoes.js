"use strict";

var Unificacao = (function () {

    function init() {
        $("#partial-unificacao-pesquisa").hide();
        bindFunctions();


    }

    function bindFunctions() {
        bindAcoesResultadoPesquisa();
        $('.dropdown-content').off().click(function (event) {
            event.stopPropagation();
        });

        bindFiltro();
        eventosPesquisarQuestoes();
        verificarDuplicidadeQuestaoUnitaria();       
        $('.paginacao').off().click(clickPaginacao);
        bindAutoCompleteInputCursos();
        renderizarOpcoesDropDownResultado();
    }

    function bindAutoCompleteInputCursos() {
        var curso = "";
        new GCS().setObj({
            type: "POST",
            dataType: 'json',
            showLoad: false,
            contentType: 'application/json',
            url: urlObterCursos + "?curso=" + curso,
            success: function (data) {
                if (data.status) {
                    var cursos = {};

                    data.cursos.forEach(x => {
                        cursos[x] = null;
                    });

                    $('input.autocomplete').autocomplete({
                        data: cursos
                    });
                } else {
                    Helper.OpenAlert({ title: "Ops", msg: "Erro ao buscar os cursos", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            },
            error: function (err) {
                Helper.OpenAlert({ title: "Ops", msg: "Erro ao buscar os cursos", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            }
        }).executar();
    }

    function renderizarOpcoesDropDownResultado() {
        $('.dropdown-button').dropdown();
    } 

    function bindAcoesResultadoPesquisa() {
        $("body").on('DOMSubtreeModified', "#partial-unificacao-pesquisa", function () {
            if ($("#partial-unificacao-pesquisa").children().length > 0) {
                $("#partial-unificacao-pesquisa").show();
            } else {
                $("#partial-unificacao-pesquisa").hide();
            }
        });
    }

    function bindFiltro() {
        adicionarRemoverFiltro();
        removerFiltroBotaoFechar();
    }

    function removerFiltroBotaoFechar() {
        $(".filtros-tags .filtro-tag .close").off().click(function () {
            var nomeTagFiltro = $(this).closest(".filtro-tag").find(".nome").text().trim();
            var elementoCheckbox = $("#filtro-btn input[type='checkbox']").filter((x, elem) => $(elem).closest("li").find("label").text().trim() == nomeTagFiltro);
            elementoCheckbox.prop("checked", false);
        });
    }

    function adicionarRemoverFiltro() {
        $("#filtro-btn input[type='checkbox']").off().click(function() {
            var nomeTagFiltroCheckBox = $(this).closest("li").find("label").text().trim();
            if ($(this).prop("checked")) {
                $(".filtros-tags").append(ListagemQuestoesTemplates.obterTemplateFiltroTag(nomeTagFiltroCheckBox));
                removerFiltroBotaoFechar();
            } else {
                $(".filtros-tags .filtro-tag .nome").filter((x, elem) => $(elem).text().trim() == nomeTagFiltroCheckBox).closest(".filtro-tag").remove();
            }
        });
    }

    function obterCamposBusca(pagina = 1) {
        return {
            texto: $(".input-text-unuficacao").val(),
            filtros: $(".filtros-tags .filtro-tag .nome").map((x, elem) => $(elem).text()).toArray(),
            paginaAtual: pagina
        };
    }

    function eventosPesquisarQuestoes() {
        $("#pesquisar").off().click(function () {
            pesquisarQuestoes();
        });

        $(".input-text-unuficacao").keypress(function (e) {
            if (e.which == 13) {
                pesquisarQuestoes();
            }
        });
    }

    function clickPaginacao() {
        var pagina = $(this).data('pagina');
        pesquisarQuestoes(pagina);
    }

    function pesquisarQuestoes(pagina = 1) {
        $(".autocomplete-content").children().remove();
        var camposBusca = obterCamposBusca(pagina);

        new GCS().setObj({
            type: "POST",
            dataType: 'html',
            contentType: 'application/json',
            data: JSON.stringify(camposBusca),
            url: urlPesquisarQuestoes,
            success: function (data) {
                if (!Helper.isJSON(data)) {
                    $('#partial-unificacao-pesquisa').html(data);
                    renderizaAcoesPesquisa();
                    Helper.scrollTopElement("#partial-unificacao-pesquisa");
                    bindFunctions();
                } else {
                    Helper.OpenAlert({ title: "Ops", msg: "Erro ao realizar a pesquisa", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            },
            error: function (err) {
                Helper.OpenAlert({ title: "Ops", msg: "Erro ao realizar a pesquisa", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            }
        }).executar();
    }

    function renderizaAcoesPesquisa() {
        atualizaStatusBotoes();
        renderizarOpcoesDropDownResultado();
        verificarDuplicidadeQuestaoUnitaria();
        $(".btn-loading").hide();
        $(".unificar-resultados").off().click(() => $('#modal-load-unificacao').modal({ dismissible: false }).modal('open'));
    }

    function atualizaStatusBotoes() {
        var qtdColunas = $("table thead tr th").length;
        var idColumnNumber = 0;

        $("table tbody tr").each((x, elem) => {
            var htmlTd = "";
            idColumnNumber++;
            var coditem = $(elem).data("coditem");

            switch ($(elem).data("botao")) {
                case "botao-unificado":
                    htmlTd = ListagemQuestoesTemplates.obterBotaoUnificada(coditem, idColumnNumber);
                    break;
                case "botao-resultado":
                    htmlTd = ListagemQuestoesTemplates.obterBotaoResultado(coditem, idColumnNumber);
                    break;
                case "botao-nenhum-resultado":
                    htmlTd = ListagemQuestoesTemplates.obterBotaoNenhumResultado(coditem, idColumnNumber);
                    break;
                case "botao-unificar":
                    break;
                case "botao-verificar-duplicidades":
                    htmlTd = ListagemQuestoesTemplates.obterBotaoVerificarDuplicidade();
                    break;
            }

            if ($(elem).find("td").length < qtdColunas) {
                $(elem).append(htmlTd);
            } else {
                elem.querySelectorAll("td")[qtdColunas - 1].outerHTML = htmlTd;
            }

        });
    }

    function verificarDuplicidadeQuestaoUnitaria() {
        $("#partial-unificacao-pesquisa .unificar-questao-unidade").off().click(function () {
            mudarVisibilidadeCarregamentoVerificacaoDuplicidade(true, this);
            var coditem = [$(this).closest("tr").data("coditem")];
            verificarDuplicidadeQuestao(coditem, this);
        });
    }

    function mudarVisibilidadeCarregamentoVerificacaoDuplicidade(visivel, thisButton) {
        if (visivel) {
            $(thisButton).closest("td").find(".btn-loading").show();
            $(thisButton).closest("td").children().filter((x, elem) => !$(elem).hasClass("btn-loading")).hide();
        } else {
            $(thisButton).closest("td").find(".btn-loading").hide();
            $(thisButton).closest("td").children().filter((x, elem) => !$(elem).hasClass("btn-loading")).show();
        }
    }

    function verificarDuplicidadeQuestao(coditem, thisButton) {
        $("table .td-btn").attr('disabled', true).prop('disabled', true).css('pointer-events', 'none');
        new GCS().setObj({
            type: "GET",
            dataType: 'json',
            contentType: 'application/json',
            showLoad: false,
            url: `${urlVerificarDuplicidadeQuestao}?coditem=${coditem}&unificar=false`,
            success: function (data) {
                $("table .td-btn").attr('disabled', false).prop('disabled', false).css('pointer-events', '');
                mudarVisibilidadeCarregamentoVerificacaoDuplicidade(false, thisButton);

                if (data && data.status) {

                    if (data.dataUnificacao) {
                        mudarVisibilidadeDataExecucao("verificacao", false, thisButton);
                        mudarVisibilidadeDataExecucao("unificacao", true, thisButton, data.dataUnificacao);
                    } else if (data.dataVerificacao) {
                        mudarVisibilidadeDataExecucao("unificacao", false, thisButton);
                        mudarVisibilidadeDataExecucao("verificacao", true, thisButton, data.dataVerificacao);
                    }

                    $(thisButton).closest("tr").data("botao", data.botaoStatus);

                    renderizaAcoesPesquisa();


                } else {
                    Helper.OpenAlert({ title: "Ops", msg: "Erro ao realizar a verificação de duplicidade", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }

            },
            error: function (err) {
                Helper.OpenAlert({ title: "Ops", msg: "Erro ao realizar a verificação de duplicidade", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                $("table .td-btn").attr('disabled', false).prop('disabled', false).css('pointer-events', '');
                mudarVisibilidadeCarregamentoVerificacaoDuplicidade(false, thisButton);
            }
        }).executar();
    }

    function mudarVisibilidadeDataExecucao(nomeData, exibir, thisButton, valorData = "") {
        if (exibir) {
            $(thisButton).closest("tr").find("td.td-data").find(`.data-${nomeData}`).removeClass("hide");
            $(thisButton).closest("tr").find("td.td-data").find(`.data-${nomeData} span`).text(valorData);
        } else {
            $(thisButton).closest("tr").find("td.td-data").find(`.data-${nomeData}`).addClass("hide");
            $(thisButton).closest("tr").find("td.td-data").find(`.data-${nomeData} span`).text("");
        }

        if ($(thisButton).closest("tr").find(".td-data .data-execucoes span").text()) {
            $(thisButton).closest("tr").find("td.td-data").find(".arrow i").removeClass("hide");
        } else {
            $(thisButton).closest("tr").find("td.td-data").find(".arrow i").addClass("hide");
        }
    }

    return {
        init: init
    };
})();

$(Unificacao.init);