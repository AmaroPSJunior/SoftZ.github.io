"use strict";

var ExportacaoNota = (function () {
    var searchIDs = [];
    var dadosCSV = [];

    function init() {
        bindFunctions();
    }

    function bindFunctions() {
        tipoExecucao();
        importacaoProvasLoadDropdown();
        $('#executar').click(enviarForm);
        getAlunos();
        getContas();
        getDisciplinas();
        selecionarTodas();
        scrollStyle();
        filtrarTabela();
        executarEmMassa();
        importarProvas();
        gerarCsv();
    }

    function executarEmMassa() {
        $("#executar_massa").click(function (event) {
            event.preventDefault();
            var conta = $("#contas_massa").val(),
                parcial = $("#parcial_massa").val(),
                action = "/ExportacaoNotas/GetResultado",
                tipo = "nota";


            searchIDs = $("#cursos_tabela input:checkbox:checked").map(function () {
                return $(this).val();
            }).get();

            var courseId = "" + searchIDs[0] + "";
            rodarNotas(conta, parcial, action, courseId, tipo);

            //for (var i = 0; i < searchIDs.length; i++) {
            //    var courseId = "" + searchIDs[0] + "";
            //    rodarNotas(conta, parcial, action, courseId);
            //    //console.log(searchIDs[i]);
            //}

        });
    }


    function gerarCsv() {
        $("#gerar_csv").click(function (event) {
            event.preventDefault();
            var conta = $("#contas_massa").val(),
                parcial = $("#parcial_massa").val(),
                action = "/ExportacaoNotas/GetResultado",
                tipo = "csv";

            dadosCSV = [];

            searchIDs = $("#cursos_tabela input:checkbox:checked").map(function () {
                return $(this).val();
            }).get();

            var courseId = "" + searchIDs[0] + "";
            rodarNotas(conta, parcial, action, courseId, tipo);

            //for (var i = 0; i < searchIDs.length; i++) {
            //    var courseId = "" + searchIDs[0] + "";
            //    rodarNotas(conta, parcial, action, courseId);
            //    //console.log(searchIDs[i]);
            //}

        });
    }

    function filtrarTabela() {
        $("#filtro_disciplinas").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#tabela_disciplinas tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    }

    function rodarNotas(conta, parcial, action, courseId, tipo) {
        var csv;
        if (tipo == "csv") {
            csv = true;
        } else {
            csv = false;
        }
        $('tr[data-value_course_id="' + courseId + '"]').addClass("executando_nota");
        new GCS().setObj({
            type: 'POST',
            contentType: false,
            url: action + "?parcial=" + parcial + "&courseid=" + courseId + "&user=&accountId=" + conta +"&gerarcsv="+csv,
            showLoad: false,
            success: function (data) {
                console.log(data);
                var $linha = $('tr[data-value_course_id="' + courseId + '"]');

                $linha.removeClass("executando_nota");
                var $coluna = $linha.find('td .status_sala');

                if (data['status'] === true) {
                    let todasNotasZeradas = true;

                    data.data.every(function (element) {
                        if (element.display_score !== 0) {
                            todasNotasZeradas = false;
                            return false;
                        } else
                            return true;
                    });

                    if (data.data.length === 0) {
                        $coluna.attr("style", "background: yellow");
                    } else if (todasNotasZeradas) {
                        $coluna.attr("style", "background: orange");
                    } else {
                        $coluna.attr("style", "background: green");
                        $('#' + courseId).prop('checked', false);
                    }

                    dadosCSV.push.apply(dadosCSV, data.data);
                } else {
                    console.error(data);
                    $coluna.attr("style", "background: red");
                }
            },
            complete: function () {

                searchIDs.shift();
                if (searchIDs.length > 0) {
                    var courseId = "" + searchIDs[0] + "";
                    rodarNotas(conta, parcial, action, courseId, tipo);
                }
                

                if ($('.executando_nota').length == 0) {

                    var errorIds = $("#cursos_tabela input:checkbox:checked").map(function () {
                        return $(this).val();
                    }).get();

                    $("#cursos_tabela tr").hide();
                    for (var i = 0; i < errorIds.length; i++) {
                        var courseId = errorIds[i];
                        $('tr[data-value_course_id="' + courseId + '"]').show();
                    }


                    if (tipo == "nota") {
                        Helper.OpenAlert({ title: "Envio de notas em andamento em segundo plano, se desejar, você pode fechar a guia.", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                        $(".progresso").slideDown().addClass('carregando');
                        firstAtualizacaoPorcentagem();
                        atualizarPorcentagem();
                        new GCS().setObj({
                            type: 'POST',
                            contentType: false,
                            url: "/ExportacaoNotas/IntegraNotasCollege?semestre=" + $('#form_em_massa #semestre_massa').val(),
                            showLoad: false,
                            success: function (data) {
                                console.log(data);
                            },
                            complete: function () {
                                console.log('Completado');
                            }
                        }).executar();
                    } else {
                        //window.location = "/ExportacaoNotas/DownloadCSV?conteudo=" + JSON.stringify(dadosCSV);
                        $('#frmDownloadCSV #conteudo').val(JSON.stringify(dadosCSV));
                        $('#frmDownloadCSV').submit();
                        Helper.hideLoad();
                        /*new GCS().setObj({
                            type: 'POST',
                            contentType: false,
                            url: "/ExportacaoNotas/DownloadCSV",
                            showLoad: true,
                            success: function (data) {
                                console.log(data);
                            },
                            complete: function () {
                                console.log('Completado');
                            }
                        }).executar();*/
                    }
                }
                
            },
            error: function () {
                console.error(data);
                $('tr[data-value_course_id="' + courseId + '"] td').find('.status_sala').attr("style", "background: red");
            }

        }).executar();
    }

    function scrollStyle() {
        $(document).scroll(function () {

            var acoesHeader = Math.round($("#acoes-massa-header").position().top);
            var currentScroll = $(this).scrollTop();
            if (currentScroll >= acoesHeader - 65) {
                if ($("#asidebar").hasClass("hidden-desktop")) {
                    $("#acoes-massa-header").addClass("fixed_massa_header");
                } else {
                    $("#acoes-massa-header").addClass("fixed_massa_header-small");
                }

            } else {
                $("#acoes-massa-header").removeClass("fixed_massa_header");
                $("#acoes-massa-header").removeClass("fixed_massa_header-small");
            }

        });
    }

    function selecionarTodas() {
        $('#selecionar-todas').on('click', function (e) {
            $(".checkbox-disciplinas").each(function () {
                if ($(this).parent().parent().is(":visible")) {
                    $(this).addClass("checkbox-visieveis");
                } else {
                    $(this).removeClass("checkbox-visieveis");
                }
            });

            $('.checkbox-visieveis').not(this).prop('checked', this.checked);
        })
    }

    function getDisciplinas() {
        $("#contas_massa").on('change', function (e) {
            $("#cursos_tabela").empty();
            $('#selecionar-todas').prop('checked', false); 
            var accountId = e.target.value;
            var action = "/ExportacaoNotas/GetCoursesByAccount?accountId=" + accountId;
            new GCS().setObj({
                type: 'GET',
                contentType: false,
                url: action,
                showLoad: true,
                success: function (data) {
                    //console.log(data)
                    var qtdSala = data['courses'].length;
                    for (var i = 0; i < qtdSala; i++) {
                        var course = data.courses[i];
                        $(".selecionar-todas-check").fadeIn();
                        $("#executar_massa").fadeIn();
                        $("#gerar_csv").fadeIn();
                        $("#cursos_tabela").append(`<tr data-value_course_id="${course.sis_course_id}">
                            <td>
                                <input value="${course.sis_course_id}" type='checkbox' class='filled-in checkbox-disciplinas' id="${course.sis_course_id}"/>
                                <label for="${course.sis_course_id}"></label>
                            </td>
                            <td>
                                <a href="https://${data.subdomain}.instructure.com/courses/${course.id}/assignments" target="_blank" >${course.name}</a>
                            </td>
                            <td>${course.sis_course_id}</td>
                            <td><span class='status_sala'></span></td>
                        </tr>`);
                    }
                },
                complete: function () {
                    console.log('Completado');
                }
            }).executar();

        });
    }

    function tipoExecucao() {
        $('input:radio[name="tipo_execucao"]').on("change", function () {
            if ($(this).val() == "exec_massa") {
                $("#form_por_aluno").slideUp();
                $("#form_em_massa").slideDown();
            } else {
                $("#form_por_aluno").slideDown();
                $("#form_em_massa").slideUp();
            }
        })
    }

    function enviarForm() {
        var form = new FormData($("form")[0]),
            action = $("form").attr('action');

        console.log('Carregando...');

        if ($("#txtCourseId").val() != "") {
            new GCS().setObj({
                type: 'POST',
                contentType: false,
                url: action,
                data: form,
                showLoad: true,
                success: function (data) {
                    console.log(data);
                },
                complete: function () {
                    console.log('Completado');
                    $(".progresso").slideDown();
                    Helper.OpenAlert({ title: "Envio de notas em andamento em segundo plano, se desejar, você pode fechar a guia.", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                    firstAtualizacaoPorcentagem();
                    atualizarPorcentagem();
                    new GCS().setObj({
                        type: 'POST',
                        contentType: false,
                        url: "/ExportacaoNotas/IntegraNotasCollege",
                        showLoad: false,
                        success: function (data) {
                            console.log(data);
                        },
                        complete: function () {
                            console.log('Completado');
                        }
                    }).executar();
                }
            }).executar();
        } else {
            Helper.OpenAlert({ title: "Informe o Course ID", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });

        }

        
    }

    function getContas() {
        var action = $("#contas").attr("data-urlGetAccounts");
        new GCS().setObj({
            type: 'GET',
            contentType: false,
            url: action,
            showLoad: true,
            success: function (data) {
                var qtdContas = data['accounts'].length;
                for (var i = 0; i < qtdContas; i++) {
                    //console.log(data['alunos'][i]);
                    $("#contas").append("<option value='" + data['accounts'][i].Value + "'>" + data['accounts'][i].Text + "</option>");
                    $("#contas").material_select();
                }
            },
            complete: function () {
                console.log('Completado');
            }
        }).executar();

        new GCS().setObj({
            type: 'GET',
            contentType: false,
            url: action,
            showLoad: true,
            success: function (data) {
                var qtdContas = data['accounts'].length;
                for (var i = 0; i < qtdContas; i++) {
                    //console.log(data['alunos'][i]);
                    $("#contas_massa").append("<option value='" + data['accounts'][i].Value + "'>" + data['accounts'][i].Text + "</option>");
                    $("#contas_massa").material_select();
                }
            },
            complete: function () {
                console.log('Completado');
            }
        }).executar();
    }

    function getAlunos() {
        var action = $("#txtCourseId").attr('data-urlGetEnrollments');
        
        $("#txtCourseId").on("change", function () {
            var courseId = $("#txtCourseId").val();
            new GCS().setObj({
                type: 'GET',
                contentType: false,
                url: action + "?sis_course_id=" + courseId,
                showLoad: true,
                success: function (data) {
                    
                    var qtdAlunos = data['alunos'].length;
                    for (var i = 0; i < qtdAlunos; i++) {
                        //console.log(data['alunos'][i]);
                        $("#alunosSelect").append("<option value='" + data['alunos'][i].Value + "'>" + data['alunos'][i].Text +"</option>");
                        $("#alunosSelect").material_select();
                    }
                },
                complete: function () {
                    console.log('Completado');
                }
            }).executar();
        });
    }

    function firstAtualizacaoPorcentagem() {
        new GCS().setObj({
            type: 'GET',
            contentType: false,
            url: "/ExportacaoNotas/GetProcentagemIntegracao",
            showLoad: false,
            success: function (data) {
                var porcentagem = data['porcentagem'];
                $(".progresso span").attr("style", "width: " + porcentagem + "%;");
            }
        }).executar();
    }

    function atualizarPorcentagem() {
        var interval = setInterval(function () {
            new GCS().setObj({
                type: 'GET',
                contentType: false,
                url: "/ExportacaoNotas/GetProcentagemIntegracao",
                showLoad: false,
                success: function (data) {
                    var porcentagem = data['porcentagem'];
                    if (parseFloat(porcentagem) > 99.5)
                        porcentagem = 100;

                    $(".progresso span").attr("style", "width: " + porcentagem + "%;");
                    if (porcentagem == 100) {
                        clearInterval(interval);
                        $(".progresso").removeClass('carregando');
                    }
                }
            }).executar();
        }, 20000);
    }

    function importacaoProvasLoadDropdown() {
        var urlSemestre = $("#semestre").attr("data-url");
        var urlBimestre = $("#bimestre").attr("data-url");
        var urlInstituicao = $("#instituicoes").attr("data-url");

        new GCS().setObj({
            type: 'GET',
            contentType: false,
            url: urlInstituicao,
            showLoad: false,
            success: function (data) {
                var qtdInstituicoes = data['instituicoes'].length;
                for (var i = 0; i < qtdInstituicoes; i++) {
                    $("#instituicoes").append("<option value='" + data['instituicoes'][i].Value + "'>" + data['instituicoes'][i].Text + "</option>");
                    $("#instituicoes").material_select();
                }
            },
            complete: function () {
                //console.log('Completado');
            }
        }).executar();

        new GCS().setObj({
            type: 'GET',
            contentType: false,
            url: urlSemestre,
            showLoad: false,
            success: function (data) {
                var qtdSemestre = data['anossemestres'].length;
                for (var i = 0; i < qtdSemestre; i++) {
                    $("#semestre").append("<option value='" + data['anossemestres'][i].Value + "'>" + data['anossemestres'][i].Text + "</option>");
                    $("#semestre").material_select();
                }
            },
            complete: function () {
                //console.log('Completado');
            }
        }).executar();

        new GCS().setObj({
            type: 'GET',
            contentType: false,
            url: urlBimestre,
            showLoad: false,
            success: function (data) {
                var qtdBimestre = data['bimestres'].length;
                for (var i = 0; i < qtdBimestre; i++) {
                    $("#bimestre").append("<option value='" + data['bimestres'][i] + "'>" + data['bimestres'][i] + "</option>");
                    $("#bimestre").material_select();
                }
            },
            complete: function () {
                //console.log('Completado');
            }
        }).executar();

    }

    function importarProvas() {
        $("#executar-importacao-prova").on("click", function () {
            var semestre = $("#semestre").val();
            var bimestre = $("#bimestre").val();
            var instituicao = $("#instituicoes").val();
            var parcial = $("#parcial_prova").val();

            var action = $(this).data("url");

        
            if (semestre  && bimestre) {
                new GCS().setObj({
                    type: 'POST',
                    contentType: false,
                    url: action + "?bimestre=" + bimestre + "&anosemestre=" + semestre + "&codinstituicao=" + instituicao,
                    showLoad: true,
                    success: function (data) {
                        console.log(data);
                    },
                    complete: function () {
                        Helper.OpenAlert({ title: "Envio de notas em andamento em segundo plano, se desejar, você pode fechar a guia.", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                        $(".progresso").slideDown().addClass('carregando');
                        firstAtualizacaoPorcentagem();
                        atualizarPorcentagem();

                        new GCS().setObj({
                            type: 'POST',
                            contentType: false,
                            url: "/ExportacaoNotas/IntegraNotasCollege" + "?parcial=" + parcial,
                            showLoad: false,
                            success: function (data) {
                                console.log(data);
                            },
                            complete: function () {
                                console.log('Completado');
                            }
                        }).executar();
                    }
                }).executar();
            }

        });
    }

    return {
        init: init,
        dadosCSV: dadosCSV
    };
})();

$(ExportacaoNota.init);