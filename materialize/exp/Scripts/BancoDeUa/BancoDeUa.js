"use strict";

var controller = 'UA',
    //onGridReady = function () {
    //    BancoDeUa.initGrid();
    //},

    BancoDeUa = (function () {

        function init() {
            setGridActions();
            bindFunctions();
            initGrid();
            FormValidations.init();
            Helper.init();
        }      

        function initGrid() {
            iniciarComponentesGrid();
            bindFunctionsGrid();
        }

        function iniciarComponentesGrid() {
            $('.dropdown-button').dropdown({
                constrainWidth: false,
                belowOrigin: true,
                stopPropagation: true
            });
        }

        function bindFunctions() {            

            PreencheDisciplinas();
            $('.btn-pesquisa-ua').click(clickPesquisa);
        }

        function bindFunctionsGrid() {
            $('.acoes-mobile').click(abrirModalAcoesMobile);
            $('.paginacao').click(clickPaginacao);
        }

        function apagarItemAprendizado(event) {
            if (event) {
                let codbaseunidadeaprendizagem = event.currentTarget.dataset["codunidade"];
                if (codbaseunidadeaprendizagem) {
                    let data = { codbaseunidadeaprendizagem: codbaseunidadeaprendizagem };
                    Helper.OpenConfirm({
                        title: "Atenção!",
                        msg: "<strong>Deseja realmente realizar a exclusão?</strong>",
                        classtitle: "font-vermelho",
                        yes: function () {
                            new GCS().setObj({
                                type: 'POST',
                                data: JSON.stringify(data),
                                contentType: 'application/json',
                                dataType: 'json',
                                url: `${urlApagarItemAprendizado}`,
                                success: function (data) {
                                    if (data.status) {
                                        $(".bloco-conteudo-padrao table tbody .-acoes .deletar").filter((x, elem) => elem.dataset["codunidade"] == codbaseunidadeaprendizagem).parent().parent().html("");

                                        let qtdRegistros = JSON.parse(document.querySelector(".qtdRegistros").innerText);
                                        if (qtdRegistros > 0) {
                                            document.querySelector(".qtdRegistros").innerText = (qtdRegistros - 1).toString();
                                        }

                                        Helper.OpenAlert({ title: "Excluído com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                                    } else {
                                        Helper.OpenAlert({ title: "Ops!", msg: data.msg, classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-frown-o" });
                                    }
                                },
                                error: function (data) {
                                    Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                                }
                            }).executar();
                            Helper.CloseConfirm();
                        },
                        no: function () {
                            Helper.CloseConfirm();
                        }
                    });
                }
            }
        }

        function PreencheDisciplinas() {

            new GCS().setObj({
                type: 'GET',
                url: urlGetDisciplinas,
                success: function (data) {

                    $('#ddlDisciplinaFiltro').append('<option value="" selected>Todas Disciplinas</option>');
                    $.each(data, function (i, item) {
                        $('#ddlDisciplinaFiltro').append('<option value=' + item.CODIGODISCIPLINA + '>' + item.DISCIPLINA + '</option>');
                    });

                    $('select').material_select();
                }
            }).executar();
        }

        function clickPesquisa() {
           
            var valorBusca = $("#txtPesquisa").val().replace('#', '');
            var statusUA = $("input[name='statusua']:checked").val();
            if (!statusUA) {
                statusUA = "";
            }

            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: "/UA/ListaBaseItens/?filtro=" + valorBusca + "&coddisciplina=" + $('#ddlDisciplinaFiltro').val() + "&status=" + statusUA + "&usuariocriador=" + $("#usuarioCriador").val().replace('#', '') + "&usuarioultimaatualizacao=" + $("#usuarioUltimaAtualizacao").val().replace('#', ''),
                success: function (data) {
                    $('.tblbasesitens').html(data);
                    $('.paginacao').click(clickPaginacao);
                    $(".bloco-conteudo-padrao table tbody .-acoes .deletar").click(x => apagarItemAprendizado(x));
                    Helper.scrollTopElement('.resultados-qtd', 910);
                }
            }).executar();
        }

        function clickPaginacao() {

            var paginaatual = parseInt($(this).data('pagina'));
            var statusUA = $("input[name='statusua']:checked").val();
            if (!statusUA) {
                statusUA = "";
            }

            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: "/UA/ListaBaseItens/?filtro=" + $("#txtPesquisa").val() + "&coddisciplina=" + $('#ddlDisciplinaFiltro').val() + "&status=" + statusUA + "&paginaatual=" + paginaatual,
                success: function (data) {
                    $('.tblbasesitens').html(data);
                    $('.paginacao').click(clickPaginacao);
                }
            }).executar();
        }

        function abrirModalAcoesMobile() {

            var modal = $('#modalBottomAcoesUnidades');
            modal.find('a').data('codunidade', $(this).data('codunidade'));
            modal.find('a').data('codempresa', $(this).data('codempresa'));
            modal.find('a').data('codunidadepolo', $(this).data('codunidadepolo'));
            modal.modal('open');
            modal.find('a').click(clickAcoes);

        }

        function clickAcoes() {

        }

        function setGridActions() {
            $('.grid-acoes').appendTo('.cmp-filtro-avancado .acoes');
        }

        return {
            initGrid: initGrid,
            init: init
        };
    })();

$(BancoDeUa.init);

