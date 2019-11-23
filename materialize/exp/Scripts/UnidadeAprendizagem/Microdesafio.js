"use strict";

var Microdesafio = (function () {

    function init() {
        
        functionBase();
        bindFunctions();
    }

    function functionBase() {
        abrirModal();
        checkTodosDescritores();
        checkAllMicroQuestoes();     
        chamaParcialAbaMicroDesafio();
        addAnoSemestre();
        chamaPrimeiraAba();
        verificaExibicaoDivsAbas();
    }

    function bindFunctions() {
        $('select').material_select();
        $('ul.tabs').tabs();
        salvarMicroItemModal();
        editar();
        excluir();
        avancar();
        $("#cadastro-microdesafio .divs-abas").bind("DOMSubtreeModified", verificaExibicaoDivsAbas);
    }

    function bindClickcancelarQuestao() {
        $("#cadastro-microdesafio .icon-cancel-micro").off().click(function () {

            var coddesafioitem = $(this).closest(".list-enunciados").attr("data-coddesafioitem");
            var codunidadeaprendizagem = $("#codunidadeaprendizagem").val();

            var disponibilidadeQuestoes = $(".target-qtdQuestoes select").val();
            var qtdQuestoesSelecionadas = obterQtdQuestoesSelecionadas(disponibilidadeQuestoes);

            disponibilidadeQuestoes = disponibilidadeQuestoes != "" ? parseInt(disponibilidadeQuestoes) : 0;

            if (qtdQuestoesSelecionadas > disponibilidadeQuestoes) {
                new GCS().setObj({
                    type: 'GET',
                    contentType: 'application/json',
                    url: urlAlgumAlunoJaRespondeuAQuestao + '?coddesafioitem=' + coddesafioitem + '&codunidadeaprendizagem=' + codunidadeaprendizagem,
                    success: function (data) {

                        if (data['status']) {

                            Helper.OpenConfirm({
                                title: "Atenção!",
                                msg: "<strong>A questão já foi respondida, deseja realmente realizar o cancelamento?</strong>",
                                classtitle: "font-vermelho",
                                yes: function () {
                                    Helper.CloseConfirm();
                                    abrirModalCancelarQuestao(coddesafioitem, codunidadeaprendizagem);
                                },
                                no: function () {
                                    Helper.CloseConfirm();
                                }
                            });

                        } if (!data['status']) {

                            abrirModalCancelarQuestao(coddesafioitem, codunidadeaprendizagem);

                        }
                    }
                }).executar();
            } else {
                Helper.OpenAlert({ title: "Não será possível cancelar a questão", msg: "O número de questões selecionadas deve ser maior a disponibilidade de questões.", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            }
        })
    }

    function abrirModalCancelarQuestao(coddesafioitem, codunidadeaprendizagem) {
        $("#modal-justificativa-cancelamento-questao-micro").modal({ dismissible: false }).modal('open');

        $("#modal-justificativa-cancelamento-questao-micro .justificativa").val("")
        

        $("#modal-justificativa-cancelamento-questao-micro .btn_cancelar_questao").off().click(function () {
            cancelarQuestao(coddesafioitem, codunidadeaprendizagem);
        });
    }

    function cancelarQuestao(coddesafioitem, codunidadeaprendizagem) {
        var justificativa = $("#modal-justificativa-cancelamento-questao-micro .justificativa").val();

        if (justificativa) {
            $("#modal-justificativa-cancelamento-questao-micro .btn_cancelar_questao").attr('disabled', true).prop('disabled', true).css('pointer-events', 'none');
            Helper.showLoad();

            new GCS().setObj({
                type: 'GET',
                contentType: 'application/json',
                url: urlCancelarQuestaoMicro + '?codunidadeaprendizagem=' + codunidadeaprendizagem + '&coddesafioitem=' + coddesafioitem + '&justificativa=' + justificativa,
                success: function (data) {
                    Helper.hideLoad();

                    if (data.status) {
                        var linhaDesafioItem = $(".list-enunciados").filter((x, elem) => $(elem).data("coddesafioitem") == coddesafioitem);
                        linhaDesafioItem.find("input[type='checkbox']").prop("checked", false);
                        linhaDesafioItem.find(".icon-cancel-micro").hide();
                        linhaDesafioItem.find("input[type='checkbox']").attr('disabled', true).prop('disabled', true).css('pointer-events', 'none');
                        

                        Helper.OpenAlert({ title: "Questão cancelada com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                        $("#modal-justificativa-cancelamento-questao-micro").modal('close');
                        $("#micro-modal").modal('close');

                    } else {

                        var msg = data.msgUser ? data.msgUser : "Ocorreu um erro ao cancelar";
                        Helper.OpenAlert({ title: "Não foi possível cancelar a questão", msg: msg, classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });

                    }

                    $("#modal-justificativa-cancelamento-questao-micro .btn_cancelar_questao").attr('disabled', false).prop('disabled', false).css('pointer-events', '');
                },
                error: function (error) {
                    Helper.hideLoad();

                    $("#modal-justificativa-cancelamento-questao-micro .btn_cancelar_questao").attr('disabled', false).prop('disabled', false).css('pointer-events', '');

                }
            }).executar();
        } else {

            Helper.OpenAlert({ title: "Campo obrigatório", msg: "Preencha a justificativa", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });

        }
        
    }

    function verificaExibicaoSelectQtd() {
        var qtdTotal = 0;
        $("#cadastro-microdesafio .collapsible-header").each((x, elem) => qtdTotal += $(elem).data("quantidadequestoesselecionadas"));
        if (qtdTotal > 0 && !JSON.parse(houveLiberacaoUA.toLowerCase())) {
            $(".select-questao input").attr('disabled', false).prop('disabled', false).css('pointer-events', '');
        } else {
            $(".select-questao input").attr('disabled', true).prop('disabled', true).css('pointer-events', 'none');
        }
    }

    function visualizarEnunciado() {
        $("#micro-modal .collapsible-header.active + .collapsible-body .icon-visualizar").on("click", function () {
            var coditemmatriz = $(this).closest('.list-enunciados').data('coditemmatriz');
            new GCS().setObj({
                type: "GET",
                dataType: 'html',
                contentType: 'text/html',
                url: urlVisualizarItemMicroDesafio + '?coditemmatriz=' + coditemmatriz,
                success: function (data) {
                    $('#micro-modal-visualiza').html(data);
                    $('#micro-modal-visualiza').modal({ dismissible: false }).modal('open');
                    $('.collapsible').collapsible();
                }
            }).executar();
        });
    }

    function chamaPrimeiraAba() {
        $('#cadastro-microdesafio .abas-vertical .tabs-vertical li a').first().click();
    }

    function verificaExibicaoDivsAbas() {
        let divsAbas = $("#cadastro-microdesafio .divs-abas");
        if (divsAbas.children().length > 0) {
            divsAbas.show();
        } else {
            divsAbas.hide();
        }
    }

    function LoadModalDesafioMicro() {
        $('select.target-qtdQuestoes').val(qtdQuestoes);
        $('select').material_select();
    }

    function abrirModal() {
        $("#cadastro-microdesafio .btn-addMicro").off().click(function () {
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
                    url: urlLoadMicrodesafioItem + '?codunidadeaprendizagem=' + codunidadeaprendizagem + '&ano=' + ano + '&semestre=' + semestre,
                    success: function (data) {
                        $('#micro-modal').html(data);
                        $('#micro-modal').modal({ dismissible: false }).modal('open');
                        $('.collapsible').collapsible();
                        atualizarDisponibilidadeQuestoes();
                        listarQuestoesPorDescritorCollapse();
                        validarQtdQuestoes();
                        salvarMicroItemModal();
                        LoadModalDesafioMicro();
                        verificaExibicaoSelectQtd();
                        $(".nome-microdesafio").text("Novo Microdesafio");
                    }
                }).executar();
            }
        });
    }

    function checkTodosDescritores() {
        $("#checkbox-todos-descritores").on("click", function () {
            if ($(this).is(":checked")) {
                $(".checkbox-descritor").not(this).prop('checked', this.checked);
            } else {
                $(".checkbox-descritor").prop('checked', false);
            }
        });
    }

    function checkAllMicroQuestoes() {

        $("#cadastro-microdesafio .checkbox-enunciado").off().change(function () {
            
            var elemento = $(this);
            let collasibleHeader = $(this).parent().parent().parent().find(".collapsible-header");
            if (this.checked) {
                elemento.closest('li').find(".collapsible-body .checkbox-enunciado-item").each(function () {
                    this.checked = true;
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
            obterHTMLSelectQuantidadeQuestoes();
            verificaExibicaoSelectQtd();
        });

        $("#cadastro-microdesafio .collapsible-body .checkbox-enunciado-item").off().change(function () {
            
            var elemento = $(this);
            if ($(this).is(":checked")) {
                var isAllChecked = 0;
                elemento.closest('li').find(".collapsible-body .checkbox-enunciado-item").each(function () {
                    if (!this.checked)
                        isAllChecked = 1;
                });
                if (isAllChecked === 0) {
                    elemento.closest('li').find(".check-descritor .checkbox-enunciado").prop("checked", true);

                }
                let collasibleHeader = $(this).parent().parent().parent().parent().find(".collapsible-header");
                collasibleHeader.attr("data-quantidadequestoesselecionadas", parseInt(collasibleHeader.data("quantidadequestoesselecionadas")) + 1);
                collasibleHeader.data("quantidadequestoesselecionadas", parseInt(collasibleHeader.data("quantidadequestoesselecionadas")) + 1);
            } else {
                elemento.closest('li').find(".check-descritor .checkbox-enunciado").prop("checked", false);
                let collasibleHeader = $(this).parent().parent().parent().parent().find(".collapsible-header");
                collasibleHeader.attr("data-quantidadequestoesselecionadas", parseInt(collasibleHeader.data("quantidadequestoesselecionadas")) - 1);
                collasibleHeader.data("quantidadequestoesselecionadas", parseInt(collasibleHeader.data("quantidadequestoesselecionadas")) - 1);
            }
            obterHTMLSelectQuantidadeQuestoes();
            verificaExibicaoSelectQtd();
        });
    }

    function validarQtdQuestoes() {
        
        $('.target-qtdQuestoes').on('change', function (e) {
            e.stopImmediatePropagation();
            //var questoesSelecionadas = $('#micro-modal .lista-disciplina--collapsible .collapsible-header').parent().find('.collapsible-body input[type="checkbox"]:checked').length
            var disponibilidadeDeQuestoes = e.target.value;
           
            let questoesSelecionadas = obterQtdQuestoesSelecionadas(disponibilidadeDeQuestoes);

            if (disponibilidadeDeQuestoes > questoesSelecionadas) {
                Materialize.toast('O número de questões selecionadas deve ser maior ou igual a disponibilidade de questões.', 7000, 'red');

                obterHTMLSelectQuantidadeQuestoes();
            } else {
                $('#micro-modal .btn.salvar').removeClass('disabled');

            }

        });
    }

    function obterQtdQuestoesSelecionadas(disponibilidadeDeQuestoes) {
        let questoesSelecionadas = 0;
        document.querySelectorAll("#micro-modal .lista-disciplina--collapsible div.collapsible-header").forEach(x => questoesSelecionadas += parseInt(x.dataset["quantidadequestoesselecionadas"]))

        return questoesSelecionadas;
    }

    function obterHTMLSelectQuantidadeQuestoes() {
        if (!JSON.parse(houveLiberacaoUA.toLowerCase())){
            var html = `<select class="target-qtdQuestoes">
                <option value="" disabled selected>Selecione</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                </select>
                <label for="target-qtdQuestoes">Selecione a quantidade de questões que serão exibidas para o aluno</label>
                `;
            $('.select-questao').html(html);
            $('.target-qtdQuestoes').material_select();
            $('#micro-modal .btn.salvar').addClass('disabled');
            validarQtdQuestoes();
        }
    }

    function pegaItensMicroModal() {
        var arr = [];

        var listaItem = $('#micro-modal .lista-disciplina--collapsible .collapsible-header').parent().find('.collapsible-body input[type="checkbox"]')
        listaItem.each(function () {
            var obj = {
                coditemmatriz: $(this).closest('.list-enunciados').data('coditemmatriz'),
                selecionado: $(this).is(':checked'),
                codunidadeaprendizagemtrilha: $(this).closest('.list-enunciados').data('codunidadeaprendizagemtrilha'),
            };
            arr.push(obj);
        });
        return arr;
    }

    function salvarMicroItemModal() {
        $('.micro-modal-content .salvar').off().click(function () {
        $('.micro-modal-content .salvar').off('click');

            var disponibilidadeQuestoes = $(".target-qtdQuestoes select").val();
            let questoesSelecionadas = obterQtdQuestoesSelecionadas(disponibilidadeQuestoes);

            if (disponibilidadeQuestoes > questoesSelecionadas) {
                Materialize.toast('O número de questões selecionadas deve ser maior ou igual a disponibilidade de questões.', 7000, 'red');
                salvarMicroItemModal();
            } else {
                var ano = $('#cadastro-microdesafio .abas-vertical .tabs-vertical li a.active').data('ano');
                var semestre = $('#cadastro-microdesafio .abas-vertical .tabs-vertical li a.active').data('semestre');
                var codUnidadeAprendizagem = $('#codunidadeaprendizagem').val();
                var codItems = pegaItensMicroModal();
                var qtdquestoes = $('select.target-qtdQuestoes').val();
                var codunidadeaprendizagemtrilha = $(".lista-disciplina--collapsible").data("codunidadeaprendizagemtrilha");

                var obj = {
                    codUnidadeAprendizagem: codUnidadeAprendizagem,
                    codItems: codItems,
                    qtdquestoes: qtdquestoes,
                    ano: ano,
                    semestre: semestre,
                    coddesafio: codigodesafio,
                    codunidadeaprendizagemtrilha: codunidadeaprendizagemtrilha
                };

                new GCS().setObj({
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(obj),
                    url: urlSalvarMicrodesafio,
                    success: function (data) {

                        if (data.status) {
                            Helper.OpenAlert({
                                title: "Microdesafio salvo com sucesso!",
                                msg: "",
                                classtitle: "font-verde",
                                iconclass: "satisfaction",
                                icon: "fa-check-circle",
                                close: function () {

                                    var etapaConclusao = $('.wizard_new .clickoption[data-href$="/UnidadeAprendizagem/LoadConclusao"]');
                                    if (etapaConclusao.closest('li').hasClass('wizard_new--done')) {
                                        $('.wizard_new a[data-href$="/UnidadeAprendizagem/LoadOrganizacao"]').click();
                                    } 

                                    $("#cadastro-microdesafio #micro-modal").modal('close');
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
        });
    }

    function pegaItens() {
        var arr = [];
        var listaItem = $('#cadastro-microdesafio .container-enunciados .list-enunciados');
        listaItem.each(function () {
            var obj = {
                coditemmatriz: $(this).data('coditemmatriz'),
                selecionado: $(this).find('[type="checkbox"]').is(':checked')
            };
            arr.push(obj);
        });
        return arr;
    }

    function salvarMicroDesafio() {
         
        var codunidadeaprendizagem = $('#codunidadeaprendizagem').val();
        var qtdQuestoes = $('#cadastro-microdesafio select.target-qtdQuestoes').val();
        var codigosMicrodesafio = pegaItens();
        
        var data = {
            codunidadeaprendizagem: codunidadeaprendizagem,
            coditems: codigosMicrodesafio,
            qtdquestoes: qtdQuestoes
        };

        if (codunidadeaprendizagem) {

            new GCS().setObj({
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                url: urlSalvarMicrodesafio,
                success: function (data) {
                    
                    if (data.status) {
                        $('#micro-modal').modal('close');
                        UnidadeAprendizagemListagemUas.vaiParaEtapa(6, $('#codunidadeaprendizagem').val());
                        Helper.OpenAlert({ title: "Microdesafio salvo com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                    } else {
                        Helper.OpenAlert({ title: "Ops", msg: 'Ocorreu um erro ao salvar', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }
                }
            }).executar();

        } else {
            Helper.OpenAlert({ title: "Ops", msg: 'Selecione uma opção', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
        }
    }

    function editar() {
        $('#cadastro-microdesafio .list-microdesafios .editar').off().click(function () {
            
            var elemento = $(this);
            var coddesafio = elemento.closest('.list-microdesafios').data('coddesafio');
            var codunidadeaprendizagem = elemento.closest('.list-microdesafios').data('codunidadeaprendizagem');
            var codunidadeaprendizagemtrilha = elemento.closest('.list-microdesafios').data('codunidadeaprendizagemtrilha');
            var tabsVertical = elemento.parent().parent().parent().parent().parent().parent().parent().find(".tabs-vertical a.active");
            var ano = tabsVertical.data("ano");
            var semestre = tabsVertical.data("semestre");
            var nomeMicrodesafio = $(elemento).closest(".list-microdesafios").find(".text-microdesafios").text().trim();

            $("#checkTrilha").attr("value", codunidadeaprendizagemtrilha);
            if (codunidadeaprendizagem && codunidadeaprendizagemtrilha) {
                new GCS().setObj({
                    type: 'GET',
                    contentType: 'text/html',
                    dataType: 'html',
                    url: urlLoadMicrodesafioItem + '?codunidadeaprendizagem=' + codunidadeaprendizagem + '&ano=' + ano + '&semestre=' + semestre + '&codunidadeaprendizagemtrilha=' + codunidadeaprendizagemtrilha + '&coddesafio=' + coddesafio,
                    success: function (data) {
                        $('#micro-modal').html(data);
                        $('#micro-modal').modal({ dismissible: false }).modal('open');
                        $('.collapsible').collapsible();
                        bindFunctions();
                        atualizarDisponibilidadeQuestoes();
                        listarQuestoesPorDescritorCollapse();
                        validarQtdQuestoes();
                        salvarMicroItemModal();
                        LoadModalDesafioMicro();
                        updateCheckBoxOnLoad();
                        UnidadeAprendizagemListagemUas.desabilita();
                        $(".nome-microdesafio").text(nomeMicrodesafio);

                        if (JSON.parse(houveLiberacaoUA.toLowerCase())) {
                            $(".target-qtdQuestoes input").attr('disabled', true).prop('disabled', true).css('pointer-events', 'none');
                        }
                    },
                    error: function (err) {
                        Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }
                }).executar();
            }
        });
    }

    function updateCheckBoxOnLoad() {
        $("#micro-modal .lista-disciplina--collapsible div.collapsible-header").each((x, elem) => {
            $(elem).parent().find('.check-descritor .check').removeClass('hide');
            if (elem.dataset["quantidadequestoestotal"] == elem.dataset["quantidadequestoesselecionadas"]) {
                $(elem).parent().find(".check-descritor .checkbox-enunciado").prop("checked", true);
                $(elem).attr("data-preselecao", "all");
                $(elem).data("preselecao", "all");
            } else {
                $(elem).attr("data-preselecao", "not-all");
                $(elem).data("preselecao", "not-all");
            }

            checkAllMicroQuestoes();
        });
    }

    function excluir() {
        $('#cadastro-microdesafio .list-microdesafios .excluir').off().click(function () {
            
            var elemento = $(this);
            var coddesafio = elemento.closest('.list-microdesafios').data('coddesafio');
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
                            removedaTabela(coddesafio);
                            Helper.OpenAlert({ title: "Microdesafio excluído com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
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

    function removedaTabela(coddesafio) {
        var itens = $('#cadastro-microdesafio .divs-abas .list-microdesafios');

        itens.each(function () {
            var cod = $(this).data('coddesafio');
            if (cod === coddesafio) {
                $(this).remove();
                AtualizaTabela();
            }
        });
    }

    function AtualizaTabela() {
        $('#cadastro-microdesafio .abas-vertical .tabs-vertical li a.active').click();
    }

    function avancar() {
        $('#cadastro-microdesafio .avancar').off().click(function () {
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
        });
    }

    function atualizarDisponibilidadeQuestoes() {
        $(".micro-modal-content > .container-disponibilidade-questoes .target-qtdQuestoes select").val(qtdQuestoes);
        $('select').material_select();
    }

    function listarQuestoesPorDescritorCollapse() {
        $('#micro-modal .lista-disciplina--collapsible .collapsible-header').off().click(function () {
            
            var elemento = $(this);
            if (!$(this).hasClass('active') && elemento.parent().find('.collapsible-body input[type="checkbox"]').length == 0) {
                var codunidadeaprendizagem = $('#codunidadeaprendizagem').val();
                var coddescritor = elemento.data('coddescritor');
                var codunidadeaprendizagemtrilha = $(".lista-disciplina--collapsible").data("codunidadeaprendizagemtrilha");

                new GCS().setObj({
                    contentType: 'text/html',
                    dataType: 'html',
                    url: urlListarQuestoesMicrodesafio,
                    data: { codunidadeaprendizagem: codunidadeaprendizagem, codunidadeaprendizagemtrilha: codunidadeaprendizagemtrilha, coddescritor: coddescritor, coddesafio: codigodesafio },
                    type: 'GET',
                    processData: true,
                    success: function (data) {
                        
                        elemento.siblings('.collapsible-body').html(data);
                        elemento.closest('li').find('.check-descritor .check').removeClass('hide');
                        checkAllMicroQuestoes();
                        visualizarEnunciado();
                        var checks = elemento.parent().find('.collapsible-body .list-enunciados--check input[type="checkbox"]');
                        var collapsibleHeader = checks.parent().parent().parent().parent().find(".collapsible-header");

                        if (elemento.parent().find('.check-descritor input[type="checkbox"]:checked').length > 0) {
                            checks.prop("checked", true);

                            collapsibleHeader.attr("data-quantidadequestoesselecionadas", parseInt(collapsibleHeader.data("quantidadequestoestotal")));
                            collapsibleHeader.data("quantidadequestoesselecionadas", parseInt(collapsibleHeader.data("quantidadequestoestotal")));

                        } else if ((elemento.data("preselecao") && elemento.data("preselecao") == "not-all" && checks.filter((x, elem) => elem.checked).length == 0) || !elemento.data("preselecao")) {
                            checks.prop("checked", false);

                            collapsibleHeader.attr("data-quantidadequestoesselecionadas", 0);
                            collapsibleHeader.data("quantidadequestoesselecionadas", 0);
                        }

                        collapsibleHeader.attr("data-preselecao", "");
                        collapsibleHeader.data("preselecao", "");
                        UnidadeAprendizagemListagemUas.desabilita();
                        bindClickcancelarQuestao();

                        habilitaItensCollapseComPermissao(elemento);
                    },
                    showLoad: false,
                    error: function (data) {
                        console.log(data);
                    }
                }).executar();
            } else {
                if (elemento.parent().find('.collapsible-body input[type="checkbox"]').length == 0) {
                    elemento.closest('li').find('.check-descritor .check').addClass('hide');
                } else {
                    elemento.closest('li').find('.check-descritor .check').removeClass('hide');
                }

                habilitaItensCollapseComPermissao(elemento);
            }
        });
    }

    function habilitaItensCollapseComPermissao(elemento) {
        if (JSON.parse(houveLiberacaoUA.toLowerCase())) {
            if (possuiPermissaoCancelamentoQuestao) {
                if ($(elemento).parent().find('.collapsible-body input[type="checkbox"]:checked').length > 0) {
                    $(elemento).parent().find('.collapsible-body input[type="checkbox"]:unchecked').attr('disabled', false).prop('disabled', false).css('pointer-events', '').removeClass("disabled")
                    $(".micro-modal-content .salvar").attr('disabled', false).prop('disabled', false).css('pointer-events', '').removeClass("disabled");
                    $("#modal-justificativa-cancelamento-questao-micro .btn_cancelar_questao").attr('disabled', false).prop('disabled', false).css('pointer-events', '');
                } else {
                    $(elemento).parent().find('.collapsible-body input[type="checkbox"]').attr('disabled', true).prop('disabled', true).css('pointer-events', 'none').addClass("disabled")
                    $(".micro-modal-content .salvar").attr('disabled', true).prop('disabled', true).css('pointer-events', 'none').addClass("disabled");
                    $("#modal-justificativa-cancelamento-questao-micro .btn_cancelar_questao").attr('disabled', true).prop('disabled', true).css('pointer-events', 'none');
                }
            }

            $(elemento).parent().find('.collapsible-body input[type="checkbox"]').each((x, elem) => {
                if (JSON.parse($(elem).closest(".list-enunciados").data("cancelado").toLowerCase())) {
                    $(elem).attr('disabled', true).prop('disabled', true).css('pointer-events', 'none').addClass("disabled");
                }
            });
        }
    }

    function addAnoSemestre() {
        $('#cadastro-microdesafio .btnAddAnoSemestre .btn').off().click(function () {
            var ano = $('#cadastro-microdesafio .ano-semestre #ano').val();
            var semestre = $('#cadastro-microdesafio .ano-semestre #semestre').val();
            if (ano && semestre) {
                var existe = verificaAbaExistente(ano,semestre);
                if (!existe) {

                    var li = ' <li class="tab col s3"><a data-ano="' + ano + '" data-semestre="' + semestre + '" href="#' + ano + '-' + semestre + '">' + ano + ' / ' + semestre + '</a></li>';
                    var div = ' <div id="' + ano + '-' + semestre + '" class="col s12"></div>';
                    $('.tabs-vertical').append(li);
                    $('.divs-abas').append(div);
                    setTimeout(function () {
                        chamaParcialAbaMicroDesafio();
                        $('#cadastro-microdesafio .abas-vertical .tabs-vertical li a').last().click();
                    }, 100);
                } else {
                    Helper.OpenAlert({ title: "Ops", msg: 'O ano e semestre escolhido já se encontra cadastrado.', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            }
        });
    }

    function verificaAbaExistente(ano, semestre) {
        var abasExistentes = $('#cadastro-microdesafio .abas-vertical .tabs-vertical li a');
        var existe = false;
        abasExistentes.each(function () {
            if (ano + '-' + semestre === $(this).data('ano') + '-' + $(this).data('semestre')) {
                existe =  true;
            }
        });
        return existe;
    }

    function chamaParcialAbaMicroDesafio() {
        $('#cadastro-microdesafio .abas-vertical li a').off().click(function () {
            
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
                    url: urlListarMicrodesafioAnoSemestre,
                    data: obj,
                    type: 'GET',
                    processData:true,
                    success: function (data) {
                        
                        $('#cadastro-microdesafio '+'#' + ano + '-' + semestre).html(data);

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

    return {
        init: init,
        atualizarDisponibilidadeQuestoes: atualizarDisponibilidadeQuestoes
    };
})();

