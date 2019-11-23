"use strict";

var Indexe = (function () {

    function init() {
        bindFunctions();
        loadPage();
    }

    function loadPage() {
        setaValorDefaultSelect($('.lista-curso'), false);
        setaValorDefaultSelect($('.lista-disciplina'), true);
        setaValorDefaultSelect($('.lista-habilidade'), true);
        setaValorDefaultSelect($('.lista-descritor'), true);
    }

    function bindFunctions() {

        var elementosFiltros = $('.input-field select')
            .closest(".input-field")
            .filter((x, elem) => !$(elem).hasClass("lista-descritor"))
            .find("select");
        filtros(elementosFiltros);

        teclaEnterPesquisa();
        $('.paginacao').click(clickPaginacao);
        $('.excluir').off().click(excluirEixo);
        $('.pesquisar').click(pesquisarEixo);
    }

    function teclaEnterPesquisa() {

        $('.palavra-chave input').keyup(function (e) {
            if (e.keyCode == 13) {
                pesquisarEixo(1, scrollGrid);
            }
        });
    }

    function scrollGrid() {
        Helper.scrollTopElement('.listagem', '#eixos-estruturantes');
    }

    function clickPaginacao() {
        var pagina = $(this).data('pagina');
        pesquisarEixo(pagina);
    }

    function pesquisarEixo(e, callback) {
        var pagina = typeof(e) == "object" ? 1 : e;
        var codcurso = $('.lista-curso select').val();
        var coddisciplina = $('.lista-disciplina select').val();
        var codhabilidade = $('.lista-habilidade select').val();
        var coddescritor = $('.lista-descritor select').val();
        var paginaatual = $('.grid .paginaatual').data('paginaatual');
        var texto = $(".palavra-chave").find('input').val();

        if (typeof (e) == "object") 
            callback = scrollGrid;

        if (pagina > 0) {
            paginaatual = pagina;
        }
        
        new GCS().setObj({
            type: 'GET',
            url: `${urlListaEixos}?codcurso=${codcurso}&coddisciplina=${coddisciplina}&codhabilidade=${codhabilidade}&coddescritor=${coddescritor}&texto=${texto}&paginaatual=${paginaatual}`,
            success: function (result) {
                
                $('#eixos-estruturantes .grid').html(result.data);
                $('.paginacao').click(clickPaginacao);
                $('.excluir').off().click(excluirEixo);
                var html = `Resultados: ${result.qtde} registros encontrados`;
                $('.resultados').html(html);

                if (callback) callback();
            }
        }).executar();
    }

    function excluirEixo() {
        
        var codeixo = $(this).closest('tr').data('codeixo');
        var descricao = $(this).closest('tr').find('td:first-child').text();
        Helper.OpenConfirm({
            title: "Deseja realmente excluir eixo?",
            icon: 'fa-exclamation-triangle',
            iconclass: 'satisfaction-yellow',
            msg: `${descricao}`,
            classtitle: 'font-vermelho',
            yes: function () {

                Helper.CloseConfirm();
                new GCS().setObj({
                    type: 'GET',
                    contentType: 'text/html',
                    dataType: 'html',
                    url: `${urlExcluirEixo}?codEixo=${codeixo}`,
                    success: function (data) {
                        var result = JSON.parse(data);
                        if (result.status) {
                            Helper.OpenAlert({
                                title: result.msg,
                                msg: "",
                                classtitle: "font-verde",
                                iconclass: "satisfaction",
                                icon: "fa-check-circle"
                            });
                        } else {
                            Helper.OpenAlert({
                                title: "Ops",
                                msg: result.msg,
                                classtitle: "font-vermelho-claro",
                                iconclass: "dissatisfaction",
                                icon: "fa-exclamation-triangle"
                            });
                        }
                        atualizaListagemEixo();
                    }
                }).executar();
            },
            no: function () {
                Helper.CloseConfirm();
            },
            textno: 'Cancelar',
            textsim: 'Continuar'
        });
    }

    function atualizaListagemEixo() {
        
        var paginaatual = $('#eixos-estruturantes table').data('pagina');

        new GCS().setObj({
            type: 'GET',
            contentType: 'text/html',
            dataType: 'html',
            url: `${urlListaEixos}?paginaatual=${paginaatual}`,
            success: function (data) {
                $('#eixos-estruturantes .grid').html(data);
                $('.excluir').click(excluirEixo);
                $('.paginacao').click(atualizaListagemEixo);
            }
        }).executar();
    }

    function filtros(elem) {

        var codcurso;
        var coddisciplina;
        var codhabilidade;
        var url;
        var select;
        var codItem;

        $(elem).change(function () {

            if (!$(this).val()) return;

            if ($(this).closest('.input-field').is('.lista-curso')) {
                setaValorDefaultSelect($('.lista-disciplina'), true);
                setaValorDefaultSelect($('.lista-habilidade'), true);
                setaValorDefaultSelect($('.lista-descritor'), true);

                codcurso = $(this).val();
                url = `${urlListaDisciplinasFiltro}?codcurso=${codcurso}`;
                select = $('.lista-disciplina').find('select');
                codItem = "coddisciplina";

            } else if ($(this).closest('.input-field').is('.lista-disciplina')) {
                coddisciplina = $(this).val();
                url = `${urlListaHabilidadeFiltro}?codcurso=${codcurso}&coddisciplina=${coddisciplina}`;
                select = $('.lista-habilidade').find('select');
                codItem = "codhabilidade";

            } else if ($(this).closest('.input-field').is('.lista-habilidade')) {
                codhabilidade = $(this).val();
                url = `${urlListaDescritoresFiltro}?codhabilidade=${codhabilidade}&codcurso=${codcurso}&coddisciplina=${coddisciplina}`;
                select = $('.lista-descritor').find('select');
                codItem = "coddescritor";
            }

            if (codcurso) {
                new GCS().setObj({
                    type: 'GET',
                    url: url,
                    success: function (data) {
                        var listaFiltro = [{ value: null, text: "Selecione"}];

                        listaFiltro = data.lista.map(function (x) {

                            if (codItem == "coddisciplina") {
                                setaValorDefaultSelect($('.lista-habilidade'), true);
                                setaValorDefaultSelect($('.lista-descritor'), true);

                                return { value: x.coddisciplina, text: x.descricao };

                            } else if (codItem == "codhabilidade") {
                                setaValorDefaultSelect($('.lista-descritor'), true);

                                return { value: x.codhabilidade, text: x.descricao };

                            } else if (codItem == "coddescritor") {

                                return { value: x.coddescritor, text: x.descricao };
                            }
                        });

                        Helper.updateOptions(select, listaFiltro);
                    },
                    error: function (data) {
                        Materialize.toast('');
                        console.log('erro');
                    }
                }).executar();
            }
        });
    }

    function setaValorDefaultSelect(elem, desativado){
        $(elem).find('select').val(null);
        $(elem).find('input').prop("disabled", desativado);
        $(elem).find('input').val("Selecione");
    }


    return {
        init: init
    };

})();

$(Indexe.init);

