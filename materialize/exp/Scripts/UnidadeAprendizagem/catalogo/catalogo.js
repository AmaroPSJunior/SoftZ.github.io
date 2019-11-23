"use strict";

var Catalogo = (function () {

    function init() {
        functionBase();
        bindFunctions();
    }

    function functionBase() {
        $('ul.tabs').tabs();
        $('select').material_select();
    }

    function bindFunctions() {
        CarregarCurso();
        $('#btnPesquisarUnidades').click(PesquisaCatalogo);
        $('#btnIncluirNovo').click(RedirecionarIncluirUnidade);
        deleteUnidade();
        paginacao();
        modalvisAluno();
    }

    function modalvisAluno() {
        $(document).on("click", ".visualizar_comoAluno ", function () {
            $("body").addClass("bodyWithNoScroll");
            $("#modal-visualiza-aluno").fadeIn();
            var codUA = $(this).attr("data-codunidadeaprendizagem");
            var url = "http://aluno.slconstruct.saolucas.edu.br/";

            if (location.href.indexOf("homologacao") > -1 || location.href.indexOf("localhost") > -1) {
                url = "http://homologacaoaluno.slconstruct.saolucas.edu.br/"
            } else if (location.href.indexOf("estabilizacao") > -1) {
                url = "http://estabilizacaoaluno.slconstruct.saolucas.edu.br/"
            }

            $("#iframe-visualiza-aluno").html(`<iframe src="${url}SimulacaoAluno?codunidadeaprendizagem=${codUA}"></iframe>`);
            //loadPearson($("#iframe-visualiza-aluno"));
        });

        $(document).on("click", "#fechar-visualizacao-aluno", function () {
            $("body").removeClass("bodyWithNoScroll");
            $("#modal-visualiza-aluno").fadeOut();
            $("#iframe-visualiza-aluno").empty();
        });
    }

    /*function loadPearson($localescrita) {
        var str = `
        <form id="pearsonForm" target="frmPearson" action="http://saolucas.bv3.digitalpages.com.br/user_session/authentication_gateway" method="post">
            <input name="login" type="hidden" value="123456" />
            <input name="token" type="hidden" id="token" value="932117cb6929911e47b1f918665cfcae">
        </form>
        <iframe style="width: 900px; z-index: 99999999; position: fixed; display: none;" name="frmPearson">
        </iframe>`;
        $localescrita.append(str);

        var form = document.getElementById("pearsonForm");
        form.style.display = "none";
        form.submit();
    }*/

    function paginacao() {
        $('.botoes-paginacao button').click(function () {
            debugger;
            var paginaatual = parseInt($(this).data('pagina'));
            var codcurso = $('#ddlCursos').val() ? $('#ddlCursos').val() : 0;
            var coddisciplina = $('#ddlDisciplinas').val() ? $('#ddlDisciplinas').val() : 0;
            var texto = $('#txtTexto').val() ? $('#txtTexto').val() : "";


            new GCS().setObj({
                type: "GET",
                dataType: 'html',
                contentType: 'text/html',
                url: urlConsultaUnidades + `?codCurso=${codcurso}&codDisciplina=${coddisciplina}&texto=${texto}&paginaatual=${paginaatual}`,
                success: function (data) {
                    debugger;
                    if (!Helper.isJSON(data)) {
                        $('#divgridpartial').html(data);
                        $('ul.tabs').tabs();
                        deleteUnidade();
                        paginacao();
                    } else {
                        let result = JSON.parse(data);
                        if (result && !result.status) {
                            $('#divgridpartial').html("<h5>" + result.msg + "</h5>");
                        }
                    }
                }
            }).executar();
        });
    }

    function CarregarCurso() {

        new GCS().setObj({
            type: 'GET',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            processData: false,
            url: urlConsultaCursos,
            success: function (data) {
                if (data) {
                    Helper.updateOptions($("#ddlCursos"), data.map(function (item, index) {
                        return { value: item.Value, text: item.Text };
                    }));
                }

                $('#ddlCursos').change(CarregarDisciplinas);
            }
        }).executar();
    }

    function CarregarDisciplinas() {

        if ($('#ddlCursos').val()) {

            new GCS().setObj({
                type: 'GET',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                processData: false,
                url: `${urlConsultaDisciplinas}?codcurso=${$('#ddlCursos').val()}`,
                success: function (data) {
                    if (data) {
                        Helper.updateOptions($("#ddlDisciplinas"), data.map(function (item, index) {
                            return { value: item.Value, text: item.Text };
                        }));
                    }
                }
            }).executar();
        }
    }

    function PesquisaCatalogo() {

        var codcurso = $('#ddlCursos').val() ? $('#ddlCursos').val() : 0;
        var coddisciplina = $('#ddlDisciplinas').val() ? $('#ddlDisciplinas').val() : 0;
        var texto = $('#txtTexto').val() ? $('#txtTexto').val() : "";

        new GCS().setObj({
            type: "GET",
            dataType: 'html',
            contentType: 'text/html',
            url: urlConsultaUnidades + `?codCurso=${codcurso}&codDisciplina=${coddisciplina}&texto=${texto}`,
            success: function (data) {
                if (!Helper.isJSON(data)) {
                    $('#divgridpartial').html(data);
                    $('ul.tabs').tabs();
                    deleteUnidade();
                    paginacao();
                } else {
                    let result = JSON.parse(data);
                    if (result && !result.status) {
                        $('#divgridpartial').html("<h5>" + result.msg + "</h5>");
                    }
                }
            }
        }).executar();
    }

    function RedirecionarIncluirUnidade() {

        if ($('#ddlCursos').val() && $('#ddlDisciplinas').val()) {
            window.location = `${urlIncluirUnidade}?codcurso=${$('#ddlCursos').val()}&coddisciplina=${$('#ddlDisciplinas').val()}&codunidadeaprendizagem=0&disciplina=${$('#ddlDisciplinas option:selected').text()}`;
        }
        else {
            Helper.OpenAlert({ title: "Ops", msg: 'Selecione o Curso e a Disciplina para incluir uma Unidade de Aprendizagem nova!', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
       }
    }

    function deleteUnidade() {
        $('.card.horizontal .card-stacked .card-content.scrap .fas').off().click(function () {
            
            var elemento = $(this);
            Helper.OpenConfirm({
                title: "Deseja excluir?",
                icon: 'fa-exclamation-triangle',
                iconclass: 'satisfaction-yellow',
                msg: '',
                classtitle: 'font-preto',
                yes: function () {
                    confirmacaoExclusaoUnidade(elemento);
                    Helper.CloseConfirm();
                },
                no: function () { },

                textno: 'Cancelar',
                textsim: 'Excluir'
            });  
        });
    }

    function confirmacaoExclusaoUnidade(elemento) {
        var codunidadeaprendizagem = elemento.data('codunidadeaprendizagem');
        var data = {
            codunidadeaprendizagem: codunidadeaprendizagem
        };
        new GCS().setObj({
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            url: urlExcluirUnidade,
            success: function (data) {
                debugger;
                if (data.status) {
                    elemento.closest('.card.horizontal').parent().remove();
                    Helper.OpenAlert({ title: data.msg[0], msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                } else {
                    Helper.OpenAlert({ title: "Ops", msg: data.msg[0], classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
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

$(Catalogo.init);