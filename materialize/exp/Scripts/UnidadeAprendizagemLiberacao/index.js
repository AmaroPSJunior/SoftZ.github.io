"use strict";

var LiberacaoUA = (function () {

    function init() {
        bindFunctions();
        plugins();
        anoSemestre();
    }

    function bindFunctions() {

        $('.lista-disciplina .collapsible-header').click(listaUAs);
        //$('#btnliberarmaterial').click(liberarMaterial);
        visualizarComoAluno();
        //cancelarUa();
        filtrarAnoSemestre();
    }

    function plugins() {
        $('.tabs').tabs();
        $(".sortable").sortable();
    }

    function anoSemestre() {
        new GCS().setObj({
            type: "GET",
            url: urlListarAnoSemestre,
            success: function (data) {

                $("#listar-ano-semestre").val("None");
                $("#listar-ano-semestre").material_select();

                $("#listar-cursos").val("None");
                $("#listar-cursos").parent().find("input").val("Cursos");
                $("#listar-cursos").material_select();
               
                $("#listar-disciplinas").val("None");
                $("#listar-disciplinas").parent().find("input").val("Disciplinas");
                $("#listar-disciplinas").material_select();

                data.anoSemestre.forEach(x => {
                    $("#listar-ano-semestre").append("<option value='" + x + "'>" + x + "</option>");
                });
                $("#listar-ano-semestre").material_select();
                carregarCursos();
                $("#listar-ano-semestre").parent().find("input").val("Ano / Semestre");
                $("#listar-cursos").parent().find("input").val("Cursos");
                $("#listar-disciplinas").parent().find("input").val("Disciplinas");
            }
        }).executar();
    }

    function carregarCursos() {
        $("#listar-ano-semestre").on("change", function () {
            Master.showLoad();
            var ano = $("#listar-ano-semestre").val().split("/")[0];
            var semestre = $("#listar-ano-semestre").val().split("/")[1];

            $("#listar-cursos").val("None");
            $("#listar-cursos").parent().find("input").val("Cursos");
            $("#listar-cursos").material_select();

            $("#listar-disciplinas").val("None");
            $("#listar-disciplinas").parent().find("input").val("Disciplinas");
            $("#listar-disciplinas").material_select();

            $.getJSON(urlListarCursos + "?ano=" + ano + "&semestre=" + semestre, function (data) {

                $("#listar-cursos").val("None");
                $("#listar-cursos").parent().find("input").val("Cursos");
                $("#listar-cursos").material_select();


                $("#listar-disciplinas").val("None");
                $("#listar-disciplinas").parent().find("input").val("Disciplinas");
                $("#listar-disciplinas").material_select();

                $("#listar-cursos").append("<option value=''>Todos</option>");
                var i;
                for (i = 0; i < data['msg'].length; i++) {
                    var codCurso = data['msg'][i][0].Value;
                    var curso = data['msg'][i][1].Value;
                    curso = curso.replace("- Centro de Ensino São Lucas Ltda", "");
                    $("#listar-cursos").append("<option value='" + codCurso + "'>" + curso + "</option>");
                }
                $("#listar-cursos").material_select();
                carregarDisciplinas();
                filtrarDisciplinasPorCurso();
                $("#listar-cursos").parent().find("input").val("Cursos");
                $("#listar-disciplinas").parent().find("input").val("Disciplinas");
                Master.hideLoad();
            });
        });
    }

    function carregarDisciplinas() {
        $("#listar-cursos").on("change", function () {
            Master.showLoad();
            var ano = $("#listar-ano-semestre").val().split("/")[0];
            var semestre = $("#listar-ano-semestre").val().split("/")[1];

            $("#listar-disciplinas").empty();
            $("#listar-disciplinas").append('<option value="" disabled selected>Disciplinas</option>');
            var codCurso = $("#listar-cursos").val();
            $("#listar-disciplinas").val("None");
            $("#listar-disciplinas").material_select();
            if (codCurso) {
                $.getJSON(urlListarDisciplinas + "?codcurso=" + codCurso + "&ano=" + ano + "&semestre=" + semestre, function (data) {
                    $("#listar-disciplinas").empty();
                    $("#listar-disciplinas").val("None");
                    $("#listar-disciplinas").material_select();

                    $("#listar-disciplinas").append("<option value=''>Todos</option>");
                    var i;
                    for (i = 0; i < data['msg'].length; i++) {
                        var codDisciplina = data['msg'][i][0].Value;
                        var disciplina = data['msg'][i][1].Value;
                        $("#listar-disciplinas").append("<option value='" + codDisciplina + "'>" + disciplina + "</option>");
                    }
                    $("#listar-disciplinas").material_select();
                    filtrarDisciplinasPorDisciplina();
                    $("#listar-disciplinas").parent().find("input").val("Disciplinas");
                    Master.hideLoad();
                });
            } else {
                Master.hideLoad();
            }

        });
    }

    function filtrarAnoSemestre() {
        $("#listar-ano-semestre").on("change", function () {

            $("#listar-cursos").val("None");
            $("#listar-cursos").parent().find("input").val("Cursos");
            $("#listar-cursos").material_select();

            $("#listar-disciplinas").val("None");
            $("#listar-disciplinas").parent().find("input").val("Disciplinas");
            $("#listar-disciplinas").material_select();

            $("#listar-cursos").empty();
            $("#listar-disciplinas").empty();

            filtrarDisciplinas();
        });
    }

    function filtrarDisciplinasPorCurso() {
        $("#listar-cursos").on("change", function () {

            $("#listar-disciplinas").val("None");
            $("#listar-disciplinas").parent().find("input").val("Disciplinas");
            $("#listar-disciplinas").material_select();

            $("#listar-disciplinas").empty();
            filtrarDisciplinas();
        });
    }

    function filtrarDisciplinasPorDisciplina() {
        $("#listar-disciplinas").on("change", function () {
            filtrarDisciplinas();
        });
    }

    function filtrarDisciplinas() {
        var ano = $("#listar-ano-semestre").val().split("/")[0];
        var semestre = $("#listar-ano-semestre").val().split("/")[1];
        var codCurso = $("#listar-cursos").val() ? $("#listar-cursos").val() : "";
        var codDisciplina = $("#listar-disciplinas").val() ? $("#listar-disciplinas").val() : "";

        new GCS().setObj({
            type: "GET",
            contentType: 'text/html',
            dataType: 'html',
            url: "Index?codcurso=" + codCurso + "&coddisciplina=" + codDisciplina + "&ano=" + ano + "&semestre=" + semestre,
            showLoad: false,
            success: function (data) {
                $(".divPartial").html($(data).find(".divPartial").html())
                $('.collapsible.lista-disciplina--collapsible').collapsible();
                bindFunctions();
            }
        }).executar();
    }

    function Correcao() {
        $('.collapsible-body .btncorrecao a').click(function () {
            window.location = CarregarCorrecaoUrl +
                '/?codunidadeaprendizagem=' + $(this).closest('tr').data('codunidadeaprendizagem') +
                '&codcursocollege=' + $(this).closest('tr').data('codcursocollege') +
                '&coddisciplinacollege=' + $(this).closest('tr').data('coddisciplinacollege') +
                '&codturmacollege=' + $(this).closest('li').find('div.collapsible-header').data('codturmacollege') +
                '&titulo=' + $(this).closest('tr').find('td:first-child').text();
        });
    }


    function Editar() {
        $('.collapsible-body .btnliberar a').click(function () {

            window.location = CarregarLiberacaoUlr + '/?codunidadeaprendizagem=' + $(this).closest('tr').data('codunidadeaprendizagem') +
                '&codcursocollege=' + $(this).closest('tr').data('codcursocollege') +
                '&coddisciplinacollege=' + $(this).closest('tr').data('coddisciplinacollege') +
                '&codturmacollege=' + $(this).closest('li').find('div.collapsible-header').data('codturmacollege');
        });
    }

    function listaUAs() {

        var elemento = $(this);
        if (!elemento.hasClass('active')) {
            var coddisciplinacollege = $(this).data('coddisciplinacollege');
            var codcursocollege = $(this).data('codcursocollege');
            var codturmacollege = $(this).data('codturmacollege');

            new GCS().setObj({
                type: "GET",
                dataType: 'html',
                contentType: 'text/html',
                url: urlObterListaDisciplinaGrid + '?coddisciplinacollege=' + coddisciplinacollege + '&codcursocollege=' + codcursocollege + '&codturmacollege=' + codturmacollege + '&formularioua= ' + formularioUA,
                success: function (data) {
                    $('.lista-disciplina .collapsible-header').siblings('.collapsible-body').html(data);
                    Editar();
                    Correcao();
                    ReabrirCorrecao();
                    visualizarComoAluno();
                    cancelarUa();
                }
            }).executar();

        }
    }

    function ReabrirCorrecao() {
        $('.reabre button').off().click(function () {
            Helper.OpenConfirm({
                title: "Deseja realmente reabrir a correção do Macrodesafio?",
                icon: 'fa-exclamation-triangle',
                iconclass: 'satisfaction-yellow',
                msg: '',
                classtitle: 'font-preto',
                yes: function () {
                    ReabrirCorrecaoConfirma();
                    Helper.CloseConfirm();
                },
                no: function () { },
                textno: 'Não',
                textsim: 'Sim'
            });
        });
    }

    function visualizarComoAluno() {
        $('.visualizar').off().click(function (e) {
            e.stopPropagation();
           
            $("#modal-visualiza-aluno").removeClass('hide');
            $("body").addClass("bodyWithNoScroll");
            $("#modal-visualiza-aluno").fadeIn();

            var codUA = 0;
            var coddisciplina = $(this).closest(".collapsible-header").attr("data-coddisciplinacollege"); 
            var codturma = $(this).closest(".collapsible-header").attr("data-codturmacollege");
            var codcurso = $(this).closest(".collapsible-header").attr("data-codcursocollege");

            if ($(this).closest(".bordered").is(".bordered")) {
                codUA = $(this).closest("tr").attr("data-codunidadeaprendizagem");
                coddisciplina = $(this).closest("tr").attr("data-coddisciplinacollege"); 
                codturma = $(this).closest("li").find("div").attr("data-codturmacollege"); 
                codcurso = $(this).closest("tr").attr("data-codcursocollege"); 
            }

            var url = "http://aluno.slconstruct.saolucas.edu.br/";

            if (location.href.indexOf("homologacao") > -1 || location.href.indexOf("localhost") > -1) {
                url = "http://homologacaoaluno.slconstruct.saolucas.edu.br/";
            } else if (location.href.indexOf("estabilizacao") > -1) {
                url = "http://estabilizacaoaluno.slconstruct.saolucas.edu.br/";
            }

            var teste = `${url}SimulacaoAluno?codunidadeaprendizagem=${codUA}&coddisciplina=${coddisciplina}&codturma=${codturma}&codcurso=${codcurso}`;
            console.log(teste);

            $("#iframe-visualiza-aluno").html(`<iframe src="${url}SimulacaoAluno?codunidadeaprendizagem=${codUA}&coddisciplina=${coddisciplina}&codturma=${codturma}&codcurso=${codcurso}" style="width: 100%; height: 100%;"></iframe>`);

            $('#fechar-visualizacao-aluno').off().click(function () {
                $("body").removeClass("bodywithnoscroll");
                $("#iframe-visualiza-aluno").empty();
                $("#modal-visualiza-aluno").fadeOut();
                $("#modal-visualiza-aluno").addClass('hide');
            });
        });
    }

    function ReabrirCorrecaoConfirma() {

        new GCS().setObj({
            type: "GET",
            dataType: 'html',
            contentType: 'text/html',
            url: urlReabreCorrecaomacro,
            success: function (data) {
                debugger;

            }
        }).executar();
    }


    //function liberarMaterial() {

    //    var codunidadeaprendizagem = $('#codunidadeaprendizagem').val();
    //    var codcursocollege = $('#codcursocollege').val();
    //    var coddisciplinacollege = $('#coddisciplinacollege').val();
    //    var codturmacollege = $('#codturmacollege').val();

    //    new GCS().setObj({
    //        type: "GET",
    //        url: LiberarMaterialUlr + '/?codunidadeaprendizagem=' + codunidadeaprendizagem + '&codcursocollege=' +
    //            codcursocollege + '&coddisciplinacollege=' + coddisciplinacollege + '&codturmacollege=' + codturmacollege,
    //            //curso,
    //        success: function (data) {

    //            console.log(data.status);
    //            if (data.status) {
    //                Helper.OpenAlert({ title: "Material liberado com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
    //            }
    //            else {
    //                Helper.OpenAlert({ title: "Ops", msg: "Algo deu errado: " + data.msg, classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
    //            }
    //        }
    //    }).executar();
    //}

    function cancelarUa() {

        $(".btncancelar").off().click(function () {
            var self = this;

            Helper.OpenConfirm({
                title: "Deseja realmente cancelar a Unidade de Aprendizagem para essa turma?",
                icon: 'fa-exclamation-triangle',
                iconclass: 'satisfaction-yellow',
                msg: '',
                classtitle: 'font-preto',
                yes: function () {
                    Helper.CloseConfirm();
                    verificaAlunosInciaramAtividades(self, executaCancelamentoUA);
                },
                no: function () { },
                textno: 'Não',
                textsim: 'Sim'
            });
           
        });
    }

    function verificaAlunosInciaramAtividades(self, callbackCancelamento) {
        var codunidadeaprendizagem = $(self).closest("tr").attr("data-codunidadeaprendizagem");
        var codcursocollege = $(self).closest("tr").attr("data-codcursocollege");
        var coddisciplinacollege = $(self).closest("tr").attr("data-coddisciplinacollege");
        var codturmacollege = $(self).closest(".active").find(".collapsible-header.active").attr("data-codturmacollege");

        new GCS().setObj({
            type: "GET",
            url: urlAtividadesIniciadasPelosAlunosUnidadeAprendizagem + '/?codunidadeaprendizagem=' + codunidadeaprendizagem + '&codcursocollege=' +
                codcursocollege + '&coddisciplinacollege=' + coddisciplinacollege + '&codturmacollege=' + codturmacollege,
            success: function (data) {
                if (data.status) {
                    if (data.atividadesIniciadasPelosAlunos) {
                        setTimeout(x => {
                            Helper.OpenConfirm({
                                title: "A turma já realizou desafios, deseja realmente cancelar?",
                                icon: 'fa-exclamation-triangle',
                                iconclass: 'satisfaction-yellow',
                                msg: '',
                                classtitle: 'font-preto',
                                yes: function () {
                                    Helper.CloseConfirm();
                                    $("#modal-justificativa-cancelamento").modal({ dismissible: false }).modal('open');
                                    $("#justificativa").val(null);
                                    $("#enviar_novatentativa_btn").off().click(function () {

                                        if ($("#justificativa").val() == "") {
                                            Helper.OpenAlert({ title: "Ops", msg: "Campo Justificativa é Obrigatorio", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                                        } else {
                                            callbackCancelamento(self);
                                        }
                                    });
                                },
                                no: function () { },
                                textno: 'Não',
                                textsim: 'Sim'
                            });
                        }, 250);
                        
                    } else {
                        $("#modal-justificativa-cancelamento").modal({ dismissible: false }).modal('open');
                        $("#justificativa").val(null);
                        $("#enviar_novatentativa_btn").off().click(function () {

                            if ($("#justificativa").val() == "") {
                                Helper.OpenAlert({ title: "Ops", msg: "Campo Justificativa é Obrigatorio", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                            } else {
                                callbackCancelamento(self);
                            }
                        });
                    }
                }
                else {
                    Helper.OpenAlert({ title: "Ops", msg: "Algo deu errado: " + data.msg, classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            },
            error: function (err) {
                Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            }
        }).executar();


    }

    function executaCancelamentoUA(self) {
        var codunidadeaprendizagem = $(self).closest("tr").attr("data-codunidadeaprendizagem");
        var codcursocollege = $(self).closest("tr").attr("data-codcursocollege");
        var coddisciplinacollege = $(self).closest("tr").attr("data-coddisciplinacollege");
        var codturmacollege = $(self).closest(".active").find(".collapsible-header.active").attr("data-codturmacollege");
        var justificativa = $("#justificativa").val();

        new GCS().setObj({
            type: "GET",
            url: urlCancelarUa + '/?codunidadeaprendizagem=' + codunidadeaprendizagem + '&codcursocollege=' +
                codcursocollege + '&coddisciplinacollege=' + coddisciplinacollege + '&codturmacollege=' + codturmacollege + '&justificativa= ' + justificativa,
            success: function (data) {
                if (data.status) {
                    Helper.OpenAlert({ title: "Ua cancelada com sucesso!", msg: data.ms, classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                    $("#justificativa").val(null);
                    $("#modal-justificativa-cancelamento").modal('close');

                    $(self).closest("tr").find("td.data-inicio").text("-");
                    $(self).closest("tr").find("td.data-final").text("-");
                    $(self).closest("tr").find("td.data-limite").text("-");
                    $(self).closest("tr").find("td.status-ua").text("CANCELADA");
                    $(self).closest("tr").find("td.btnliberar").hide();
                    $(self).closest("tr").find("td.btncancelar").hide();

                    carregarDisciplinas();
                    Editar();
                    Correcao();
                    ReabrirCorrecao();
                    visualizarComoAluno();
                    cancelarUa();
                }
                else {
                    Helper.OpenAlert({ title: "Ops", msg: "Algo deu errado: " + data.msg, classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            },
            error: function (err) {
                Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            }
        }).executar();
    }
    

    return {
        init: init
    };

})();

$(LiberacaoUA.init);

