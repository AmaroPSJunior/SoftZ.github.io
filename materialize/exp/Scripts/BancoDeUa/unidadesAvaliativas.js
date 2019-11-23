"use strict";


var codhabilidadeMacro = '';
var codhabilidadeMicro = '';

var unidadesAvaliativas = function () {

    function init() {
        bindFunctions();
        FormValidations.init();
        verificaModalidade();
        inicializacollapse();
    }

    function bindFunctions() {

        micros_macros();
        abreModalMacro();
        abreModalMicro();
        abreModalItemMacro();
        carregaItemMicro();
        carregaItemMacro();


        TabelasParciais();
        InicializaOperacoesPadrao();

        CKEDITOR.config.resize_enabled = false;

        $('.capaunidade').change(function () {

            var $inputFile = $(this),
                files = this.files;

            var item = files[0];

            var hiddenField = $('#base64capaunidade');

            Helper.getBase64(item, hiddenField);
        });

        $('.guiaestudopdf').change(function () {

            var $inputFile = $(this),
                files = this.files;

            var item = files[0];

            var hiddenField = $('#base64guiaestudopdf');

            Helper.getBase64(item, hiddenField);
        });

        $('.guiaestudoscorm').change(function () {

            var $inputFile = $(this),
                files = this.files;

            var item = files[0];

            var hiddenField = $('#base64guiaestudoscorm');

            Helper.getBase64(item, hiddenField);
        });


        $('.infografico').change(function () {

            var $inputFile = $(this),
                files = this.files;

            var item = files[0],
                nomeArquivo = $(this).val().toLowerCase().split('\\')[2],
                extension = nomeArquivo ? extension = nomeArquivo.substring(nomeArquivo.lastIndexOf('.') + 1) : '';
            if (extension !== 'gif' && extension !== 'jpg' && extension !== 'png' && extension !== 'pdf') {
                $(this).val('');
                Helper.OpenAlert({ title: "Ops", msg: 'Só é aceito extensões .gif, .jpg, .png e .pdf', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            } else {

                var hiddenField = $('#base64infografico');
                $('#extensaoinfografico').val(extension);
                Helper.getBase64(item, hiddenField);
            }
        });

        $('.destaques').change(function () {

            var $inputFile = $(this),
                files = this.files;

            var item = files[0],
                nomeArquivo = $(this).val().toLowerCase().split('\\')[2],
                extension = nomeArquivo ? extension = nomeArquivo.substring(nomeArquivo.lastIndexOf('.') + 1) : '';
            if (extension !== 'gif' && extension !== 'jpg' && extension !== 'png' && extension !== 'pdf') {
                $(this).val('');
                Helper.OpenAlert({ title: "Ops", msg: 'Só é aceito extensões .gif, .jpg, .png e .pdf', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            } else {

                var hiddenField = $('#base64destaques');
                $('#extensaodestaques').val(extension);
                Helper.getBase64(item, hiddenField);
            }
        });


        $('.btn-anexar-guia').off().change(function () {

            var $inputFile = $(this),
                files = this.files;

            var item = files[0],
                nomeArquivo = $(this).val().toLowerCase().split('\\')[2],
                extension = nomeArquivo ? extension = nomeArquivo.substring(nomeArquivo.lastIndexOf('.') + 1) : '';

            var tipos = ['zip', 'rar', 'tar', 'gz', '7z'];

            //if (extension !== 'zip') {
            if ((JSON.parse($("#scorm").val()) && tipos.indexOf(extension) == -1) || (!JSON.parse($("#scorm").val()) && extension !== 'pdf')) {
                $(this).val('');
                Helper.OpenAlert({
                    title: "Ops", msg: 'Só é aceito extensões ' + (JSON.parse($("#scorm").val()) ? '.zip, .rar, .tar, .gz, .7z' : '.pdf'), classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle"
                });
            } else {
                $('#frmCadastroGuiaOnline #NomeArquivoUnidade').val(nomeArquivo);
                $('#frmCadastroGuiaOnline #ExtensaoUnidade').val(extension);
                var hiddenField = $('#frmCadastroGuiaOnline #base64Unidade');
                Helper.getBase64(item, hiddenField);
            }
        });

        excluiItemDescritor();
        visualizaMacros();
        visualizaMicros();
        //listaDisciplinas();
        ativaModalGuiaEstudante();
        salvaFormularioCadastrarItens();
        alteracaoModalidade();
        Helper.addClassScroll();
        $('#add-video .btn #anexo').change(function () {
            $('file-path-wrapper #anexo').addClass('validate');
            validaArquivo(this);
        });

        if (!JSON.parse(permissaoGravacao.toLowerCase()) && $("#bancoQuestao").length == 0) {
            $("input:not(input[type='hidden'])").prop("disabled", true);
        }
    }


    function validaArquivoTemplateMacro() {
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


    function alteracaoModalidade() {

        if (document.querySelector(".blocoradio input[type='checkbox']:checked")) {
            $(".bloco > .titulo-item > .edit-modal").show();
        } else {
            $(".bloco > .titulo-item > .edit-modal").hide();
        }

        $(".blocoradio").change(x => {
            $("#table-pesq-habilidades > tbody > tr").remove()
            if ($("input[name='codmodalidade']:checked").length) {
                $(".bloco > .titulo-item > .edit-modal").show();
            } else {
                $(".bloco > .titulo-item > .edit-modal").hide();
            }
        });
    }

    function carregaImagemCKeditor() {
        $('.anexa-img').off().change(changeArquivo);


    }

    function inicializacollapse() {
        $('.collapsible').collapsible();
    }

    function verificaPrenchimentoObrigatorio() {
        var guiaonline = $('#data-codtipoconteudo').val();
        var guiascorm = $('#guiascorm-valid').val();
        //var micro = $('#tabela-de-micros tbody tr').length;
        //var macro = $('#tabela-de-macros tbody tr').length;
        //var video = $('#tabela-de-videos tbody tr').length;

        if (guiaonline > 0) {

            if (guiascorm > 0) {
                Helper.OpenAlert({ title: "Ops", msg: 'Guia Scorm deve ser preenchido', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            }
        } else {
            $('.criando-item').addClass('hide');
        }
    }

    function salvaFormularioCadastrarItens() {
        $('#btnAvancar').off().click(function () {

            var camposobrigatorios = verificaPrenchimentoObrigatorio();
            if (camposobrigatorios) {

                var form = new FormData($("#frmCadastroItens")[0]);

                new GCS().setObj({
                    type: 'POST',
                    contentType: false,
                    dataType: 'html',
                    data: form,
                    url: $('#frmCadastroItens').data('url'),
                    success: function (data) {
                        if (!Helper.isJSON(data)) {
                            $('#divPartialUA').html(data);
                            init();

                            $('.wizard_new_head').removeClass('passo1');
                            $('.wizard_new_head').removeClass('passo2');
                            $('.wizard_new_head').removeClass('passo3');

                            $('.wizard_new_head').addClass('passo3');
                        } else {
                            Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                        }

                    },
                    error: function (err) {
                        Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }
                }).executar();
                //}
            } else {
                Helper.OpenAlert({ title: "Ops", msg: 'Todos os arquivos são obrigatórios', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            }
        });
    }

    function verificaModalidade() {
        var codmodalidade = $('#codmodalidade').val();
        var divsHide = $('.div--guia-estudo-online, .div--guia-estudo-hibrido').addClass('hide');
        if (codmodalidade === '1') {
            $(".sl-subtitulo.sl-navy-blue.idpacote").text("Híbrido");
            $('.div--guia-estudo-hibrido').removeClass('hide');
        }
        else if (codmodalidade === '2') {
            $(".sl-subtitulo.sl-navy-blue.idpacote").text("Online");
            $('.div--guia-estudo-online').removeClass('hide');
            $('.div--guia-estudo-hibrido').removeClass('hide');
        } else {
            $('.div--guia-estudo-online').removeClass('hide');
        }
    }

    function micros_macros() {
        criarMicro();
        criarMacro();
    }

    function videoVimeo() {
        $('#url').off().change(function () {
            ValidaVideo();
        });
    }

    function ValidaVideo(callback = null) {
        var videoUrl = $('#url').val();
        var endpoint = 'https://vimeo.com/api/oembed.json';
        var url = endpoint + '?url=' + encodeURIComponent(videoUrl);
        var vimeo = videoUrl.indexOf('https://vimeo.com/') > -1;
        var youtube = videoUrl.indexOf('https://www.youtube.com/watch?v=') > -1;
        var meuPadrao = youtube ? /^https:\/\/www.youtube.com/ : /^https:\/\/vimeo.com/;
        var btn = $('.salva-url-video');
        var msg = "Vídeo indisponível";

        function urlInvalida() {
            Helper.OpenAlert({ title: "Ops", msg: msg, classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            $('#video-vimeo').html('Carregue o link para visualizar o vídeo..');
            $("#url").val("");
            btn.attr('disabled', true);
        }

        if (videoUrl) {
            if (meuPadrao.test(videoUrl)) {
                if (vimeo) {
                    new GCS().setObj({
                        type: 'GET',
                        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                        url: url,
                        showLoad: false,
                        success: function (data) {

                            if ($('#video-vimeo iframe').length) {
                                var idIframeAtual = document.querySelector('#video-vimeo iframe').src.split('/')[4];
                                var idAtual = idIframeAtual.split('?')[0];
                                var x = parseInt(idAtual) === data.video_id;

                                if (!x) {
                                    $('#video-vimeo').html(data.html);
                                }
                            } else {
                                $('#video-vimeo').html(data.html);
                            }

                            btn.attr('disabled', false);
                            if (callback) {
                                callback();
                            }
                        },
                        error: function (a, b, error) {

                            if (a.errorThrown && a.errorThrown === "Forbidden") {
                                msg = "O proprietário deste vídeo estabeleceu restrições de domínio e não será possível incorporá-lo em todos os sites.";
                            }
                            urlInvalida();
                        }
                    }).executar();

                } else {
                    if (youtube) {
                        var idVideo = videoUrl.substring(videoUrl.lastIndexOf('v=') + 2);
                        let obj = {
                            part: 'snippet',
                            key: 'AIzaSyDhtU9oebZG4uIMA63utC6AT0OYrXQnpzs',
                            id: idVideo
                        };
                        new GCS().setObj({
                            type: 'GET',
                            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                            url: "https://www.googleapis.com/youtube/v3/videos",
                            data: obj,
                            processData: true,
                            success: function (data) {

                                if (data.items.length) {

                                    if (($('#video-vimeo iframe').length)) {
                                        var idIframeAtual = document.querySelector('#video-vimeo iframe').src.split('/')[4];
                                        var idAtual = idIframeAtual.split('?')[0];
                                        var x = idAtual === dataId;
                                        var dataId = data.items[0].id;

                                        if (!x) {
                                            $('#video-vimeo').html('<iframe width="800" height="500" src="' + videoUrl.replace('watch?v=', 'embed/') + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
                                        }

                                    } else {
                                        $('#video-vimeo').html('<iframe width="800" height="500" src="' + videoUrl.replace('watch?v=', 'embed/') + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
                                    }

                                    btn.attr('disabled', false);
                                    if (callback) {
                                        callback();
                                    }

                                } else {
                                    urlInvalida();
                                }

                            },
                            showLoad: false
                        }).executar();
                    } else {
                        msg = "Só é aceito videos da plataforma Vimeo ou YouTube";
                        urlInvalida();
                    }
                }
            } else {
                msg = "Só é aceito videos da plataforma Vimeo ou YouTube";
                urlInvalida();
            }

        } else {
            msg = "Carregue o link para visualizar o vídeo..";
            urlInvalida();
        }

    }

    function salvaUrlVideo() {

        $('.salva-url-video').off().click(function () {
            $('.salva-url-video').off('click');
            ValidaVideo(adicionaVideo);
        });
    }

    function adicionaVideo() {

        var url = $('#url').val(),
            titulo = $('#titulo').val(),
            nomeArquivo = $('#anexo').val().toLowerCase().split('\\')[2],
            extensao = nomeArquivo ? extensao = nomeArquivo.substring(nomeArquivo.lastIndexOf('.') + 1) : '';

        $("#extensao").val(extensao);
        $("#baseunidadeaprendizagem").val($('#codbaseunidadeaprendizagem').val());

        var form = new FormData($("#add-video form")[0]);

        if (titulo) {
            if (url) {
                new GCS().setObj({
                    type: 'POST',
                    url: urlSalvaVideo,
                    contentType: false,
                    data: form,
                    success: function (data) {
                        Helper.OpenAlert({ title: "Vídeo salvo com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                        $('#add-video input').val('');
                        $('#video-vimeo iframe').remove();
                        TabelasParciais();
                        $('file-path-wrapper #anexo').removeClass('validate');
                        $('#add-video').modal('close');
                        salvaUrlVideo();
                    }
                }).executar();
            } else {
                Helper.OpenAlert({ title: "Ops", msg: 'Url do vídeo está vazio.', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            }
        } else {
            Helper.OpenAlert({ title: "Ops", msg: 'Título do vídeo está vazio.', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
        }
    }

    function excluiVideo() {
        $('.exclui-video').off().click(function () {

            var elemento = $(this);

            Helper.OpenConfirm({
                title: "Deseja excluir?",
                icon: 'fa-exclamation-triangle',
                iconclass: 'satisfaction-yellow',
                msg: '',
                classtitle: 'font-preto',
                yes: function () {
                    confirmacaoExcusaoVideo(elemento);
                    Helper.CloseConfirm();
                },
                no: function () { },

                textno: 'Cancelar',
                textsim: 'Excluir'
            });
        });
    }

    function confirmacaoExcusaoVideo(elemento) {

        var codconteudo = $(elemento).closest('tr').data('coditem');
        new GCS().setObj({
            type: 'GET',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            url: '/Video/ExcluirVideo?codbaseunidadeaprendizagem=' + $('#codbaseunidadeaprendizagem').val() + '&codconteudo=' + codconteudo,
            success: function (data) {
                if (data.status) {
                    var trExcluir = elemento.closest('tr');
                    trExcluir.remove();
                    Helper.OpenAlert({ title: "Vídeo excluido com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                } else {
                    Helper.OpenAlert({ title: "Não foi possível excluir", msg: data.msg, classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
                bindFunctions();
            }
        }).executar();
    }

    function editarVideo() {

        $('.editar-video').off().click(function () {
            var elemento = $(this);
            var codvideo = elemento.closest('tr').data('coditem');
            var url = elemento.closest('tr').find('td.url').text().trim();
            var titulo = elemento.closest('tr').find('td.titulovideo').text().trim();

            $('.file-path-wrapper #anexo').removeClass('valid');

            if (url) {
                $('#add-video input').each(function () {
                    $(this).val(null);
                });

                $('#add-video').modal({ dismissible: false }).modal('open');
                $('#url').val(url);
                $('#titulo').val(titulo);
                $('#url').trigger('change');
                $('#codvideo').val(codvideo);
                $('.file-path-wrapper #anexo').val(elemento.data('nomeanexo'));
            }
        });
    }

    function abreModalVideo() {
        $('.abre-modal-video').off().click(function () {
            $('#add-video').modal({ dismissible: false }).modal('open');
            $('#video-vimeo iframe').remove();
            $('#add-video input').val('');
            $('.file-path-wrapper #anexo').removeClass('valid');
            //salvaUrlVideo();
        });
    }

    function excluiItemDescritor() {
        $('.exclui-item-descritor').off().click(function () {

            var elemento = $(this);
            Helper.OpenConfirm({
                title: "Deseja excluir?",
                icon: 'fa-exclamation-triangle',
                iconclass: 'satisfaction-yellow',
                msg: '',
                classtitle: 'font-preto',
                yes: function () {
                    confirmacaoExclusaoItemDescritor(elemento);
                    Helper.CloseConfirm();
                },
                no: function () { },

                textno: 'Cancelar',
                textsim: 'Excluir'
            });
        });
    }

    function abreModalMacro() {
        $('.macrodesafio').off().click(function () {

            new GCS().setObj({
                type: 'GET',
                contentType: false,
                dataType: 'html',
                url: urlGetHabilidadeMacro + '?codbaseunidadeaprendizagem=' + $('#codbaseunidadeaprendizagem').val(),
                success: function (data) {
                    if (!Helper.isJSON(data)) {
                        $('#cria-macro').html(data);
                        $('#cria-macro').modal({ dismissible: false }).modal('open');
                        inicializacollapse();
                        carregaItemMacro();

                    } else {
                        Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }
                }, error: function (data) {
                    console.log(data);
                },
                showLoad: false
            }).executar();
        });
    }

    function abreModalMicro() {
        $('.microdesafio').off().click(function () {
            new GCS().setObj({
                type: 'GET',
                contentType: false,
                dataType: 'html',
                url: urlGetHabilidadeMicro + '?codbaseunidadeaprendizagem=' + $('#codbaseunidadeaprendizagem').val(),
                success: function (data) {
                    if (!Helper.isJSON(data)) {
                        $('#cria-micro').html(data);
                        $('#cria-micro').modal({ dismissible: false }).modal('open');
                        inicializacollapse();
                        carregaItemMicro();
                    } else {
                        Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }
                }, error: function (data) {
                    console.log(data);
                },
                showLoad: false
            }).executar();
        });
    }

    function carregaItemMicro() {
        $('.itemmicro').off().click(function () {
            let item = $(this);

            if (!$(this).hasClass('active')) {

                var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
                var codhabilidade = $(this).attr('data-codhabilidade');
                var coddisciplina = $(this).attr('data-coddisciplina');
                var codunidadeensino = $(this).attr('data-codunidadeensino');
                var coddescritor = $(this).attr('data-coddescritor');
                var griditem = $(this).siblings('.collapsible-body').find('.griditem');

                if (codhabilidade && coddisciplina && codbaseunidadeaprendizagem && codunidadeensino) {

                    new GCS().setObj({
                        type: 'GET',
                        contentType: 'text/html',
                        dataType: 'html',
                        url: urlGetItemMicro + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem + '&codhabilidade=' + codhabilidade + '&coddisciplina=' + coddisciplina + '&codunidadeensino=' + codunidadeensino + '&coddescritor=' + coddescritor,
                        success: function (data) {
                            griditem.html(data);
                            inicializacollapse();
                            bindOpcoesMicroDesafio(item);
                        }, error: function (data) {
                            console.log(data);
                        },
                        showLoad: false
                    }).executar();
                }
            }
        });
    }

    function bindOpcoesMicroDesafio(item) {
        var btnNovoMicroDesafio = item.parent().find(".itemcollapse");

        if (!btnNovoMicroDesafio || btnNovoMicroDesafio.length == 0) {
            btnNovoMicroDesafio = item.parent().find(".itemmicrodesafio");

            item.parent().find("#table-pesq-habilidades tbody tr").each((x, elem) => {
                let coditem = elem.dataset.coditem;
                $(elem).find(".alterar-item-micro").off().click({ coditem: coditem }, alterarMicroDesafio);
                $(elem).find(".exclui-item-micro").off().click({ coditem: coditem, item: item }, excluirQuestao);
            });
        }

        btnNovoMicroDesafio.off().click(criarNovoMicroDesafio);
    }


    function carregaItemMacro() {

        $('.itemmacro').off().click(function () {

            if (!$(this).hasClass('active')) {
                var item = $(this);
                var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
                var codhabilidade = $(this).attr('data-codhabilidade');
                var coddisciplina = $(this).attr('data-coddisciplina');
                var codunidadeensino = $(this).attr('data-codunidadeensino');
                var griditem = $(this).siblings('.collapsible-body').find('.griditem');

                if (codhabilidade && coddisciplina && codbaseunidadeaprendizagem && codunidadeensino) {

                    new GCS().setObj({
                        type: 'GET',
                        contentType: 'text/html',
                        dataType: 'html',
                        url: urlGetItemMacro + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem + '&codhabilidade=' + codhabilidade + '&coddisciplina=' + coddisciplina + '&codunidadeensino=' + codunidadeensino,
                        success: function (data) {
                            griditem.html(data);
                            inicializacollapse();
                            bindOpcoesMacroDesafio(item);
                        }, error: function (data) {
                            console.log(data);
                        },
                        showLoad: false
                    }).executar();
                }
            }
        });
    }

    function abreModalItemMacro() {
        $('.itemmacrodesafio').off().click(function () {
            $('#cria-itemmacro').modal({ dismissible: false }).modal('open');
        });
    }

    function changeArquivo() {

        if (this.files.length > 0) {
            var type = this.files[0].type,
                nomeArquivo = $(this).val().toLowerCase().split('\\')[2],
                extension = nomeArquivo ? extension = nomeArquivo.substring(nomeArquivo.lastIndexOf('.') + 1) : '';

            if (this.files.length > 0) {
                var item = this.files[0];

                var id = this.id;

                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", "base64imagemCkeditorTemp");
                hiddenField.setAttribute("value", "base64imagemCkeditorTemp");

                var micro_macro = $(this).closest('form').attr('id') === 'frmCadastroMicro' ? 'micro' : 'macro';

                Helper.getBase64callback(item, function (base64, element) {

                    $('.btn-fixed').removeClass('hide');
                    addMediaMacro(item, micro_macro, base64, extension, id);
                    $('.anexa-img').val("")
                }, hiddenField);

            } else {
                $('.btn-fixed').addClass('hide');
            }
        } else {
            $('.btn-fixed').addClass('hide');
        }
    }

    function addMediaMacro(arquivo, micro_macro, base64, extension, id) {
        var tipoimagem = 1;
        var editor = micro_macro === 'micro' ? 'editormicro' : 'editormacro';
        if (micro_macro == 'micro' && id.length > 0) {
            if (id.indexOf("caminhoImagemFeedback_") != -1) {
                editor = "editor-micro-alternativa" + id.split("caminhoImagemFeedback_")[1];
                tipoimagem = 3;
            } else if (id.indexOf("caminhoImagemAlternativa_") != -1) {
                editor = "editor-micro" + id.split("caminhoImagemAlternativa_")[1];
                tipoimagem = 2;
            }
        }

        var data = {
            //arquivo: arquivo,
            extensao: extension,
            base64: base64,
            tipoimagem: tipoimagem
        };

        new GCS().setObj({
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            // contentType: false,
            url: '/BancoQuestao/UploadImagemQuestao',
            processData: true,
            data: { file: data },
            success: function (data) {

                if (data.status) {
                    CKEDITOR.instances[editor].insertHtml('<img src="' + data.url + '"></img>');
                } else {
                    Helper.OpenAlert({ title: "Erro ao carregar imagem", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            }, error: function (data) {
                CKEDITOR.instances.editormacro.insertHtml('<img src=""></img>');

            },
            showLoad: false
        }).executar();
    }

    function carregaParcialTabelaMacro() {
        //GET Tabela Macro desafio
        var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
        new GCS().setObj({
            type: 'GET',
            contentType: 'text/html',
            dataType: 'html',
            url: urlGetListaHabilidadeMacro + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem,
            success: function (data) {
                $('.input-title.macro').html(data);
                visualizaMacros();
                micros_macros();
            }
        }).executar();
    }

    function visualizaMacros() {
        $('#tabela-de-macros tbody tr .habilidade').off().click(function () {

            var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
            var codhabilidade = parseInt($(this).data("codhabilidade"));
            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlGetListaDescritorMacro + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem + '&codhabilidade=' + codhabilidade,
                success: function (data) {
                    $('#mostra-macro').html(data);
                    $('.collapsible').collapsible();
                    $('#mostra-macro').modal({ dismissible: false }).modal('open');
                    codhabilidadeMacro = codhabilidade;
                    Habilidade_Macro_get_items();
                }
            }).executar();
        });
    }

    function criarMacro() {
        $('.abre-modal-macro').off().click(function () {

            var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlCadastroMacro + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem,
                success: function (data) {
                    $('#cria-macro').html(data);
                    $('select').material_select();
                    $('#cria-macro').modal({ dismissible: false }).modal('open');
                    changes_criar_macro();
                    salvar_nova_macro();
                    FormValidations.init();
                }
            }).executar();
        });
    }

    function changes_criar_macro() {

        $('#Disciplina').change(function () {
            var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
            var coddisciplina = parseInt($(this).val());
            if (coddisciplina > 0) {
                new GCS().setObj({
                    type: 'GET',
                    url: urlGetHabilidadeMacroChange + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem + '&coddisciplina=' + coddisciplina,
                    success: function (data) {
                        var lista = data;
                        var id_elemento = 'Habilidade';
                        monta_select(lista, id_elemento);
                        salvar_nova_macro();
                    }
                }).executar();
            } else {
                $('#Habilidade option').remove();
                $('#Descritor option').remove();
            }
        });

        $('#Habilidade').change(function () {
            var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
            var coddisciplina = parseInt($('#Disciplina').val());
            var codhabilidade = parseInt($(this).val());
            new GCS().setObj({
                type: 'GET',
                url: urlGetDescritorMacroChange + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem + '&coddisciplina=' + coddisciplina + '&codhabilidade=' + codhabilidade,
                success: function (data) {
                    var lista = data;
                    var id_elemento = 'Descritor';
                    monta_select(lista, id_elemento);
                    salvar_nova_macro();
                }
            }).executar();
        });
    }

    function salvar_nova_macro() {
        $('#cria-macro .salvar').off().click(function () {
            if (Helper.validateCKEditor("editormacro")) {
                disabledComboBoxSelecionadosMacro(false);
                $('#Enunciado').val(CKEDITOR.instances.editormacro.getData());
                var form = new FormData($("#frmCadastroMacro")[0]),
                    action = $("#frmCadastroMacro").attr('action');
                var formValido = $('#frmCadastroMacro').valid();
                if (formValido) {
                    new GCS().setObj({
                        type: 'POST',
                        contentType: false,
                        url: action,
                        data: form,
                        success: function (data) {
                            if (data.status) {

                                Helper.OpenAlert({ title: JSON.parse($('#frmCadastroMacro input#coditem').val()) ? "Macro desafio alterado" : "Macro desafio criado", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                                $('#cria-macro').find('#coditem').val(data.coditem);
                                setTimeout(function () {
                                    $('#cria-macro a[href="#listagem-"]').closest('li').removeClass('disabled');
                                    $('#cria-macro a[href="#listagem-"]').click();

                                }, 200);
                                carregaParcialTabelaMacro();
                                ObterQuantidadeQuestoes();
                            } else {
                                Helper.OpenAlert({ title: "Erro ao salvar", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                            }
                        },
                        error: function (err) {
                            Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                        }

                    }).executar();
                }

                disabledComboBoxSelecionadosMacro(true);
            }
        });
    }

    function Habilidade_Macro_get_items() {

        $('.descritor-pai-macro').off().click(function () {
            if (!$(this).hasClass('active')) {
                var tabela = $(this).next().find('table tbody');
                var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
                var codhabilidade = codhabilidadeMacro;
                var coddescritor = parseInt($(this).data('coddescritor'));
                if (codhabilidade && coddescritor && codbaseunidadeaprendizagem) {
                    new GCS().setObj({
                        type: 'GET',
                        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                        processData: true,
                        showLoad: false,
                        url: urlGetDescritor_ITENS_Macro + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem + '&codhabilidade=' + codhabilidade + '&coddescritor=' + coddescritor,
                        success: function (data) {
                            if (data.status) {
                                var classe = 'item-descritor-macro';
                                montaListaDeItemsCollapsible(data.item, tabela, classe);
                            }
                            bindFunctions();
                            editar_item_descritor_Macro();
                            deletar_item_descritor_Macro();
                        }
                    }).executar();
                }
            }
        });
    }

    function Habilidade_Micro_get_items() {

        $('.descritor-pai-micro').off().click(function () {

            if (!$(this).hasClass('active')) {

                var tabela = $(this).next().find('table tbody');
                var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
                var codhabilidade = codhabilidadeMicro;
                var coddescritor = parseInt($(this).data('coddescritor'));
                if (codhabilidade && coddescritor && codbaseunidadeaprendizagem) {
                    new GCS().setObj({
                        type: 'GET',
                        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                        processData: true,
                        showLoad: false,
                        url: urlGetDescritor_ITENS_Micro + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem + '&codhabilidade=' + codhabilidade + '&coddescritor=' + coddescritor,
                        success: function (data) {
                            if (data.status) {
                                var classe = 'item-descritor-micro';
                                montaListaDeItemsCollapsible(data.item, tabela, classe);
                            }
                            bindFunctions();
                            editar_item_descritor_Micro();
                            deletar_item_descritor_Micro();
                        }
                    }).executar();
                }
            }
        });
    }

    function deletar_item_descritor_Macro() {

        $('.exclui-item-descritor-macro').off().click(function () {
            var elemento = $(this);
            Helper.OpenConfirm({
                title: "Deseja excluir?",
                icon: 'fa-exclamation-triangle',
                iconclass: 'satisfaction-yellow',
                msg: '',
                classtitle: 'font-preto',
                yes: function () {
                    confirmacao_deletar_item_descritor_Macro(elemento);
                    Helper.CloseConfirm();
                },
                no: function () { },
                textno: 'Cancelar',
                textsim: 'Excluir'
            });
        });
    }

    function deletar_item_descritor_Micro() {

        $('.exclui-item-descritor-micro').off().click(function () {

            var elemento = $(this);
            Helper.OpenConfirm({
                title: "Deseja excluir?",
                icon: 'fa-exclamation-triangle',
                iconclass: 'satisfaction-yellow',
                msg: '',
                classtitle: 'font-preto',
                yes: function () {
                    confirmacao_deletar_item_descritor_Micro(elemento);
                    Helper.CloseConfirm();
                },
                no: function () { },
                textno: 'Cancelar',
                textsim: 'Excluir'
            });
        });
    }

    function confirmacao_deletar_item_descritor_Macro(elemento) {

        var coditem = { coditem: parseInt(elemento.closest('tr').data('coditem')) };

        if (coditem) {
            new GCS().setObj({
                type: 'POST',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                processData: true,
                url: urlDeletar_ITENS_Macro,
                data: coditem,
                success: function (data) {
                    if (data.status) {
                        var coditem = data.coditem;
                        var items = $('.exclui-item-descritor-macro');
                        items.each(function () {
                            if (parseInt($(this).closest('tr').data('coditem')) === coditem) {
                                elemento.closest('tr').remove();
                            }
                        });
                    }
                }
            }).executar();
        }
    }

    function confirmacao_deletar_item_descritor_Micro(elemento) {
        var coditem = { coditem: parseInt(elemento.closest('tr').data('coditem')) };
        if (coditem) {
            new GCS().setObj({
                type: 'POST',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                processData: true,
                url: urlDeletar_ITENS_Micro,
                data: coditem,
                success: function (data) {
                    if (data.status) {
                        var coditem = data.coditem;
                        var items = $('.exclui-item-descritor-macro');
                        items.each(function () {
                            if (parseInt($(this).closest('tr').data('coditem')) === coditem) {
                                elemento.closest('tr').remove();
                            }
                        });
                    } else {
                        Helper.OpenAlert({ title: "Erro ao deletar item", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }
                }
            }).executar();
        }
    }

    function editar_item_descritor_Macro() {

        $('.editar-item-descritor-macro').off().click(function () {
            var coditem = parseInt($(this).closest('tr').data('coditem'));
            var codbaseunidadeaprendizagem = $('#codbaseunidadeaprendizagem').val();
            if (coditem) {
                new GCS().setObj({
                    type: 'GET',
                    contentType: 'text/html',
                    dataType: 'html',
                    url: urlEditar_ITENS_Macro + '?coditem=' + coditem + '&codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem,
                    success: function (data) {
                        $('#cria-macro').html('');
                        $('#cria-macro').html(data);
                        $('select').material_select();
                        $('#cria-macro').modal({ dismissible: false }).modal('open');
                        CKEDITOR.instances.editormacro.setData($('#Enunciado').val());
                        FormValidations.init();
                        bindFunctions();
                        salvar_nova_macro();
                    }
                }).executar();
            }
        });
    }

    function editar_item_descritor_Micro() {

        $('.editar-item-descritor-micro').off().click(function () {
            var coditem = parseInt($(this).closest('tr').data('coditem'));
            var codbaseunidadeaprendizagem = $('#codbaseunidadeaprendizagem').val();
            if (coditem) {
                new GCS().setObj({
                    type: 'GET',
                    contentType: 'text/html',
                    dataType: 'html',
                    url: urlEditar_ITENS_Micro + '?coditem=' + coditem + '&codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem,
                    success: function (data) {
                        try {
                            JSON.parse(data);
                            Materialize.toast("Não foi possível editar o item", 4000);
                        } catch (e) {
                            $('#cria-micro').html('');
                            $('#cria-micro').html(data);
                            $('select').material_select();
                            $('#cria-micro').modal({ dismissible: false }).modal('open');
                            FormValidations.init();
                            bindFunctions();
                            salvar_nova_micro();
                            popularEditarCamposMicro();
                        }
                    }
                }).executar();
            }
        });
    }

    function popularEditarCamposMicro() {
        $('#qtdOpcoesResposta')
            .val($('#qtdOpcoesRespostaEscolhida').val())
            .material_select();
    }

    function carregaParcialTabelaMicro() {
        //GET Tabela Micro desafio
        var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
        new GCS().setObj({
            type: 'GET',
            contentType: 'text/html',
            dataType: 'html',
            url: urlGetListaHabilidadeMicro + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem,
            success: function (data) {
                $('.input-title.micro').html(data);
                visualizaMicros();
                micros_macros();
            }
        }).executar();
    }


    function visualizaMicros() {
        $('#tabela-de-micros tbody tr .habilidade').off().click(function () {

            var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
            var codhabilidade = parseInt($(this).data("codhabilidade"));
            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlGetListaDescritorMicro + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem + '&codhabilidade=' + codhabilidade,
                success: function (data) {
                    $('#mostra-micro').html(data);
                    $('.collapsible').collapsible();
                    $('#mostra-micro').modal({ dismissible: false }).modal('open');
                    codhabilidadeMicro = codhabilidade;
                    Habilidade_Micro_get_items();
                }
            }).executar();
        });
    }

    function criarMicro() {
        $('.abre-modal-micro').off().click(function () {
            var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlCadastroMicro + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem,
                success: function (data) {
                    $('#cria-macro').html('');
                    $('#cria-micro').html(data);
                    $('select').material_select();
                    $('#cria-micro').modal({ dismissible: false }).modal('open');
                    changes_criar_micro();
                    salvar_nova_micro();
                    FormValidations.init();
                }
            }).executar();
        });
    }

    function changes_criar_micro() {

        $('#Disciplina').change(function () {

            var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
            var coddisciplina = parseInt($(this).val());
            if (coddisciplina > 0) {
                new GCS().setObj({
                    type: 'GET',
                    url: urlGetHabilidadeMacroChange + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem + '&coddisciplina=' + coddisciplina,
                    success: function (data) {
                        var lista = data;
                        var id_elemento = 'Habilidade';
                        monta_select(lista, id_elemento);
                        salvar_nova_macro();
                    }
                }).executar();

            } else {
                $('#Habilidade option').remove();
                $('#Descritor option').remove();
            }
        });

        $('#Habilidade').change(function () {

            var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
            var coddisciplina = parseInt($('#Disciplina').val());
            var codhabilidade = parseInt($(this).val());
            new GCS().setObj({
                type: 'GET',
                url: urlGetDescritorMacroChange + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem + '&coddisciplina=' + coddisciplina + '&codhabilidade=' + codhabilidade,
                success: function (data) {
                    var lista = data;
                    var id_elemento = 'Descritor';
                    monta_select(lista, id_elemento);
                    salvar_nova_macro();
                }
            }).executar();
        });


        $('#qtdOpcoesResposta').change(changeQtdOpcoesResposta);
    }

    function salvar_nova_micro() {
        $('#cria-micro .btn-salva-default').off().click(function () {
            if (Helper.validateCKEditor("editormicro")) {
                Helper.validarRespostasMicro().then(x => {
                    if (!x.includes(false)) {
                        disabledComboBoxSelecionadosMicro(false);
                        popularCamposOcultosMicro();
                        var $frm = $("#frmCadastroMicro"),
                            form = new FormData($frm[0]),
                            action = $frm.attr('action');
                        var formValido = $frm.valid();
                        if (formValido) {
                            if (Helper.equalAnswers(x)) {

                                new GCS().setObj({
                                    type: 'POST',
                                    contentType: false,
                                    url: action,
                                    data: form,
                                    success: function (data) {
                                        if (data.status) {
                                            Helper.OpenAlert({ title: JSON.parse($('#frmCadastroMicro input#coditem').val()) ? "Micro desafio alterado" : "Micro desafio criado", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });

                                            $('#cria-micro').find('#coditem').val(data.coditem);
                                            setTimeout(function () {
                                                $('#cria-micro a[href="#listagem-"]').closest('li').removeClass('disabled');
                                                $('#cria-micro a[href="#listagem-"]').click();

                                            }, 200);
                                            carregaParcialTabelaMicro();
                                            ObterQuantidadeQuestoes();
                                        } else {
                                            Helper.OpenAlert({ title: "Erro ao salvar", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                                        }
                                    },
                                    error: function (err) {
                                        Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                                    }

                                }).executar();
                            } else {
                                Helper.OpenAlert({ title: "Não é permitido respostas iguais.", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                            }
                        }

                        disabledComboBoxSelecionadosMicro(true);
                    }
                });
            }

        });
    }

    function popularCamposOcultosMicro() {

        //Percorrer todos os CKEditors de alternativas
        $('.questao-unitario').each(function () {
            var ckAlternativa = $(this).find('.alternativa > div[id*="cke_editor-micro"]'),
                ckFeedback = $(this).find('.feedback > div[id*="cke_editor-micro"]');

            //Seta o valor de cada CKEDItor de alternativa no input[type="hidden"] de descrição correspondente
            $(this).find('.descricao').val(CKEDITOR.instances[ckAlternativa.attr('id').replace('cke_', '')].getData());

            //Seta o valor de cada CKEDItor de feedback no input[type="hidden"] de justificativa correspondente
            $(this).find('.justificativa').val(CKEDITOR.instances[ckFeedback.attr('id').replace('cke_', '')].getData());
        });

        //Setar o valor do CKEDItor de Enunciado no input[type="hidden"] de enunciado
        $('#frmCadastroMicro #Enunciado').val(CKEDITOR.instances.editormicro.getData());
    }

    // #endregion

    function monta_select(lista, id_elemento) {

        var html = '';
        for (var i = 0; i < lista.length; i++) {
            var elementoLista = lista[i];
            html += '<option value="' + elementoLista.Value + '">' + elementoLista.Text + '</option>';
        }
        $('#' + id_elemento + ' option').remove();
        $('#' + id_elemento).append(html);
        $('select').material_select();
    }

    function montaListaDeItemsCollapsible(data, tabela, classe) {

        var html = '';

        for (var i = 0; i < data.length; i++) {

            html += ` <tr data-coditem="${data[i].coditem}">
                        <td>${data[i].coditem}</td>
                        <td>${data[i].descricao}</td>
                        <td class="right"><i class="fas fa-pen-square editar-${classe}" aria-hidden="true" title="Editar"></i> <i class="fa fa-trash-o fas fa-trash-alt delete exclui-${classe}" aria-hidden="true" title="Excluir"></i></td>
                    </tr>`;
        }

        tabela.find('tr').remove();
        tabela.append(html);
        $('.collapsible').collapsible();
        editar_item_descritor_Macro();
    }


    function ativaModalGuiaEstudante() {
        $('.guia-estudos-scorm').off().click(function () {
            var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
            var scorm = true
            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlGetGuiaEstudoOnline + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem + '&scorm=' + scorm,
                success: function (data) {
                    $('#cria-guia-estudo').html('');
                    $('#cria-guia-estudo').html(data);
                    $('select').material_select();
                    $('#cria-guia-estudo').modal({ dismissible: false }).modal('open');
                    bindFunctions();
                    FormValidations.init();
                    AddUnidadeOnline();
                    refatoraOnline();
                    excluirBlocoOnline();
                }
            }).executar();

        });

        $('.guia-estudos').off().click(function () {

            var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
            var scorm = false;
            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlGetGuiaEstudoOnline + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem + '&scorm=' + scorm,
                success: function (data) {
                    $('#cria-guia-estudo').html('');
                    $('#cria-guia-estudo').html(data);
                    $('select').material_select();
                    $('#cria-guia-estudo').modal({ dismissible: false }).modal('open');
                    bindFunctions();
                    FormValidations.init();
                    AddUnidadeOnline();
                    refatoraOnline();
                    excluirBlocoOnline();
                }
            }).executar();
        });

        $('.guia-estudos-hibrido').off().click(function () {

            var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlGetGuiaEstudoHibrido + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem,
                success: function (data) {
                    $('#cria-guia-estudo-hibrido').html('');
                    $('#cria-guia-estudo-hibrido').html(data);
                    $('select').material_select();
                    $('#cria-guia-estudo-hibrido').modal({ dismissible: false }).modal('open');
                    FormValidations.init();

                }
            }).executar();
        });
    }

    //function verificaNumeroDeUnidades() {
    //    var qtdRegistros = $('#tabela-de-guias-hibrido tbody tr').length + 1;
    //    $('.label-nome-unidade').text('Unidade ' + qtdRegistros);

    //    var linhasTabelaUnidade = $('#tabela-de-guias-hibrido tbody tr');

    //    linhasTabelaUnidade.each(function (i, ele) {

    //        $(ele).find('td:first').text('Unidade ' + (i+1));

    //    });
    //    CKEDITOR.instances.editorguiaestudohibrido0.setData('');

    //    $('.nome-unidade').val('').focus();
    //}

    function AddUnidadeOnline() {
        $('.add-guia-online').off().click(function () {

            var html = '';
            var blocounidades = $('.bloco-unidades');
            var qtd = $('.bloco-refatora').length;

            html += ` <div class="bloco-refatora">
                <input type="hidden" name="Unidades[0].base64Unidade" class="refatora-nome"/>
                <input type="hidden" name="Unidades[0].ExtensaoUnidade" class="refatora-nome"/>
                <input type="hidden" name="Unidades[0].NomeArquivoUnidade" class="refatora-nome"/>
                <input type="hidden" name="Unidades[0].codconteudounidade" class="refatora-nome"/>

                
                <input type="text" class="input-title-div refatora-nome" name="Unidades[0].NomeUnidade" value="Unidade ${qtd + 1}" readonly="readonly"/>

                <div class="file-field input-field">
                    <div class="btn">
                        <span><i class="fa fa-file-text-o" aria-hidden="true"></i> Upload</span>

                        <input type="file" class="input-title-div refatora-nome" name="Unidades[0].CaminhoUnidade" accept = "image/jpeg/pdf" placeholder = "Anexar arquivo" required/>
                    </div>
                    <span class="excluir-bloco">Excluir</span>
                    <div class="file-path-wrapper">
                        
                        <input type="text" class="file-path validate refatora-nome" name="Unidades[0].CaminhoUnidade" placeholder = "Anexar arquivo" required/>
                    </div>
                </div>
            </div>`;

            blocounidades.append(html);
            excluirBlocoOnline();
            bindFunctions();
            FormValidations.init();
        });
    }

    function salvaGuiaOnline() {
        $('.salvar-guia-online').off().click(function () {

            var form = new FormData($("#frmCadastroGuiaOnline")[0]);
            var formValido = $('#frmCadastroGuiaOnline').valid();

            if (formValido) {
                new GCS().setObj({
                    type: 'POST',
                    contentType: false,
                    url: urlSalvaGuiaEstudoOnline,
                    data: form,
                    success: function (data) {
                        if (data.status) {
                            $('.modal').modal();
                            $('#cria-guia-estudo').modal('close');
                            Helper.OpenAlert({ title: "Salvo com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                        } else {
                            Helper.OpenAlert({ title: "Erro ao salvar", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                        }
                        bindFunctions();
                        FormValidations.init();
                    }
                }).executar();
            }
        });
    }

    function excluirBlocoOnline() {
        $('#frmCadastroGuiaOnline .excluir-bloco').off().click(function () {
            var elemento = $(this);
            Helper.OpenConfirm({
                title: "Deseja excluir?",
                icon: 'fa-exclamation-triangle',
                iconclass: 'satisfaction-yellow',
                msg: '',
                classtitle: 'font-preto',
                yes: function () {
                    confirmacaoExcusaoGuiaOnline(elemento);
                    Helper.CloseConfirm();
                },
                no: function () { },
                textno: 'Cancelar',
                textsim: 'Excluir'
            });
        });
    }

    function confirmacaoExcusaoGuiaOnline(elemento) {
        elemento.closest('.bloco-refatora').remove();
    }

    function refatoraHibrido() {

        $('#frmCadastroGuiaHibrido input[name="Texto"]').val(ValidaTextoCKEditor(CKEDITOR.instances.editorguiaestudohibrido0.getData()));
        $('#frmCadastroGuiaHibrido input[name="NomeUnidade"]').val($('.nome-unidade').val().trim());
        salvaGuiaHibrido();
        if ($('.nome-unidade').val() !== '') {
            if (CKEDITOR.instances.editorguiaestudohibrido0.getData() !== '') {
                return true;
            } else {
                Helper.OpenAlert({ title: "Editor de texto está vazio.", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                return false;
            }
        } else {
            Helper.OpenAlert({ title: "Nome da Unidade está vazio.", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            return false;
        }
    }

    function salvaGuiaHibrido() {
        $('.salvar-guia-hibrido').off().click(function () {
            $('.salvar-guia-hibrido').off('click');

            var verificacao = refatoraHibrido();
            if (verificacao) {
                var form = new FormData($("#frmCadastroGuiaHibrido")[0]);
                var formValido = true;
                if ($('#frmCadastroGuiaHibrido').val()) {
                    formValido = $('#frmCadastroGuiaHibrido').valid();
                }

                if (formValido) {
                    new GCS().setObj({
                        type: 'POST',
                        contentType: false,
                        dataType: 'html',
                        url: urlSalvarGuiaEstudoHibrido,
                        data: form,
                        success: function (data) {
                            try {
                                JSON.parse(data);
                                Helper.OpenAlert({ title: "Erro ao salvar", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });

                            } catch (e) {
                                TabelasParciais();
                                InicializaOperacoesPadrao();
                                FormValidations.init();
                                Helper.OpenAlert({ title: "Salvo com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                                FormValidations.init();
                                $("#cria-guia-estudo-hibrido").modal('close');
                            }
                        }
                    }).executar();
                }
            }
        });
    }

    function ValidaTextoCKEditor(body) {


        var find = '“';
        var re = new RegExp(find, 'g');
        var str = body.replace(re, '"');

        find = '”';
        re = new RegExp(find, 'g');
        str = str.replace(re, '"');

        find = 'ç';
        re = new RegExp(find, 'g');
        str = str.replace(re, 'ç');

        find = 'ã';
        re = new RegExp(find, 'g');
        str = str.replace(re, 'ã');

        find = 'é';
        re = new RegExp(find, 'g');
        str = str.replace(re, 'é');

        find = 'í';
        re = new RegExp(find, 'g');
        str = str.replace(re, 'í');

        find = 'à';
        re = new RegExp(find, 'g');
        str = str.replace(re, 'à');

        find = 'õ';
        re = new RegExp(find, 'g');
        str = str.replace(re, 'õ');

        find = 'ê';
        re = new RegExp(find, 'g');
        str = str.replace(re, 'ê');

        find = '-lo';
        re = new RegExp(find, 'g');
        str = str.replace(re, '-lo');

        find = 'ó';
        re = new RegExp(find, 'g');
        str = str.replace(re, 'ó');

        find = 'é';
        re = new RegExp(find, 'g');
        str = str.replace(re, 'é');

        find = 'ê';
        re = new RegExp(find, 'g');
        str = str.replace(re, 'ê');

        find = 'á';
        re = new RegExp(find, 'g');
        str = str.replace(re, 'á');

        find = 'ú';
        re = new RegExp(find, 'g');
        str = str.replace(re, 'ú');

        find = 'í';
        re = new RegExp(find, 'g');
        str = str.replace(re, 'í');

        find = 'õ';
        re = new RegExp(find, 'g');
        str = str.replace(re, 'õ');

        find = 'ç';
        re = new RegExp(find, 'g');
        str = str.replace(re, 'ç');

        find = 'ó';
        re = new RegExp(find, 'g');
        str = str.replace(re, 'ó');

        find = '–';
        re = new RegExp(find, 'g');
        str = str.replace(re, '-');

        find = ' ';
        re = new RegExp(find, 'g');
        str = str.replace(re, ' ');

        find = ' ';
        re = new RegExp(find, 'g');
        str = str.replace(re, ' ');

        find = '’';
        re = new RegExp(find, 'g');
        str = str.replace(re, '\'');

        return str;
    }

    function deletarGuiaOnline() {

        $('.excluir-unidade-online').off().click(function () {
            var elemento = $(this);
            Helper.OpenConfirm({
                title: "Deseja excluir?",
                icon: 'fa-exclamation-triangle',
                iconclass: 'satisfaction-yellow',
                msg: '',
                classtitle: 'font-preto',
                yes: function () {
                    confirmacaoExclusaoGuiaOnline(elemento);
                    Helper.CloseConfirm();
                },
                no: function () { },
                textno: 'Cancelar',
                textsim: 'Excluir'
            });
        });
    }

    function confirmacaoExclusaoGuiaOnline(elemento) {

        var codconteudounidade = parseInt(elemento.closest('tr').data('codconteudo'));
        if (codconteudounidade) {
            new GCS().setObj({
                type: 'GET',
                url: urlDeletarUnidadeGuiaEstudoOnline + '?codconteudo=' + codconteudounidade,
                success: function (data) {
                    if (data.status) {
                        elemento.closest('tr').remove();

                        Helper.OpenAlert({ title: "Excluído com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                    } else {
                        Helper.OpenAlert({ title: "Não foi possível excluir", msg: data.msg, classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }
                }
            }).executar();
        }
    }

    function deletarUnidadeHibrido() {

        $('.excluir-unidade-hibrido').off().click(function () {
            var elemento = $(this);
            Helper.OpenConfirm({
                title: "Deseja excluir?",
                icon: 'fa-exclamation-triangle',
                iconclass: 'satisfaction-yellow',
                msg: '',
                classtitle: 'font-preto',
                yes: function () {
                    confirmacaoExcusaoUnidadeHibrido(elemento);
                    Helper.CloseConfirm();
                },
                no: function () { },
                textno: 'Cancelar',
                textsim: 'Excluir'
            });
        });
    }

    function editarUnidadeHibrido() {
        $('.editar-unidade-hibrido').off().click(function () {
            var elemento = $(this);
            var codconteudounidade = parseInt(elemento.closest('tr').data('codconteudounidade'));
            var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlGetGuiaEstudoHibrido + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem + (codconteudounidade ? '&codconteudounidade=' + codconteudounidade : ''),
                success: function (data) {
                    if (Helper.isJSON(data)) {
                        Helper.OpenAlert({ title: "Não é possível editar", msg: JSON.parse(data).msg, classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    } else {
                        $('#cria-guia-estudo-hibrido').html(data);
                        $('select').material_select();
                        $('#cria-guia-estudo-hibrido').modal({ dismissible: false }).modal('open');
                        InicializaOperacoesPadrao();
                        confirmaLinkexistente();
                        FormValidations.init();
                        //loadPearson($('#cria-guia-estudo-hibrido'));
                        if (JSON.parse($("#estaVinculadoUA").val().toLowerCase())) {
                            //$("#cria-guia-estudo-hibrido div *").prop("disabled", true);
                            /*for (var instance in CKEDITOR.instances) {
                                if (instance.toUpperCase().indexOf("editorguiaestudohibrido0") > -1) {
                                    CKEDITOR.instances[instance].document.getBody().setAttribute('contenteditable', false);
                                }
                            }*/
                        } else {
                            //$("#cria-guia-estudo-hibrido div *").prop("disabled", false);

                            /*for (var instance in CKEDITOR.instances) {
                                if (instance.toUpperCase().indexOf("editorguiaestudohibrido0") > -1) {
                                    CKEDITOR.instances[instance].document.getBody().setAttribute('contenteditable', true);
                                }
                            }*/
                        }
                    }

                }
            }).executar();
        });
    }

    function confirmacaoExcusaoUnidadeHibrido(elemento) {

        var codconteudounidade = parseInt(elemento.closest('tr').data('codconteudounidade'));
        if (codconteudounidade) {
            new GCS().setObj({
                type: 'GET',
                url: urlDeletarUnidadeGuiaEstudoHibrido + '?codconteudounidade=' + codconteudounidade,
                success: function (data) {
                    if (data.status) {
                        elemento.closest('tr').remove();
                        Helper.OpenAlert({ title: "Excluído com sucesso!", msg: data.msg, classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                    } else {
                        Helper.OpenAlert({ title: "Não foi possível excluir", msg: data.msg, classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }
                }
            }).executar();
        }
    }

    function salvaInfografico() {
        $('.salvar-infografico').off().click(function () {
            $('.salvar-infografico').off('click');

            var infografico = $('#caminhoinfo[type="file"]').val();
            if (infografico) {
                var form = new FormData($("#frmCadastroInfografico")[0]);
                var formValido = $('#frmCadastroInfografico').valid();
                if (formValido) {
                    new GCS().setObj({
                        type: 'POST',
                        contentType: false,
                        dataType: 'html',
                        url: urlSalvarInfografico,
                        data: form,
                        success: function (data) {
                            var retorno = JSON.parse(data);
                            if (retorno.status) {
                                $('[name="caminhoinfo"], #base64infografico, #extensaoinfografico').val('');
                                $('select').material_select();
                                TabelasParciais();
                                InicializaOperacoesPadrao();
                                FormValidations.init();
                                $('#cria-infográfico').modal('close');
                                Helper.OpenAlert({ title: "Salvo com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                                $('#cria-infográfico').modal('close');
                            } else {
                                Helper.OpenAlert({ title: "Erro ao salvar", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                            }
                            FormValidations.init();
                        }
                    }).executar();
                }
            } else {
                Helper.OpenAlert({ title: "Um arquivo deve ser anexado.", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            }
        });
    }

    function deletarInfografico() {

        $('.deletar-infografico').off().click(function () {
            var elemento = $(this);
            Helper.OpenConfirm({
                title: "Deseja excluir?",
                icon: 'fa-exclamation-triangle',
                iconclass: 'satisfaction-yellow',
                msg: '',
                classtitle: 'font-preto',
                yes: function () {
                    confirmacaoExcusaoInfografico(elemento);
                    Helper.CloseConfirm();
                    InicializaOperacoesPadrao();
                },
                no: function () { },
                textno: 'Cancelar',
                textsim: 'Excluir'
            });
        });
    }

    function confirmacaoExcusaoInfografico(elemento) {

        var codconteudo = parseInt(elemento.closest('tr').data('codconteudo'));
        if (codconteudo) {
            new GCS().setObj({
                type: 'GET',
                url: urlDeletarInfografico + '?codconteudo=' + codconteudo,
                success: function (data) {
                    if (data.status) {
                        elemento.closest('tr').remove();
                        Helper.OpenAlert({ title: "Excluído com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                    } else {
                        Helper.OpenAlert({ title: "Não foi possível excluir", msg: data.msg, classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }
                }
            }).executar();
        }
    }

    function salvaDestaques() {
        $('.salvar-destaques').off().click(function () {
            $('.salvar-destaques').off('click');

            var destaques = $('#caminhodestaques[type="file"]').val();
            if (destaques) {
                var form = new FormData($("#frmCadastroDestaques")[0]);
                var formValido = $('#frmCadastroDestaques').valid();
                if (formValido) {
                    new GCS().setObj({
                        type: 'POST',
                        contentType: false,
                        dataType: 'html',
                        url: urlSalvarDestaques,
                        data: form,
                        success: function (data) {
                            var retorno = JSON.parse(data);
                            if (retorno.status) {
                                $('[name="caminhodestaques"], #base64destaques, #extensaodestaques').val('');
                                $('select').material_select();
                                TabelasParciais();
                                InicializaOperacoesPadrao();
                                FormValidations.init();
                                $('#cria-destaques').modal('close');
                                Helper.OpenAlert({ title: "Salvo com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                                $('#cria-destaques').modal('close');
                            } else {
                                Helper.OpenAlert({ title: "Erro ao salvar", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                            }
                            FormValidations.init();
                        }
                    }).executar();
                }
            } else {
                Helper.OpenAlert({ title: "Um arquivo deve ser anexado.", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            }
        });
    }

    function deletarDestaques() {

        $('.deletar-destaques').off().click(function () {
            var elemento = $(this);
            Helper.OpenConfirm({
                title: "Deseja excluir?",
                icon: 'fa-exclamation-triangle',
                iconclass: 'satisfaction-yellow',
                msg: '',
                classtitle: 'font-preto',
                yes: function () {
                    confirmacaoExcusaoDestaques(elemento);
                    Helper.CloseConfirm();
                    InicializaOperacoesPadrao();
                },
                no: function () { },
                textno: 'Cancelar',
                textsim: 'Excluir'
            });
        });
    }

    function confirmacaoExcusaoDestaques(elemento) {

        var codconteudo = parseInt(elemento.closest('tr').data('codconteudo'));
        if (codconteudo) {
            new GCS().setObj({
                type: 'GET',
                url: urldeletarDestaques + '?codconteudo=' + codconteudo,
                success: function (data) {
                    if (data.status) {
                        elemento.closest('tr').remove();
                        Helper.OpenAlert({ title: "Excluído com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                    } else {
                        Helper.OpenAlert({ title: "Não foi possível excluir", msg: data.msg, classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }
                }
            }).executar();
        }
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

    //TabelaGet
    function abreModalGuiaEstudanteHibrido() {
        $('.abre-modal-guiahibrido').off().click(function () {
            var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlGetGuiaEstudoHibrido + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem,
                success: function (data) {
                    $('#cria-guia-estudo-hibrido').html(data);
                    $('select').material_select();
                    $('#cria-guia-estudo-hibrido').modal({ dismissible: false }).modal('open');
                    InicializaOperacoesPadrao();
                    confirmaLinkexistente();
                    FormValidations.init();
                    //loadPearson($('#cria-guia-estudo-hibrido'));
                }
            }).executar();

        });
    }

    //function loadPearson($localescrita) {
    //    var str = `
    //    <form id="pearsonForm" target="frmPearson" action="http://saolucas.bv3.digitalpages.com.br/user_session/authentication_gateway" method="post">
    //        <input name="login" type="hidden" value="123456" />
    //        <input name="token" type="hidden" id="token" value="932117cb6929911e47b1f918665cfcae">
    //    </form>
    //    <iframe style="width: 900px; z-index: 99999999; position: fixed; display: none;" name="frmPearson">
    //    </iframe>`;
    //    $localescrita.append(str);

    //    var form = document.getElementById("pearsonForm");
    //    form.style.display = "none";
    //    form.submit();
    //}

    function confirmaLinkexistente() {

        var botaoLink = $('.referencia button.btn');
        setInterval(function () {
            var campoLink = $('#referenciabibliografica').val();
            if (campoLink) {
                botaoLink.removeClass('hide');
            } else {
                botaoLink.addClass('hide');
            }
        }, 500);
        abreLink();
    }

    function abreLink() {
        $('.referencia button.btn').off().click(function () {
            var linkvalido = $('#referenciabibliografica').valid();
            if (linkvalido) {
                var valorLink = $('#referenciabibliografica').val();
                if (valorLink.indexOf('minhabiblioteca.com.br') > -1) {
                    minhaBibiotecaVirtual(valorLink);
                } else if (valorLink.indexOf('bv4') > -1) {
                    bibliotecaPerson(valorLink);
                } else {
                    abreLinkNovaAba(valorLink);
                }
            }
        });
    }

    function bibliotecaPerson(link) {

        new GCS().setObj({
            type: 'POST',
            url: urlBibliotecaPerson,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            processData: true,
            data: {
                link: link
            },
            success: function (data) {
                window.open(`${data.Url}`, null, 'height=700,width=900,status=yes,toolbar=no,scrollbars=yes,menubar=no,location=no');
            }
        }).executar();
    }

    function minhaBibiotecaVirtual(link) {

        new GCS().setObj({
            type: 'POST',
            url: urlMinhaBibliotecaVirtual,// + '?link=' + link,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            processData: true,
            data: {
                link: link
            },
            success: function (data) {
                if (data.status) {
                    $.globalEval(data.msg);
                } else {
                    Helper.OpenAlert({ title: "Ops", msg: 'Falha na autenticação', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            }
        }).executar();
    }

    function abreLinkNovaAba(link) {
        window.open(link, '_blank', 'width=800, height=600');
    }

    function abreModalGuiaEstudanteOnline() {
        $('.abre-modal-guia-estudo-online').off().click(function () {

            var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
            var scorm = false;
            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlGetGuiaEstudoOnline + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem + '&scorm=' + scorm,
                success: function (data) {
                    $('#cria-guia-estudo').html(data);
                    $('select').material_select();
                    $('#cria-guia-estudo').modal({ dismissible: false }).modal('open');
                    InicializaOperacoesPadrao();
                    bindFunctions();
                    FormValidations.init();
                }
            }).executar();
        });
    }

    function abreModalGuiaEstudanteOnlineScorm() {
        $('.abre-modal-guia-estudo-scorm').off().click(function () {

            var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
            var scorm = true;
            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlGetGuiaEstudoOnline + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem + '&scorm=' + scorm,
                success: function (data) {
                    $('#cria-guia-estudo').html(data);
                    $('select').material_select();
                    $('#cria-guia-estudo').modal({ dismissible: false }).modal('open');
                    bindFunctions();
                    InicializaOperacoesPadrao();
                    bindFunctions();
                    FormValidations.init();
                    if (JSON.parse($("#scorm").val())) {
                        document.querySelector("#frmCadastroGuiaOnline .titulo-modal-default-sl").innerHTML += " Scorm";
                        document.querySelector("#frmCadastroGuiaOnline .sl-titulo-default").innerHTML += " Scorm";
                        document.querySelector("#frmCadastroGuiaOnline #CaminhoUnidade").accept = ".zip,.rar,.tar,tar.gz,.7z";
                    }
                }
            }).executar();
        });
    }

    function abreModalInfografico() {
        $('.abre-modal-infografico').off().click(function () {

            var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlGetInfografico + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem,
                success: function (data) {
                    $('#cria-infográfico').html(data);
                    $('select').material_select();
                    $('#cria-infográfico').modal({ dismissible: false }).modal('open');
                    bindFunctions();
                    InicializaOperacoesPadrao();
                    FormValidations.init();
                }
            }).executar();
        });
    }

    function abreModalDestaques() {
        $('.abre-modal-destaques').off().click(function () {

            var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlGetDestaquesModal + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem,
                success: function (data) {
                    $('#cria-destaques').html(data);
                    $('select').material_select();
                    $('#cria-destaques').modal({ dismissible: false }).modal('open');
                    bindFunctions();
                    InicializaOperacoesPadrao();
                    FormValidations.init();
                }
            }).executar();
        });
    }
    // #region Chamada das parciais principais da tela "Guias de estudo (3)", "Infográfico", "Videos"
    function TabelasParciais() {

        var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());

        if ($('#codmodalidade').val() === '1') {
            carregaParcialTabelaGuiaHibrido(codbaseunidadeaprendizagem);
            carregaParcialTabelaVideos(codbaseunidadeaprendizagem);
            carregaParcialTabelaDestaques(codbaseunidadeaprendizagem);
            carregaParcialTabelaInfografico(codbaseunidadeaprendizagem);

        } else if ($('#codmodalidade').val() === '2') {

            carregaParcialTabelaGuiaHibrido(codbaseunidadeaprendizagem);
            //carregaParcialTabelaGuiaOnline__pdf(codbaseunidadeaprendizagem);
            //carregaParcialTabelaGuiaOnline__scorm(codbaseunidadeaprendizagem);
            carregaParcialTabelaInfografico(codbaseunidadeaprendizagem);
            carregaParcialTabelaVideos(codbaseunidadeaprendizagem);
            carregaParcialTabelaDestaques(codbaseunidadeaprendizagem);
        }

        function carregaParcialTabelaGuiaHibrido(codbaseunidadeaprendizagem) {

            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlGetListaTabelaInicialGuiaHibrido + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem,
                success: function (data) {
                    $('.--guia-estudo-hibrido').html(data);
                    document.querySelectorAll(".texto-guia-estudo").forEach(x => {
                        x.innerText = Helper.removeHTMLTagFromText(x.innerText);
                    });

                    InicializaOperacoesPadrao();
                }
            }).executar();
        }

        function carregaParcialTabelaGuiaOnline__pdf(codbaseunidadeaprendizagem) {

            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlGetListaTabelaGuiaEstudoOnline + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem,
                success: function (data) {
                    $('.--guia-estudo').html(data);
                    InicializaOperacoesPadrao();
                }
            }).executar();
        }

        function carregaParcialTabelaGuiaOnline__scorm(codbaseunidadeaprendizagem) {


            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlGetListaTabelaGuiaEstudoScorm + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem,
                success: function (data) {
                    $('.--guia-estudo-scorm').html(data);
                    InicializaOperacoesPadrao();
                }
            }).executar();
        }

        function carregaParcialTabelaInfografico(codbaseunidadeaprendizagem) {

            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlGetListaTabelaInfografico + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem,
                success: function (data) {
                    $('.--infografico').html(data);
                    InicializaOperacoesPadrao();
                }
            }).executar();
        }

        function carregaParcialTabelaVideos(codbaseunidadeaprendizagem) {

            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlGetListaVideo + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem,
                success: function (data) {

                    $('.--videos').html(data);
                    InicializaOperacoesPadrao();
                }
            }).executar();
        }

        function carregaParcialTabelaDestaques(codbaseunidadeaprendizagem) {

            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlGetDestaques + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem,
                success: function (data) {
                    $('.--destaques').html(data);
                    InicializaOperacoesPadrao();
                }
            }).executar();
        }
    }

    // #endregion

    // #region Inicializa Operacoes Das TabelasParciais na tela

    function InicializaOperacoesPadrao() {
        videoVimeo();
        excluiVideo();
        abreModalVideo();
        editarVideo();
        salvaUrlVideo();

        abreModalGuiaEstudanteHibrido();
        abreModalGuiaEstudanteOnline();
        abreModalGuiaEstudanteOnlineScorm();

        salvaGuiaOnline();
        deletarGuiaOnline();

        salvaGuiaHibrido();
        deletarUnidadeHibrido();
        editarUnidadeHibrido();

        abreModalInfografico();
        salvaInfografico();
        deletarInfografico();

        abreModalDestaques();
        salvaDestaques();
        deletarDestaques();
        Helper.addClassScroll();
    }
    // #endregion

    //function criarNovoMacrodesafio() {
    //    $('#cria-macro .griditem .itemmacrodesafio').off().click(function () {
    //        debugger;
    //        let coditem = params.data["coditem"];
    //        if (coditem) {
    //            var elemento = $(this);
    //            var codcurso = parseInt(elemento.closest('li.active').find('.itemmacro').data('codcurso'));
    //            var curso = elemento.closest('li.active').find('.itemmacro').data('curso');
    //            var codhabilidade = parseInt(elemento.closest('li.active').find('.itemmacro').data('codhabilidade'));
    //            var habilidade = elemento.closest('li.active').find('.itemmacro').text();
    //            var coddisciplina = parseInt(elemento.closest('li.active').find('.itemmacro').data('coddisciplina'));
    //            var disciplina = elemento.closest('li.active').find('.itemmacro').data('disciplina');

    //            var combo = {
    //                curso: curso.trim(),
    //                codcurso: codcurso,
    //                codhabilidade: codhabilidade,
    //                habilidade: habilidade.trim(),
    //                coddisciplina: coddisciplina,
    //                disciplina: disciplina.trim()
    //            };

    //            new GCS().setObj({
    //                type: 'GET',
    //                contentType: 'text/html',
    //                dataType: 'html',
    //                url: urlEditarMacro + '?coditem=' + coditem,
    //                success: function (data) {
    //                    if (!Helper.isJSON(data)) {
    //                        debugger;
    //                        $('#cria-macro').html(data);
    //                        $('select').material_select();
    //                        $('#cria-macro').modal({ dismissible: false }).modal('open');
    //                        setaValorSelectFixoMacro(combo);
    //                        salvar_nova_macro();
    //                        FormValidations.init();
    //                        unidadesAvaliativas.carregaImagemCKeditor();
    //                    } else {
    //                        Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
    //                    }

    //                },
    //                error: function (err) {
    //                    Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
    //                }
    //            }).executar();
    //        }
    //    });
    //}

    function alterarMacroDesafio(params) {
        let coditem = params.data["coditem"];
        if (coditem) {
            var elemento = $(this);
            var codcurso = parseInt(elemento.closest('li.active').find('.itemmacro').data('codcurso'));
            var curso = elemento.closest('li.active').find('.itemmacro').data('curso');
            var codhabilidade = parseInt(elemento.closest('li.active').find('.itemmacro').data('codhabilidade'));
            var habilidade = elemento.closest('li.active').find('.itemmacro').text();
            var coddisciplina = parseInt(elemento.closest('li.active').find('.itemmacro').data('coddisciplina'));
            var disciplina = elemento.closest('li.active').find('.itemmacro').data('disciplina');

            var combo = {
                curso: curso.trim(),
                codcurso: codcurso,
                codhabilidade: codhabilidade,
                habilidade: habilidade.trim(),
                coddisciplina: coddisciplina,
                disciplina: disciplina.trim()
            };

            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlEditarMacro + '?coditem=' + coditem,
                success: function (data) {
                    if (!Helper.isJSON(data)) {

                        $('#cria-macro').html(data);
                        $('select').material_select();
                        $('#cria-macro').modal({ dismissible: false }).modal('open');
                        setaValorSelectFixoMacro(combo);
                        salvar_nova_macro();
                        FormValidations.init();
                        unidadesAvaliativas.carregaImagemCKeditor();
                        validaArquivoTemplateMacro();
                        setTimeout(function () {
                            $('#cria-macro a[href="#cadastro-"]').click();
                        }, 200);
                        $('#cria-macro a[href="#listagem-"]').closest('li').removeClass('disabled');
                        bindTabGetMatrizEditMacro();

                        $('ul.tabs').tabs();

                        $('.status-desativado').remove();
                    } else {
                        Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }

                }
            }).executar();
        }
    }

    function excluirQuestao(params) {
        let codItem = params.data["coditem"];
        let item = params.data["item"];
        if (codItem) {
            Helper.OpenConfirm({
                title: "Atenção!",
                msg: "<strong>Deseja realmente realizar a exclusão?</strong>",
                classtitle: "font-vermelho",
                yes: function () {
                    new GCS().setObj({
                        type: 'GET',
                        contentType: 'text/html',
                        url: `/BancoQuestao/ExcluirQuestao?codItem=${codItem}`,
                        success: function (data) {
                            if (data && data.status) {
                                removeItemFromTable(codItem, item);
                                if (item.parent().find(".collapsible-body").length > 0)
                                    item.parent().find(".collapsible-body")[0].style.display = "none";

                                if (item.hasClass("active"))
                                    item.removeClass("active");

                                if (item.parent().hasClass("active"))
                                    item.parent().removeClass("active");

                                ObterQuantidadeQuestoes();
                            } else {
                                Helper.OpenAlert({ title: "Não foi possível excluir", msg: data.msg, classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                            }

                        },
                        error: function (err) {
                            Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                        }
                    }).executar();
                    Helper.CloseConfirm();
                },
                no: function () {
                    Helper.CloseConfirm();
                }
            });

        }
    }

    function removeItemFromTable(codItem, item) {
        let tr = item.parent().find("tr");
        if (tr && tr.length > 0) {
            let datasetCodItem = tr.toArray().filter(x => x.dataset.coditem == codItem);
            if (datasetCodItem && datasetCodItem.length > 0) {
                datasetCodItem[0].innerHTML = "";
            }
        }
    }

    function criarNovoMacroDesafio() {
        var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());

        var elemento = $(this);
        var codcurso = parseInt(elemento.closest('li.active').find('.itemmacro').data('codcurso'));
        var curso = elemento.closest('li.active').find('.itemmacro').data('curso');
        var codhabilidade = parseInt(elemento.closest('li.active').find('.itemmacro').data('codhabilidade'));
        var habilidade = elemento.closest('li.active').find('.itemmacro').text();
        var coddisciplina = parseInt(elemento.closest('li.active').find('.itemmacro').data('coddisciplina'));
        var disciplina = elemento.closest('li.active').find('.itemmacro').data('disciplina');

        var combo = {
            curso: curso.trim(),
            codcurso: codcurso,
            codhabilidade: codhabilidade,
            habilidade: habilidade.trim(),
            coddisciplina: coddisciplina,
            disciplina: disciplina.trim()
        };

        if (codcurso && curso && codhabilidade && habilidade && coddisciplina) {
            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlCriaMacro + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem,
                success: function (data) {
                    if (!Helper.isJSON(data)) {

                        $('#cria-macro').html(data);
                        $('select').material_select();
                        $('#cria-macro').modal({ dismissible: false }).modal('open');
                        setaValorSelectFixoMacro(combo);
                        $('#qtdOpcoesResposta').change(changeQtdOpcoesResposta);
                        salvar_nova_macro();
                        FormValidations.init();
                        unidadesAvaliativas.carregaImagemCKeditor();
                        validaArquivoTemplateMacro();
                        $('ul.tabs').tabs();
                        setTimeout(function () {
                            $('#cria-macro a[href="#cadastro-"]').click();
                        }, 200);
                        bindTabGetMatriz();
                    } else {
                        Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }

                },
                error: function (err) {
                    Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            }).executar();
        }
    }

    function bindOpcoesMacroDesafio(item) {
        var btnNovoMacroDesafio = item.parent().find(".itemcollapse");

        if (!btnNovoMacroDesafio || btnNovoMacroDesafio.length == 0) {
            btnNovoMacroDesafio = item.parent().find(".itemmacrodesafio");

            item.parent().find("#table-pesq-habilidades tbody tr").each((x, elem) => {
                let coditem = elem.dataset.coditem;
                $(elem).find(".alterar-item-macro").off().click({ coditem: coditem }, alterarMacroDesafio);
                $(elem).find(".exclui-item-macro").off().click({ coditem: coditem, item: item }, excluirQuestao);
            });
        }

        btnNovoMacroDesafio.off().click(criarNovoMacroDesafio);
    }

    function ObterQuantidadeQuestoes() {
        var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());

        new GCS().setObj({
            type: 'GET',
            url: `${urlObterQuantidadeQuestoes}?codbaseunidadeaprendizagem=${codbaseunidadeaprendizagem}`,
            success: function (data) {
                if (data && data.status) {
                    atualizaCamposQuestaoVinculada("quantidadeQuestaoObjetivo", data.qtdeRegistrosObjetivo);
                    atualizaCamposQuestaoVinculada("quantidadeQuestaoSubjetivo", data.qtdeRegistrosSubjetivo);
                }
            }
        }).executar();
    }

    function atualizaCamposQuestaoVinculada(nomeCampo, quantidade) {
        let doc = document.querySelector(`#${nomeCampo}`);

        if (quantidade > 0) {
            doc.classList.remove("sem-questao");
            doc.classList.add("com-questao");
            doc.textContent = quantidade + (quantidade > 1 ? " questões vinculadas" : " questão vinculada")
        } else {
            doc.classList.remove("com-questao");
            doc.classList.add("sem-questao");
            doc.textContent = "Sem questão vinculada"
        }
    }

    function setaValorSelectFixoMacro(combo) {
        $('#cria-macro #Curso').find('option').remove();
        $('#cria-macro #Curso').append('<option value="' + combo.codcurso + '">' + combo.curso + '</option>');
        $('#cria-macro #Habilidade').find('option').remove();
        $('#cria-macro #Habilidade').append('<option value="' + combo.codhabilidade + '">' + combo.habilidade + '</option>');
        $('#cria-macro #Disciplina').find('option').remove();
        $('#cria-macro #Disciplina').append('<option value="' + combo.coddisciplina + '">' + combo.disciplina + '</option>');
        $('select').material_select();

        disabledComboBoxSelecionadosMacro(true);
    }

    function disabledComboBoxSelecionadosMacro(disabled) {
        $("#cria-macro #Curso").prop("disabled", disabled ? "disabled" : "");
        $("#cria-macro #Habilidade").prop("disabled", disabled ? "disabled" : "");
        $("#cria-macro #Disciplina").prop("disabled", disabled ? "disabled" : "");
        $('select').material_select();
    }

    function criarNovoMicroDesafio() {
        var elemento = $(this);

        var codautor = parseInt(elemento.closest('li.active').find('.itemmicro').data('codautor'));
        var autortexto = elemento.closest('li.active').find('.itemmicro').data('autortexto');

        var codbanca = parseInt(elemento.closest('li.active').find('.itemmicro').data('codbanca'));
        var bancatexto = elemento.closest('li.active').find('.itemmicro').data('bancatext');


        var codcurso = parseInt(elemento.closest('li.active').find('.itemmicro').data('codcurso'));
        var cursotexto = elemento.closest('li.active').find('.itemmicro').data('cursotexto');

        var codhabilidade = parseInt(elemento.closest('li.active').find('.itemmicro').data('codhabilidade'));
        var habilidadetexto = elemento.closest('li.active').find('.itemmicro').data('habilidadetexto');

        var coddisciplina = parseInt(elemento.closest('li.active').find('.itemmicro').data('coddisciplina'));
        var disciplinatexto = elemento.closest('li.active').find('.itemmicro').data('disciplinatexto');

        var coddescritor = parseInt(elemento.closest('li.active').find('.itemmicro').data('coddescritor'));
        var descritortexto = elemento.closest('li.active').find('.itemmicro').data('descritortexto');

        var codunidadeensino = parseInt(elemento.closest('li.active').find('.itemmicro').data('codunidadeensino'));

        var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
        var combo = {
            codautor: codautor,
            autortexto: autortexto,
            codbanca: codbanca,
            bancatexto: bancatexto,
            codcurso: codcurso,
            cursotexto: cursotexto,
            codhabilidade: codhabilidade,
            coddisciplina: coddisciplina,
            codunidadeensino: codunidadeensino,
            coddescritor: coddescritor,
            habilidadetexto: habilidadetexto,
            descritortexto: descritortexto,
            disciplinatexto: disciplinatexto,
            codbaseunidadeaprendizagem: codbaseunidadeaprendizagem
        };

        if (codcurso && cursotexto && codhabilidade && coddisciplina && coddescritor && codunidadeensino && descritortexto && habilidadetexto && disciplinatexto) {

            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlCriaMicro + '?codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem,
                success: function (data) {
                    if (!Helper.isJSON(data)) {

                        $('#cria-micro').html(data);
                        $('select').material_select();
                        $('#cria-micro').modal({ dismissible: false }).modal('open');
                        $('#qtdOpcoesResposta').change(changeQtdOpcoesResposta);
                        let qtdQuestoes = $(".questao-unitario").length - $(".questao-unitario.hide").length;
                        qtdQuestoes = qtdQuestoes > 0 ? qtdQuestoes : 5;
                        setaValorSelectFixoMicro(combo);
                        $('#qtdOpcoesResposta').val(qtdQuestoes);
                        salvar_nova_micro();
                        FormValidations.init();
                        $('.somente-bq').removeClass('hide');
                        $('select').material_select();
                        changeQtdOpcoesResposta();
                        unidadesAvaliativas.carregaImagemCKeditor();
                        $('ul.tabs').tabs();
                        setTimeout(function () {
                            $('#cria-micro a[href="#cadastro-"]').click();
                        }, 200);
                        bindTabGetMatrizMicro();
                    } else {
                        Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }

                },
                error: function (err) {
                    Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            }).executar();
        }
    }

    function alterarMicroDesafio(params) {

        let coditem = params.data["coditem"];
        if (coditem) {
            var elemento = $(this);

            var codautor = parseInt(elemento.closest('li.active').find('.itemmicro').data('codautor'));
            var autortexto = elemento.closest('li.active').find('.itemmicro').data('autortexto');

            var codbanca = parseInt(elemento.closest('li.active').find('.itemmicro').data('codbanca'));
            var bancatexto = elemento.closest('li.active').find('.itemmicro').data('bancatext');


            var codcurso = parseInt(elemento.closest('li.active').find('.itemmicro').data('codcurso'));
            var cursotexto = elemento.closest('li.active').find('.itemmicro').data('cursotexto');

            var codhabilidade = parseInt(elemento.closest('li.active').find('.itemmicro').data('codhabilidade'));
            var habilidadetexto = elemento.closest('li.active').find('.itemmicro').data('habilidadetexto');

            var coddisciplina = parseInt(elemento.closest('li.active').find('.itemmicro').data('coddisciplina'));
            var disciplinatexto = elemento.closest('li.active').find('.itemmicro').data('disciplinatexto');

            var coddescritor = parseInt(elemento.closest('li.active').find('.itemmicro').data('coddescritor'));
            var descritortexto = elemento.closest('li.active').find('.itemmicro').data('descritortexto');

            var codunidadeensino = parseInt(elemento.closest('li.active').find('.itemmicro').data('codunidadeensino'));

            var codbaseunidadeaprendizagem = parseInt($('#codbaseunidadeaprendizagem').val());
            var combo = {
                codautor: codautor,
                autortexto: autortexto,
                codbanca: codbanca,
                bancatexto: bancatexto,
                codcurso: codcurso,
                cursotexto: cursotexto,
                codhabilidade: codhabilidade,
                coddisciplina: coddisciplina,
                codunidadeensino: codunidadeensino,
                coddescritor: coddescritor,
                habilidadetexto: habilidadetexto,
                descritortexto: descritortexto,
                disciplinatexto: disciplinatexto,
                codbaseunidadeaprendizagem: codbaseunidadeaprendizagem
            };

            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlEditarMicro + '?coditem=' + coditem,
                success: function (data) {
                    if (!Helper.isJSON(data)) {
                        $('#cria-micro').html(data);
                        $('select').material_select();
                        $('#cria-micro').modal({ dismissible: false }).modal('open');
                        $('#qtdOpcoesResposta').change(changeQtdOpcoesResposta);
                        let qtdQuestoes = $(".questao-unitario").length - $(".questao-unitario.hide").length;
                        qtdQuestoes = qtdQuestoes > 0 ? qtdQuestoes : 2;
                        setaValorSelectFixoMicro(combo);
                        $('#qtdOpcoesResposta').val(qtdQuestoes);
                        salvar_nova_micro();
                        FormValidations.init();
                        $('.somente-bq').removeClass('hide');
                        $('select').material_select();
                        changeQtdOpcoesResposta();
                        unidadesAvaliativas.carregaImagemCKeditor();

                        for (var i = 0; i < $("#frmCadastroMicro #espacoQuestoes").children().length - 1; i++) {
                            if ($("#frmCadastroMicro #qtdOpcoesResposta").parent().find("input").val() >= i + 1) {
                                $("#frmCadastroMicro #espacoQuestoes").children()[i].classList.remove("hide");
                            }
                        }

                        setTimeout(function () {
                            $('#cria-micro a[href="#cadastro-"]').click();
                        }, 200);
                        $('#cria-micro a[href="#listagem-"]').closest('li').removeClass('disabled');
                        bindTabGetMatrizEditMicro();

                        $('ul.tabs').tabs();
                    } else {
                        Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }

                }
            }).executar();
        }
    }

    function setaValorSelectFixoMicro(combo) {
        $('#cria-micro #Banca').find('option').remove();
        $('#cria-micro #Banca').append('<option value="' + combo.codbanca + '">' + combo.bancatexto + '</option>');

        $('#cria-micro #Autor').find('option').remove();
        $('#cria-micro #Autor').append('<option value="' + combo.codautor + '">' + combo.autortexto + '</option>');

        $('#cria-micro #Curso').find('option').remove();
        $('#cria-micro #Curso').append('<option value="' + combo.codcurso + '">' + combo.cursotexto + '</option>');

        $('#cria-micro #Disciplina').find('option').remove();
        $('#cria-micro #Disciplina').append('<option value="' + combo.coddisciplina + '">' + combo.disciplinatexto + '</option>');

        $('#cria-micro #Habilidade').find('option').remove();
        $('#cria-micro #Habilidade').append('<option value="' + combo.codhabilidade + '">' + combo.habilidadetexto + '</option>');

        $('#cria-micro #Descritor').find('option').remove();
        $('#cria-micro #Descritor').append('<option value="' + combo.coddescritor + '">' + combo.descritortexto + '</option>');

        disabledComboBoxSelecionadosMicro(true);
    }


    function disabledComboBoxSelecionadosMicro(disabled) {
        $("#cria-micro #Banca").prop("disabled", disabled ? "disabled" : "");
        $("#cria-micro #Autor").prop("disabled", disabled ? "disabled" : "");
        $("#cria-micro #Curso").prop("disabled", disabled ? "disabled" : "");
        $("#cria-micro #Disciplina").prop("disabled", disabled ? "disabled" : "");
        $("#cria-micro #Habilidade").prop("disabled", disabled ? "disabled" : "");
        $("#cria-micro #Descritor").prop("disabled", disabled ? "disabled" : "");
        $('select').material_select();
    }

    function verificaPrenchimentoObrigatorio() {
        return true;
        //Foi solicitado que retirasse a obrigatoriedade dos arquivos
        /*var codmodalidade = parseInt($('#codmodalidade').val());
        var guiaestudoHibrido = $('.--guia-estudo-hibrido table tbody td.-acoes').length;
        var guiaestudoOnline = $('.--guia-estudo table tbody td.-acoes').length;
        var guiaestudoOnlineScorm = $('.--guia-estudo-scorm table tbody td.-acoes').length;
        var infografico = $('.--infografico table tbody td.-acoes').length;
        var videos = $('.--videos table tbody td.-acoes').length;

        if (codmodalidade === 1) {
            return guiaestudoHibrido > 0 && infografico > 0 && videos > 0;
        } else if (codmodalidade === 2) {
            return guiaestudoOnline > 0 && guiaestudoOnlineScorm > 0 && infografico > 0 && videos > 0;
        }*/
    }

    function bindTabGetMatriz() {
        //unidadea
        $('#cria-macro a[href="#listagem-"]').off().click(function () {

            var ativo = $('#cria-macro a[href="#listagem-"]').closest('li').hasClass('disabled');
            if (!ativo) {
                $('#cria-macro .btn-salva-default').addClass('hide');
                $('#cria-macro .salva-item-matriz').addClass('hide');
                $("#cria-macro #cadastro-").hide();
                $("#cria-macro #listagem-").show();
                LoadItemMatrizMacro();
            }
            excluirItemMatrizMacro();
        });

        $('#cria-macro a[href="#cadastro-"]').off().click(function () {
            $('#cria-macro .btn-salva-default').removeClass('hide');
            $('#cria-macro #listagem-').hide();
            $('#cria-macro- #cadastro-').show();
        });
    }

    function bindTabGetMatrizMicro() {
        $('#cria-micro a[href="#listagem-"]').off().click(function () {

            var ativo = $('#cria-micro a[href="#listagem-"]').closest('li').hasClass('disabled');
            if (!ativo) {
                $('#cria-micro .btn-salva-default').addClass('hide');
                $('#cria-micro .salva-item-matriz').addClass('hide');
                $("#cria-micro #listagem-").show();
                $("#cria-micro #cadastro-").hide();
                LoadItemMatrizMicro();
            }
            excluirItemMatrizMicro();
        });

        $('#cria-micro a[href="#cadastro-"]').off().click(function () {
            $("#cria-micro #listagem-").hide();
            $("#cria-micro #cadastro-").show();
            $('#cria-micro .btn-salva-default').removeClass('hide');
        });
    }

    function bindTabGetMatrizEditMacro() {
        $('#cria-macro a[href="#listagem-"]').off().click(function () {

            var ativo = $('#cria-macro a[href="#listagem-"]').closest('li').hasClass('disabled');
            if (!ativo) {
                $('#cria-macro .btn-salva-default').addClass('hide');
                $('#cria-macro .salva-item-matriz').addClass('hide');
                $("#cria-macro #listagem-").show();
                $("#cria-macro #cadastro-").hide();
                LoadItemMatrizMacro();

            }
            excluirItemMatrizMacro();
        });

        $('#cria-macro a[href="#cadastro-"]').off().click(function () {
            $("#cria-macro #listagem-").hide();
            $("#cria-macro #cadastro-").show();
            $('#cria-macro .btn-salva-default').removeClass('hide');
        });
    }

    function bindTabGetMatrizEditMicro() {
        $('#cria-micro a[href="#listagem-"]').off().click(function () {

            var ativo = $('#cria-micro a[href="#listagem-"]').closest('li').hasClass('disabled');
            if (!ativo) {
                $('#cria-micro .btn-salva-default').addClass('hide');
                $('#cria-micro .salva-item-matriz').addClass('hide');
                $("#cria-micro #listagem-").show();
                $("#cria-micro #cadastro-").hide();
                LoadItemMatrizMicro();

            }
            excluirItemMatrizMicro();
        });

        $('#cria-micro a[href="#cadastro-"]').off().click(function () {
            $("#cria-micro #listagem-").hide();
            $("#cria-micro #cadastro-").show();
            $('#cria-micro .btn-salva-default').removeClass('hide');
            $('#cria-micro .btn-salva-default').addClass('disabled');
        });
    }



    function LoadItemMatrizMacro() {

        var coditem = $('#cria-macro #coditem').val();

        if (coditem > 0) {

            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlGetMatrizes + '?coditem=' + coditem,
                success: function (data) {
                    $('.listItemMatriz').html(data);
                    excluirItemMatrizMacro();
                    //$('ul.tabs').tabs();

                }
            }).executar();
        }
    }

    function LoadItemMatrizMicro() {
        var coditem = $('#cria-micro #coditem').val();

        if (coditem > 0) {

            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: urlGetMatrizesMicro + '?coditem=' + coditem,
                success: function (data) {
                    $('.listItemMatriz').html(data);
                    excluirItemMatrizMicro();
                    $('ul.tabs').tabs();
                }
            }).executar();
        }
    }



    function excluirItemMatrizMacro() {
        $('#cria-macro .excluir-item-matriz').hide();
        //$('#cria-macro .excluir-item-matriz').off().click(function () {
        //    var coditemmatriz = $(this).data('coditemmatriz');
        //    Helper.OpenConfirm({
        //        msg: "<strong>Deseja realmente realizar a exclusão?</strong>",
        //        classtitle: "font-vermelho",
        //        yes: function () {
        //            Helper.CloseConfirm();
        //            var data = {
        //                coditemmatriz: coditemmatriz
        //            };

        //            new GCS().setObj({

        //                url: urlExcluirDesafioMatriz,
        //                data: JSON.stringify(data),
        //                success: function (data) {
        //                    if (data.status) {

        //                        Helper.OpenAlert({ title: "Questão excluída com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
        //                        LoadItemMatrizMacro();
        //                    } else {
        //                        Helper.OpenAlert({ title: "Ops", msg: 'Ocorreu um erro ao tentar exluir!', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
        //                    }
        //                    LoadItemMatrizMacro();
        //                }
        //            }).executar();
        //        },
        //        no: function () {
        //            Helper.CloseConfirm();
        //        }
        //    });
        //});
    }

    function excluirItemMatrizMicro() {
        $('#cria-micro .excluir-item-matriz').hide();
        //$('#cria-micro .excluir-item-matriz').off().click(function () {
        //    var coditemmatriz = $(this).data('coditemmatriz');
        //    Helper.OpenConfirm({
        //        msg: "<strong>Deseja realmente realizar a exclusão?</strong>",
        //        classtitle: "font-vermelho",
        //        yes: function () {
        //            Helper.CloseConfirm();
        //            var data = {
        //                coditemmatriz: coditemmatriz
        //            };

        //            new GCS().setObj({

        //                url: urlExcluirDesafioMatriz,
        //                data: JSON.stringify(data),
        //                success: function (data) {
        //                    if (data.status) {

        //                        Helper.OpenAlert({ title: "Questão excluída com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
        //                        LoadItemMatrizMacro();
        //                    } else {
        //                        Helper.OpenAlert({ title: "Ops", msg: 'Ocorreu um erro ao tentar exluir!', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
        //                    }
        //                    LoadItemMatrizMacro();
        //                }
        //            }).executar();
        //        },
        //        no: function () {
        //            Helper.CloseConfirm();
        //        }
        //    });
        //});
    }

    function validaArquivo(self) {

        var allowedExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'];
        var value = $(self).val(),
            file = value.toLowerCase(),
            extension = file.substring(file.lastIndexOf('.') + 1);

        if (self.files[0].size > 5243000) {
            Helper.OpenAlert({
                title: "Ops",
                msg: 'Arquivo selecionado deve ter tamanho máximo de 5 MB.',
                classtitle: "font-vermelho-claro",
                iconclass: "dissatisfaction",
                icon: "fa-exclamation-triangle"
            });
            $(self).val('');
            return;
        }

        if ($.inArray(extension, allowedExtensions) === -1) {
            Helper.OpenAlert({
                title: "Ops",
                msg: 'Só é aceito extensões .doc, .docx, .xls, xlsx, ppt, pptx e .pdf',
                classtitle: "font-vermelho-claro",
                iconclass: "dissatisfaction",
                icon: "fa-exclamation-triangle"
            });
            $(self).val('');
        }

        var $inputFile = $(self),
            files = self.files;

        var item = files[0];

        var hiddenField = $('#base64');
        Helper.getBase64(item, hiddenField);
        salvaUrlVideo();

        if ($('#anexo').vol !== null) {
            Helper.OpenAlert({
                title: "Arquivo anexado com sucesso.",
                msg: "",
                classtitle: "font-verde",
                iconclass: "satisfaction",
                icon: "fa-check-circle"
            });
        }
    }

    return {
        init: init,
        criarMacro: criarMacro,
        carregaImagemCKeditor: carregaImagemCKeditor
    };

}();

$(unidadesAvaliativas.init);

