"use strict";

var informacoesSistemas = function () {

    function init() {
        bindFunctions();
        FormValidations.init();
        verificaUrl();
    }

    function bindFunctions() {
        abreModalCadastrohabilidade();
        salvaHabilidadetabela();
        salvaFormularioCadastrarUnidades();
        excluiHabilidade();
        carregarDisciplinasCurso();
        listaHabilidades();
        pacote();
        validaBotaoSalvar();
        checkAllHabilidadeModal();
        checkAllHabilidadeTabela();
        excluiHabilidadeMulti();
        validaEditacao();
        bindTabelaHabilidades();
        direcionarProcesso();

        if (!JSON.parse(permissaoGravacao.toLowerCase())) {
            $("input:not(input[type='hidden'])").prop("disabled", true);
        }
    }

    function bindTabelaHabilidades() {
        ValidaVisibilidadeCheckedAll("table-pesq-habilidades", "checkedAllTable");
        $("#table-pesq-habilidades").change(x => {
            ValidaVisibilidadeCheckedAll("table-pesq-habilidades", "checkedAllTable");
        });
    }

    function ValidaVisibilidadeCheckedAll(idTable, idCheckedAll ="checkedAll") {
        if ($(`#${idTable} tbody tr`).length > 0) {
            document.querySelector(`#${idTable} #${idCheckedAll}`).style.display = "block";
            document.querySelector(`#${idTable} #${idCheckedAll}`).type = "checkbox";
        }
        else {
            document.querySelector(`#${idTable} #${idCheckedAll}`).style.display = "none";
            document.querySelector(`#${idTable} #${idCheckedAll}`).type = "text";
        }
    }


    function validaEditacao() {
        if ($("#codbaseunidadeaprendizagem").val() && JSON.parse($("#codbaseunidadeaprendizagem").val())) {
            document.querySelectorAll(".blocoradio input").forEach(x => x.disabled = true);
        } else {
            document.querySelectorAll(".blocoradio input").forEach(x => x.disabled = false);
        }
    }

    function verificaUrl() {
        var url = window.location.href;
        var parametros = url.indexOf('?');
        if (parametros > -1) {
            $('.criando-item').removeClass('hide');
        } else {
            $('.criando-item').addClass('hide');
        }
    }

    function checkAllHabilidadeModal() {

        $("#unidadeAprendizagem #table-pesq-habilidades-modal thead th #checkedAll").change(function () {
            if (this.checked) {
                $(".checkSingle").each(function () {
                    this.checked = true;
                });
            } else {
                $(".checkSingle").each(function () {
                    this.checked = false;
                });
            }
        });

        $("#unidadeAprendizagem #table-pesq-habilidades-modal .checkSingle").change(function () {
            
            if ($(this).is(":checked")) {
                var isAllChecked = 0;
                $(".checkSingle").each(function () {
                    if (!this.checked)
                        isAllChecked = 1;
                });
                if (isAllChecked === 0) { $("#checkedAll").prop("checked", true); }
            } else {
                $("#checkedAll").prop("checked", false);
            }
        });
    }

    function checkAllHabilidadeTabela() {
        $("#unidadeAprendizagem #table-pesq-habilidades thead th #checkedAllTable").off().change(function () {
            if (this.checked) {
                $("#unidadeAprendizagem #table-pesq-habilidades .checkSingleTable").each(function () {
                    this.checked = true;
                    $('.excluir-habilidades-multi').removeClass('hide');
                    $('.cadastrar-unidades').addClass('hide');
                });
            } else {
                $("#unidadeAprendizagem #table-pesq-habilidades .checkSingleTable").each(function () {
                    this.checked = false;
                    $('.excluir-habilidades-multi').addClass('hide');
                    $('.cadastrar-unidades').removeClass('hide');
                });
            }
        });

        $("#unidadeAprendizagem #table-pesq-habilidades tbody tr td .checkSingleTable").off().change(function () {
            
            if ($(this).is(":checked")) {
                var isAllChecked = 0;
                $("#unidadeAprendizagem #table-pesq-habilidades tbody tr td .checkSingleTable").each(function () {
                    if (!this.checked)
                        isAllChecked = 1;
                });
                if (isAllChecked === 0) { $("#checkedAllTable").prop("checked", true); }
                if ($("#unidadeAprendizagem #table-pesq-habilidades tbody tr td .checkSingleTable").filter(':checked', true).length > 0) {
                    $('.excluir-habilidades-multi').removeClass('hide');
                    $('.cadastrar-unidades').addClass('hide');
                } else {
                    $('.excluir-habilidades-multi').addClass('hide');
                    $('.cadastrar-unidades').removeClass('hide');
                }
            } else {
                $("#checkedAllTable").prop("checked", false);
                if ($("#unidadeAprendizagem #table-pesq-habilidades tbody tr td .checkSingleTable").filter(':checked', true).length > 0) {
                    $('.excluir-habilidades-multi').removeClass('hide');
                    $('.cadastrar-unidades').addClass('hide');
                } else {
                    $('.excluir-habilidades-multi').addClass('hide');
                    $('.cadastrar-unidades').removeClass('hide');
                }
            }
        });
    }

    function validaBotaoSalvar() {
        $("#table-pesq-habilidades").bind("DOMSubtreeModified", x => {
            if ($("#table-pesq-habilidades tbody>tr").length > 0) {
                $(".cadastrar-unidades").removeAttr("disabled");
            } else {
                $(".cadastrar-unidades").attr("disabled");
            }
        });
    }

    function pacote() {
        var url = window.location.search.replace("?", "");
        var items = url.split("=");
        if (url !== "") {
            $(".sl-subtitulo.sl-navy-blue.idpacote").text("Pacote #" + items[1]);
        }
        else
        {
            $(".sl-subtitulo.sl-navy-blue.idpacote").text("Novo Pacote");
        }
    }

    function direcionarProcesso() {
        if (!ordemProcessoCadastro) ordemProcessoCadastro = 1;
        let codbaseunidadeaprendizagem = $("#codbaseunidadeaprendizagem").val();
        codbaseunidadeaprendizagem = codbaseunidadeaprendizagem ? JSON.parse(codbaseunidadeaprendizagem) : 0;
        new GCS().setObj({
            type: 'GET',
            contentType: false,
            dataType: 'html',
            url: `/UA/GetProcesso?ordemProcessoCadastro=${ordemProcessoCadastro}&codbaseunidadeaprendizagem=${codbaseunidadeaprendizagem}`,
            success: function (data) {
                if (data) {
                    $('#divPartialUA').html(data);
                    unidadesAvaliativas.init();
                    $('.wizard_new_head').removeClass('passo1,passo2,passo3');
                    $('.wizard_new_head').addClass('passo2');
                }
                $('#divPartialUA').removeAttr("class", "hide");

            }
        }).executar();
    }

    function salvaFormularioCadastrarUnidades() {

        $('.cadastrar-unidades').off().click(function () {
            if ($("#frmCadastroUnidade").valid()) {
                var trTabela = $('#table-pesq-habilidades tbody tr');
                var model = $('#frmCadastroUnidade');
                var input = '';
                
                var modalidadeSelecionada = $('[name=codmodalidade]:checked');
                var codmodalidadeArray = [];
                modalidadeSelecionada.each(function () {
                    codmodalidadeArray.push($(this).val());
                });
                input += '<input type="hidden" name="codmodalidades" value="' + codmodalidadeArray.join() + '" />';


                trTabela.each(function (index) {
                    var elemento = $(this);
                    var codhabilidade = elemento.data('codhabilidade');
                    var coddisciplina = elemento.data('coddisciplina');
                    var codunidadeensino = elemento.data('codunidadeensino');
                    var codbasecurricular = elemento.data('codbasecurricular');
                    var codcurriculo = elemento.data('codcurriculo');
                    var codbaseunidadeaprendizagem = elemento.data('codbaseunidadeaprendizagem');
                    var codbaseunidadeaprendizagemhabilidade = elemento.data('codbaseunidadeaprendizagemhabilidade');
                    var codcurso = elemento.data('codcurso');
                    input += '<input type="hidden" name="listamatriz[' + index + '].codunidadeensinohabilidadecollege" value="' + codhabilidade + '" />';
                    input += '<input type="hidden" name="listamatriz[' + index + '].coddisciplinacollege" value="' + coddisciplina + '" />';
                    input += '<input type="hidden" name="listamatriz[' + index + '].codunidadeensinocollege" value="' + codunidadeensino + '" />';
                    input += '<input type="hidden" name="listamatriz[' + index + '].codbasecurricularcollege" value="' + codbasecurricular + '" />';
                    input += '<input type="hidden" name="listamatriz[' + index + '].codcurriculocollege" value="' + codcurriculo + '" />';
                    input += '<input type="hidden" name="listamatriz[' + index + '].codbaseunidadeaprendizagem" value="' + codbaseunidadeaprendizagem + '" />';
                    input += '<input type="hidden" name="listamatriz[' + index + '].codbaseunidadeaprendizagemhabilidade" value="' + codbaseunidadeaprendizagemhabilidade + '" />';
                    input += '<input type="hidden" name="listamatriz[' + index + '].codcursocollege" value="' + codcurso + '" />';
                });
                document.querySelectorAll(".blocoradio input").forEach(x => x.disabled = false);
                //formulário.append(input).submit();
                model.append(input);
                var form = new FormData($("#frmCadastroUnidade")[0]);
                //console.log(form);
                //console.log(formulario);
                //if ($('#table-pesq-habilidades tbody tr').length > 0) {
                new GCS().setObj({
                    type: 'POST',
                    //contentType: 'text/html',
                    contentType: false,
                    dataType: 'html',
                    data: form,
                    //processData: false,
                    url: $('#frmCadastroUnidade').data('url'),
                    success: function (data) {
                        $('#divPartialUA').html(data);
                        unidadesAvaliativas.init();
                        $('.wizard_new_head').removeClass('passo1,passo2,passo3');
                        $('.wizard_new_head').addClass('passo2');
                        //wizard.init();
                    }
                }).executar();

                validaEditacao();
                //}
                //else {
                //    Helper.OpenAlert({ title: "Ops!", msg: "É necessário vincular habilidades a base para prosseguir o cadastro", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-frown-o" });
                //}
            } else {
                $('html,body').animate({ scrollTop: 0 }, 'slow');
            }
        });
    }

    function abreModalCadastrohabilidade() {

        $('.edit-modal').off().click(function () {
            ValidaVisibilidadeCheckedAll("table-pesq-habilidades-modal");
            var modalidadeSelecionada = $('[name=codmodalidade]:checked');
            var codmodalidadeArray = [];
            modalidadeSelecionada.each(function () {
                codmodalidadeArray.push($(this).val());
            });

            new GCS().setObj({
                type: 'GET',
                contentType: 'application/json',

                url: '/UA/GetCursosPorModalidade?codmodalidade=' + codmodalidadeArray.join(),
                success: function (data) {
                    
                    Helper.updateOptions($("#codcursocollege"), data.cursos.map(function (item, index) {
                        return { value: item.Value, text: item.Text };
                    }));
                }
            }).executar();
            $('#modal-cdastro-habilidade').modal({
                dismissible: false,
                complete: function () {
                    $('#table-pesq-habilidades-modal tbody').html('');
                    $('#ddlDisciplina option').remove();
                    $('#codcursocollege').val("0");
                    $('select').material_select();
                }
            }).modal('open');
        });
    }

    function carregarDisciplinasCurso() {

        $('#codcursocollege').off().change(function () {
            if ($('#codcursocollege').val()) {
                new GCS().setObj({
                    type: "GET",
                    dataType: 'html',
                    contentType: 'text/html',
                    url: $('#codcursocollege').data('url') + '?codbaseunidadeaprendizagem=' + $('#codbaseunidadeaprendizagem').val() + '&codcurso=' + $('#codcursocollege').val(),
                    success: function (data) {
                        var dados = JSON.parse(data);
                        //console.log(dados.disciplinas);
                        if (dados.status) {
                            $('#ddlDisciplina').find('option').remove();
                            $('#ddlDisciplina').append($('<option>', {
                                value: "",
                                text: "Selecione"
                            }));
                            $.each(dados.disciplinas, function (i, item) {
                                $('#ddlDisciplina').append('<option value=' + item.CODIGODISCIPLINA + '>' + item.DISCIPLINA + '</option>');
                            });
                        }
                        else {
                            $('#ddlDisciplina').find('option').remove();
                            $('#ddlDisciplina').append($('<option>', {
                                value: "",
                                text: "Selecione"
                            }));
                        }
                        $('select').material_select();
                        //carregarUnidadesDisciplinas();
                    }
                }).executar();
            }
        });
    }

    function listaHabilidades() {

        $('.-buscahabilidade').off().click(function () {
            if ($("#frmCadastroUnidadeAdicionarHabilidade").valid()) {
                var codhabilidadesnotin = '';
                $('#table-pesq-habilidades tbody tr').each(function () {
                    if (codhabilidadesnotin !== '')
                        codhabilidadesnotin += ',' + $(this).data('codhabilidade');
                    else
                        codhabilidadesnotin += $(this).data('codhabilidade');
                });
                new GCS().setObj({
                    url: $(this).data('url') + '?codbaseunidadeaprendizagem=' + $('#codbaseunidadeaprendizagem').val() + '&codcurso=' + $('#codcursocollege').val() +
                        '&coddisciplina=' + $('#ddlDisciplina').val() + '&pesquisa=' + $('.input-pesquisa').val() +
                        '&codhabilidadesnotin=' + codhabilidadesnotin,
                    type: "GET",
                    dataType: 'html',
                    contentType: 'text/html',
                    success: function (data) {
                        $('#table-pesq-habilidades-modal tbody').html(data);
                        checkAllHabilidadeModal();
                        checkAllHabilidadeTabela();
                        excluiHabilidadeMulti();
                        ValidaVisibilidadeCheckedAll("table-pesq-habilidades-modal");

                    }
                }).executar();
            }
        });
    }

    function salvaHabilidadetabela() {

        $('.salva-habilidade').off().click(function () {
            if ($("#frmCadastroUnidadeAdicionarHabilidade").valid()) {
                var elemento = $(this);
                var habilidades = [];
                var itensChecados = elemento.closest('#modal-cdastro-habilidade').find('#table-pesq-habilidades-modal tbody tr input');
                itensChecados.each(function () {
                    if ($(this).is(':checked')) {
                        var item = {
                            habilidade: $(this).closest('tr').find('.-habilidade').text().trim(),
                            codhabilidade: $(this).closest('tr').data('codhabilidade'),
                            disciplina: $(this).closest('tr').find('.-disciplina').text().trim(),
                            curso: $(this).closest('tr').find('.-cursos').text().trim(),
                            coddisciplina: $(this).closest('tr').data('coddisciplina'),
                            codunidadeensino: $(this).closest('tr').data('codunidadeensino'),
                            codbasecurricular: $(this).closest('tr').data('codbasecurricular'),
                            codcurriculo: $(this).closest('tr').data('codcurriculo'),
                            codbaseunidadeaprendizagem: $(this).closest('tr').data('codbaseunidadeaprendizagem'),
                            codbaseunidadeaprendizagemhabilidade: $(this).closest('tr').data('codbaseunidadeaprendizagemhabilidade'),
                            codcurso: $(this).closest('tr').data('codcurso')
                        };
                        habilidades.push(item);
                    }
                });
                excluiHabilidade();
                if (habilidades.length > 0) {
                    salvaTabelaHabilidades(habilidades);
                } else if (habilidades.length === 0) {
                    Helper.OpenAlert({ title: "Nenhuma habildade foi selecionada", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }

                ValidaVisibilidadeCheckedAll("table-pesq-habilidades", "checkedAllTable");
            }
        });
    }

    function salvaTabelaHabilidades(obj) {
        
        var tabela = $('#table-pesq-habilidades tbody');
        var trTabela = '';
        for (var i = 0; i < obj.length; i++) {
            trTabela += `<tr data-codhabilidade="${obj[i].codhabilidade}" data-coddisciplina="${obj[i].coddisciplina}" data-codunidadeensino="${obj[i].codunidadeensino}" data-codbasecurricular="${obj[i].codbasecurricular}" data-codcurriculo="${obj[i].codcurriculo}" data-codbaseunidadeaprendizagem="${obj[i].codbaseunidadeaprendizagem}" data-codbaseunidadeaprendizagemhabilidade="${obj[i].codbaseunidadeaprendizagemhabilidade}" data-codcurso="${obj[i].codcurso}">
                    <td>
                        <input type="checkbox" class="filled-in checkSingleTable" id="filled-in-box-${obj[i].codhabilidade}">
                        <label for="filled-in-box-${obj[i].codhabilidade}">${obj[i].habilidade}</label>
                    </td>
                    <td>${obj[i].curso}
                    <td>${obj[i].disciplina}</td>
                    <td class="center"><i class="fa fa-trash-o fas fa-trash-alt exclui-habilidade" aria-hidden="true" title="Excluir"></i></td>
                </tr>`;
        }
        tabela.append(trTabela);
        checkAllHabilidadeTabela();
        excluiHabilidade();
        excluiHabilidadeMulti();
        $('#modal-cdastro-habilidade').modal('close');
    }

    function excluiHabilidade() {

        $('.exclui-habilidade').off().click(function () {
            var elemento = $(this);
            Helper.OpenConfirm({
                title: "Deseja excluir?",
                icon: 'fa-exclamation-triangle',
                iconclass: 'satisfaction-yellow',
                msg: '',
                classtitle: 'font-preto',
                yes: function () {
                    confirmacaoExcusaoHabilidade(elemento);
                    Helper.CloseConfirm();
                },
                no: function () { },
                textno: 'Cancelar',
                textsim: 'Excluir'
            });     
        });
    }

    function excluiHabilidadeMulti() {

        $('.excluir-habilidades-multi').off().click(function () {
            var elemento = $(this);
            Helper.OpenConfirm({
                title: "Deseja excluir?",
                icon: 'fa-exclamation-triangle',
                iconclass: 'satisfaction-yellow',
                msg: '',
                classtitle: 'font-preto',
                yes: function () {
                    confirmacaoExcusaoHabilidadeMulti();
                    Helper.CloseConfirm();
                },
                no: function () { },
                textno: 'Cancelar',
                textsim: 'Excluir'
            });
        });
    }

    function confirmacaoExcusaoHabilidadeMulti() {
        
        var checados = $("#unidadeAprendizagem #table-pesq-habilidades tbody tr td .checkSingleTable").filter(':checked', true);
        var data = [];
        checados.each(function () {
            /*var codbaseunidadeaprendizagemhabilidade = {
                codbaseunidadeaprendizagemhabilidade: $(this).closest('tr').data('codbaseunidadeaprendizagemhabilidade')
            };*/
            data.push($(this).closest('tr').data('codbaseunidadeaprendizagemhabilidade'));
        });
        new GCS().setObj({
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            data: { codbaseunidadeaprendizagemhabilidade:data},
            processData: true,
            url: urlExcluiHabilidadeMulti,
            success: function (resultado) {
                if (resultado.status) {
                    removeDaTabelaMulti(data);
                    Helper.OpenAlert({ title: "Habilidade excluida com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                    $('.excluir-habilidades-multi').addClass('hide');
                    $('.cadastrar-unidades').removeClass('hide');
                } else {
                    Helper.OpenAlert({ title: "Não foi possível excluir", msg: resultado.msg, classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
                bindFunctions();

            },
            error: function (err) {
                Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            }
        }).executar();
    }

    function confirmacaoExcusaoHabilidade(elemento) {

        var codbaseunidadeaprendizagemhabilidade = parseInt(elemento.closest('tr').data('codbaseunidadeaprendizagemhabilidade'));
        var data = {
            codbaseunidadeaprendizagemhabilidade: codbaseunidadeaprendizagemhabilidade
        };
        if (codbaseunidadeaprendizagemhabilidade) {
            new GCS().setObj({
                type: 'POST',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                data: data,
                processData: true,
                url: urlExcluiHabilidade,
                success: function (data) {
                    if (data.status) {
                        removeDaTabela(codbaseunidadeaprendizagemhabilidade);
                        if ($("#table-pesq-habilidades tbody tr td input:checked").length > 0) {
                            $('.excluir-habilidades-multi').removeClass('hide');
                            $('.cadastrar-unidades').addClass('hide');
                        } else {
                            $('.excluir-habilidades-multi').addClass('hide');
                            $('.cadastrar-unidades').removeClass('hide');
                        }

                        Helper.OpenAlert({ title: "Habilidade excluida com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                    } else {
                        Helper.OpenAlert({ title: "Não foi possível excluir", msg: data.msg, classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }
                    bindFunctions();
                },
                error: function (err) {
                    Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            }).executar();
        } else {
            elemento.parent().parent().remove();

            if ($("#table-pesq-habilidades tbody tr td input:checked").length > 0) {
                $('.excluir-habilidades-multi').removeClass('hide');
                $('.cadastrar-unidades').addClass('hide');
            } else {
                $('.excluir-habilidades-multi').addClass('hide');
                $('.cadastrar-unidades').removeClass('hide');
            }

            Helper.OpenAlert({ title: "Habilidade excluida com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
        }
    }

    function removeDaTabela(codbaseunidadeaprendizagemhabilidade) {
        var trTabela = $('#table-pesq-habilidades tbody tr');

        trTabela.each(function () {
            var elemento = $(this);
            if (parseInt(elemento.data('codbaseunidadeaprendizagemhabilidade')) === codbaseunidadeaprendizagemhabilidade) {
                elemento.remove();
            }
        });

        if (trTabela && trTabela.length > 0)
            $("#table-pesq-habilidades tbody tr td input[type='checkbox']").toArray().forEach(x => x.checked = false);
    }

    function removeDaTabelaMulti(elementos) {
        var trTabela = $('#unidadeAprendizagem #table-pesq-habilidades tbody tr');

        $("#unidadeAprendizagem #table-pesq-habilidades tbody tr td .checkSingleTable").filter(':checked', true).parent().parent().remove()

        if ($("#unidadeAprendizagem #table-pesq-habilidades tbody tr td .checkSingleTable").filter(':checked', true).length > 0) {
            $('.excluir-habilidades-multi').removeClass('hide');
            $('.cadastrar-unidades').addClass('hide');
        } else {
            $('.excluir-habilidades-multi').addClass('hide');
            $('.cadastrar-unidades').removeClass('hide');
            $('#checkedAllTable').prop('checked', false);
        }

        if (trTabela && trTabela.length > 0)
            $("#table-pesq-habilidades tbody tr td input[type='checkbox']").toArray().forEach(x => x.checked = false);

    }
    return {
        init: init
    };

}();
$(informacoesSistemas.init);


















