"use strict";

var Infografico = (function () {

    function init() {
        functionBase();
        bindFunctions();
        marcarinfografico();
        marcarDestaques();
        vizualizaimagemSintese();
        vizualizaimagemDestaque();
    }

    function functionBase() {
        $('.modal').modal();
    }

    function bindFunctions() {
        $('#infografico .salvar').click(salvar);
        $('.container-infografico .container-infografico--box [type="checkbox"]:checked').closest('div').addClass('active');
        $('.container-destaques .container-destaques--box [type="checkbox"]:checked').closest('div').addClass('active');
    }

    function marcarinfografico() {
        $('.container-infografico .container-infografico--box label').off().click(function () {
            var input = $(this).closest(".container-infografico--box").find("[type='checkbox']");
            if (input.attr('disabled') !== 'disabled') {
                setTimeout(function () {
                    var estado = input.is(':checked');
                    var codarquivo = input.siblings('label').data('codarquivo');

                    if (estado) {
                        var titulo = input.siblings('label').data('titulo');
                        checado();
                        input.closest('.container-infografico--box').addClass('active');
                        var html = '<div><i class="fas fa-check"></i><h2 class="sl-titulo-default sl-navy-blue" data-codarquivo="' + codarquivo + '">' + titulo + '</h2></div>';
                        $('.container-infografico-macro .container-infografico + .arquivo-section').append(html);
                        $('[name="infografico-marcado"]').val(codarquivo);
                    } else {
                        var listaItem = $('.container-infografico-macro .container-infografico + .arquivo-section h2');
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

    function marcarDestaques() {
        $('.container-destaques .container-destaques--box label').off().click(function () {
            var input = $(this).closest(".container-destaques--box").find("[type='checkbox']");
            if (input.attr('disabled') !== 'disabled') {
                setTimeout(function () {
                    var estado = input.is(':checked');
                    var codarquivo = input.siblings('label').data('codarquivo');

                    if (estado) {
                        var titulo = input.siblings('label').data('titulo');
                        checado();
                        input.closest('.container-destaques--box').addClass('active');
                        var html = '<div><i class="fas fa-check"></i><h2 class="sl-titulo-default sl-navy-blue" data-codarquivo="' + codarquivo + '">' + titulo + '</h2></div>';
                        $('.container-infografico-macro .container-destaques + .arquivo-section').append(html);
                        $('[name="infografico-marcado"]').val(codarquivo);
                    } else {
                        var listaItem = $('.container-infografico-macro .container-destaques + .arquivo-section h2');
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


    function vizualizaimagemSintese() {
        $('.container-infografico .fa-eye.visualiza').off().click(function () {
            debugger;
            $('#modalimg .modal-content iframe').remove();
            if ($(this).hasClass('is-pdf')) {
                var div = $(this).closest('.container-infografico--box');
                var base64PDF = div.find('label').data('src');
                $('#modalimg .modal-content img').addClass('hide');
                var iframe = $('<iframe>').attr('src', base64PDF);
                $('#modalimg .modal-content').append(iframe);
                $('#modalimg').modal('open');
            } else {
                $('#modalimg .modal-content img').removeClass('hide');
                var div = $(this).closest('.container-infografico--box');
                var img = div.find('.infografico-imagem');
                var modal = $("#modalimg");
                var modalImg = $("#imgModal");
                var base64img = img.attr('src');
                modal.find(modalImg).attr('src', base64img);
                modal.modal('open');
            }
           
        });
    }

    function vizualizaimagemDestaque() {
        $('.container-destaques .fa-eye.visualiza').off().click(function () {
            debugger;
            $('#modalimg .modal-content iframe').remove();
            if ($(this).hasClass('is-pdf')) {
                var div = $(this).closest('.container-destaques--box');
                var base64PDF = div.find('label').data('src');
                $('#modalimg .modal-content img').addClass('hide');
                var iframe = $('<iframe>').attr('src', base64PDF);
                $('#modalimg .modal-content').append(iframe);
                $('#modalimg').modal('open');
            } else {
                $('#modalimg .modal-content img').removeClass('hide');
                var div = $(this).closest('.container-destaques--box');
                var img = div.find('.destaques-imagem');
                var modal = $("#modalimg");
                var modalImg = $("#imgModal");
                var base64img = img.attr('src');
                modal.find(modalImg).attr('src', base64img);
                modal.modal('open');
            }

        });
    }

    function checado() {
        $('.container-infografico .container-infografico--box').removeClass('active');
        $('.container-infografico .container-infografico--box [type="checkbox"]:checked').closest('div').addClass('active');
    }

    function pegaArquivosChecados() {
        var arr = [];
        var listaItem = $('.container-infografico-macro .container-infografico + .arquivo-section h2');
        listaItem.each(function () {
            var codigo = $(this).data('codarquivo');
            arr.push(codigo);
        });
        return arr;
    }

    function pegaArquivosDestaquesChecados() {
        var arr = [];
        var listaItem = $('.container-infografico-macro .container-destaques + .arquivo-section h2');
        listaItem.each(function () {
            var codigo = $(this).data('codarquivo');
            arr.push(codigo);
        });
        return arr;
    }

    function salvar() {
        debugger;
        var codunidadeaprendizagem = $('#codunidadeaprendizagem').val();
        var codigosArquivos = pegaArquivosChecados();
        var codigosArquivosDestaques = pegaArquivosDestaquesChecados();
        var data = {
            codunidadeaprendizagem: codunidadeaprendizagem,
            codconteudoInfograficolist: codigosArquivos,
            codconteudoDestaquelist: codigosArquivosDestaques
        };
        if (codunidadeaprendizagem) {

            new GCS().setObj({
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                url: urlSalvarInfografico,
                success: function (data) {
                    
                    if (data.status) {

                        var etapaConclusao = $('.wizard_new .clickoption[data-href$="/UnidadeAprendizagem/LoadConclusao"]');
                        if (etapaConclusao.closest('li').hasClass('wizard_new--done')) {
                            $('.wizard_new a[data-href$="/UnidadeAprendizagem/LoadOrganizacao"]').click();
                        } else {
                            UnidadeAprendizagemListagemUas.vaiParaEtapa(5, data.codunidadeaprendizagem);
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
                   
    return {
        init: init
    };
})();

$(Infografico.init);