"use strict";

var bancoDeQuestoes = function () {

    function init() {
        bindFunctions();
        FormValidations.init();
        getCursos();
        $('.paginacao').click(clickPaginacao);
        validaArquivo();
    }

    function bindFunctions() {
        inicializaComponentes();
        criarQuestao();
        editaQuestao();
        criaitem();
        //pesquisar();
        $('#btnPesquisar').off().click(clickPesquisa);

        $("#divTipoQuestao").click(x => {
            if (getComboBoxValue("tipoQuestao") == '1') {
                $("#divDescritorBuscaBancoQuestoes").removeClass("desabilita-descritor");
            } else {
                $("#divDescritorBuscaBancoQuestoes").addClass("desabilita-descritor");
            }
        });

        $("input[name='tipoQuestao']").off().change(x => {
            $("#tabelaBancoQuestoes").attr("class", "hide");
            limparCamposPesquisa();
        });

        bindMacroDesafio();
    }

    function ocultaColunaDescritor() {
        /*if (getComboBoxValue("tipoQuestao") == 2) {
            let th = document.querySelectorAll("#tabelaBancoQuestoes th");
            if (th.length > 0) {
                th[3].style.display = "none";
            }

            let tr = document.querySelectorAll("#tabelaBancoQuestoes tr");
            if (tr.length > 0) {
                tr.forEach(x => (x.querySelectorAll("td").length > 0 && x.querySelectorAll("td")[3]) ? x.querySelectorAll("td")[3].style.display = "none" : "")
            }
        }*/

    }

    function bindMacroDesafio() {
        var curso = $("#frmCadastroMacro #Curso");
        var disciplina = $("#frmCadastroMacro #Disciplina");
        var habilidade = $("#frmCadastroMacro #Habilidade");

        curso.change(x => {
            disciplina.empty();
            habilidade.empty();
            $('select').material_select();
        });

        disciplina.change(x => {
            habilidade.empty();
            $('select').material_select();
        });
    }

    function criaitem() {
        criarMicro();
        criarMacro();
    }

    function inicializaComponentes() {
        $('select').material_select();
        $('ul.tabs').tabs();
    }


    /*function pesquisar() {
        $("#btnPesquisar").off().click(() => {
            let codTipoQuestao = getComboBoxValue("tipoQuestao");
            let codDificuldade = getComboBoxValue("dificuldade");
            let codDisciplina = $("#disciplina").val() ? $("#disciplina").val() : "";
            let codDescritor = $("#descritor").val() ? $("#descritor").val() : "";
            let texto = $("#texto").val() ? $("#texto").val() : "";

            window.location = `${urlBuscaDadosTabela}?codTipoQuestao=${codTipoQuestao}&codDificuldade=${codDificuldade}&codDisciplina=${codDisciplina}&codDescritor=${codDescritor}&texto=${texto}`;

            //                url: '/UA/ListaBancoQuestoes/?codTipoQuestao=' + $("input[name='tipoQuestao']").val() + '&codDificuldade=' + $("input[name='dificuldade']").val() + '&codDisciplina=' + $('#ddlDisciplinaFiltro').val() + '&codDescritor=' + $('#descritor').val() + '&texto=' + $('#texto').val(),

        });
    }*/

    function limparCamposPesquisa() {
        $("#texto").val("");
        $("#descritor").val("");
        $("#ddlHabilidadeFiltro").val("");
        $("#ddlDisciplinaFiltro").val("");
        $("#ddlCursoFiltro").val("");
        $('select').material_select();
        $("#dificuldadeBaixo").prop("checked", false);
        $("#dificuldadeMedio").prop("checked", false);
        $("#dificuldadeAlto").prop("checked", false);
    }

    function clickPesquisa() {

        var codtipoquestao = $("input[name='tipoQuestao']:checked").val();
        codtipoquestao = !codtipoquestao ? "" : codtipoquestao;

        var listDificuldade = [];

        if ($("#dificuldadeBaixo").prop("checked")) listDificuldade.push($("#dificuldadeBaixo").val());
        if ($("#dificuldadeMedio").prop("checked")) listDificuldade.push($("#dificuldadeMedio").val());
        if ($("#dificuldadeAlto").prop("checked")) listDificuldade.push($("#dificuldadeAlto").val());

        new GCS().setObj({
            type: 'GET',
            contentType: 'text/html',
            dataType: 'html',
            url: '/BancoQuestao/ListaBancoQuestoes/?codTipoQuestao=' + codtipoquestao + '&listDificuldade=' + listDificuldade.join() + '&codDisciplina=' + $('#ddlDisciplinaFiltro').val() + '&codDescritor=' + $('#descritor').val() + '&texto=' + $('#texto').val() + '&codCurso=' + $('#ddlCursoFiltro').val() + '&codHabilidade=' + $('#ddlHabilidadeFiltro').val(),
            success: function (data) {
                $('.divPartial').html(data);
                $('.paginacao').click(clickPaginacao);
                editaQuestao();
                ocultaColunaDescritor();
                $("#tabelaBancoQuestoes").removeAttr("class", "hide");
                if ($("table").length > 0)
                    Helper.scrollTopElement('table', 1110);
            }
        }).executar();
    }

    function excluirQuestao(codItem) {
        if (codItem) {
            Helper.OpenConfirm({
                title: "Atenção!",
                msg: "<strong>Deseja realmente realizar a exclusão?</strong>",
                classtitle: "font-vermelho",
                yes: function () {
                    new GCS().setObj({
                        type: 'GET',
                        contentType: 'application/json',
                        dataType: 'html',
                        url: `/BancoQuestao/ExcluirQuestao?codItem=${codItem}`,
                        success: function (data) {
                            if (Helper.isJSON(data) && JSON.parse(data).status) {
                                removeItemFromTable(codItem);
                                $('.paginacao').click(clickPaginacao);
                                $("#tabelaBancoQuestoes").removeAttr("class", "hide");
                                editaQuestao();
                                ocultaColunaDescritor();
                                let qtdRegistros = JSON.parse(document.querySelector("#qtdRegistros").innerText);
                                if (qtdRegistros > 0) {
                                    document.querySelector("#qtdRegistros").innerText = (qtdRegistros - 1).toString();
                                }
                            } else {
                                if (Helper.isJSON(data)) {
                                    var retorno = JSON.parse(data);
                                    Helper.OpenAlert({ title: "Ops", msg: retorno.msg, classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                                } else {
                                    Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                                }
                            }
                        }
                    }).executar();
                    Helper.CloseConfirm();
                    clickPaginacao();
                },
                no: function () {
                    Helper.CloseConfirm();
                }
            });

        }
    }

    function removeItemFromTable(codItem) {
        document.querySelectorAll("#tabelaBancoQuestoes table tbody tr").forEach(tr => {
            if (tr.querySelector(".-acoes .edita-questao")) {
                if (tr.querySelector(".-acoes .edita-questao").getAttribute("data-questao") == codItem) tr.innerHTML = "";
            }
        });
    }

    function clickPaginacao() {

        var paginaatual = parseInt($(this).data('pagina'));

        var codtipoquestao = $("input[name='tipoQuestao']:checked").val();
        codtipoquestao = !codtipoquestao ? "" : codtipoquestao;

        var listDificuldade = [];

        if ($("#dificuldadeBaixo").prop("checked")) listDificuldade.push($("#dificuldadeBaixo").val());
        if ($("#dificuldadeMedio").prop("checked")) listDificuldade.push($("#dificuldadeMedio").val());
        if ($("#dificuldadeAlto").prop("checked")) listDificuldade.push($("#dificuldadeAlto").val());


        new GCS().setObj({
            type: 'GET',
            contentType: 'text/html',
            dataType: 'html',
            url: '/BancoQuestao/ListaBancoQuestoes/?codTipoQuestao=' + codtipoquestao + '&listDificuldade=' + listDificuldade.join() + '&codDisciplina=' + $('#ddlDisciplinaFiltro').val() + '&codDescritor=' + $('#descritor').val() + '&texto=' + $('#texto').val() + '&codCurso=' + $('#ddlCursoFiltro').val() + '&codHabilidade=' + $('#ddlHabilidadeFiltro').val() + '&paginaatual=' + paginaatual,
            success: function (data) {
                $('.divPartial').html(data);
                $('.paginacao').click(clickPaginacao);
                editaQuestao();
                $("#tabelaBancoQuestoes").removeAttr("class", "hide");
                ocultaColunaDescritor();
            }
        }).executar();
    }

    function getCursos() {
        $("#ddlDisciplinaFiltro").empty();
        $("#ddlHabilidadeFiltro").empty();
        $("#descritor").empty();
        $('select').material_select();
        new GCS().setObj({
            type: 'GET',
            url: urlGetCursos,
            success: function (data) {
                if (data) {
                    monta_select(data, "ddlCursoFiltro", false);
                    $("#ddlCursoFiltro").change(getDisciplinas);

                }
            }
        }).executar();
    }

    function getDisciplinas() {
        $("#ddlDisciplinaFiltro").empty();
        $("#ddlHabilidadeFiltro").empty();
        $("#descritor").empty();
        $('select').material_select();
        var codCurso = $("#ddlCursoFiltro").val();
        if (codCurso) {
            new GCS().setObj({
                type: 'GET',
                url: urlGetDisciplinas + "?codCurso=" + codCurso,
                success: function (data) {
                    if (data) {
                        monta_select(data, "ddlDisciplinaFiltro", false);
                        $("#ddlDisciplinaFiltro").change(getHabilidades);

                    }
                }
            }).executar();
        }
    }

    function getHabilidades() {
        $("#ddlHabilidadeFiltro").empty();
        $("#descritor").empty();
        $('select').material_select();
        var codDisciplina = $("#ddlDisciplinaFiltro").val();
        var codCurso = $("#ddlCursoFiltro").val();
        if (codDisciplina && codCurso) {
            new GCS().setObj({
                type: 'GET',
                url: `${urlGetHabilidades}?coddisciplina=${codDisciplina}&codCurso=${codCurso}`,
                success: function (data) {

                    if (data) {
                        monta_select(data, "ddlHabilidadeFiltro", false);
                        $("#ddlHabilidadeFiltro").change(getDescritor);
                    }
                }
            }).executar();
        }
    }

    function getDescritor() {
        $("#descritor").empty();
        $('select').material_select();
        var codDisciplina = $("#ddlDisciplinaFiltro").val();
        var codHabilidade = $("#ddlHabilidadeFiltro").val();
        var codCurso = $("#ddlCursoFiltro").val();
        $('select').material_select();
        if (codDisciplina && codHabilidade && codCurso) {
            new GCS().setObj({
                type: 'GET',
                url: `${urlGetDescritor}?codDisciplina=${codDisciplina}&codHabilidade=${codHabilidade}&codCurso=${codCurso}`,
                success: function (data) {
                    if (data) {
                        monta_select(data, "descritor", false);
                    }
                }
            }).executar();
        }
    }

    function monta_select(lista, id_elemento, disabledLabel = true) {

        var html = '';
        html += `<option value="" ${disabledLabel ? disabled : ''} selected>Escolha uma opção</option>`;
        for (var i = 0; i < lista.length; i++) {

            var elementoLista = lista[i];
            html += '<option value="' + elementoLista.Value + '">' + elementoLista.Text + '</option>';
        }
        $('#' + id_elemento + ' option').remove();
        $('#' + id_elemento).append(html);

        $('select').material_select();
    }

    function getComboBoxValue(id) {
        let comboBox = getCheckedComboBox(id);
        return comboBox.length > 0 ? comboBox[0].value : "";
    }

    function getCheckedComboBox(id) {
        return Array.prototype.slice.call(document.querySelectorAll(`input[id^=${id}]`)).filter(x => x.checked);
    }

    function editaQuestao() {

        $('#bancoQuestao .edita-questao').off().click(function () {
            var questao = $(this).attr('data-questao');
            var tipoitem = parseInt($(this).attr('data-tipoitem'));

            if (tipoitem === 1) {
                new GCS().setObj({
                    type: 'GET',
                    contentType: 'text/html',
                    dataType: 'html',
                    url: urlEditarMicro + '?coditem=' + questao,
                    success: function (data) {

                        $('#cria-micro-').html(data);
                        $('#cria-micro-').modal({ dismissible: false }).modal('open');
                        inicializaComponentes();
                        FormValidations.init();
                        changeEixoMicro();
                        changeCursoMicro();
                        changeDisciplinaMicro();
                        changeHabilidadeMicro();
                        criarMicro();
                        $('#qtdOpcoesResposta').val($(".questao-unitario").length - $(".questao-unitario.hide").length);
                        $('select').material_select();
                        $('#qtdOpcoesResposta').change(changeQtdOpcoesResposta);
                        $('.somente-bq').removeClass('hide');
                        validaArquivo();

                        if ($('#cria-micro-').find('#coditem').val() != "0" && $('#cria-micro-').find('#coditem').val() != "") {
                            $('#cria-micro- a[href="#listagem-"]').closest('li').removeClass('disabled');
                        }

                        setTimeout(function () {
                            $('#cria-micro- a[href="#cadastro-"]').click();
                        }, 300);

                        bindTabGetMatrizEditMicro();
                        $('ul.tabs').tabs();


                        $('#frmCadastroMicro .modal-footer .dropdown-button').dropdown({
                            inDuration: 300,
                            outDuration: 225,
                            constrainWidth: false, // Does not change width of dropdown to that of the activator
                            gutter: 0, // Spacing from edge
                            belowOrigin: false, // Displays dropdown below the button
                            alignment: 'left', // Displays dropdown with edge aligned to the left of button
                            stopPropagation: false // Stops event propagation
                        });
                        desativaElemento();
                    },
                    error: function (data) {
                        console.log(data);
                    }

                }).executar();
            }
            else if (tipoitem === 2) {
                new GCS().setObj({
                    type: 'GET',
                    contentType: 'text/html',
                    dataType: 'html',
                    url: urlEditarMacro + '?coditem=' + questao,
                    success: function (data) {
                        $('#cria-macro-').html(data);
                        $('#cria-macro-').modal({ dismissible: false }).modal('open');
                        inicializaComponentes();
                        FormValidations.init();
                        changeEixoMacro();
                        changeCursoMacro();
                        changeDisciplinaMacro();
                        criarMacro();
                        $('.somente-bq').removeClass('hide');
                        validaArquivo();
                        if ($('#cria-macro-').find('#coditem').val() != "0" && $('#cria-macro-').find('#coditem').val() != "") {
                            $('#cria-macro- a[href="#listagem-"]').closest('li').removeClass('disabled');
                        }
                        setTimeout(function () {
                            $('#cria-macro- a[href="#cadastro-"]').click();
                        }, 300);

                        bindTabGetMatrizEditMacro();
                        $('ul.tabs').tabs();

                        $('#frmCadastroMacro .modal-footer .dropdown-button').dropdown({
                            inDuration: 300,
                            outDuration: 225,
                            constrainWidth: false, // Does not change width of dropdown to that of the activator
                            gutter: 0, // Spacing from edge
                            belowOrigin: false, // Displays dropdown below the button
                            alignment: 'left', // Displays dropdown with edge aligned to the left of button
                            stopPropagation: false // Stops event propagation
                        });
                        desativaElemento();
                    }
                }).executar();
            }
        });
    }

    function criarQuestao() {

        $('#bancoQuestao #criar-questao-drop .criar-questao-macro, #cria-macro- .criar-novo-macro').off().click(function () {

            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlCriaMacro,
                success: function (data) {
                    $('#cria-macro-').html(data);
                    $('#cria-macro-').modal({
                        dismissible: false,
                        ready: function () {

                            inicializaComponentes();
                            FormValidations.init();
                            changeEixoMacro();
                            changeCursoMacro();
                            unidadesAvaliativas.carregaImagemCKeditor();
                            salvaNovoItemMatrizMacro();
                            $('.somente-bq').removeClass('hide');
                            validaArquivo();
                            criarMacro();
                            criarQuestao();

                            setTimeout(function () {
                                $('#cria-macro- a[href="#cadastro-"]').click();
                            }, 200);

                            bindTabGetMatriz();
                        }
                    }).modal('open');
                }
            }).executar();
        });

        $('#bancoQuestao #criar-questao-drop .criar-questao-micro, #cria-micro- .criar-novo-micro').off().click(function () {

            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlCriaMicro,
                success: function (data) {
                    $('#cria-micro-').html(data);
                    $('#cria-micro-').modal({
                        dismissible: false,
                        ready: function () {

                            inicializaComponentes();
                            FormValidations.init();
                            changeEixoMicro();
                            changeCursoMicro();
                            changeQtdOpcoesResposta();
                            $('#qtdOpcoesResposta').change(changeQtdOpcoesResposta);
                            $('.somente-bq').removeClass('hide');
                            unidadesAvaliativas.carregaImagemCKeditor();
                            excluirItemMatrizMicro();
                            salvaNovoItemMatrizMicro();
                            criarMicro();
                            criarQuestao();

                            setTimeout(function () {
                                $('#cria-micro- a[href="#cadastro-"]').click();
                            }, 200);

                            bindTabGetMatrizMicro();
                        }
                    }).modal('open');
                }
            }).executar();
        });
    }

    function changeEixoMacro() {

        $('#frmCadastroMacro #Eixo').off().change(function () {
            var codEixo = parseInt($(this).val());

            if ($(this).val() == '') {
                codEixo = 0;
                $(this).find('option:first-child').val(0);
            }

            if (codEixo >= 0) {
                new GCS().setObj({
                    type: 'GET',
                    url: urlChangeEixoMacro + `?codeixo=${codEixo}`,
                    success: function (data) {
                        var items = [];
                        for (var i = 0; i < data.length; i++) {
                            var obj = {
                                value: data[i].CODIGOCURSO,
                                text: data[i].CURSO
                            };
                            items.push(obj);
                        }
                        var select = $('#cria-macro- #Curso');
                        Helper.updateOptions(select, items);
                        inicializaComponentes();
                        FormValidations.init();
                        changeCursoMacro();
                        changeDisciplinaMacro();
                        criarMicro();
                        LoadItemMatrizMacro();
                    }
                }).executar();
            }
        });
    }

    function changeDisciplinaMacro() {

        $('#frmCadastroMacro #Disciplina').off().change(function () {
            $("#frmCadastroMacro #Habilidade").empty();
            $('select').material_select();
            $(this).find('option').attr("disabled", false);
            var coddisciplina = parseInt($(this).val());
            var codCurso = parseInt($('#frmCadastroMacro #Curso').val());
            var codeixo = parseInt($('#frmCadastroMacro #Eixo').val());

            if ($(this).val() == '') {
                coddisciplina = 0;
            }

            if ($('#frmCadastroMacro #Eixo').val() == '') {
                codeixo = 0;
            }

            if (codCurso > 0 && codeixo >= 0) {

                new GCS().setObj({
                    type: 'GET',
                    url: urlChangeHabilidadeMacro + `?coddisciplina=${coddisciplina}&codCurso=${codCurso}&codeixo=${codeixo}`,
                    success: function (data) {
                        var items = [];
                        for (var i = 0; i < data.length; i++) {
                            var obj = {
                                value: data[i].CODIGOHABILIDADE,
                                text: data[i].HABILIDADE
                            };
                            items.push(obj);
                        }
                        var select = $('#cria-macro- #Habilidade');
                        Helper.updateOptions(select, items);
                        inicializaComponentes();
                        FormValidations.init();
                        //changeDisciplinaMacro();
                        criarMacro();
                        validaArquivo();
                    }
                }).executar();
            }
        });
    }

    function criarMacro() {
        $('#cria-macro- .btn-salva-default').off().click(function () {

            if (Helper.validateCKEditor("editormacro")) {
                $('#Enunciado').val(CKEDITOR.instances.editormacro.getData());

                var form = new FormData($("#frmCadastroMacro")[0]);
                var formValido = $('#frmCadastroMacro').valid();
                if (formValido) {
                    new GCS().setObj({
                        type: 'POST',
                        contentType: false,
                        data: form,
                        url: urlSalvaMacro,
                        success: function (data) {
                            if (data.status) {
                                Helper.OpenAlert({ title: "Macro desafio criado", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                                $('#cria-macro-').find('#coditem').val(data.coditem);
                                clickPesquisa();
                                criaitem();
                                editaQuestao();
                                setTimeout(function () {
                                    $('#cria-macro- a[href="#listagem-"]').closest('li').removeClass('disabled');
                                    $('#cria-macro- a[href="#listagem-"]').click();

                                }, 200);
                                LoadItemMatrizMacro();

                            } else {
                                Helper.OpenAlert({ title: "Erro ao salvar", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                            }
                        }
                    }).executar();
                }
            }
        });
    }

    function changeEixoMicro() {
        $('#frmCadastroMicro #Eixo').off().change(function () {
            var codEixo = parseInt($(this).val());

            if ($(this).val() == '') {
                codEixo = 0;
                $(this).find('option:first-child').val(0);
            }
            $(this).closest('.input-field').data('codeixo', codEixo);

            if (codEixo >= 0) {
                new GCS().setObj({
                    type: 'GET',
                    url: urlChangeEixoMicro + `?codeixo=${codEixo}`,
                    success: function (data) {
                        var items = [];
                        for (var i = 0; i < data.length; i++) {
                            var obj = {
                                value: data[i].CODIGOCURSO,
                                text: data[i].CURSO
                            };
                            items.push(obj);
                        }
                        var select = $('#cria-micro- #Curso');
                        Helper.updateOptions(select, items);
                        inicializaComponentes();
                        FormValidations.init();
                        changeCursoMicro();
                        changeDisciplinaMicro();
                        criarMicro();
                        LoadItemMatrizMicro();
                    }
                }).executar();
            }
        });
    }

    function changeCursoMicro() {
        $('#frmCadastroMicro #Curso').off().change(function () {

            $("#frmCadastroMicro #Disciplina").empty();
            $("#frmCadastroMicro #Habilidade").empty();
            $("#frmCadastroMicro #Descritor").empty();
            $('select').material_select();
            //$(this).find('option').attr("disabled", false);
            var codCurso = parseInt($(this).val());
            var codeixo = $('#frmCadastroMicro #Eixo').closest('.input-field').data('codeixo');

            if ($(this).val() == '') {
                codCurso = 0;
            }

            if ((codCurso > 0 && codeixo > 0) || (codCurso > 0 && codeixo == 0)) {
                new GCS().setObj({
                    type: 'GET',
                    url: urlChangeCursoMicro + `?codCurso=${codCurso}&codeixo=${codeixo}`,
                    success: function (data) {
                        var items = [];
                        for (var i = 0; i < data.length; i++) {
                            var obj = {
                                value: data[i].CODIGODISCIPLINA,
                                text: data[i].DISCIPLINA
                            };
                            items.push(obj);
                        }
                        var select = $('#cria-micro- #Disciplina');
                        Helper.updateOptions(select, items);
                        inicializaComponentes();
                        FormValidations.init();
                        changeCursoMicro();
                        changeDisciplinaMicro();
                        criarMicro();
                        LoadItemMatrizMacro();
                    }
                }).executar();
            }
        });
    }

    function changeCursoMacro() {

        $('#frmCadastroMacro #Curso').off().change(function () {
            $("#frmCadastroMacro #Disciplina").empty();
            $("#frmCadastroMacro #Habilidade").empty();
            $('select').material_select();
            $(this).find('option').attr("disabled", false)
            var codcurso = parseInt($(this).val());
            var codeixo = parseInt($('#frmCadastroMacro #Eixo').val());

            if ($(this).val() == '') {
                codcurso = 0;
            }

            if ($('#frmCadastroMacro #Eixo').val() == '') {
                codeixo = 0;
            }

            if (codcurso > 0 && codeixo >= 0) {
                new GCS().setObj({
                    type: 'GET',
                    url: urlChangeCursoMacro + `?codcurso=${codcurso}&codeixo=${codeixo}`,
                    success: function (data) {
                        var items = [];
                        for (var i = 0; i < data.length; i++) {
                            var obj = {
                                value: data[i].CODIGODISCIPLINA,
                                text: data[i].DISCIPLINA
                            };
                            items.push(obj);
                        }
                        var select = $('#cria-macro- #Disciplina');
                        Helper.updateOptions(select, items);
                        inicializaComponentes();
                        LoadItemMatrizMacro();
                        FormValidations.init();
                        changeDisciplinaMacro();
                        criarMacro();
                    }
                }).executar();
            }
        });
    }

    function changeDisciplinaMicro() {

        $('#frmCadastroMicro #Disciplina').off().change(function () {
            $("#frmCadastroMicro #Habilidade").empty();
            $("#frmCadastroMicro #Descritor").empty();
            $('select').material_select();
            var coddisciplina = parseInt($(this).val());
            var codCurso = parseInt($('#frmCadastroMicro #Curso').val());
            var codeixo = $('#frmCadastroMicro #Eixo').closest('.input-field').data('codeixo');

            if ($(this).val() == '') {
                coddisciplina = 0;
            }

            if (codCurso > 0 && coddisciplina > 0 && codeixo >= 0) {
                new GCS().setObj({
                    type: 'GET',
                    url: urlChangeHabilidadeMicro + `?coddisciplina=${coddisciplina}&codCurso=${codCurso}&codEixo=${codeixo}`,
                    success: function (data) {
                        var items = [];
                        for (var i = 0; i < data.length; i++) {
                            var obj = {
                                value: data[i].CODIGOHABILIDADE,
                                text: data[i].HABILIDADE
                            };
                            items.push(obj);
                        }
                        var select = $('#cria-micro- #Habilidade');
                        Helper.updateOptions(select, items);
                        inicializaComponentes();
                        FormValidations.init();
                        changeDisciplinaMicro();
                        changeHabilidadeMicro();
                        criarMicro();
                    }
                }).executar();
            }
        });
    }

    function criarMicro() {
        $('#frmCadastroMicro .btn-salva-default').off().click(function () {

            if (Helper.validateCKEditor("editormicro")) {
                Helper.validarRespostasMicro().then(x => {
                    if (!x.includes(false)) {
                        $('#Enunciado').val(CKEDITOR.instances.editormicro.getData());
                        popularCamposOcultosMicro();
                        var form = new FormData($("#frmCadastroMicro")[0]);
                        var formValido = $('#frmCadastroMicro').valid();
                        if (formValido) {
                            if (Helper.equalAnswers(x)) {

                                new GCS().setObj({
                                    type: 'POST',
                                    contentType: false,
                                    data: form,
                                    url: urlSalvaMicro,
                                    success: function (data) {
                                        if (data.status) {
                                            Helper.OpenAlert({ title: "Micro desafio criado", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                                            if (data.coditem > 0) {
                                                $('#cria-micro- #coditem').val(data.coditem);
                                                $(".tabs .tab").removeClass("disabled");

                                                $(".tab.cadastro").off().click(function () {
                                                    $(".modal-footer .btn-salva-default").show();
                                                });

                                                $(".tab.listagem").off().click(function () {
                                                    $(".modal-footer .btn-salva-default").hide();
                                                    $(".modal-content").scrollTop(0);

                                                });
                                                $(".tabs .tab a").click();

                                                setTimeout(function () {
                                                    $('#cria-micro- a[href="#listagem-"]').closest('li').removeClass('disabled');
                                                    $('#cria-micro- a[href="#listagem-"]').click();
                                                }, 200);
                                                LoadItemMatrizMicro();
                                            }

                                            salvaNovoItemMatrizMicro();
                                            clickPesquisa();
                                            criaitem();
                                            editaQuestao();
                                        } else {
                                            Helper.OpenAlert({ title: "Erro ao salvar", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                                        }
                                    }
                                }).executar();
                            } else {
                                Helper.OpenAlert({ title: "Não é permitido respostas iguais.", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                            }
                        }
                    }
                });
            }
        });
    }

    function popularCamposOcultosMicro() {

        //Percorrer todos os CKEditors de alternativas
        $('.questao-unitario').each(function () {
            var ckAlternativa = $(this).find('.alternativa > span[id*="cke_editor-micro"]');
            var ckFeedback = $(this).find('.feedback > span[id*="cke_editor-micro"]');

            if (ckAlternativa.length == 0 || ckFeedback.length == 0) {
                ckAlternativa = $(this).find('.alternativa > div[id*="cke_editor-micro"]');
                ckFeedback = $(this).find('.feedback > div[id*="cke_editor-micro"]');
            }

            //Seta o valor de cada CKEDItor de alternativa no input[type="hidden"] de descrição correspondente
            $(this).find('.descricao').val(CKEDITOR.instances[ckAlternativa.attr('id').replace('cke_', '')].getData());

            //Seta o valor de cada CKEDItor de feedback no input[type="hidden"] de justificativa correspondente
            $(this).find('.justificativa').val(CKEDITOR.instances[ckFeedback.attr('id').replace('cke_', '')].getData());
        });

        //Setar o valor do CKEDItor de Enunciado no input[type="hidden"] de enunciado
        $('#frmCadastroMicro #Enunciado').val(CKEDITOR.instances.editormicro.getData());
    }

    function changeHabilidadeMicro() {

        $('#frmCadastroMicro #Habilidade').off().change(function () {
            $("#frmCadastroMicro #Descritor").empty();
            $('select').material_select();
            $(this).find('option').attr("disabled", false)
            var codhabilidade = parseInt($(this).val());
            var coddisciplina = parseInt($('#frmCadastroMicro #Disciplina').val());
            var codeixo = parseInt($('#frmCadastroMicro #Eixo').val());

            if ($(this).val() == '') {
                codhabilidade = 0;
            }

            if ($('#frmCadastroMicro #Disciplina').val() == '') {
                coddisciplina = 0;
            }

            if ($('#frmCadastroMicro #Eixo').val() == '') {
                codeixo = 0;
            }

            if (coddisciplina > 0 && codhabilidade > 0 && codeixo >= 0) {
                new GCS().setObj({
                    type: 'GET',
                    url: urlChangeDescritorMicro + `?coddisciplina=${coddisciplina}&codhabilidade=${codhabilidade}&codEixo=${codeixo}`,
                    success: function (data) {
                        var items = [];
                        for (var i = 0; i < data.length; i++) {
                            var obj = {
                                value: data[i].CODIGODESCRITOR,
                                text: data[i].DESCRITOR
                            };
                            items.push(obj);
                        }
                        var select = $('#cria-micro- #Descritor');
                        Helper.updateOptions(select, items);
                        inicializaComponentes();
                        FormValidations.init();
                    }
                }).executar();
            }
        });
    }


    function changeQtdOpcoesResposta() {
        var alternativas = $('.questao-unitario'),
            qtdOpcoesResposta = $("#qtdOpcoesResposta").val();

        for (var i = 0; i < alternativas.length; i++) {
            if (i >= qtdOpcoesResposta) {
                alternativas.eq(i).addClass('hide');
                alternativas.eq(i).find('input[type="hidden"]').attr('disabled', 'disabled');
            } else {
                alternativas.eq(i).removeClass('hide');
                alternativas.eq(i).find('input[type="hidden"]').removeAttr('disabled');
            }
        }
    }

    $('.guiaestudopdf').change(function () {

        var $inputFile = $(this),
            files = this.files;

        var item = files[0];

        var hiddenField = $('#base64guiaestudopdf');

        Helper.getBase64(item, hiddenField);
    });

    function validaArquivo() {
        $('[type="file"]#caminhoTemplateCkeditor').change(function () {



            var allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'xlsx', 'xls', 'doc', 'docx', 'ppt', 'pptx', 'pdf', 'odt', 'ods', 'ots', 'odp', 'ott', 'sxw', 'stw'];
            var value = $(this).val(),
                file = value.toLowerCase(),
                extension = file.substring(file.lastIndexOf('.') + 1);

            if (this.files[0].size > 5243000) {
                Helper.OpenAlert({ title: "Ops", msg: 'Arquivo selecionado deve ter tamanho máximo de 5 MB.', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                $(this).val('');
                return;
            }

            if ($.inArray(extension, allowedExtensions) === -1) {
                Helper.OpenAlert({ title: "Ops", msg: 'Extensão de arquivo não é válida!', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            }

            var $inputFile = $(this),
                files = this.files;

            var item = files[0];

            var hiddenField = $('#base64imagemTemplateCkeditor');
            $('#extensaoTemplateCkeditor').val(extension);
            Helper.getBase64(item, hiddenField);
        });
    }

    function salvaNovoItemMatrizMacro() {

        $('#cria-macro- .salva-item-matriz').off().click(function () {

            var elemento = $(this);
            var coditem = elemento.closest('.modal').find('#coditem').val(),
                codunidadeaprendizagem = 0,
                coddisciplina = elemento.closest('.modal').find('#Disciplina').val(),
                codhabilidade = elemento.closest('.modal').find('#Habilidade').val(),
                codcurso = elemento.closest('.modal').find('#Curso').val(),
                codeixo = 0,
                coditemmatriz = 0;

            if (coddisciplina && codhabilidade && codcurso) {

                var data = {
                    coditem: coditem,
                    codunidadeaprendizagem: codunidadeaprendizagem,
                    coddisciplina: coddisciplina,
                    codhabilidade: codhabilidade,
                    codcurso: codcurso,
                    codeixo: codeixo,
                    coditemmatriz: coditemmatriz
                };

                new GCS().setObj({

                    data: JSON.stringify(data),
                    url: urlSalvarMatriz,
                    success: function (data) {
                        if (data.status) {
                            Helper.OpenAlert({ title: "Questão classificada com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                            LoadItemMatrizMacro();
                            criarQuestao();
                        } else {
                            Helper.OpenAlert({ title: "Ops", msg: data.msgUser ? data.msgUser : 'Erro ao tentar classificar a questão!', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                        }
                    }
                }).executar();
            } else {
                Helper.OpenAlert({ title: "Ops", msg: 'Preencha todos os campos', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            }
            LoadItemMatrizMacro();
        });

    }

    function salvaNovoItemMatrizMicro() {
        $('#cria-micro- .salva-item-matriz').off().click(function () {
            var elemento = $(this);
            var coditem = elemento.closest('.modal').find('#coditem').val(),
                codunidadeaprendizagem = 0,
                coddisciplina = elemento.closest('.modal').find('#Disciplina').val(),
                codhabilidade = elemento.closest('.modal').find('#Habilidade').val(),
                codcurso = elemento.closest('.modal').find('#Curso').val(),
                coddescritor = elemento.closest('.modal').find('#Descritor').val(),
                codeixo = 0,
                coditemmatriz = 0;

            if (coddisciplina && codhabilidade && codcurso && coddescritor) {

                var data = {
                    coditem: coditem,
                    codunidadeaprendizagem: codunidadeaprendizagem,
                    coddisciplina: coddisciplina,
                    codhabilidade: codhabilidade,
                    codcurso: codcurso,
                    coddescritor: coddescritor,
                    codeixo: codeixo,
                    coditemmatriz: coditemmatriz
                };

                new GCS().setObj({

                    data: JSON.stringify(data),
                    url: urlSalvarMatrizMicro,
                    success: function (data) {

                        if (data.status) {
                            Helper.OpenAlert({ title: "Questão classificada com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                            LoadItemMatrizMicro();
                            criarQuestao();
                        } else {
                            Helper.OpenAlert({ title: "Ops", msg: data.msgUser ? data.msgUser : 'Erro ao tentar classificar a questão!', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                        }
                    }
                }).executar();
            } else {
                Helper.OpenAlert({ title: "Ops", msg: 'Preencha todos os campos', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            }
            LoadItemMatrizMicro();
        });
    }

    function LoadItemMatrizMacro() {

        var coditem = $('#cria-macro- #coditem').val();

        if (coditem > 0) {

            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlGetMatrizes + '?coditem=' + coditem,
                success: function (data) {
                    $('.listItemMatriz').html(data);
                    if ($('.listItemMatriz .content-list-card-item.z-depth-1').length > 0) {
                        $('#cria-macro- .criar-novo-macro').removeClass('hide');
                    } else {
                        $('#cria-macro- .criar-novo-macro').addClass('hide');
                    }
                    excluirItemMatrizMacro();
                    salvaNovoItemMatrizMacro();
                }
            }).executar();
        }
    }

    function LoadItemMatrizMicro() {
        var coditem = $('#cria-micro- #coditem').val();

        if (coditem > 0) {

            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlGetMatrizesMicro + '?coditem=' + coditem,
                success: function (data) {
                    $('.listItemMatriz').html(data);
                    if ($('.listItemMatriz .content-list-card-item.z-depth-1').length > 0) {
                        $('#cria-micro- .criar-novo-micro').removeClass('hide');
                    } else {
                        $('#cria-micro- .criar-novo-micro').addClass('hide');
                    }
                    excluirItemMatrizMicro();
                    salvaNovoItemMatrizMicro();
                }
            }).executar();
        }
    }

    function bindTabGetMatriz() {
        $('#cria-macro- a[href="#listagem-"]').off().click(function () {

            var ativo = $('#cria-macro- a[href="#listagem-"]').closest('li').hasClass('disabled');
            if (!ativo) {
                $("#cria-macro- #cadastro-").hide();
                $('#cria-macro- .btn-salva-default').addClass('hide');
                $("#cria-micro- #listagem-").show();
                LoadItemMatrizMacro();
            }
            excluirItemMatrizMacro();
        });

        $('#cria-macro- a[href="#cadastro-"]').off().click(function () {
            $("#cria-micro- #listagem-").hide();
            $('#cria-macro- .btn-salva-default').removeClass('hide');
            $("#cria-micro- #cadastro-").show();
        });
    }

    function bindTabGetMatrizMicro() {
        $('#cria-micro- a[href="#listagem-"]').off().click(function () {

            var ativo = $('#cria-micro- a[href="#listagem-"]').closest('li').hasClass('disabled');
            if (!ativo) {
                $("#cria-micro- #cadastro-").hide();
                $('#cria-micro- .btn-salva-default').addClass('hide');
                $("#cria-micro- #listagem-").show();
                LoadItemMatrizMicro();
            }
            excluirItemMatrizMicro();
        });

        $('#cria-micro- a[href="#cadastro-"]').off().click(function () {
            $("#cria-micro- #listagem-").hide();
            $('#cria-micro- .btn-salva-default').removeClass('hide');
            $("#cria-micro- #cadastro-").show();
        });
    }

    function bindTabGetMatrizEditMacro() {
        $('#cria-macro- a[href="#listagem-"]').off().click(function () {

            var ativo = $('#cria-macro- a[href="#listagem-"]').closest('li').hasClass('disabled');
            if (!ativo) {
                $('#cria-macro- .btn-salva-default').addClass('hide');
                $('#cria-macro- .status-desativado').addClass('hide');
                $("#cria-macro- #cadastro-").hide();
                $("#cria-micro- #listagem-").show();
                LoadItemMatrizMacro();

            }
            excluirItemMatrizMacro();
        });

        $('#cria-macro- a[href="#cadastro-"]').off().click(function () {
            $('#cria-macro- .btn-salva-default').removeClass('hide');
            $('#cria-macro- .status-desativado').removeClass('hide');
            $("#cria-macro- #listagem-").hide();
            $("#cria-macro- #cadastro-").show();

        });
    }

    function bindTabGetMatrizEditMicro() {
        $('#cria-micro- a[href="#listagem-"]').off().click(function () {

            var ativo = $('#cria-micro- a[href="#listagem-"]').closest('li').hasClass('disabled');
            if (!ativo) {
                $('#cria-micro- .btn-salva-default').addClass('hide');
                $('#cria-micro- .status-desativado').addClass('hide');
                $("#cria-micro- #cadastro-").hide();
                $("#cria-micro- #listagem-").show();
                LoadItemMatrizMicro();

            }
            excluirItemMatrizMicro();
        });

        $('#cria-micro- a[href="#cadastro-"]').off().click(function () {
            $('#cria-micro- .btn-salva-default').removeClass('hide');
            $('#cria-micro- .status-desativado').removeClass('hide');
            $("#cria-micro- #listagem-").hide();
            $("#cria-micro- #cadastro-").show();

        });
    }

    function excluirItemMatrizMacro() {
        $('#cria-macro- .excluir-item-matriz').off().click(function () {
            var coditemmatriz = $(this).data('coditemmatriz');
            Helper.OpenConfirm({
                msg: "<strong>Deseja realmente realizar a exclusão?</strong>",
                classtitle: "font-vermelho",
                yes: function () {
                    Helper.CloseConfirm();
                    var data = {
                        coditemmatriz: coditemmatriz
                    };

                    new GCS().setObj({

                        url: urlExcluirDesafioMatriz,
                        data: JSON.stringify(data),
                        success: function (data) {
                            if (data.status) {

                                Helper.OpenAlert({ title: "Questão excluída com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                                LoadItemMatrizMacro();
                            } else {
                                if (data.msgUser) {
                                    Helper.OpenAlert({ title: "Ops", msg: data.msgUser, classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                                } else {
                                    Helper.OpenAlert({ title: "Ops", msg: 'Ocorreu um erro ao tentar excluir!', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                                }
                            }
                            LoadItemMatrizMacro();
                        }
                    }).executar();
                },
                no: function () {
                    Helper.CloseConfirm();
                }
            });
        });
    }

    function excluirItemMatrizMicro() {
        $('#cria-micro- .excluir-item-matriz').off().click(function () {
            var coditemmatriz = $(this).data('coditemmatriz');
            Helper.OpenConfirm({
                msg: "<strong>Deseja realmente realizar a exclusão?</strong>",
                classtitle: "font-vermelho",
                yes: function () {
                    Helper.CloseConfirm();
                    var data = {
                        coditemmatriz: coditemmatriz
                    };

                    new GCS().setObj({

                        url: urlExcluirDesafioMatriz,
                        data: JSON.stringify(data),
                        success: function (data) {
                            if (data.status) {

                                Helper.OpenAlert({ title: "Questão excluída com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                                LoadItemMatrizMacro();
                            } else {
                                if (data.msgUser) {
                                    Helper.OpenAlert({ title: "Ops", msg: data.msgUser, classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                                } else {
                                    Helper.OpenAlert({ title: "Ops", msg: 'Ocorreu um erro ao tentar excluir!', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                                }
                            }
                            LoadItemMatrizMicro();
                        }
                    }).executar();
                },
                no: function () {
                    Helper.CloseConfirm();
                }
            });
        });
    }

    function desativaElemento() {

        $('.status-desativado li').off().click(function () {

            var el = this.innerHTML;
            var cl = this.className;
            var coditem = $('#coditem').val();

            if (cl === 'ativa') {
                $('#desativado').val(false);
            } else {
                $('#desativado').val(true);
            }

            var desativado = $('#desativado').val();
            var status = $('.status-desativado').data('status');

            if (coditem > 0 && desativado.toLowerCase() !== status.toLowerCase()) {

                Helper.OpenConfirm({
                    classtitle: "font-vermelho",
                    title: "Atenção!",
                    msg: "<strong>Deseja realmente alterar?</strong>",
                    yes: function () {

                        new GCS().setObj({
                            type: 'GET',
                            url: `${urlAtualizaStatusQuestao}?coditem=${coditem}&desativado=${desativado}`,
                            success: function (data) {
                                if (data.status) {
                                    Helper.OpenAlert({ title: "Alteração realizada com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                                    $('.modal-footer .dropdown-button').removeClass('ativa');
                                    $('.modal-footer .dropdown-button').removeClass('inativa');
                                    $('.modal-footer .dropdown-button').html(el).addClass(cl);
                                } else {
                                    Helper.OpenAlert({ title: "Ops", msg: 'Não foi possível Salvar!', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                                }
                                $('.status-desativado').data('status', desativado);
                                desativaElemento();
                            }
                        }).executar();

                        Helper.CloseConfirm();
                    },
                    no: function () {
                        Helper.CloseConfirm();
                    }
                });
            }
        });
    }

    return {
        init: init,
        excluirQuestao: excluirQuestao
    };

}();

$(bancoDeQuestoes.init);

