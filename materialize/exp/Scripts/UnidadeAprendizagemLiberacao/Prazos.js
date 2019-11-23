"use strict";

var PrazosUA = (function () {

    function init() {
        bindFunctions();
        CarregarPrazos();
        //validacaoSalvarPrazo();
        checkBoxAtraso();
    }

    function bindFunctions() {
        
    }


    //true ou false (impedir que seja data passada)
    function validaRetroativas() {
        return true;

        var validaRetroativas = null;

        var dataInicio = $("#dataInicio").val();
        dataInicio = dataInicio.split("/");
        var dia = dataInicio[0];
        var mes = dataInicio[1];
        var ano = dataInicio[2];
        dataInicio = mes + "/" + dia + "/" + ano + " " + $("#horarioInicio").val();
        dataInicio = new Date(dataInicio);


        var hoje = new Date();
        if (dataInicio < hoje) {
            validaRetroativas = false;
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
            var dataprazo = $("#dataFim").val();
            dataprazo = dataprazo.split("/");
            var dia = dataprazo[0];
            var mes = dataprazo[1];
            var ano = dataprazo[2];
            dataprazo = mes + "/" + dia + "/" + ano + " " + $("#horarioFim").val();
            dataprazo = new Date(dataprazo);

            //formatação da data atraso
            var dataatraso = $("#dataAtraso").val();
            dataatraso = dataatraso.split("/");
            dia = dataatraso[0];
            mes = dataatraso[1];
            ano = dataatraso[2];
            dataatraso = mes + "/" + dia + "/" + ano + " " + $("#horarioAtraso").val();
            dataatraso = new Date(dataatraso);

            if (dataatraso <= dataprazo) {
                validaPrazoAtraso = false;
            } else if ($("#dataAtraso").val() == "") {
                validaPrazoAtraso = false;
            } else {
                validaPrazoAtraso = true;
            }

        } else {
            validaPrazoAtraso = true;
        }
        return validaPrazoAtraso;

    }

    //true ou false (validar se a data de entrega no prazo é posterior ao prazo inicial)
    function validaEnvio() {
        var validaPrazoEnvio = null;

        //formatação da data inicio
        var dataInicio = $("#dataInicio").val();
        dataInicio = dataInicio.split("/");
        var dia = dataInicio[0];
        var mes = dataInicio[1];
        var ano = dataInicio[2];
        dataInicio = mes + "/" + dia + "/" + ano + " " + $("#horarioInicio").val();
        dataInicio = new Date(dataInicio);

        //formatação da data prazo
        var dataprazo = $("#dataFim").val();
        dataprazo = dataprazo.split("/");
        dia = dataprazo[0];
        mes = dataprazo[1];
        ano = dataprazo[2];
        dataprazo = mes + "/" + dia + "/" + ano + " " + $("#horarioFim").val();
        dataprazo = new Date(dataprazo);


        if (dataprazo <= dataInicio) {
            validaPrazoEnvio = false;
        } else {
            validaPrazoEnvio = true;
        }

        return validaPrazoEnvio;

    }

    //validar os campos obrigatorios
    function validarCamposObrigatorios() {
        var validarCamposObrigatorios = null;
        var datahorainicio = $("#dataInicio").val();
        var horainicio = $("#horarioInicio").val();
        var datahorafim = $("#dataFim").val();
        var horafim = $("#horarioFim").val();
        var dataatraso = $("#dataAtraso").val();
        var horaatraso = $("#horarioAtraso").val();

        if (datahorainicio == "" || horainicio == "" || datahorafim == "" || horafim == "") {
            validarCamposObrigatorios = false;
        } else if ($("#LiberacaoAtraso").is(':checked') && (dataatraso == "" || horaatraso == "")) {
            validarCamposObrigatorios = false;
        } else {
            validarCamposObrigatorios = true;
        }
        return validarCamposObrigatorios;
    }

    //checkbox atraso
    function checkBoxAtraso() {
        function statusFuncaoAtraso() {
            if (!$("#LiberacaoAtraso").is(':checked')) {
                $("#horarioAtraso").attr("disabled", "disabled").val("");
                $("#dataAtraso").attr("disabled", "disabled").val("");
                $("#LiberacaoAtraso").attr("data-status", false);
            } else {
                $("#LiberacaoAtraso").attr("data-status", true);
                $("#horarioAtraso").removeAttr("disabled").val("23:59");
                $("#dataAtraso").removeAttr("disabled");
            }
        }
        $(document).on("click", "#LiberacaoAtraso", function () {
            statusFuncaoAtraso();
        });

    }


    function CarregarPrazos() {
        var codunidadeaprendizagem = $('#codunidadeaprendizagem').val();
        var codcursocollege = $('#codcursocollege').val();
        var coddisciplinacollege = $('#coddisciplinacollege').val();
        var codturmacollege = $('#codturmacollege').val();

        new GCS().setObj({
            type: "GET",
            dataType: 'html',
            contentType: 'text/html',
            url: CarregarPrazosUrl + '?codunidadeaprendizagem=' + codunidadeaprendizagem + '&codcursocollege=' + codcursocollege + '&coddisciplinacollege=' + coddisciplinacollege + '&codturmacollege=' + codturmacollege + '&codunidadeaprendizagemturmadisciplina=' + codunidadeaprendizagemturmadisciplina,
            success: function (data) {
                $("#prazos").html(data);
                $(".acaoSalvarPrazo").off().click(function () {
                    var acao = $(this).attr("id");
                    validacaoSalvarPrazo(acao);
                });
            }
        }).executar();
    }

    function validacaoSalvarPrazo(acao) {
       
        var codunidadeaprendizagemturmadisciplinaliberacao = $("#codunidadeaprendizagemturmadisciplinaliberacao").val();
        if (!codunidadeaprendizagemturmadisciplinaliberacao) {
            codunidadeaprendizagemturmadisciplinaliberacao = 0;
        } else {
            codunidadeaprendizagemturmadisciplinaliberacao = codunidadeaprendizagemturmadisciplinaliberacao;
        }

        if (validaAtraso() == true && validaEnvio() == true && validarCamposObrigatorios() == true && validaRetroativas() == true) {
            //validado
         
            if (codunidadeaprendizagemturmadisciplinaliberacao > 0) {
                $('#modal-justificativa-liberacao').modal({
                    dismissible: false,
                    ready: function () {

                        $('#enviar_justificativa').off().click(function () {
                            acao = $(this).attr("id");
                            var justificativa = $("#modal-justificativa-liberacao #justificativa").val();

                            if (justificativa) {
                                salvarPrazo(acao, codunidadeaprendizagemturmadisciplinaliberacao);
                            } else {
                                Helper.OpenAlert({ title: "Campo obrigatório", msg: "Preencha a justificativa", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                            }
                        });
                    }
                }).modal('open');
            } else {
                salvarPrazo(acao, codunidadeaprendizagemturmadisciplinaliberacao);
            }   

            //erros
        } else if (validarCamposObrigatorios() == false) {
            Helper.OpenAlert({ title: "Ops", msg: 'Por favor, preencha os campos obrigatórios', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
        } else if (validaEnvio() == false) {
            Helper.OpenAlert({ title: "Ops", msg: 'A data de entrega deve ser posterior a data inicial', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
        } else if (validaAtraso() == false) {
            Helper.OpenAlert({ title: "Ops", msg: 'A data de entrega com atraso deve ser posterior a data do prazo inicial', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
        } else if (validaRetroativas() == false) {
            Helper.OpenAlert({ title: "Ops", msg: 'A data de início não pode ser retroativa', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
        }
    }

    function salvarPrazo(acao, codunidadeaprendizagemturmadisciplinaliberacao) {

        var obj = {
            codUnidadeAprendizagem: $("#codUnidadeAprendizagem").val(),
            codempresacollege: $("#codempresacollege").val(),
            codunidadecollege: $("#codunidadecollege").val(),
            codcursocollege: $("#codcursocollege").val(),
            coddisciplinacollege: $("#coddisciplinacollege").val(),
            codturmacollege: $("#codturmacollege").val(),
            codunidadeaprendizagemturmadisciplina: $("#codunidadeaprendizagemturmadisciplina").val(),
            codunidadeaprendizagemturmadisciplinaliberacao: codunidadeaprendizagemturmadisciplinaliberacao,
            //campos formulario
            datahorainicio: $("#dataInicio").val() + " " + $("#horarioInicio").val(),
            horainicio: $("#horarioInicio").val(),
            datahorafim: $("#dataFim").val() + " " + $("#horarioFim").val(),
            horafim: $("#horarioFim").val(),
            liberacaoatrasadostatus: $("#LiberacaoAtraso").attr("data-status"),
            dataatraso: $("#dataAtraso").val() + " " + $("#horarioAtraso").val(),
            horaatraso: $("#horarioAtraso").val(),
            justificativa: $("#justificativa").val()
            // numero de tentativas e configuração de visualização - (campos predefinidos)

        };

        new GCS().setObj({
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(obj),
            url: SalvarPrazosUrl,
            success: function (data) {

                if (data.status) {

                    $('#codunidadeaprendizagemturmadisciplina').val(data.codunidadeaprendizagemturmadisciplina);
                    let textLiberada = data.statusLiberacao ? data.statusLiberacao : "Não Liberada";
                    $('.info-ua .ua-liberada').text(textLiberada);

                    var retorno = data.retorno.split('<br/>');
                    var integracaoCanvas = data.integrado ? 'Canvas: <span>INTEGRADA</span>' : 'Canvas: <span>NÃO INTEGRADA</span>';
                    $('.info-ua .canvas').html(integracaoCanvas);
                    var msgFormatada = data.retorno.replace(' True', '').replace(' False', '');

                    $("#codunidadeaprendizagemturmadisciplinaliberacao").val(data.codunidadeaprendizagemturmadisciplinaliberacao);

                    Helper.OpenAlert({
                        title: "",
                        msg: msgFormatada,
                        classtitle: 'font-preto',
                        close: function () {
                            if (acao == "enviar_justificativa" || acao == 'salvarAvancar') {
                                $('ul.tabs').tabs('select_tab', 'organizacao');
                            } else {
                                window.history.back();
                            }
                        }
                    });

                } else {
                    Helper.OpenAlert({
                        title: "Ops",
                        msg: data.msg,
                        classtitle: "font-vermelho-claro",
                        iconclass: "dissatisfaction",
                        icon: "fa-exclamation-triangle",
                        close: function () {
                        }
                    });
                }
                $("#modal-justificativa-liberacao #justificativa").val('');
                $("#modal-justificativa-liberacao").modal('close');
            },
            error: function (data) {
                console.log(data);
            }
        }).executar();
    }


    return {
        init: init
    };

})();

$(PrazosUA.init);

