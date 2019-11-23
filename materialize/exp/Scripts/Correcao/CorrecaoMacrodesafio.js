"use strict";

var correcaoMacrodesafio = (function () {

    function init() {
        functionBase();
        bindFunctions();
    }

    function functionBase() {

    }

    function bindFunctions() {
        RetornarRedacao($('#codpessoa').val());
        selecionarProximoAluno();
        selecionarAlunoDropdown();
        selecionarAlunoAnterior();
        btnArquivoFeedback();
        salvarRascunhoFeedback();
        salvarRascunhoNota();
        //salvarFeedbackArquivo();
        //excluirFeedbackArquivo();
        $('.voltar-correcoes-pendentes').click(VoltarListagemCorrecoes);
        history.go(1);
        abreModalIgnorarTentativa();
        visualizaTentativa();
        marcaTentativa();
        atribuirNovaTentativaModal();
        enviarNovaTentativa();
        checkBoxAtraso();
        habilitaButton();
        $("#codpessoa").change(x => $(".sl-subtitulo.sl-navy-blue.aluno").text($(".selecao-alunos input").val()));
        loadPage();

    }

    

    //estilo botão arquivo
    function btnArquivoFeedback() {
        $(document).on('click', '.input-arquivo', function (e) {
            $("#arquivo-feedback").trigger("click");
        });
        $(document).on('change', '#arquivo-feedback', function (e) {
            var nomeArquivo = $(this)[0].files[0].name;
            $("#nome-arquivo-feedback").text(nomeArquivo);
        });

    }

    function VoltarListagemCorrecoes() {

        window.location = Listagem + '/?codunidadeaprendizagem=' + $('#codunidadeaprendizagem').val() +
            '&codcursocollege=' + $('#codcursocollege').val() +
            '&coddisciplinacollege=' + $('#coddisciplinacollege').val() +
            '&codturmacollege=' + $('#codturmacollege').val() + '&titulo=' + $(".unidade").text();
    }

    //chamar os metodos
    function RetornarRedacao(codpessoa) {

        if (!codpessoa) {
            codpessoa == 0;
        } else {
            codpessoa = codpessoa;
        }
        new GCS().setObj({
            contentType: false,
            dataType: 'html',
            url: RetornarRedacaoUrl + "?codpessoadesafiotentativaresposta=" + codpessoa,
            type: 'GET',
            success: function (data) {

                $("#arquivoCorrecao-partial").html(data);
                var dataEnvio = $("#data-envio").val();
                var nomeArquivo = $("#nome-arquivo").val();
                $("#data-envio-cabecalho").text(dataEnvio);
                $("#titulo-arquivo").text(nomeArquivo);

                //selecionar o codpessoa by default
                //$('.selecao-alunos select').parent().find("select option").filter((x, elem) => $(elem).data("codpessoa") == parseInt($('#codpessoaitematual').val())).first().prop("selected", "selected");
                $('.Tentativa.Atual').addClass('active');

                $('select').material_select();

                salvarFeedbackArquivo();
                excluirFeedbackArquivo();
                FinalizarCorrecao();
                visualizaTentativa();
                marcaTentativa();
                habilitaButton();
                Helper.refreshGoogleDocsIframe();
                selecionarProximoAluno();
                selecionarAlunoAnterior();
                loadPage();
            },
            error: function (data) {

                console.log(data);
            }
        }).executar();
    }

    function salvarRascunhoFeedback() {
        $(document).on('focusout', '#feedback-textarea', function (e) {
            $("#status-feedback").text("Salvando...");
            var feedback = $("#feedback-textarea").val();
            var codpessoa = $(".selecao-alunos select").val();
            var data = {
                codpessoadesafiotentativaresposta: codpessoa,
                texto: feedback !== "" ? feedback : ""
            };

            new GCS().setObj({
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                url: SalvarFeedbackUrl,
                showLoad: false,
                success: function (data) {
                    console.log(codpessoa);
                    console.log(data);
                    $("#status-feedback").text("Feedback salvo como rascunho.");
                },
                error: function (data) {
                    Helper.OpenAlert({ title: "Acesso não autorizado", msg: "Não será possível salvar o feedback", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    $("#status-feedback").text("");
                }
            }).executar();

        });
    }

    function salvarRascunhoNota() {

        $(document).on('keyup', "#nota-correcao", function () {
            $(this).val($(this).val().replace(',', '.'));
            var valor = $(this).val();
            var max = valor.substring(0, 3);

            if (max.indexOf('_') == -1) {
                valor = parseInt(max);
                console.log(valor);
                if (valor > 10) {
                    $(this).val("");
                    $('#nota-correcao:focus').blur();
                    Helper.OpenAlert({ title: "Ops", msg: 'Insira uma nota de 0 a 10', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                } else if (valor == 10) {
                    valor = valor + ".00";
                    $('#nota-correcao').val(valor);
                    $('#nota-correcao:focus').blur();
                }
            }

        });

        $(document).on('focusout', '#nota-correcao', function (e) {

            var valor = $(this).val();
            if (valor.indexOf('_') == 3) {
                valor = valor + "00";
                valor = valor.replace("__", "");
                $('#nota-correcao').val(valor);
            } else if (valor.indexOf('_') == 4) {
                valor = valor + "0";
                valor = valor.replace("_", "");
                $('#nota-correcao').val(valor);
            } else if (valor.indexOf('_') == 1) {
                valor = "0" + valor + "00";
                valor = valor.replace(/_/g, "");
                $('#nota-correcao').val(valor);
            }


            if ($('#nota-correcao').val()) {
                $("#status-nota").text("Salvando...");
                var nota = valor !== '__.__' ? valor : 0;
                var codpessoaDesafioTentativaResposta = $(".selecao-alunos select").val();
                new GCS().setObj({
                    contentType: 'application/json',
                    url: SalvarNotaUrl + "?codpessoadesafiotentativaresposta=" + codpessoaDesafioTentativaResposta + "&nota=" + nota,
                    type: 'POST',
                    showLoad: false,
                    success: function (data) {
                        console.log(codpessoaDesafioTentativaResposta);
                        console.log(data);
                        $("#status-nota").text("Nota salva como rascunho.");
                    },
                    error: function (data) {
                        Helper.OpenAlert({ title: "Acesso não autorizado", msg: "Não será possível salvar a nota", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                        $("#status-nota").text("");
                    }
                }).executar();
            }
            else {

                $("#nota-correcao").val(0);
            }

        });
    }

    function salvarFeedbackArquivo() {
        $(document).on('change', '#arquivo-feedback', function (e) {
            var arquivo = $('#arquivo-feedback').get(0).files[0];
            var codpessoadesafiotentativaresposta = $(".selecao-alunos select").val();

            var frm = new FormData();
            frm.append("codpessoadesafiotentativaresposta", codpessoadesafiotentativaresposta);
            frm.append("arquivo", arquivo);

            new GCS().setObj({
                type: 'POST',
                contentType: false,
                data: frm,
                url: SalvarArquivoFeedbackUrl,
                success: function (data) {

                    if (data.status) {

                        var html = `<div class="arquivo-feedback">
                                        <span><i class="fas fa-file-alt"></i></span>
                                        <div>
                                            <span>Arquivo de Feedback</span> 
                                            <span><a target="_blank" href="${ data.caminho}">Visualizar documento</a></span>
                                        </div>
                                        <span><i class="fas fa-times excluir-arquivo-feedback" data-codpessoadesafiocorrecao="${ data.codpessoadesafiocorrecao}"></i></span>
                                    </div>`;

                        $('.arquivo-feedback-professor').html(html);
                        //excluirFeedbackArquivo();
                    }
                },
                error: function (data) {
                    Helper.OpenAlert({ title: "Acesso não autorizado", msg: "Não será possível enviar o arquivo", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    $("#nome-arquivo-feedback").text("");
                }
            }).executar();

        });
    }

    function FinalizarCorrecao() {
        $('.salvar-correcao').off().click(function (e) {

            var codpessoadesafiotentativaresposta = $(".selecao-alunos select").val();
            var nota = $("#nota-correcao").val() ? parseFloat($("#nota-correcao").val()) : 0;
            var feedback = $("#feedback-textarea").val();

            var data = {
                codpessoadesafiotentativaresposta: codpessoadesafiotentativaresposta,
                texto: feedback,
                nota: nota
            };

            new GCS().setObj({
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                url: FinalizaCorrecao,
                success: function (data) {

                    if (data.status) {

                        Helper.OpenAlert({
                            title: "Correção finalizada com sucesso", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle",
                            close: function () {

                                window.location = indexUrl + '/?codunidadeaprendizagem=' + $('#codunidadeaprendizagem').val() +
                                    '&codcursocollege=' + $('#codcursocollege').val() +
                                    '&coddisciplinacollege=' + $('#coddisciplinacollege').val() +
                                    '&codturmacollege=' + $('#codturmacollege').val();
                            }
                        });
                    }
                },
                error: function (data) {
                    Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            }).executar();

        });
    }

    function excluirFeedbackArquivo() {
        $('.excluir-arquivo-feedback').off().click(function (e) {

            var codpessoadesafiocorrecao = $(this).data('codpessoadesafiocorrecao');
            console.log(codpessoadesafiocorrecao);

            new GCS().setObj({
                type: 'GET',
                url: ExcluirArquivoFeedbackUrl + '/?codpessoadesafiocorrecao=' + codpessoadesafiocorrecao,
                success: function (data) {

                    var html = `<div class="input-arquivo">
                                    <span id="attachment-feedback"><i class="fas fa-cloud-upload-alt"></i></span>Procurar Arquivo de Correção
                                    <span id="nome-arquivo-feedback"></span>
                                </div>
                                <input type="file" id="arquivo-feedback" class="transparent-input" />`;

                    $('.arquivo-feedback-professor').html(html);
                    //salvarFeedbackArquivo();
                },
                error: function (data) {
                    console.log(data);
                }
            }).executar();

        });
    }

    //funções dropdown
    function selecionarAlunoDropdown() {
        $(".selecao-alunos select").on("change", function () {
            var codpessoa = $(this).val();
            RetornarRedacao(codpessoa);
        });
    }

    function selecionarProximoAluno() {
        $("#selecionar-proximoAluno").off().click(function () {

            if ($(".selecao-alunos select option:last").is(":selected")) {
                $('.selecao-alunos select option:first').prop('selected', true);
            } else {
                $('.selecao-alunos select option:selected').next().prop('selected', true);
            }
            var codpessoa = $('.selecao-alunos select').val();
            var nomeAluno = $('.selecao-alunos select option:selected').text();
            $(".selecao-alunos input").val(nomeAluno);
            RetornarRedacao(codpessoa);
            $(".sl-subtitulo.sl-navy-blue.aluno").text($(".selecao-alunos input").val());
        });
    }

    function selecionarAlunoAnterior() {
        $("#selecionar-alunoAnterior").off().click(function () {

            if ($(".selecao-alunos select option:first").is(":selected")) {
                $('.selecao-alunos select option:last').prop('selected', true);
            } else {
                $('.selecao-alunos select option:selected').prev().prop('selected', true);
            }
            var codpessoa = $('.selecao-alunos select').val();
            var nomeAluno = $('.selecao-alunos select option:selected').text();
            $(".selecao-alunos input").val(nomeAluno);
            RetornarRedacao(codpessoa);
            $(".sl-subtitulo.sl-navy-blue.aluno").text($(".selecao-alunos input").val());
        });
    }

    function abreModalIgnorarTentativa() {

        $('.ignorar-tentativa').off().click(function () {

            var codpessoaDesafioTentativaResposta = $(".selecao-alunos select").val();

            new GCS().setObj({
                type: 'GET',
                url: LoadModalIgnorarTentativaUrl + `?codpessoaDesafioTentativaResposta=${codpessoaDesafioTentativaResposta}`,
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

                            $("#datahorafim").val(datafim);
                            $("#horafim").val(horafim);
                        } else {
                            $("#datahorafim").val("");
                            $("#horafim").val("");
                        }

                        var datahoralimiteatraso = data.datahoralimiteatraso;
                        if (datahoralimiteatraso) {
                            $("#LiberacaoAtraso").click();

                            var datalimiteatraso = datahoralimiteatraso.split(" ")[0];
                            var horalimiteatraso = datahoralimiteatraso.split(" ")[1];

                            $("#datahoralimiteatraso").val(datalimiteatraso);
                            $("#horalimiteatraso").val(horalimiteatraso);
                        } else {
                            $("#datahoralimiteatraso").val("");
                            $("#horalimiteatraso").val("");
                        }
                    }
                },
                error: function (data) {
                    Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            }).executar();
        });
    }

    $('#atribuir-nova-tentativa-tela-correcao').off().click(function () {
        $("#modal-conf-tentativas-tela-correcao .modal-close").off().click(function () {
            $(".LiberacaoDataFim").prop("checked", false);
            $(".datahorafim").val("").prop("disabled", true);;
            $(".horafim").val("").prop("disabled", true);;
            $(".LiberacaoAtraso").prop("checked", false);
            $(".datahoralimiteatraso").val("").prop("disabled", true);;
            $(".horalimiteatraso").val("").prop("disabled", true);;
            $(".justificativa").val("")
        })

        var nomeAluno = $('.modal-header .aluno').text();

        $('#modal-conf-tentativas-tela-correcao').modal({ dismissible: false }).modal('open');
        $('#modal-ignorar-tentativa-tela-correcao').modal({ dismissible: false }).modal('close');
        $('#modal-nova-tentativa .nome-aluno').text(nomeAluno);
    });


    function marcaTentativa() {

        $('.list-tentativas ul li').first().addClass('active');

        var itemClicacdo = $('#itematual').val();

        if (itemClicacdo) {
            $('.list-tentativas ul li').removeClass('active');
            $('.list-tentativas ul li').each(function () {

                //console.log($(this).data('codpessoadesafiotentativaresposta'));
                if ($(this).data('codpessoadesafiotentativaresposta') === parseInt(itemClicacdo)) {
                    $(this).addClass('active');
                }
            });
        }

    }

    function visualizaTentativa() {
        $('.list-tentativas ul li').off().click(function () {

            var elemento = $(this);
            $('#itematual').val(elemento.data('codpessoadesafiotentativaresposta'));
            $('#codpessoaitematual').val(elemento.data('codpessoa'));
            var codpessoadesafiotentativaresposta = elemento.parent().find("li.Tentativa.Atual").data('codpessoadesafiotentativaresposta');
            RetornarRedacao(elemento.data('codpessoadesafiotentativaresposta'));
        });
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

            $('#modal-tentativas-microdesafio').modal({ dismissible: false }).modal('close');
            $('#Modal-liberar-nova-tentativa').modal({ dismissible: false }).modal('close');
            $('#modal-configuracao-tentativas-microdesafio').modal({ dismissible: false }).modal('open');
        });
    }

    //true ou false (data limite deve ser menor do que a fim)
    function validaDataLimiteMaiorQueDataFim() {
        var datahorafim = $("#datahorafim").val();
        datahorafim = datahorafim.split("/");
        var dia = datahorafim[0];
        var mes = datahorafim[1];
        var ano = datahorafim[2];
        datahorafim = mes + "/" + dia + "/" + ano + " " + $("#horafim").val();
        datahorafim = new Date(datahorafim);

        var datahoralimiteatraso = $("#datahoralimiteatraso").val();
        if (datahoralimiteatraso) {
            datahoralimiteatraso = datahoralimiteatraso.split("/");
            var dia = datahoralimiteatraso[0];
            var mes = datahoralimiteatraso[1];
            var ano = datahoralimiteatraso[2];
            datahoralimiteatraso = mes + "/" + dia + "/" + ano + " " + $("#horalimiteatraso").val();
            datahoralimiteatraso = new Date(datahoralimiteatraso);

            if (datahoralimiteatraso < datahorafim)
                return false;
        }

        return true;
    }

    //true ou false (impedir que seja data passada)
    function validaRetroativas(self) {
        var validaRetroativas = null;
        if ($("#LiberacaoDataFim").is(':checked')) {
            var dataFinalEntrega = $("#datahorafim").val();

            if ($("#datahoralimiteatraso").val()) {
                dataFinalEntrega = $("#datahoralimiteatraso").val();
            }

            dataFinalEntrega = dataFinalEntrega.split("/");
            var dia = dataFinalEntrega[0];
            var mes = dataFinalEntrega[1];
            var ano = dataFinalEntrega[2];
            dataFinalEntrega = mes + "/" + dia + "/" + ano + " " + $("#horafim").val();
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
    function validaAtraso() {
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

    }

    function validarCamposObrigatorios() {
        var validarCamposObrigatorios = null;
        var datahorafim = $("#datahorafim").val();
        var horafim = $("#horafim").val();
        var justificativa = $("#justificativa").val();
        var datahoralimiteatraso = $("#datahoralimiteatraso").val();
        var horalimiteatraso = $("#horalimiteatraso").val();


        if (!$("#LiberacaoDataFim").is(':checked') && !$("#LiberacaoAtraso").is(':checked')) {
            validarCamposObrigatorios = false;
        } else if ($("#LiberacaoDataFim").is(':checked') && (datahorafim == "" || horafim == "" || justificativa == "")) {
            validarCamposObrigatorios = false;
        } else if ($("#LiberacaoAtraso").is(':checked') && (datahoralimiteatraso == "" || horalimiteatraso == "")) {
            validarCamposObrigatorios = false;
        }
        else if (($("#LiberacaoDataFim").is(':checked') && (datahorafim == "" || horafim == "" || justificativa == "")) ||
            ($("#LiberacaoAtraso").is(':checked') && (datahoralimiteatraso == "" || horalimiteatraso == "" || justificativa == ""))) {
            validarCamposObrigatorios = false;
        } else {
            validarCamposObrigatorios = true;
        }
        return validarCamposObrigatorios;
    }

    function checkBoxAtraso() {
        $('#LiberacaoAtraso').off().click(function () {
            if (!$("#LiberacaoAtraso").is(':checked')) {
                $("#modal-conf-tentativas-tela-correcao #horalimiteatraso").attr("disabled", "disabled").val("");
                $("#modal-conf-tentativas-tela-correcao #datahoralimiteatraso").attr("disabled", "disabled").val("");
                $("#modal-conf-tentativas-tela-correcao #LiberacaoAtraso").attr("data-status", false);
            } else {
                $("#modal-conf-tentativas-tela-correcao #LiberacaoAtraso").attr("data-status", true);
                $("#modal-conf-tentativas-tela-correcao #horalimiteatraso").removeAttr("disabled");//.val("23:59");
                $("#modal-conf-tentativas-tela-correcao #datahoralimiteatraso").removeAttr("disabled");
            }
        });


        $('#modal-conf-tentativas-tela-correcao #LiberacaoDataFim').off().click(function () {
            if (!$("#modal-conf-tentativas-tela-correcao #LiberacaoDataFim").is(':checked')) {
                $("#modal-conf-tentativas-tela-correcao #horafim").attr("disabled", "disabled").val("");
                $("#modal-conf-tentativas-tela-correcao #datahorafim").attr("disabled", "disabled").val("");
                $("#modal-conf-tentativas-tela-correcao #LiberacaoDataFim").attr("data-status", false);
            } else {
                $("#modal-conf-tentativas-tela-correcao #LiberacaoDataFim").attr("data-status", true);
                $("#modal-conf-tentativas-tela-correcao #horafim").removeAttr("disabled");//.val("23:59");
                $("#modal-conf-tentativas-tela-correcao #datahorafim").removeAttr("disabled");
            }
        });

    }

    function enviarNovaTentativa() {
        $("#enviar_novatentativa_btn").off().click(function () {

            if (/*validaAtraso() == true && */validarCamposObrigatorios() == true && validaRetroativas() == true && validaDataLimiteMaiorQueDataFim()) {
                var codpessoadesafiotentativa = $("#codpessoadesafiotentativa").val();

                var datahorafim = "";
                if ($("#LiberacaoDataFim").is(':checked')) {
                    datahorafim = $("#datahorafim").val();
                    datahorafim = datahorafim.split("/");
                    var dia = datahorafim[0];
                    var mes = datahorafim[1];
                    var ano = datahorafim[2];
                    var horafim = $("#horafim").val() ? $("#horafim").val().split(":").length == 3 ? $("#horafim").val() : $("#horafim").val() + ":00" : "";

                    datahorafim = dia + "/" + mes + "/" + ano + " " + horafim;
                }

                var datahoralimiteatraso = "";
                if ($("#LiberacaoAtraso").is(':checked')) {
                    var datahoralimiteatraso = $("#datahoralimiteatraso").val();
                    datahoralimiteatraso = datahoralimiteatraso.split("/");
                    var dialimite = datahoralimiteatraso[0];
                    var meslimite = datahoralimiteatraso[1];
                    var anolimite = datahoralimiteatraso[2];
                    var horalimiteatraso = $("#horalimiteatraso").val() ? $("#horalimiteatraso").val().split(":").length == 3 ? $("#horalimiteatraso").val() : $("#horalimiteatraso").val() + ":00" : "";
                    if (datahoralimiteatraso && horalimiteatraso)
                        datahoralimiteatraso = dialimite + "/" + meslimite + "/" + anolimite + " " + horalimiteatraso;
                }

                var justificativa = $("#justificativa").val();

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
                            //Helper.OpenAlert({ title: "", msg: 'Nova tentativa criada com sucesso!' });
                            location.reload();
                        } else {
                            Helper.OpenAlert({ title: "Ops", msg: 'Não foi possível criar uma nova tentativa', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                        }
                        $("#datahorafim").val("");
                        $("#horafim").val("");
                        $("#datahoralimiteatraso").val("");
                        $("#horalimiteatraso").val("");
                        $("#justificativa").val("");
                        $('#modal-ignorar-tentativa-tela-correcao').modal({ dismissible: false }).modal('close');
                        $('#modal-conf-tentativas-tela-correcao').modal({ dismissible: false }).modal('close');

                    },
                    error: function (data) {
                        console.log(data);
                    }
                }).executar();

            } else {
                if (validarCamposObrigatorios() == false) {
                    Helper.OpenAlert({
                        title: "Ops",
                        msg: 'Por favor, preencha os campos obrigatórios',
                        classtitle: "font-vermelho-claro",
                        iconclass: "dissatisfaction",
                        icon: "fa-exclamation-triangle"
                    });
                } else if (validaRetroativas() == false) {
                    Helper.OpenAlert({
                        title: "Ops",
                        msg: 'A data do prazo não pode ser retroativa',
                        classtitle: "font-vermelho-claro",
                        iconclass: "dissatisfaction",
                        icon: "fa-exclamation-triangle"
                    });
                } else if (!validaDataLimiteMaiorQueDataFim()) {
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

    function habilitaButton() {

        if ($('#correcao-macro-partial .Atual.active').length > 0) {
            $('#correcao-macro-partial .ignorar-tentativa').removeAttr("disabled");


            $('#nota-correcao')
                .css('pointer-events', 'auto')
                .css('cursor', 'pointer')
                .css('backgroundColor', '#fff');


            $('#feedback-textarea')
                .css('pointer-events', 'auto')
                .css('cursor', 'pointer')
                .css('backgroundColor', '#fff');


            $('.input-arquivo')
                .css('pointer-events', 'auto')
                .css('cursor', 'pointer')
                .css('backgroundColor', '#fff');

            $('.salvar-correcao')
                .css('pointer-events', 'auto')
                .css('cursor', 'pointer')
                .css('backgroundColor', '#007eff');


        } else {

            $('#correcao-macro-partial .ignorar-tentativa').attr("disabled", "disabled");

            $('#nota-correcao')
                .css('pointer-events', 'none')
                .css('cursor', 'no-drop')
                .css('backgroundColor', '#eee');

            $('#feedback-textarea')
                .css('pointer-events', 'none')
                .css('cursor', 'no-drop')
                .css('backgroundColor', '#eee');

            $('.input-arquivo')
                .css('pointer-events', 'none')
                .css('cursor', 'no-drop')
                .css('backgroundColor', '#eee');

            $('.salvar-correcao')
                .css('pointer-events', 'none')
                .css('cursor', 'no-drop')
                .css('backgroundColor', '#eee');
        }

    }

    function loadPage() {

        /*$(document).ready(function () {

            var codpessoadesafiotentativaresposta = $(".selecao-alunos select").val();
            var nota = $("#nota-correcao").val() ? parseFloat($("#nota-correcao").val()) : 0;
            var feedback = $("#feedback-textarea").val();

            var data = {
                codpessoadesafiotentativaresposta: codpessoadesafiotentativaresposta,
                texto: feedback,
                nota: nota
            };

            new GCS().setObj({
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                url: FinalizaCorrecao,
                success: function (data) {
                                        
                },
                error: function (data) {
                    setTimeout(function () {
                        $('#nota-correcao, #feedback-textarea, #arquivo-feedback, .ignorar-tentativa, .salvar-correcao').prop('disabled', true);
                        $('#nota-correcao, #feedback-textarea, #arquivo-feedback, .input-arquivo').attr("style", "background-color: rgb(245, 245, 245); color: #acacac");
                        $('#attachment-feedback i').attr("style", "background-color: #acacac");
                        
                    }, 400);
                }
            }).executar();
        });*/
    }

    return {
        init: init
    };

})();
$(correcaoMacrodesafio.init);
