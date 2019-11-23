"use strict";

var Listagem = (function () {

    function init() {
        bindFunctions();
    }

    function bindFunctions() {
        //pesquisaUnitaria();
        pesquisaDinamica();
        Correcao();
        clickPaginacao();
        abreModalLiberarNovaTentativa();
        abreModalTentativasIgnoradasMicrodesafio();
        abreModalTentativasMicrodesafio();
        atribuirNovaTentativaModal();
        enviarNovaTentativa();
        reabreCorrecao();
        //novaTentativaListagem();
        enviarNotaUnitaria();
        enviarTodasNotas();
        novaTentativaMacrodesafioListagem();
        enviarNovaTentativaMicrodesafioListagem();
        abreModalCriarTentativas();
        modalNovaTentativa();
        modalMacrodesafioCancelados();

    }

    function modalNovaTentativa() {
        $('[id^="nova_tentativa_ua_"]').off().click(function () {
            var element = $(this);
            var nome = element.closest('tr').find('.nome').html().trim();
            $('#modal-configuracao-tentativas-microdesafio').modal({ dismissible: false }).modal('open');
            $('#modal-configuracao-tentativas-microdesafio .nome-aluno').html(nome);
            
            checkBoxAtrasoMicro();

            $('#modal-configuracao-tentativas-microdesafio.open .enviar_novatentativamicro_btn').off().click(function () {
                
                var thisModal = $('#modal-configuracao-tentativas-microdesafio.open');
                

                var datahorafim = "";
                if ($(thisModal).find("#LiberacaoDataFimMicro").is(':checked')) {
                    datahorafim = $(thisModal).find("#datahorafimmicro").val();
                    datahorafim = datahorafim.split("/");
                    var dia = datahorafim[0];
                    var mes = datahorafim[1];
                    var ano = datahorafim[2];
                    var horafim = $(thisModal).find("#horafimmicro").val() ? $(thisModal).find("#horafimmicro").val().split(":").length == 3 ? $(thisModal).find("#horafimmicro").val() : $(thisModal).find("#horafimmicro").val() + ":00" : "";
                    datahorafim = dia + "/" + mes + "/" + ano + " " + horafim;
                }

                var datahoralimiteatraso = "";
                if ($(thisModal).find("#LiberacaoAtrasoMicro").is(':checked')) {
                    datahoralimiteatraso = $(thisModal).find("#datahoralimiteatrasomicro").val();
                    datahoralimiteatraso = datahoralimiteatraso.split("/");
                    var dialimite = datahoralimiteatraso[0];
                    var meslimite = datahoralimiteatraso[1];
                    var anolimite = datahoralimiteatraso[2];
                    var horalimiteatraso = $(thisModal).find("#horalimiteatrasomicro").val() ? $(thisModal).find("#horalimiteatrasomicro").val().split(":").length == 3 ? $(thisModal).find("#horalimiteatrasomicro").val() : $(thisModal).find("#horalimiteatrasomicro").val() + ":00" : "";
                    if (horalimiteatraso)
                        datahoralimiteatraso = dialimite + "/" + meslimite + "/" + anolimite + " " + horalimiteatraso;
                }

                var justificativa = $(thisModal).find("#justificativamicro").val();


                var obj = {
                    codunidadeaprendizagempessoa: element.closest('tr').find('.col-microdesafio').data('codunidadeaprendizagempessoa'),
                    justificativa: justificativa,
                    datahorafim: datahorafim,
                    datahoralimite: datahoralimiteatraso
                };

                if (validarCamposObrigatorios("micro") && validaRetroativas("micro") && validaDataLimiteMaiorQueDataFim("micro")) {
                    new GCS().setObj({
                    
                        url: urlAtribuirNovaTentativaParaDesafios,
                        data: JSON.stringify(obj),
                        success: function (data) {
                            if (data.status) {
                                Helper.OpenAlert({ title: "", msg: 'Nova Tentativa Criada Para os Desafios.', close: () => location.reload() });
                            } else {
                                Helper.OpenAlert({ title: "Ops", msg: 'Não foi possível criar Nova Tentativa Para os Desafios.', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle", close: () => location.reload() });
                            }
                            $(thisModal).find("#datahorafimmicro").val("");
                            $(thisModal).find("#horafimmicro").val("");
                            $(thisModal).find("#datahoralimiteatrasomicro").val("");
                            $(thisModal).find("#horalimiteatrasomicro").val("");
                            $(thisModal).find("#justificativamicro").val("");
                            $('#modal-configuracao-tentativas-microdesafio.open').modal({ dismissible: false }).modal('close');
                        },
                        error: function (data) {
                            console.log(data);
                        }
                    }).executar();

                } else {
                    Helper.OpenAlert({ title: "Preencha os campos obrigatórios corretamente.", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });

                }
            });
        });
    }

    function enviarNotaUnitaria() {
        $(document).on("click", "#enviar_nota_unt", function () {
            var nomeAluno = $(this).parent().siblings(".nome").text();
            var notaAluno = $(this).attr("data-nota");
            var codpessoa = $(this).attr("data-codpessoa");
            var buttonEnviar = $(this);

            Helper.OpenConfirm({
                title: "Deseja enviar a nota de " + nomeAluno + "?",
                icon: 'fa-exclamation-triangle',
                iconclass: 'satisfaction-yellow',
                msg: '',
                classtitle: 'font-preto',
                yes: function () {
                    //ajax
                    var codunidadeaprendizagem = $("#codunidadeaprendizagem").val();
                    var codcursocollege = $("#codcursocollege").val();
                    var coddisciplinacollege = $("#coddisciplinacollege").val();
                    var codturmacollege = $("#codturmacollege").val();

                    new GCS().setObj({
                        type: 'GET',
                        url: urlEnviarNotaAluno + "?codunidadeaprendizagem=" + codunidadeaprendizagem + "&codcursocollege=" + codcursocollege + "&coddisciplinacollege=" + coddisciplinacollege + "&codturmacollege=" + codturmacollege + "&codpessoa=" + codpessoa,
                        success: function (data) {
                            Helper.OpenAlert({
                                title: "Notas enviadas com sucesso!",
                                msg: "",
                                classtitle: "font-verde",
                                iconclass: "satisfaction",
                                icon: "fa-check-circle",
                                close: function () {
                                    Helper.CloseConfirm();
                                    $(buttonEnviar).addClass('disabled');
                                    $(buttonEnviar).closest('td').next().find('i').removeClass('icone-nota-nao-enviado').addClass('icone-nota-enviado');
                                    $(buttonEnviar).closest('td').next().find('i').data('tooltip', 'Nota enviada');
                                }
                            });
                        },
                        error: function (data) {
                            Helper.OpenAlert({ title: "Houve um erro ao enviar as notas.", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                        }
                    }).executar();

                    Helper.CloseConfirm();
                },
                no: function () { },
                textno: 'Não',
                textsim: 'Sim'
            });
        });
    }

    function enviarTodasNotas() {

        $(document).on("click", "#enviar_nota_todas", function () {
            var qtdregistros = $("#qtdresgistros").val();
            Helper.OpenConfirm({
                title: "Deseja enviar as notas de todos os " + qtdregistros + " alunos?",
                icon: 'fa-exclamation-triangle',
                iconclass: 'satisfaction-yellow',
                msg: '',
                classtitle: 'font-preto',
                yes: function () {
                    //ajax

                    var codunidadeaprendizagem = $("#codunidadeaprendizagem").val();
                    var codcursocollege = $("#codcursocollege").val();
                    var coddisciplinacollege = $("#coddisciplinacollege").val();
                    var codturmacollege = $("#codturmacollege").val();

                    new GCS().setObj({
                        type: 'GET',
                        url: urlEnviarTodosAlunosBlue + "?codunidadeaprendizagem=" + codunidadeaprendizagem + "&codcursocollege=" + codcursocollege + "&coddisciplinacollege=" + coddisciplinacollege + "&codturmacollege=" + codturmacollege,
                        success: function (data) {
                            Helper.OpenAlert({
                                title: "Notas enviadas com sucesso!",
                                msg: "",
                                classtitle: "font-verde",
                                iconclass: "satisfaction",
                                icon: "fa-check-circle",
                                close: function () {
                                    Helper.CloseConfirm();
                                    $(this).addClass('disabled');
                                    $(this).closest('td').next().find('i').removeClass('icone-nota-nao-enviado').addClass('icone-nota-enviado');
                                    $(this).closest('td').next().find('i').attr('data-tooltip', 'Nota enviada');
                                    $('#search').click();
                                }
                            });
                        },
                        error: function (data) {
                            Helper.OpenAlert({ title: "Houve um erro ao enviar as notas.", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                        }
                    }).executar();
                },
                no: function () { },
                textno: 'Não',
                textsim: 'Sim'
            });
        });
    }

    function reabreCorrecao() {
        $('.reabrir').off().click(function () {

            var elem = $(this);

            Helper.OpenConfirm({
                title: "Deseja reabrir a correção do Macrodesafio?",
                icon: 'fa-exclamation-triangle',
                iconclass: 'satisfaction-yellow',
                msg: '',
                classtitle: 'font-preto',
                yes: function () {
                    reabreCorrecaoConfirma(elem);
                    Helper.CloseConfirm();
                },
                no: function () { },
                textno: 'Não',
                textsim: 'Sim'
            });
        });
    }

    function reabreCorrecaoConfirma(elem) {

        var elemento = elem;
        var codpessoadesafiocorrecao = elemento.data('codpessoadesafiocorrecao');

        if (codpessoadesafiocorrecao) {

            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlReabreCorrecaomacro + '?codpessoadesafiocorrecao=' + codpessoadesafiocorrecao,
                success: function (data) {
                    if (Helper.isJSON(data)) {
                        var dados = JSON.parse(data);
                        if (dados.status) {
                            Helper.OpenAlert({ title: "Correção reaberta com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                            elemento.addClass('hide');
                            elemento.closest('tr').find('.status-macro').text('RASCUNHO');
                            elemento.closest('tr').find('#enviar_nota_unt').addClass('hide');
                        } else {
                            Helper.OpenAlert({ title: "Não foi possível reabrir a correção", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                        }
                    } else {
                        Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }

                }
            }).executar();
        }
    }

    function atribuirNovaTentativaModal() {

        $('.datepicker').pickadate({
            monthsFull: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            weekdaysFull: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabádo'],
            weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
            today: 'Hoje',
            clear: 'Limpar',
            close: 'Pronto',
            labelMonthNext: 'Próximo mês',
            labelMonthPrev: 'Mês anterior',
            labelMonthSelect: 'Selecione um mês',
            labelYearSelect: 'Selecione um ano',
            selectMonths: true,
            selectYears: 15,
            format: 'dd/mm/yyyy'


        });

        $('.timepicker').pickatime({
            default: 'now', // Set default time: 'now', '1:30AM', '16:30'
            fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
            twelvehour: false, // Use AM/PM or 24-hour format
            donetext: 'OK', // text for done-button
            cleartext: 'Limpar', // text for clear-button
            canceltext: 'Cancelar', // Text for cancel-button,
            container: undefined, // ex. 'body' will append picker to body
            autoclose: false, // automatic close timepicker
            ampmclickable: true, // make AM PM clickable
            aftershow: function () { } //Function for after opening timepicker


        });
        $('#atribuir-nova-tentativa').off().click(function () {
            $("#modal-configuracao-tentativas-microdesafio .modal-close").off().click(function () {

                $(".LiberacaoDataFimMicro").prop("checked", false);
                $(".datahorafimmicro").val("").prop("disabled", true);
                $(".horafimmicro").val("").prop("disabled", true);
                $(".LiberacaoAtrasoMicro").prop("checked", false);
                $(".datahoralimiteatrasomicro").val("").prop("disabled", true);
                $(".horalimiteatrasomicro").val("").prop("disabled", true);
                $(".justificativamicro").val("");
            });


            var nomeAluno = $('#Modal-liberar-nova-tentativa-micro .alunoN').text();
            checkBoxAtrasoMicro();
            $('#modal-conf-tentativas-tela-correcao').prop("disabled", true);
            $('#modal-configuracao-tentativas-microdesafio').prop("disabled", false);
            $('#modal-configuracao-tentativas-microdesafio').modal({ dismissible: false }).modal('open');
            $('#modal-nova-tentativa-micro .nome-aluno').text(nomeAluno);
            $('#modal-tentativas-microdesafio').modal({ dismissible: false }).modal('close');
            $('#Modal-liberar-nova-tentativa').modal({ dismissible: false }).modal('close');
        });
    }


    function Correcao() {
        $('#btncorrecoespendentes').off().click(function () {

            var codunidadeaprendizagem = $('#codunidadeaprendizagem').val();
            var codcursocollege = $('#codcursocollege').val();
            var coddisciplinacollege = $('#coddisciplinacollege').val();
            var codturmacollege = $('#codturmacollege').val();

            new GCS().setObj({
                type: 'GET',
                url: VerificaCorrecaoPendente + '/?codunidadeaprendizagem=' + codunidadeaprendizagem +
                    '&codcursocollege=' + codcursocollege + '&coddisciplinacollege=' + coddisciplinacollege + '&codturmacollege=' + codturmacollege,
                success: function (data) {

                    if (data.status) {
                        window.location = indexUrl + '/?codunidadeaprendizagem=' + $('#codunidadeaprendizagem').val() +
                            '&codcursocollege=' + $('#codcursocollege').val() +
                            '&coddisciplinacollege=' + $('#coddisciplinacollege').val() +
                            '&codturmacollege=' + $('#codturmacollege').val();
                    }
                    else {
                        Helper.OpenAlert({ title: "Ops", msg: "Não há Macrodesafios para serem corrigidos.", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }
                },
                error: function (data) {
                    console.log(data);
                }
            }).executar();
        });
    }


    function pesquisaDinamica() {

        var filtros = $('.filtros .btn.active');
        var retorno = '';
        var arrayFiltros = [];
        filtros.each(function () {
            arrayFiltros.push($(this).data('filtro'));
        });

        for (var i = 0; i < arrayFiltros.length; i++) {
            retorno += arrayFiltros[i];
            retorno += (i == (arrayFiltros.length - 1) ? '' : ',');
        }

        return retorno;
    }

    /*function pesquisaUnitaria() {
        $('#search').off().click(function () {
            debugger;
            var campoPesquisado = $('#pesquisar').val();
            if (campoPesquisado) {
                debugger;

                //new GCS().setObj({
                //    type: "GET",
                //    dataType: 'html',
                //    contentType: 'text/html',
                //    url: '' ,
                //    success: function (data) {
                //        $('.grid-resultados').html(data);
                //    }
                //}).executar();
            } else {
                Helper.OpenAlert({ title: "Ops", msg: 'Preencha o campo para pesquisar', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            }
        });
    }*/

    function clickPaginacao() {
        $('.paginacao, #search').off().click(function () {
            $('.filtros .btn').removeClass('active');
            $(this).addClass('active');

            var filtro = pesquisaDinamica();
            var paginaatual = parseInt($(this).data('pagina'));
            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: `/CorrecaoMacrodesafio/ListagemGrid/?codunidadeaprendizagem=${$('#codunidadeaprendizagem').val()}&codcursocollege=${$('#codcursocollege').val()}&coddisciplinacollege=${$('#coddisciplinacollege').val()}&codturmacollege=${$('#codturmacollege').val()}&filtro=${filtro}&texto=${$('#pesquisar').val()}&paginaatual= ${paginaatual}`,
                success: function (data) {
                    $('.grid-resultados').html(data);
                    bindFunctions();
                    $('.dropdown-button').dropdown();
                }
            }).executar();
            //bindFunctions();
            $('.dropdown-button').dropdown();
        });

    }

    function abreModalCriarTentativas() {
        $(".criar-tentativas").off().click(function () {
            var codunidadeaprendizagempessoa = $('#modal-tentativas-microdesafio').attr('data-codunidadeaprendizagempessoa');

            Helper.OpenConfirm({
                title: "Deseja criar as tentativas para o aluno?",
                icon: 'fa-exclamation-triangle',
                iconclass: 'satisfaction-yellow',
                msg: '',
                classtitle: 'font-preto',
                yes: function () {
                    new GCS().setObj({
                        type: 'GET',
                        contentType: 'application/json',
                        dataType: 'json',
                        url: urlCriarTentativas + '?codunidadeaprendizagempessoa=' + codunidadeaprendizagempessoa,
                        success: function (data) {
                            if (data && data.status) {

                                if (!data.uafinalizada) {
                                    if (data.datahorafim) {
                                        $("#modal-tentativas-microdesafio .LiberacaoDataFimMicro").click();

                                        var datafim = data.datahorafim.split(" ")[0];
                                        var horafim = data.datahorafim.split(" ")[1];

                                        $("#modal-tentativas-microdesafio .datahorafimmicro").val(datafim);
                                        $("#modal-tentativas-microdesafio .horafimmicro").val(horafim);
                                    } else {
                                        $("#modal-tentativas-microdesafio .datahorafimmicro").val("");
                                        $("#modal-tentativas-microdesafio .horafimmicro").val("");
                                    }

                                    if (data.datahoralimiteatraso) {
                                        $("#modal-tentativas-microdesafio .LiberacaoAtrasoMicro").click();

                                        var datalimiteatraso = data.datahoralimiteatraso.split(" ")[0];
                                        var horalimiteatraso = data.datahoralimiteatraso.split(" ")[1];

                                        $("#modal-tentativas-microdesafio .datahoralimiteatrasomicro").val(datalimiteatraso);
                                        $("#modal-tentativas-microdesafio .horalimiteatrasomicro").val(horalimiteatraso);
                                    } else {
                                        $("#modal-tentativas-microdesafio .datahoralimiteatrasomicro").val("");
                                        $("#modal-tentativas-microdesafio .horalimiteatrasomicro").val("");
                                    }

                                }
                                $('#modal-configuracao-tentativas-microdesafio').modal({ dismissible: false }).modal('open');

                            } else {
                                Helper.OpenAlert({ title: "Ops", msg: "Não foi possível criar as tentativas para o aluno.", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                            }
                        }
                    }).executar();

                    Helper.CloseConfirm();
                },
                no: function () { },
                textno: 'Não',
                textsim: 'Sim'
            });
        });
    }

    function abreModalLiberarNovaTentativa() {

        $(document).on("click", ".ignorar-tentativa", function (e) {

            e.preventDefault();
            console.log(e);
            var elemento = $(this);
            var codpessoadesafiotentativa = $(this).closest(".collapsible-header").attr("data-codpessoadesafiotentativa");

            var datahorafim = $(this).closest(".collapsible-header").attr("data-datahorafim");
            var datahoralimiteatraso = $(this).closest(".collapsible-header").attr("data-datahoralimiteatraso");
            var dataentregaaluno = $(this).closest(".collapsible-header").find(".data").text();

            if (!JSON.parse($(this).closest(".collapsible-header").attr("data-uafinalizada").toLowerCase())) {

                if (datahorafim) {
                    $("#modal-tentativas-microdesafio .LiberacaoDataFimMicro").click();

                    var datafim = datahorafim.split(" ")[0];
                    var horafim = datahorafim.split(" ")[1];

                    $("#modal-tentativas-microdesafio .datahorafimmicro").val(datafim);
                    $("#modal-tentativas-microdesafio .horafimmicro").val(horafim);
                    $('#Modal-liberar-nova-tentativa .data-limite-entrega').first().text(datahorafim).removeClass('hide');

                } else {
                    $("#modal-tentativas-microdesafio .datahorafimmicro").val("");
                    $("#modal-tentativas-microdesafio .horafimmicro").val("");
                }


                if (datahoralimiteatraso) {
                    $("#modal-tentativas-microdesafio .LiberacaoAtrasoMicro").click();

                    var datalimiteatraso = datahoralimiteatraso.split(" ")[0];
                    var horalimiteatraso = datahoralimiteatraso.split(" ")[1];

                    $("#modal-tentativas-microdesafio .datahoralimiteatrasomicro").val(datalimiteatraso);
                    $("#modal-tentativas-microdesafio .horalimiteatrasomicro").val(horalimiteatraso);
                    $('#Modal-liberar-nova-tentativa data-limite-entrega-atraso').first().text(datahoralimiteatraso).removeClass('hide');

                } else {
                    $("#modal-tentativas-microdesafio .datahoralimiteatrasomicro").val("");
                    $("#modal-tentativas-microdesafio .horalimiteatrasomicro").val("");
                }
            }

            if (dataentregaaluno) {
                $('#Modal-liberar-nova-tentativa .data-entrega-aluno').first().text(dataentregaaluno).removeClass('hide').show();
                $("#Modal-liberar-nova-tentativa .div-entrega-aluno").show();
            } else {
                $('#Modal-liberar-nova-tentativa .data-entrega-aluno').first().hide();
                $("#Modal-liberar-nova-tentativa .div-entrega-aluno").hide();
            }

            if (datahorafim) {
                $('#Modal-liberar-nova-tentativa .data-limite-entrega').first().text(datahorafim).removeClass('hide').show();
                $("#Modal-liberar-nova-tentativa .div-limite-entrega").show();
            } else {
                $('#Modal-liberar-nova-tentativa .data-limite-entrega').hide();
                $("#Modal-liberar-nova-tentativa .div-limite-entrega").hide();
            }

            if (datahoralimiteatraso) {
                $('#Modal-liberar-nova-tentativa .data-limite-entrega-atraso').first().text(datahoralimiteatraso).removeClass('hide').show();
                $("#Modal-liberar-nova-tentativa .div-limite-atraso").show();
            } else {
                $('#Modal-liberar-nova-tentativa .data-limite-entrega-atraso').hide();
                $("#Modal-liberar-nova-tentativa .div-limite-atraso").hide();
            }

            var nome = '  ' + $('#modal-tentativas-microdesafio .tentativa-microdesafio .aluno').first().text();
            var tentativa = $('#modal-tentativas-microdesafio .tentativa-microdesafio .tentativa').first().text() + '  ';
            var dataentrega = $('#modal-tentativas-microdesafio .tentativa-microdesafio .data-entrega .data').first().text();


            $('#Modal-liberar-nova-tentativa .aluno').first().text(nome).removeClass('hide');
            $('#Modal-liberar-nova-tentativa .tentativaN').first().text(tentativa);


            $('#Modal-liberar-nova-tentativa').modal({ dismissible: false }).modal('open');
            $("#codpessoadesafiotentativa_modal").val(codpessoadesafiotentativa);
        });
    }

    function abreModalTentativasMicrodesafio() {

        $('.col-microdesafio i').off().click(function myfunction() {

            var nome = $(this).closest('tr').find('.nome').text();
            var codunidadeaprendizagempessoa = $(this).closest('td').data('codunidadeaprendizagempessoa');
            //var codunidadeaprendizagempessoa = 2693;

            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlListaTentativas + '?codunidadeaprendizagempessoa=' + codunidadeaprendizagempessoa,
                success: function (data) {

                    $('#modal-tentativas-microdesafio').html(data);
                    $('#modal-tentativas-microdesafio').data('codunidadeaprendizagempessoa', codunidadeaprendizagempessoa);
                    $('#modal-tentativas-microdesafio').data('nome', nome);
                    $('#modal-tentativas-microdesafio').modal({ dismissible: false }).modal('open');
                    $('.collapsible').collapsible();

                    $('#modal-tentativas-microdesafio .tentativa-microdesafio .aluno').first().text(nome).removeClass('hide');
                    $('#modal-tentativas-microdesafio .ver-tentativas').first().removeClass('hide');
                    abreQuestoes();
                    abreModalTentativasIgnoradasMicrodesafio();
                    abreModalCriarTentativas();
                }
            }).executar();

        });
    }

    function abreQuestoes() {
        $('#modal-tentativas-microdesafio .collapsible-header').off().click(function (e) {

            var elem = $(this);
            elem.siblings('.collapsible-body').html('');

            //pra evitar de abrir o collapsible ao clicar no "ignorar tentativas"
            if (e.target.className.indexOf("ignorar-tentativa") != -1) {
                return;
            }

            var codPessoaDesafioTentativa = elem.data('codpessoadesafiotentativa');
            var numerotentativa = elem.data('numerotentativa');
            if (codPessoaDesafioTentativa && numerotentativa) {
                if (!elem.hasClass('active')) {
                    new GCS().setObj({
                        type: 'GET',
                        contentType: 'text/html',
                        dataType: 'html',
                        url: urlCarregaItemTentativa + '?codPessoaDesafioTentativa=' + codPessoaDesafioTentativa + '&numerotentativa=' + numerotentativa,
                        success: function (data) {
                            elem.siblings('.collapsible-body').html(data);
                            abreModalTentativasIgnoradasMicrodesafio();
                            abreModalCriarTentativas();
                        },
                        showLoad: false
                    }).executar();
                }
            }
        });
    }

    function abreModalTentativasIgnoradasMicrodesafio() {

        $('#modal-tentativas-microdesafio .ver-tentativas').off().click(function () {

            var codunidadeaprendizagempessoa = $('#modal-tentativas-microdesafio').data('codunidadeaprendizagempessoa');
            //var codunidadeaprendizagempessoa = 2693;

            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlListaTentativasCancelado + '?codunidadeaprendizagempessoa=' + codunidadeaprendizagempessoa,
                success: function (data) {

                    $('#modal-tentativas-ignoradas-microdesafio').html(data);
                    $('.collapsible').collapsible();
                    $('#modal-tentativas-microdesafio').modal({ dismissible: false }).modal('close');
                    $('#modal-tentativas-ignoradas-microdesafio').modal({ dismissible: false }).modal('open');


                    $('.voltar').first().removeClass('hide');

                    var nome = $('#modal-tentativas-microdesafio').data('nome');
                    $('#modal-tentativas-ignoradas-microdesafio .aluno').first().text(nome).removeClass('hide');

                    $('.voltar').off().click(function () {
                        $('#modal-tentativas-ignoradas-microdesafio').modal({ dismissible: false }).modal('close');
                        $('#modal-tentativas-microdesafio').modal({ dismissible: false }).modal('open');
                    });
                    abreQuestoesIgnoradas();
                }
            }).executar();
        });
    }


    function abreQuestoesIgnoradas() {
        $('#modal-tentativas-ignoradas-microdesafio .collapsible-header').off().click(function (e) {

            var elem = $(this);
            elem.siblings('.collapsible-body').html('');

            var codPessoaDesafioTentativa = elem.data('codpessoadesafiotentativa');
            var numerotentativa = elem.data('numerotentativa');

            if (codPessoaDesafioTentativa && numerotentativa) {
                if (!elem.hasClass('active')) {
                    new GCS().setObj({
                        type: 'GET',
                        contentType: 'text/html',
                        dataType: 'html',
                        url: urlCarregaItemTentativaCancelado + '?codPessoaDesafioTentativa=' + codPessoaDesafioTentativa + '&numerotentativa=' + numerotentativa,
                        success: function (data) {
                            elem.siblings('.collapsible-body').html(data);

                            var justificativa = $('.justificativa span');
                            justificativa.each(function () {
                                $(this).append($(this).closest('.collapsible-body').data('justificativa'));
                            });
                        },
                        showLoad: false
                    }).executar();
                }
            }
        });
    }

    //true ou false (data limite deve ser menor do que a fim)
    function validaDataLimiteMaiorQueDataFim(tipo) {

        var datahorafim = tipo == "macro" ? $("#datahorafim").val() : $("#datahorafimmicro").val();
        datahorafim = datahorafim.split("/");
        var dia = datahorafim[0];
        var mes = datahorafim[1];
        var ano = datahorafim[2];
        datahorafim = mes + "/" + dia + "/" + ano + " " + (tipo == "macro" ? $("#horafim").val() : $("#horafimmicro").val());
        datahorafim = new Date(datahorafim);

        var datahoralimiteatraso = tipo == "macro" ? $("#datahoralimiteatraso").val() : $("#datahoralimiteatrasomicro").val();
        if (datahoralimiteatraso) {
            datahoralimiteatraso = datahoralimiteatraso.split("/");
            dia = datahoralimiteatraso[0];
            mes = datahoralimiteatraso[1];
            ano = datahoralimiteatraso[2];
            datahoralimiteatraso = mes + "/" + dia + "/" + ano + " " + (tipo == "macro" ? $("#horalimiteatraso").val() : $("#horalimiteatrasomicro").val());
            datahoralimiteatraso = new Date(datahoralimiteatraso);

            if (datahoralimiteatraso < datahorafim)
                return false;
        }

        return true;
    }


    //true ou false (impedir que seja data passada)
    function validaRetroativas(tipo) {
        var validaRetroativas = null;
        if ((tipo == "macro" && $("#LiberacaoDataFim").is(':checked')) || $("#LiberacaoDataFimMicro").is(':checked')) {
            var dataFinalEntrega = $("#datahorafim").val();

            if ((tipo == "macro" && $("#datahoralimiteatraso").val()) || $("#datahoralimiteatrasomicro").val()) {
                dataFinalEntrega = tipo == "macro" ? $("#datahoralimiteatraso").val() : $("#datahoralimiteatrasomicro").val();
            }

            dataFinalEntrega = dataFinalEntrega.split("/");
            var dia = dataFinalEntrega[0];
            var mes = dataFinalEntrega[1];
            var ano = dataFinalEntrega[2];
            dataFinalEntrega = mes + "/" + dia + "/" + ano + " " + (tipo == "macro" ? $("#horafim").val() : $("#horafimmicro").val());
            dataFinalEntrega = new Date(dataFinalEntrega);


            var hoje = new Date();
            if (dataFinalEntrega < hoje) {
                validaRetroativas = false;
            } else {
                validaRetroativas = true;
            }
        } else {
            validaRetroativas = true;
        }

        return validaRetroativas;
    }

    //true ou false (validar se a data de entrega de atraso é posterior ao prazo fim)
    /*function validaAtraso() {
        if ($("#LiberacaoAtraso").is(':checked')) {
            var validaPrazoAtraso = null;
            //formatação da data prazo
            var datahorafim = $("#datahorafim").val();
            datahorafim = datahorafim.split("/");
            var dia = datahorafim[0];
            var mes = datahorafim[1];
            var ano = datahorafim[2];
            datahorafim = mes + "/" + dia + "/" + ano + " " + $("#horafim").val();
            datahorafim = new Date(datahorafim);

            //formatação da data atraso
            var datahoralimiteatraso = $("#datahoralimiteatraso").val();
            datahoralimiteatraso = datahoralimiteatraso.split("/");
            var dia = datahoralimiteatraso[0];
            var mes = datahoralimiteatraso[1];
            var ano = datahoralimiteatraso[2];
            datahoralimiteatraso = mes + "/" + dia + "/" + ano + " " + $("#horalimiteatraso").val();
            datahoralimiteatraso = new Date(datahoralimiteatraso);

            if (datahoralimiteatraso <= datahorafim) {
                validaPrazoAtraso = false;
            } else if ($("#datahoralimiteatraso").val() == "") {
                validaPrazoAtraso = false;
            } else {
                validaPrazoAtraso = true;
            }

        } else {
            validaPrazoAtraso = true;
        }
        return validaPrazoAtraso;

    }*/

    function validarCamposObrigatorios(tipo) {
        var validarCamposObrigatorios = null;
        var datahorafim = tipo == "macro" ? $("#datahorafim").val() : $("#datahorafimmicro").val();
        var horafim = tipo == "macro" ? $("#horafim").val() : $("#horafimmicro").val();
        var datahorafim = tipo == "macro" ? $("#datahorafim").val() : $("#datahorafimmicro").val();
        var datahoralimiteatraso = tipo == "macro" ? $("#datahoralimiteatraso").val() : $("#datahoralimiteatrasomicro").val();
        var horalimiteatraso = tipo == "macro" ? $("#horalimiteatraso").val() : $("#horalimiteatrasomicro").val();

        var liberacaoDatafim = tipo == "macro" ? $("#LiberacaoDataFim") : $("#LiberacaoDataFimMicro");
        var liberacaoAtraso = tipo == "macro" ? $("#LiberacaoAtraso") : $("#LiberacaoAtrasoMicro");
        var justificativa = tipo == "macro" ? $("#justificativa").val() : $("#justificativamicro").val();


        if (!$(liberacaoDatafim).is(':checked') && !$(liberacaoAtraso).is(':checked')) {
            validarCamposObrigatorios = false;
        } else if ($(liberacaoDatafim).is(':checked') && (datahorafim == "" || horafim == "" || justificativa == "")) {
            validarCamposObrigatorios = false;
        } else if ($(liberacaoAtraso).is(':checked') && (datahoralimiteatraso == "" || horalimiteatraso == "")) {
            validarCamposObrigatorios = false;
        }
        else if (($(liberacaoDatafim).is(':checked') && (datahorafim == "" || horafim == "" || justificativa == "")) ||
            ($(liberacaoAtraso).is(':checked') && (datahoralimiteatraso == "" || horalimiteatraso == "" || justificativa == ""))) {
            validarCamposObrigatorios = false;
        } else {
            validarCamposObrigatorios = true;
        }
        return validarCamposObrigatorios;
    }

    function atualizaDataFimMicroComDataOntem() {
        var datahorafim = moment().subtract(1, 'day');
        $("#modal-configuracao-tentativas-microdesafio .datahorafimmicro").val(datahorafim.format('DD/MM/YYYY'))
        $("#modal-configuracao-tentativas-microdesafio .horafimmicro").val(datahorafim.format('HH:mm'))
    }

    function checkBoxAtrasoMicro() {
        
        $('#modal-conf-tentativas-tela-correcao .LiberacaoAtraso').unbind();
        $('#modal-conf-tentativas-tela-correcao .LiberacaoDataFim').unbind();

        $('#modal-configuracao-tentativas-microdesafio .LiberacaoAtrasoMicro').off().click(function () {
            if (!$("#modal-configuracao-tentativas-microdesafio .LiberacaoAtrasoMicro").is(':checked')) {
                $("#modal-configuracao-tentativas-microdesafio .horalimiteatrasomicro").attr("disabled", "disabled").val("");
                $("#modal-configuracao-tentativas-microdesafio .datahoralimiteatrasomicro").attr("disabled", "disabled").val("");
                $("#modal-configuracao-tentativas-microdesafio .LiberacaoAtrasoMicro").attr("data-status", false);

            } else {
                $("#modal-configuracao-tentativas-microdesafio .LiberacaoAtrasoMicro").attr("data-status", true);
                $("#modal-configuracao-tentativas-microdesafio .horalimiteatrasomicro").removeAttr("disabled");//.val("23:59");
                $("#modal-configuracao-tentativas-microdesafio .datahoralimiteatrasomicro").removeAttr("disabled");

                if (!$("#LiberacaoDataFimMicro").is(':checked') && (!$("#modal-configuracao-tentativas-microdesafio .datahorafimmicro").val() || !$("#modal-configuracao-tentativas-microdesafio .horafimmicro").val())) {
                    atualizaDataFimMicroComDataOntem();
                }
            }
        });

        $('#modal-configuracao-tentativas-microdesafio .LiberacaoDataFimMicro').off().click(function () {
            if (!$("#modal-configuracao-tentativas-microdesafio  .LiberacaoDataFimMicro").is(':checked')) {
                $("#modal-configuracao-tentativas-microdesafio  .horafimmicro").attr("disabled", "disabled").val("");
                $("#modal-configuracao-tentativas-microdesafio  .datahorafimmicro").attr("disabled", "disabled").val("");
                $("#modal-configuracao-tentativas-microdesafio  .LiberacaoDataFimMicro").attr("data-status", false);

                if ($("#LiberacaoAtrasoMicro").is(':checked') && (!$("#modal-configuracao-tentativas-microdesafio .datahorafimmicro").val() || !$("#modal-configuracao-tentativas-microdesafio .horafimmicro").val())) {
                    atualizaDataFimMicroComDataOntem();
                }
            } else {
                $("#modal-configuracao-tentativas-microdesafio  .LiberacaoDataFimMicro").attr("data-status", true);
                $("#modal-configuracao-tentativas-microdesafio  .horafimmicro").removeAttr("disabled");//.val("23:59");
                $("#modal-configuracao-tentativas-microdesafio  .datahorafimmicro").removeAttr("disabled");
            }
        });
    }

    function checkBoxAtrasoMacro() {
        $('#modal-configuracao-tentativas-microdesafio .LiberacaoAtrasoMicro').unbind();
        $('#modal-configuracao-tentativas-microdesafio .LiberacaoDataFimMicro').unbind();

        $('#modal-conf-tentativas-tela-correcao .LiberacaoAtraso').off().click(function () {
            if (!$("#modal-conf-tentativas-tela-correcao .LiberacaoAtraso").is(':checked')) {
                $("#modal-conf-tentativas-tela-correcao .horalimiteatraso").attr("disabled", "disabled").val("");
                $("#modal-conf-tentativas-tela-correcao .datahoralimiteatraso").attr("disabled", "disabled").val("");
                $("#modal-conf-tentativas-tela-correcao .LiberacaoAtraso").attr("data-status", false);
            } else {
                $("#modal-conf-tentativas-tela-correcao .LiberacaoAtraso").attr("data-status", true);
                $("#modal-conf-tentativas-tela-correcao .horalimiteatraso").removeAttr("disabled");//.val("23:59");
                $("#modal-conf-tentativas-tela-correcao .datahoralimiteatraso").removeAttr("disabled");
            }
        });


        $('#modal-conf-tentativas-tela-correcao .LiberacaoDataFim').off().click(function () {
            if (!$("#modal-conf-tentativas-tela-correcao .LiberacaoDataFim").is(':checked')) {
                $("#modal-conf-tentativas-tela-correcao .horafim").attr("disabled", "disabled").val("");
                $("#modal-conf-tentativas-tela-correcao .datahorafim").attr("disabled", "disabled").val("");
                $("#modal-conf-tentativas-tela-correcao .LiberacaoDataFim").attr("data-status", false);
            } else {
                $("#modal-conf-tentativas-tela-correcao .LiberacaoDataFim").attr("data-status", true);
                $("#modal-conf-tentativas-tela-correcao .horafim").removeAttr("disabled");//.val("23:59");
                $("#modal-conf-tentativas-tela-correcao .datahorafim").removeAttr("disabled");
            }
        });
    }

    function enviarNovaTentativa() {
        $("#modal-conf-tentativas-tela-correcao #enviar_novatentativa_btn").off().click(function () {

            var thisModal = $("#modal-conf-tentativas-tela-correcao");
            if (/*validaAtraso() == true && */validarCamposObrigatorios("macro") == true && validaRetroativas("macro") == true && validaDataLimiteMaiorQueDataFim("macro")) {
                var codpessoadesafiotentativa = $("#codpessoadesafiotentativa_modal").val();

                var datahorafim = "";
                if ($(thisModal).find("#LiberacaoDataFim").is(':checked')) {
                    datahorafim = $(thisModal).find("#datahorafim").val();
                    datahorafim = datahorafim.split("/");
                    var dia = datahorafim[0];
                    var mes = datahorafim[1];
                    var ano = datahorafim[2];
                    var horafim = $(thisModal).find("#horafim").val() ? $(thisModal).find("#horafim").val().split(":").length == 3 ? $(thisModal).find("#horafim").val() : $(thisModal).find("#horafim").val() + ":00" : "";
                    datahorafim = dia + "/" + mes + "/" + ano + " " + horafim;
                }

                var datahoralimiteatraso = "";
                if ($(thisModal).find("#LiberacaoAtraso").is(':checked')) {
                    datahoralimiteatraso = $(thisModal).find("#datahoralimiteatraso").val();
                    datahoralimiteatraso = datahoralimiteatraso.split("/");
                    var dialimite = datahoralimiteatraso[0];
                    var meslimite = datahoralimiteatraso[1];
                    var anolimite = datahoralimiteatraso[2];
                    var horalimiteatraso = $(thisModal).find("#horalimiteatraso").val() ? $(thisModal).find("#horalimiteatraso").val().split(":").length == 3 ? $(thisModal).find("#horalimiteatraso").val() : $(thisModal).find("#horalimiteatraso").val() + ":00" : "";
                    if (horalimiteatraso)
                        datahoralimiteatraso = dialimite + "/" + meslimite + "/" + anolimite + " " + horalimiteatraso;
                }

                var justificativa = $(thisModal).find("#justificativa").val();

                var obj = {
                    codpessoadesafiotentativa: codpessoadesafiotentativa,
                    datahorafim: datahorafim,
                    datahoralimiteatraso: datahoralimiteatraso,
                    justificativa: justificativa
                };

                new GCS().setObj({
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(obj),
                    url: SalvarPrazosNovaTentativa,
                    success: function (data) {
                        if (data.status) {
                            Helper.OpenAlert({ title: "", msg: 'Nova tentativa criada com sucesso!', close: () => location.reload() });
                        } else {
                            Helper.OpenAlert({ title: "Ops", msg: 'Não foi possível criar uma nova tentativa', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle", close: () => location.reload() });
                        }
                        $(thisModal).find("#datahorafim").val("");
                        $(thisModal).find("#horafim").val("");
                        $(thisModal).find("#datahoralimiteatraso").val("");
                        $(thisModal).find("#horalimiteatraso").val("");
                        $(thisModal).find("#justificativa").val("");
                        $('#modal-configuracao-tentativas-microdesafio').modal({ dismissible: false }).modal('close');
                    },
                    error: function (data) {
                        console.log(data);
                    }
                }).executar();

            } else {
                if (validarCamposObrigatorios("macro") == false) {
                    Helper.OpenAlert({ title: "Ops", msg: 'Por favor, preencha os campos obrigatórios', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    //} else if (validaAtraso() == false) {
                    //    Helper.OpenAlert({ title: "Ops", msg: 'A data de entrega com atraso deve ser posterior a data do prazo inicial', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                } else if (validaRetroativas("macro") == false) {
                    Helper.OpenAlert({ title: "Ops", msg: 'A data do prazo não pode ser retroativa', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                } else if (!validaDataLimiteMaiorQueDataFim("macro")) {
                    Helper.OpenAlert({ title: "Ops", msg: 'A data fora do prazo não pode ser inferior à data do novo prazo', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }

            }
        });
    }

    function novaTentativaMacrodesafioListagem() {
        $('.nova-tentativa-list').off().click(function () {

            var codpessoaDesafioTentativaResposta = $(this).data("codpessoadesafiotentativaresposta");
            var codpessoadesafiotentativa = $(this).data("codpessoadesafiotentativa");
            $("#codpessoadesafiotentativa_modal").val(codpessoadesafiotentativa);

            new GCS().setObj({
                type: 'GET',
                url: LoadModalIgnorarTentativaUrl + `?codpessoaDesafioTentativaResposta=${codpessoaDesafioTentativaResposta}&codpessoadesafiotentativa=${codpessoadesafiotentativa}`,
                success: function (data) {
                    $('#modal-ignorar-tentativa-tela-correcao').modal({ dismissible: false }).modal('open');
                    $('#modal-ignorar-tentativa-tela-correcao .aluno').first().text(data.nome).removeClass('hide');
                    $('#modal-ignorar-tentativa-tela-correcao .data-entrega-aluno').text(data.dataentregaaluno).removeClass('hide');
                    $('#modal-ignorar-tentativa-tela-correcao .data-limite-entrega').text(data.datahorafim).removeClass('hide');

                    if (data.dataentregaaluno) {
                        $('#modal-ignorar-tentativa-tela-correcao .div-entrega-aluno').show();
                    } else {
                        $('#modal-ignorar-tentativa-tela-correcao .div-entrega-aluno').hide();
                    }

                    if (data.datahorafim) {
                        $('#modal-ignorar-tentativa-tela-correcao .div-limite-entrega').show();
                    } else {
                        $('#modal-ignorar-tentativa-tela-correcao .div-limite-entrega').hide();
                    }

                    if (data.datahoralimiteatraso) {
                        $('#modal-ignorar-tentativa-tela-correcao .div-limite-atraso').show();
                        $('#modal-ignorar-tentativa-tela-correcao .data-limite-entrega-atraso').text(data.datahoralimiteatraso).removeClass('hide');
                    } else {
                        $('#modal-ignorar-tentativa-tela-correcao .div-limite-atraso').hide();
                    }

                    if (!data.uafinalizada) {
                        var datahorafim = data.datahorafim;
                        if (datahorafim) {
                            var datafim = datahorafim.split(" ")[0];
                            var horafim = datahorafim.split(" ")[1];

                            $(".datahorafim").val(datafim);
                            $(".horafim").val(horafim);
                        } else {
                            $(".datahorafim").val("");
                            $(".horafim").val("");
                        }

                        var datahoralimiteatraso = data.datahoralimiteatraso;
                        if (datahoralimiteatraso) {
                            $(".LiberacaoAtraso").click();

                            var datalimiteatraso = datahoralimiteatraso.split(" ")[0];
                            var horalimiteatraso = datahoralimiteatraso.split(" ")[1];

                            $(".datahoralimiteatraso").val(datalimiteatraso);
                            $(".horalimiteatraso").val(horalimiteatraso);
                        } else {
                            $(".datahoralimiteatraso").val("");
                            $(".horalimiteatraso").val("");
                        }
                    }
                },
                error: function (data) {
                    Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            }).executar();

            $(document).on("click", "#atribuir-nova-tentativa-tela-correcao", function () {
                $("#modal-conf-tentativas-tela-correcao .modal-close").off().click(function () {
                    $(".LiberacaoDataFim").prop("checked", false);
                    $(".datahorafim").val("").prop("disabled", true);
                    $(".horafim").val("").prop("disabled", true);;
                    $(".LiberacaoAtraso").prop("checked", false);
                    $(".datahoralimiteatraso").val("").prop("disabled", true);
                    $(".horalimiteatraso").val("").prop("disabled", true);
                    $(".justificativa").val("");

                });

                $('#modal-conf-tentativas-tela-correcao').prop("disabled", false);
                $('#modal-configuracao-tentativas-microdesafio').prop("disabled", true);
                checkBoxAtrasoMacro();

                var nomeAluno = $('#modal-ignorar-tentativa-tela-correcao .modal-header .aluno').text();
                $('#modal-conf-tentativas-tela-correcao').modal({ dismissible: false }).modal('open');
                $('#modal-conf-tentativas-tela-correcao #modal-ignorar-tentativa-tela-correcao').modal({ dismissible: false }).modal('close');
                $('#modal-conf-tentativas-tela-correcao #modal-nova-tentativa .nome-aluno').text(nomeAluno);
            });

        });
    }

    function enviarNovaTentativaMicrodesafioListagem() {
        $("#modal-configuracao-tentativas-microdesafio #enviar_novatentativamicro_btn").off().click(function () {
            var thisModal = $("#modal-configuracao-tentativas-microdesafio");
            if (/*validaAtraso() == true && */validarCamposObrigatorios("micro") == true && validaRetroativas("micro") == true && validaDataLimiteMaiorQueDataFim("micro")) {

                var codpessoadesafiotentativa = $("#codpessoadesafiotentativa_modal").val() ? $("#codpessoadesafiotentativa_modal").val() : 0;

                var datahorafim = "";
                if ($("#LiberacaoDataFimMicro").is(':checked') || $("#LiberacaoAtrasoMicro").is(':checked')) {
                    datahorafim = $("#datahorafimmicro").val();
                    datahorafim = datahorafim.split("/");
                    var dia = datahorafim[0];
                    var mes = datahorafim[1];
                    var ano = datahorafim[2];
                    var horafim = $("#horafimmicro").val() ? $("#horafimmicro").val().split(":").length == 3 ? $("#horafimmicro").val() : $("#horafimmicro").val() + ":00" : "";
                    datahorafim = dia + "/" + mes + "/" + ano + " " + horafim;
                }

                var datahoralimiteatraso = $("#datahoralimiteatrasomicro").val();
                datahoralimiteatraso = datahoralimiteatraso.split("/");
                var dialimite = datahoralimiteatraso[0];
                var meslimite = datahoralimiteatraso[1];
                var anolimite = datahoralimiteatraso[2];
                var horalimiteatraso = $("#horalimiteatrasomicro").val() ? $("#horalimiteatrasomicro").val().split(":").length == 3 ? $("#horalimiteatrasomicro").val() : $("#horalimiteatrasomicro").val() + ":00" : "";
                if (horalimiteatraso)
                    datahoralimiteatraso = dialimite + "/" + meslimite + "/" + anolimite + " " + horalimiteatraso;

                if ($("#LiberacaoAtrasoMicro").is(':checked')) {
                    datahoralimiteatraso = datahoralimiteatraso;
                } else {
                    datahoralimiteatraso = "";
                }

                var justificativa = $("#justificativamicro").val();

                var obj = {
                    codpessoadesafiotentativa: codpessoadesafiotentativa,
                    datahorafim: datahorafim,
                    datahoralimiteatraso: datahoralimiteatraso,
                    justificativa: justificativa,
                    codunidadeaprendizagempessoa: $('#modal-tentativas-microdesafio').data('codunidadeaprendizagempessoa')
                };

                new GCS().setObj({
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(obj),
                    url: SalvarPrazosNovaTentativa,
                    success: function (data) {
                        if (data.status) {
                            //Helper.OpenAlert({ title: "", msg: 'Nova tentativa criada com sucesso!' });
                            location.reload();
                        } else {
                            Helper.OpenAlert({ title: "Ops", msg: 'Não foi possível criar uma nova tentativa', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                        }
                        $("#datahorafimmicro").val("");
                        $("#horafimmicro").val("");
                        $("#datahoralimiteatrasomicro").val("");
                        $("#horalimiteatrasomicro").val("");
                        $("#justificativamicro").val("");
                        $('#modal-ignorar-tentativa-tela-correcao').modal({ dismissible: false }).modal('close');
                        $('#modal-conf-tentativas-tela-correcao').modal({ dismissible: false }).modal('close');

                        Helper.OpenAlert({
                            title: "Nova tentativa inserida com sucesso!",
                            msg: "",
                            classtitle: "font-verde",
                            iconclass: "satisfaction",
                            icon: "fa-check-circle"
                        });

                    },
                    error: function (data) {
                        console.log(data);
                    }
                }).executar();

            } else {
                if (validarCamposObrigatorios("micro") == false) {
                    Helper.OpenAlert({
                        title: "Ops",
                        msg: 'Por favor, preencha os campos obrigatórios',
                        classtitle: "font-vermelho-claro",
                        iconclass: "dissatisfaction",
                        icon: "fa-exclamation-triangle"
                    });
                } else if (validaRetroativas("micro") == false) {
                    Helper.OpenAlert({
                        title: "Ops",
                        msg: 'A data do novo prazo não pode ser retroativa',
                        classtitle: "font-vermelho-claro",
                        iconclass: "dissatisfaction",
                        icon: "fa-exclamation-triangle"
                    });
                } else if (!validaDataLimiteMaiorQueDataFim("micro")) {
                    Helper.OpenAlert({
                        title: "Ops",
                        msg: 'A data fora do prazo não pode ser inferior à data do novo prazo',
                        classtitle: "font-vermelho-claro",
                        iconclass: "dissatisfaction",
                        icon: "fa-exclamation-triangle"
                    });
                }
            }
        });
    }

    function modalMacrodesafioCancelados() {

        $('.grid-resultados .botoes-paginacao a').off().click(function () {

            $('#modal-historico-macros-cancelados').modal({
                dismissible: false,
                ready: function () {

                    var codunidadeaprendizagem = $('#codunidadeaprendizagem').val();
                    var codcursocollege = $('#codcursocollege').val();
                    var coddisciplinacollege = $('#coddisciplinacollege').val();
                    var codturmacollege = $('#codturmacollege').val();

                    new GCS().setObj({
                        type: 'GET',
                        contentType: 'text/html',
                        dataType: 'html',
                        url: urlObterMacroDesafiosCancelados + `?codunidadeaprendizagem=${codunidadeaprendizagem}
                                                                &codcursocollege=${codcursocollege}
                                                                &coddisciplinacollege=${coddisciplinacollege}
                                                                &codturmacollege=${codturmacollege}`,
                        success: function (data) {
                            $('#modal-historico-macros-cancelados').html(data);
                        }
                    }).executar();
                },
                complete: function () {
                    $('#modal-historico-macros-cancelados .modal-content').html("");
                }
            }).modal('open');
        });
    }

    /*function clickPaginacao() {

        var filtro = pesquisaDinamica();
        var paginaatual = parseInt($(this).data('pagina'));
        new GCS().setObj({
            type: 'GET',
            contentType: 'text/html',
            dataType: 'html',
            url: `/CorrecaoMacrodesafio/ListagemGrid/?codunidadeaprendizagem=${$('#codunidadeaprendizagem').val()}&codcursocollege=${$('#codcursocollege').val()}&coddisciplinacollege=${$('#coddisciplinacollege').val()}&codturmacollege=${$('#codturmacollege').val()}&filtro=${filtro}&texto=${$('#pesquisar').val()}&paginaatual= ${paginaatual}`,
            success: function (data) {
                $('.grid-resultados').html(data);
                $('.paginacao, #search').click(clickPaginacao);
            }
        }).executar();
    }*/

    return {
        init: init
    };

})();
$(Listagem.init);
