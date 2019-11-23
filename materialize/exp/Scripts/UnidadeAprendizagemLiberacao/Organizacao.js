"use strict";

var OrganizacaoUA = (function () {

    function init() {
        bindFunctions();
        CarregarOrganizacao();
        organizarItems();
        SalvarOrganizacao();
        SalvarWidget();
        $('input#titulo-widget').characterCounter();
        carregraWidget();
        cadastrarWidget();
        excluirWidget();
        carregaImagemCKeditor();
    }
 

    function bindFunctions() {
    }


    function carregaImagemCKeditor() {
        $('.anexa-img').off().change(changeArquivo);
    }

    function changeArquivo() {
        if (this.files.length > 0) {
            var type = this.files[0].type,
                nomeArquivo = $(this).val().toLowerCase().split('\\')[2],
                extension = nomeArquivo ? extension = nomeArquivo.substring(nomeArquivo.lastIndexOf('.') + 1) : '';

            if (this.files.length > 0) {
                var item = this.files[0];
                var hiddenField = $('#base64imagemCkeditor');
                $('#extensaoimagemCkeditor').val(extension);
                var micro_macro = $(this).closest('form').attr('id') === 'frmCadastroMicro' ? 'micro' : 'macro';

                Helper.getBase64callback(item, function (base64, element) {

                    element.val(base64);
                    $('.btn-fixed').removeClass('hide');
                    addMedia(item);
                    $('.anexa-img').val("")
                }, hiddenField);

            } else {
                $('.btn-fixed').addClass('hide');
            }
        } else {
            $('.btn-fixed').addClass('hide');
        }
    }

    function addMedia(arquivo) {
        var data = {
            //arquivo: arquivo,
            extensao: $('#extensaoimagemCkeditor').val(),
            base64: $('#base64imagemCkeditor').val()
        };

        new GCS().setObj({
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            url: salvarImagem,
            processData: true,
            data: { file: data },
            success: function (data) {
                if (data.status) {
                    CKEDITOR.instances["texto-widget"].insertHtml('<img src="' + data.url + '"></img>');
                    $('#extensaoimagemCkeditor').val('');
                } else {
                    Helper.OpenAlert({ title: "Erro ao carregar imagem", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            }, error: function (data) {
                CKEDITOR.instances.editormacro.insertHtml('<img src=""></img>');
            },
            showLoad: false
        }).executar();
    }

    function organizarItems() {
        $(".sortable").on("sortupdate", function (event, ui) {
            $(".sortable li").each(function () {
                $(this).attr("data-ordem", $(this).index()+1);
            });
        });
    }

    function SalvarOrganizacao() {
        $("#btnSalvarOrganizacaoAnoSemestre").on("click", function () {
            var array = [];
            var ordem = 0;
            $('.sortable li').map(function () {
                ordem++;
                array.push($(this).data('codunidadeaprendizagemturmadisciplinatrilha') + "-" + ordem);
            });

            console.log(array);
            var obj = {
                listaUADisciplinaTrilha: array,
                codunidadeaprendizagem: $('#codunidadeaprendizagem').val(),
                codcursocollege: $('#codcursocollege').val(),
                coddisciplinacollege: $('#coddisciplinacollege').val(),
                codturmacollege: $('#codturmacollege').val()
            };

            new GCS().setObj({
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(obj),
                url: SalvarOrganizacaoUrl,
                success: function (data) {
                    if (data.status) {
                        let textLiberada = data.statusLiberacao ? data.statusLiberacao : "Não Liberada";
                        $('.info-ua .ua-liberada').text(textLiberada);

                        var integracaoCanvas = data.integrado ? 'Canvas: <span>INTEGRADA</span>' : 'Canvas: <span>NÃO INTEGRADA</span>';
                        $('.info-ua .canvas').html(integracaoCanvas);
                    }

                    console.log(data);
                },
                error: function (data) {
                    console.log(data);
                }
            }).executar();
        });
    }

    function CarregarOrganizacao() {

        var codunidadeaprendizagem = $('#codunidadeaprendizagem').val();
        var codcursocollege = $('#codcursocollege').val();
        var coddisciplinacollege = $('#coddisciplinacollege').val();
        var codturmacollege = $('#codturmacollege').val();

        new GCS().setObj({
            type: "GET",
            dataType: 'html',
            contentType: 'text/html',
            url: CarregarOrganizacaoUrl + '?codunidadeaprendizagem=' + codunidadeaprendizagem + '&codcursocollege=' + codcursocollege + '&coddisciplinacollege=' + coddisciplinacollege + '&codturmacollege=' + codturmacollege,
            success: function (data) {
                $("#organizacao-container").html(data);
            }
        }).executar();
    }

    function cadastrarWidget() {
        $(document).on("click", ".btn-addItem", function () {
            $('#widget-modal').modal({ dismissible: false }).modal('open');
            $("#codunidadeaprendizagemturmadisciplinatrilha").val("0");
            $("#codunidadeaprendizagemturmadisciplinatrilhaorientacao").val("0");
            $("#titulo-widget").val("");
            CKEDITOR.instances['texto-widget'].setData("");
            $("#salvar-widget").text("Adicionar");
        });
    }

    function SalvarWidget() {
        $("#salvar-widget").on("click", function () { 
            var codunidadeaprendizagemturmadisciplinatrilha = $("#codunidadeaprendizagemturmadisciplinatrilha").val();
            var codunidadeaprendizagemturmadisciplinatrilhaorientacao = $("#codunidadeaprendizagemturmadisciplinatrilhaorientacao").val();
            var titulo = $("#titulo-widget").val();
            var texto = CKEDITOR.instances['texto-widget'].getData();

            if (titulo && texto) {
                var obj = {
                    codunidadeaprendizagemturmadisciplinatrilha: codunidadeaprendizagemturmadisciplinatrilha,
                    codunidadeaprendizagemturmadisciplinatrilhaorientacao: codunidadeaprendizagemturmadisciplinatrilhaorientacao,
                    titulo: titulo,
                    texto: texto,
                    codunidadeaprendizagem: $('#codunidadeaprendizagem').val(),
                    codcursocollege: $('#codcursocollege').val(),
                    coddisciplinacollege: $('#coddisciplinacollege').val(),
                    codturmacollege: $('#codturmacollege').val()
                };

                new GCS().setObj({
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(obj),
                    url: SalvarWidgetUlr,
                    success: function (data) {
                        CarregarOrganizacao();
                        $('#widget-modal').modal('close');
                    },
                    error: function (data) {
                        console.log(data);
                    }
                }).executar();
            } else {
                Helper.OpenAlert({ title: "Ops", msg: 'Preenche todos os campos!', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            }
        });

    }

    function carregraWidget() {
        $(document).on("click", ".editarWidget", function () {
            var codunidadeaprendizagemturmadisciplinatrilha = $(this).parent().parent().attr("data-codunidadeaprendizagemturmadisciplinatrilha");
            var codunidadeaprendizagemturmadisciplinatrilhaorientacao = $(this).parent().parent().attr("data-codunidadeaprendizagemturmadisciplinatrilhaorientacao");

            new GCS().setObj({
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json',
                url: carregarWidget + '?codunidadeaprendizagemturmadisciplinatrilha=' + codunidadeaprendizagemturmadisciplinatrilha + '&codunidadeaprendizagemturmadisciplinatrilhaorientacao=' + codunidadeaprendizagemturmadisciplinatrilhaorientacao,
                success: function (data) {
                    var codunidadeaprendizagemturmadisciplinatrilha = data['codunidadeaprendizagemturmadisciplinatrilha'];
                    var codunidadeaprendizagemturmadisciplinatrilhaorientacao = data['codunidadeaprendizagemturmadisciplinatrilhaorientacao'];
                    var titulo = data['titulo'];
                    var texto = data['texto'];

                    $('#widget-modal').modal({ dismissible: false }).modal('open');
                    $("#codunidadeaprendizagemturmadisciplinatrilha").val(codunidadeaprendizagemturmadisciplinatrilha);
                    $("#codunidadeaprendizagemturmadisciplinatrilhaorientacao").val(codunidadeaprendizagemturmadisciplinatrilhaorientacao);
                    $("#salvar-widget").text("Salvar");
                    $("#titulo-widget").val(titulo);
                    CKEDITOR.instances['texto-widget'].setData(texto);
                },
                error: function (data) {
                    console.log(data);
                }
            }).executar();
        });
    }

    function excluirWidget() {
        //aviso e prepara pra exclusão
        $(document).on("click", ".excluirWidget", function () {
            $('#excluirModal').modal({ dismissible: false }).modal('open');
            var nomeItem = $(this).parent().siblings("span").text();
            $("#nomeItemAExcluir").text(nomeItem);
            var codunidadeaprendizagemturmadisciplinatrilha = $(this).parent().parent().attr("data-codunidadeaprendizagemturmadisciplinatrilha");
            var codunidadeaprendizagemturmadisciplinatrilhaorientacao = $(this).parent().parent().attr("data-codunidadeaprendizagemturmadisciplinatrilhaorientacao");
            $("#excluirWidgetBtn").attr("data-codunidadeaprendizagemturmadisciplinatrilha", codunidadeaprendizagemturmadisciplinatrilha);
            $("#excluirWidgetBtn").attr("data-codunidadeaprendizagemturmadisciplinatrilhaorientacao", codunidadeaprendizagemturmadisciplinatrilhaorientacao);
        });

        //exclusão widget
        $(document).on("click", "#excluirWidgetBtn", function () {
            var codunidadeaprendizagemturmadisciplinatrilha = $(this).attr("data-codunidadeaprendizagemturmadisciplinatrilha");
            var codunidadeaprendizagemturmadisciplinatrilhaorientacao = $(this).attr("data-codunidadeaprendizagemturmadisciplinatrilhaorientacao");

            new GCS().setObj({
                type: 'POST',
                contentType: 'application/json',
                url: ExcluirWidget + '?codunidadeaprendizagemturmadisciplinatrilha=' + codunidadeaprendizagemturmadisciplinatrilha + '&codunidadeaprendizagemturmadisciplinatrilhaorientacao=' + codunidadeaprendizagemturmadisciplinatrilhaorientacao,
                success: function (data) {
                    CarregarOrganizacao();
                },
                error: function (data) {
                    console.log(data);
                }
            }).executar();
        });
    }

    return {
        init: init
    };

})();

$(OrganizacaoUA.init);

