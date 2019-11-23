"use strict";

var CadastroEixo = (function () {
    var objList = [];
    var cursosList = [];

    // #region init

    function init() {
        bindFunctions();
    }

    // #endregion


    // #region bindFunctions

    function bindFunctions() {
        inicializaSelecao();
        inicializaCheck();
        atualizarQtdCurso();
        $('.paginacao').off().click(clickPaginacao);
        inicializaBuscas();
        inicializaModais();
        $('#cadastro-eixo').find('.btn.salvar').off().click(function () {
            salvar();
        });
        $('.modal-close').off().click(function () {
            $('#cadastro-eixo').find('.todos').click();
        });
    }

    // #endregion


    // #region inicializaGrupoSelecao

    function inicializaSelecao() {
        $('#cadastro-eixo .filtros .btn').off().click(function () {
            $('#cadastro-eixo .filtros .btn').removeClass('click');
            $(this).addClass('click');
            busca();
        });
        $('#modal-disciplinas .filtros .btn').off().click(function () {
            $('#modal-disciplinas .filtros .btn').removeClass('click');
            $(this).addClass('click');
            busca('#modal-disciplinas');
        });
        $('#modal-habilidades .filtros .btn').off().click(function () {
            $('#modal-habilidades .filtros .btn').removeClass('click');
            $(this).addClass('click');
            busca('#modal-habilidades');
        });
        $('#modal-descritores .filtros .btn').off().click(function () {
            $('#modal-descritores .filtros .btn').removeClass('click');
            $(this).addClass('click');
            busca('#modal-descritores');
        });
    }

    // #endregion


    // #region inicializaModais

    function inicializaModais() {
        $("#cadastro-eixo .link-modal").off().click(function () {
            abreModal('#modal-disciplinas', $(this));
        });
        $("#modal-disciplinas .link-modal").off().click(function () {
            abreModal('#modal-habilidades', $(this));
        });
        $("#modal-habilidades .link-modal").off().click(function () {
            abreModal('#modal-descritores', $(this));
        });

        $("#modal-habilidades .link-sidebar, #modal-descritores .link-sidebar").off().click(function () {
            abreModalSidebar($(this));
        });


    }

    // #endregion


    // #region abreModalSidebar

    function abreModalSidebar(elementoClicado) {

        var url = elementoClicado.data('url');
        var modal_referencia = elementoClicado.data('modal_referencia');
        var obj = {};
        obj.sidebar = modal_referencia === '#modal-disciplinas' ? false : true;

        new GCS().setObj({
            type: 'GET',
            contentType: 'text/html',
            dataType: 'html',
            url: url,
            success: function (data) {
                $('.modal.open').modal('close');
                $(modal_referencia).modal({
                    dismissible: false,
                    ready: function (modal, trigger) {

                        $(modal).html(data);
                        if (obj.sidebar) {
                            $(modal).find('.sidebar').show();
                        } else {
                            $(modal).find('.sidebar').hide();
                        }
                        inicializaBuscas();
                        inicializaCheck();
                        inicializaSelecao();
                        inicializaModais();
                        $(modal_referencia + ' .btn.salvar').click(function () {
                            salvar(modal_referencia);
                        });
                        $(modal_referencia + ' .btn.modais-salvar').click(function () {
                            salvarModais(modal_referencia);
                        });

                        $(modal_referencia).find('.todos').click();

                    }
                }).modal('open');
            }
        }).executar();
    }

    // #endregion

    // #region inicializaCheck

    function inicializaCheck() {
        check('#cadastro-eixo');
        addClassSelecionado();
        checkModais();
    }

    // #endregion


    // #region inicializaBuscas

    function inicializaBuscas() {
        $("#cadastro-eixo .icone-buscar").off().click(function () {
            busca();
        });
        $("#modal-disciplinas .icone-buscar").off().click(function () {
            busca('#modal-disciplinas');
        });
        $("#modal-habilidades .icone-buscar").off().click(function () {
            busca('#modal-habilidades');
        });
        $("#modal-descritores .icone-buscar").off().click(function () {
            busca('#modal-descritores');
        });

        $('#cadastro-eixo .filtros input').off().keyup(function (e) {
            if (e.keyCode === 13) {
                $(this).next().click();
            }
        });
        $('#modal-disciplinas .filtros input').off().keyup(function (e) {
            if (e.keyCode === 13) {
                $(this).next().click();
            }
        });
        $('#modal - habilidades .filtros input').off().keyup(function (e) {
            if (e.keyCode === 13) {
                $(this).next().click();
            }
        });
    }

    // #endregion


    // #region check

    function check(modal) {

        $(modal).find("thead .filled-in").off().click(function () {

            $(modal).find("tbody .item-list").each(function () {

                if (!$(this).is(".hide") && $(modal).find(".filled-in").prop("checked")) {
                    $(this).find(".filled-in").prop("checked", true);
                    $(this).addClass("active");
                } else {
                    $(this).find(".filled-in").prop("checked", false);
                    $(this).removeClass("active");
                }
            });
        });

        $(modal).find("tbody .item-list").off().click(function (e) {
            if (e.target.className === 'link-modal') return false;
            if ($(this).find(".filled-in").prop("checked")) {
                $(this).closest(".item-list").removeClass("active");
                $(this).find(".filled-in").prop("checked", false);
            } else {
                $(this).closest(".item-list").addClass("active");
                $(this).find(".filled-in").prop("checked", true);
            }

            var codcurso;
            var tr;
            var descricao;
            var encontrou;

            if ($(this).find(".filled-in").prop("checked")) {
                codcurso = $(this).data("codcurso");
                cursosList = cursosList.filter(x => x != codcurso);
                cursosList.push(codcurso);

                /* Verificando se existe codcurso no objeto */

                tr = $(this).closest('tr');
                descricao = $(tr).find('td.descricao').html();
                encontrou = false;

                for (var i = 0; i < objList.length; i++) {

                    if (objList[i].codcurso == codcurso) {
                        objList[i].associado = true;
                        encontrou = true;
                    }
                }

                if (!encontrou) {
                    objList.push({ codcurso: codcurso, descricao: descricao, associado: true });
                }

            } else {
                codcurso = $(this).data("codcurso");
                cursosList = cursosList.filter(x => x != codcurso);

                /* Verificando se existe codcurso no objeto */

                tr = $(this).closest('tr');
                descricao = $(tr).find('td.descricao').html();
                encontrou = false;

                for (var j = 0; j < objList.length; j++) {

                    if (objList[j].codcurso == codcurso) {
                        objList[j].associado = false;
                        encontrou = true;
                    }
                }

                if (!encontrou) {
                    objList.push({ codcurso: codcurso, descricao: descricao, associado: false });
                }
            }

            console.log(cursosList);
        });
    }

    // #endregion


    // #region abreModal

    function abreModal(el, elementoClicado) {
       
        var obj = verificaReferencia(el);

        var url = elementoClicado.data('url');

        new GCS().setObj({
            type: 'GET',
            contentType: 'text/html',
            dataType: 'html',
            url: url,
            success: function (data) {
                $('.modal.open').modal('close');
                $(obj.divReferencia).modal({
                    dismissible: false,
                    ready: function (modal, trigger) {

                        $(modal).html(data);
                        if (obj.sidebar) {
                            $(modal).find('.sidebar').show();
                        } else {
                            $(modal).find('.sidebar').hide();
                        }
                        inicializaBuscas();
                        inicializaCheck();
                        inicializaSelecao();
                        inicializaModais();
                        $(obj.divReferencia + ' .btn.salvar').click(function () {
                            salvar(obj.divReferencia);
                        });
                        $(obj.divReferencia + ' .btn.modais-salvar').click(function () {
                            salvarModais(obj.divReferencia);
                        });

                    }
                }).modal('open');
            }
        }).executar();

    }

    // #endregion


    // #region busca

    function busca(el, botaoPaginacao, callback) {
        
        var obj = verificaReferencia(el);
        var codEixo = $("#cadastro-eixo").data("codeixo");
        var texto = $(obj.divReferencia + " .buscar").val();
        var paginaatual = parseInt($(botaoPaginacao).data('pagina'));
        var filtrarTodos = $(obj.divReferencia).find('.filtros .btn.selecionado.click').length > 0 ? false : true;
        codEixo = !codEixo ? 0 : codEixo;

        if (typeof (e) === "object") {
            callback = scrollGrid;
        }

        new GCS().setObj({
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            dataType: 'html',
            processData: true,
            data: {
                obj_eixo: obj.objetocodeixo,
                texto: texto,
                paginaatual: paginaatual,
                todos: filtrarTodos
            },
            url: obj.url,
            success: function (data) {

                console.log($(obj.divReferencia + ' ' + obj.elementoHtmlRendezirar));
                $(obj.divReferencia + ' ' + obj.elementoHtmlRendezirar).html(data);
                inicializaSelecao();
                inicializaCheck();
                atualizarQtdCurso();
                $('.paginacao').off().click(clickPaginacao);
                inicializaBuscas();
                inicializaModais();
                $(obj.divReferencia + ' ' + obj.elementoHtmlRendezirar).find('.salvar').click(function () {
                    salvar();
                });
                $(obj.divReferencia + ' ' + obj.elementoHtmlRendezirar).find('.modais-salvar').click(function () {
                    salvarModais(obj.divReferencia);
                });

            }
        }).executar();
    }
    // #endregion


    // #region salvar

    function salvar(el) {
        var obj = verificaReferencia(el);
        var nomeEixo = $("#nome_eixo").val();
        var codEixo = $("#cadastro-eixo").data("codeixo");

        if (nomeEixo.trim()) {
            new GCS().setObj({
                type: 'POST',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                processData: true,
                data: {
                    cursos: objList,
                    nome_eixo: nomeEixo,
                    codeixo: codEixo
                },
                url: obj.urlSalvar,
                success: function (data) {

                    $('#cadastro-eixo').data('codeixo', data.codeixo);

                    Helper.OpenAlert({
                        title: data.status ? "Sucesso!" : "Ops",
                        msg: data.msg,
                        classtitle: data.status ? "font-verde" : "font-vermelho-claro",
                        iconclass: data.status ? "satisfaction" : "dissatisfaction",
                        icon: data.status ? "fa-check-circle" : "fa-exclamation-triangle",
                        close: function () {
                            window.location.replace("/eixo/index");
                        }
                    });
                },
                error: function (data) {
                    Helper.OpenAlert({
                        title: "Ops",
                        msg: 'Algo deu errado!',
                        classtitle: "font-vermelho-claro",
                        iconclass: "dissatisfaction",
                        icon: "fa-exclamation-triangle"
                    });
                }
            }).executar();

        } else {
            Helper.OpenAlert({
                title: "Ops",
                msg: 'Preencha o nome do eixo',
                classtitle: "font-vermelho-claro",
                iconclass: "dissatisfaction",
                icon: "fa-exclamation-triangle"
            });
        }
    }

    // #endregion


    // #region salvarModais

    function salvarModais(el) {
        
        var obj = verificaReferencia(el);
        var nomeEixo = $("#nome_eixo").val();
        var objetoFinal = new Object();
        objetoFinal.nome_eixo = nomeEixo;
        objetoFinal.obj_eixo = obj.objetocodeixo;
        objetoFinal[obj.objetocodeixo.nomeobjeto] = obj.target;
        console.log(objetoFinal);
        new GCS().setObj({
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            processData: true,
            data: objetoFinal,
            url: obj.urlSalvar,
            success: function (data) {

                $('#cadastro-eixo').data('codeixo', data.codeixo);

                Helper.OpenAlert({
                    title: data.status ? "Sucesso!" : "Ops",
                    msg: data.msg,
                    classtitle: data.status ? "font-verde" : "font-vermelho-claro",
                    iconclass: data.status ? "satisfaction" : "dissatisfaction",
                    icon: data.status ? "fa-check-circle" : "fa-exclamation-triangle"
                });

                $(el).find('.todos').click();
            },
            error: function (data) {
                Helper.OpenAlert({
                    title: "Ops",
                    msg: 'Algo deu errado!',
                    classtitle: "font-vermelho-claro",
                    iconclass: "dissatisfaction",
                    icon: "fa-exclamation-triangle"
                });
            }
        }).executar();
    }

    // #endregion


    // #region clickPaginacao

    function clickPaginacao() {
        busca(undefined, $(this));
    }

    // #endregion


    // #region getItemsSelecionadosModais

    function getItemsSelecionadosModais(elemento) {

        var nome_elemento = '';
        var codigoItems = [];

        switch (elemento) {
            case '#modal-disciplinas':
                nome_elemento = 'coddisciplina';
                break;
            case '#modal-habilidades':
                nome_elemento = 'codhabilidade';
                break;
            case '#modal-descritores':
                nome_elemento = 'coddescritor';
                break;
            default:
                nome_elemento = '';
        }

        $(elemento).find('.grid table tbody tr').each(function () {
            var tr = $(this);
            var obj = {};

            obj[nome_elemento] = tr.data('codigo');
            obj.descricao = tr.find('td.descricao').text();
            obj.associado = tr.find('[type="checkbox"]:checked').length > 0 ? true : false;


            codigoItems.push(obj);
        });
        return codigoItems;
    }

    // #endregion


    // #region atualizaQtdCurso

    function atualizarQtdCurso() {
        var contCurso = $(".cont-curso").data("contcurso");
        var contCursoPartial = $("tbody").find(".active").length;
        $(".cont-curso").html(`${contCursoPartial} /${contCurso}`);
    }

    // #endregion


    // #region verificaReferencia
    function verificaReferencia(elemento) {
       
        var result = {};

        switch (elemento) {
            case undefined:
                result.isModal = false;
                result.sidebar = false;
                result.divReferencia = '#cadastro-eixo';
                result.url = urlListaCursos;
                result.elementoHtmlRendezirar = '.grid-eixo-partial';
                result.urlSalvar = urlSalvarCursos;
                result.objetocodeixo = {
                    codeixo: $("#cadastro-eixo").data("codeixo"),

                };
                break;

            case '#modal-disciplinas':
                result.isModal = true;
                result.sidebar = false;
                result.divReferencia = elemento;
                result.url = urlListaDisciplina;
                result.elementoHtmlRendezirar = '.grid';
                result.urlSalvar = urlSalvarDisciplinas;
                result.target = getItemsSelecionadosModais(elemento),
                    result.objetocodeixo = {
                        codeixo: $("#cadastro-eixo").data("codeixo"),
                        codcurso: $(elemento).find('.modal-').data('codcurso'),
                        nomeobjeto: 'disciplinas'
                    };
                break;

            case '#modal-habilidades':
                result.isModal = true;
                result.sidebar = true;
                result.divReferencia = elemento;
                result.url = urlListaHabilidade;
                result.elementoHtmlRendezirar = '.grid';
                result.urlSalvar = urlSalvarHabilidades;
                result.target = getItemsSelecionadosModais(elemento),
                    result.objetocodeixo = {
                        codeixo: $("#cadastro-eixo").data("codeixo"),
                        codcurso: $(elemento).find('.modal-').data('codcurso'),
                        coddisciplina: $(elemento).find('.modal-').data('coddisciplina'),
                        nomeobjeto: 'habilidades'
                    };
                break;

            case '#modal-descritores':
                result.isModal = true;
                result.sidebar = true;
                result.divReferencia = elemento;
                result.url = urlListaDescritores;
                result.elementoHtmlRendezirar = '.grid';
                result.urlSalvar = urlSalvarDescritores;
                result.target = getItemsSelecionadosModais(elemento),
                    result.objetocodeixo = {
                        codeixo: $("#cadastro-eixo").data("codeixo"),
                        codcurso: $(elemento).find('.modal-').data('codcurso'),
                        coddisciplina: $(elemento).find('.modal-').data('coddisciplina'),
                        codhabilidade: $(elemento).find('.modal-').data('codhabilidade'),
                        nomeobjeto: 'descritores'
                    };
                break;

            default:
                result = {};
        }
        return result;
    }
    // #endregion


    // #region scrollGrid

    function scrollGrid() {
        Helper.scrollTopElement('.grid-eixo-partial');
    }

    // #endregion


    // #region addClassSelecionado

    function addClassSelecionado() {

        $("#cadastro-eixo .item-list").each(function () {

            if ($(this).find(".filled-in").prop("checked")) {

                $(this).addClass("active");
                $(this).find(".filled-in").prop("checked", true);
            } else {
                $(this).removeClass("active");
                $(this).find(".filled-in").prop("checked", false);
            }
        });
    }

    // #endregion


    // #region checkModais


    function checkModais() {

        // #region disciplinas

        $("#modal-disciplinas tbody .item-list").off().click(function () {

            console.log($(this).find(".filled-in").prop("checked"));
            if ($(this).find(".filled-in").prop("checked")) {

                $(this).removeClass("active");
                $(this).find(".filled-in").prop("checked", false);
            } else {
                $(this).addClass("active");
                $(this).find(".filled-in").prop("checked", true);
            }
        });

        $("#modal-disciplinas thead .filled-in").off().click(function () {
            if ($(this).prop("checked")) {
                $("#modal-disciplinas tbody .item-list").each(function () {
                    $(this).addClass("active");
                    $(this).find(".filled-in").prop("checked", true);
                });
            } else {
                $("#modal-disciplinas tbody .item-list").each(function () {
                    $(this).removeClass("active");
                    $(this).find(".filled-in").prop("checked", false);
                });
            }
        });

        // #endregion

        // #region habilidades

        $("#modal-habilidades tbody .item-list").off().click(function () {

            console.log($(this).find(".filled-in").prop("checked"));
            if ($(this).find(".filled-in").prop("checked")) {

                $(this).removeClass("active");
                $(this).find(".filled-in").prop("checked", false);
            } else {
                $(this).addClass("active");
                $(this).find(".filled-in").prop("checked", true);
            }
        });

        $("#modal-habilidades thead .filled-in").off().click(function () {
            if ($(this).prop("checked")) {
                $("#modal-habilidades tbody .item-list").each(function () {
                    $(this).addClass("active");
                    $(this).find(".filled-in").prop("checked", true);
                });
            } else {
                $("#modal-habilidades tbody .item-list").each(function () {
                    $(this).removeClass("active");
                    $(this).find(".filled-in").prop("checked", false);
                });
            }
        });

        // #endregion

        // #region descritores

        $("#modal-descritores tbody .item-list").off().click(function () {

            console.log($(this).find(".filled-in").prop("checked"));
            if ($(this).find(".filled-in").prop("checked")) {

                $(this).removeClass("active");
                $(this).find(".filled-in").prop("checked", false);
            } else {
                $(this).addClass("active");
                $(this).find(".filled-in").prop("checked", true);
            }
        });

        $("#modal-descritores thead .filled-in").off().click(function () {
            if ($(this).prop("checked")) {
                $("#modal-descritores tbody .item-list").each(function () {
                    $(this).addClass("active");
                    $(this).find(".filled-in").prop("checked", true);
                });
            } else {
                $("#modal-descritores tbody .item-list").each(function () {
                    $(this).removeClass("active");
                    $(this).find(".filled-in").prop("checked", false);
                });
            }
        });

        // #endregion
    }

    // #endregion

    return {
        init: init
    };

})();

$(CadastroEixo.init);

