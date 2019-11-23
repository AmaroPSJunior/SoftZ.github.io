"use strict";

var Videos = (function () {

    function init() {
        functionBase();
        bindFunctions();
        marcarVideo();
    }

    function functionBase() {
        thumbnails();
        reproduzir();
    }

    function bindFunctions() {
        $('#video-partial .salvar').click(salvar);
        $('.container-video .container-video--box [type="checkbox"]:checked').closest('div').addClass('active');
    }


    function marcarVideo() {
        $('.container-video .container-video--box label').off().click(function () {
            
            var input = $(this).closest(".container-video--box").find("[type='checkbox']");
            
            if (input.attr('disabled') !== 'disabled') {

                setTimeout(function () {
             
                    var estado = input.is(':checked');
                    var codarquivo = input.siblings('label').data('codarquivo');
                
                    if (estado) {
                        var titulo = input.siblings('label').data('titulo');
                        checado();
                        input.closest('.container-video--box').addClass('active');
                        var html = '<div><i class="fas fa-check"></i><h2 class="sl-titulo-default sl-navy-blue" data-codarquivo="' + codarquivo + '">' + titulo + '</h2></div>';
                        $('.container-video-partial-macro .arquivo-section').append(html);
                    
                    } else {
                        var listaItem = $('.container-video-partial-macro .arquivo-section h2');
                        checado();
                        listaItem.each(function () {

                            if (codarquivo === $(this).data('codarquivo')) {
                                $(this).closest('div').remove();
                            }  
                        });


                    }
                }, 100);
            }
        });
    }

    function checado() {
        $('.container-video .container-video--box').removeClass('active');
        $('.container-video .container-video--box [type="checkbox"]:checked').closest('div').addClass('active');
    }

    function thumbnails() {
        var videoUrl = $('.container-video--box label');
        videoUrl.each(function () {
            var img = $(this).closest('.container-video--box').find('img');
            var caixa = $(this).closest('.container-video--box');
            var url = $(this).data('url');
            
            if (url) {
                if (url.indexOf('www.youtube.com') > -1) {
                    apiYt(url, img);
                } else if (url.indexOf('vimeo.com') > -1) {
                    apiVm(url, img);
                } else {
                            var html = '<i class="fas fa-film ico-film"></i>';
                            caixa.append(html);
                            img.remove();
                            caixa.find('label').css('border', 'none');
                       }
            }
        });
    }

    function apiYt(url, img) {
        var idVideo = url.substring(url.lastIndexOf('v=') + 2);

        new GCS().setObj({
            type: 'GET',
            processData: true,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            url: 'https://www.googleapis.com/youtube/v3/videos',
            data: {
                part: 'snippet',
                key: 'AIzaSyDhtU9oebZG4uIMA63utC6AT0OYrXQnpzs',
                id: idVideo
            },
            showLoad: false,
            success: function (data) {

                var item = data.items;
                if (item.length) {
                    img.attr('src', item[0].snippet.thumbnails.default.url);
                    reproduzir();
                } else {
                    img.closest('.container-video--box').append('<i class="fas fa-video-slash video-indisponivel"><span>Vídeo indisponível</span></i>');
                }
                
            }
        }).executar();
    }

    function apiVm(url, img) {
        
        var endpoint = 'https://vimeo.com/api/oembed.json';

        var urlVimeo = endpoint + '?url=' + encodeURIComponent(url);

        new GCS().setObj({
            type: 'GET',
            processData: true,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            url: urlVimeo,
            showLoad: false,
            success: function (data) {
                img.attr('src', data.thumbnail_url);
                reproduzir();
            },
            error: function (erro) {
                img.closest('.container-video--box').append('<i class="fas fa-video-slash video-indisponivel"><span>Vídeo indisponível</span></i>');
            }
        }).executar();  
    }

    function pegaVideosChecados() {
        var arr = [];
        var listaItem = $('.container-video-partial-macro .arquivo-section h2');
        listaItem.each(function () {
            var codigo = $(this).data('codarquivo');
            arr.push(codigo);
        });
        return arr;
    }

    function salvar() {
        
        var codunidadeaprendizagem = $('#codunidadeaprendizagem').val();
        var codigosVideos = pegaVideosChecados();
        var data = {
            codunidadeaprendizagem: codunidadeaprendizagem,
            codconteudolist: codigosVideos
        };
        if (codunidadeaprendizagem) {

            new GCS().setObj({
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                url: urlSalvarVideo,
                success: function (data) {
                    
                    if (data.status) {

                        var etapaConclusao = $('.wizard_new .clickoption[data-href$="/UnidadeAprendizagem/LoadConclusao"]');
                        if (etapaConclusao.closest('li').hasClass('wizard_new--done')) {
                            $('.wizard_new a[data-href$="/UnidadeAprendizagem/LoadOrganizacao"]').click();
                        } else {
                            UnidadeAprendizagemListagemUas.vaiParaEtapa(4, data.codunidadeaprendizagem);
                        }

                    } else {
                        Helper.OpenAlert({ title: "Ops", msg: 'Ocorreu um erro ao salvar', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }
                },
                error: function (err) {
                    Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            }).executar();

        } else {
            Helper.OpenAlert({ title: "Ops", msg: 'Selecione uma opção', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
        }
    }

    function reproduzir() {

        $('.container-video--box .visualiza').off().click(function () {

            var modalHeader = $('#player .modal-header');
            var input = $(this).closest(".container-video--box").find("[type='checkbox']");
            var codarquivo = input.siblings('label').data('codarquivo');
            var titulo = input.siblings('label').data('titulo');
            var htmlTitulo = '<h4 class="titulo-modal-video" data-codarquivo="' + codarquivo + '">' + titulo + '</h4>';
            $('#player .modal-header .titulo-modal-video').remove();
            modalHeader.append(htmlTitulo);

            var url = $(this).closest('.container-video--box').find('label').data('url');
            var modal = $('#player .modal-content');

            if (url) {
                if (url.indexOf('www.youtube.com') > -1) {
                    var idVideo = url.substring(url.lastIndexOf('v=') + 2);
                    var html = '<iframe width="100%" height="99%" src="https://www.youtube.com/embed/' + idVideo + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';

                    modal.html(html);

                    $('#player').modal({ dismissible: true }).modal('open');

                } else if (url.indexOf('vimeo.com') > -1) {
                    var urlCortada = url.split("/");

                    if (urlCortada.length >= 4) {
                        var idVideo = urlCortada[3];

                        var html = '<iframe src="https://player.vimeo.com/video/' + idVideo + '" width="100%" height="99%" frameborder="0" title="Brad!" allow="autoplay; fullscreen" allowfullscreen></iframe>';
                        modal.html(html);
                        $('#player').modal({ dismissible: true }).modal('open');
                    }
                } 
            }

            $('#player .modal-close').off().click(function () {
                var html = '';
                modal.html(html);
            });

            var possuianexo = $(this).prev().data('possuianexo');
            if (possuianexo == "True") {
                $('#player .modal-footer').removeClass('hide');
                $('.download-anexo').css('pointer-events', '').prop('disabled', false);

                $('.download-anexo').off().click(function () {

                    var codconteudo = $('.container-video--box label').data('codarquivo');
                    new GCS().setObj({
                        type: 'GET',
                        url: urlDownloadArquivoAnexoConteudo + `?codconteudo=${codconteudo}`,
                        success: function (data) {

                            if (data.status) {

                                var link = document.createElement('a');
                                link.setAttribute("download", data.nome);
                                link.setAttribute("href", data.file);
                                link.click();

                            } else {
                                Helper.OpenAlert({
                                    title: "",
                                    msg: data.msg,
                                    classtitle: "font-vermelho-claro",
                                    iconclass: "dissatisfaction",
                                    icon: "fa-exclamation-triangle"
                                });
                            }

                        }
                    }).executar();
                });
            } else {
                $('#player .modal-footer').addClass('hide');
            }
        });
    }


    return {
        init: init
    };
})();

$(Videos.init);

