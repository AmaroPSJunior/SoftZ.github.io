"use strict";

var GuiaEstudo = (function () {

    function init() {
        functionBase();
        bindFunctions();
    }

    function functionBase() {
        marcarArquivoPDF();
        marcarArquivoScorm();
        verificaMarcados();
        visualizaPDF();
        visualizaZIP();
        visualizaGuiaHibrido();
    }

    function visualizaPDF() {
        $('.visualiza-pdf').off().click(function () {
            $('.modal').modal();
            var url = $(this).closest('.container-guia--box').find('label').data('url');
            var iframe = '<iframe width="100%" height="99%" src="' + url + '"></iframe>';
            $('#modal-pdf .modal-content iframe').remove();
            $('#modal-pdf .modal-content').append(iframe);
            $('#modal-pdf').modal({ dismissible: true }).modal('open');
        });
    }

    function visualizaGuiaHibrido() {
        $('.visualiza-guia').off().click(function () {
            
            var codconteudo = $(this).closest('div').find('label').data('codarquivo')
            new GCS().setObj({
                type: 'GET',
                contentType: 'application/json',
                url: urlGetGuiaHibrido + '?codconteudo=' + codconteudo,
                showLoad: false,
                success: function (data) {

                    if (data.status) {
                        data.conteudo.referenciabibliografica = data.conteudo.referenciabibliografica ? data.conteudo.referenciabibliografica : "";
                        $('.modal').modal();
                        var html = ` <div class="border_">
                                        <h3 class="title_">Titulo:</h3>
                                        <p>${data.conteudo.titulo}</p>
                                    </div>
                                    <div class="border_">
                                        <h3 class="title_">Conteúdo:</h3>
                                        <p>${data.conteudo.conteudo}</p>
                                    </div>
                                    <div class="border_">
                                        <h3 class="title_">Referências Bibliográficas:</h3>
                                        <p>${data.conteudo.referenciabibliografica}</p>
                                    </div>`;
                        $('#modal-text .modal-content').html(html);
                        $('#modal-text').modal({ dismissible: true }).modal('open');
                    } else {
                        Helper.OpenAlert({ title: "Ops", msg: 'Ocorreu um erro! Não foi possível visualizar o arquivo.', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }
                }
            }).executar();
        });
    }

    function visualizaZIP() {
        $('.visualiza-zip').off().click(function () {
            
            var url = $(this).closest('.container-guia--box').find('label').data('url');
            var link = document.createElement('a');
            link.href = url;
            link.click();
        });
    }

    function verificaMarcados() {
        
        var guiaestudopdf = $('.container-guia--box [type="radio"]').filter(':checked', true);
        var guiaestudoscorm = $('.container-guia-estudo-scorm [type="radio"]').filter(':checked', true);
        if (guiaestudopdf.length > 0) {
            guiaestudopdf.closest('.container-guia-estudo .container-guia--box').find('label').click();
        }
        if (guiaestudoscorm.length > 0) {
            guiaestudoscorm.closest('.container-guia-estudo-scorm .container-guia--box').find('label').click();
        }
    }

    function bindFunctions() {
        $('.modal').modal();
        $('#guia-estudo .salvar').click(salvar);
        $('#guia-estudo .container-guia--box [type="checkbox"]:checked').closest('div').addClass('active');
    }

    function marcarArquivoPDF() {
        $('#guia-estudo .container-guia--box label').off().click(function () {
            
            var input = $(this).closest(".container-guia--box").find("[type='checkbox']");
            
            if (input.attr('disabled') !== 'disabled') {

                setTimeout(function () {
             
                    var estado = input.is(':checked');
                    var codarquivo = input.siblings('label').data('codarquivo');
                
                    if (estado) {
                        var titulo = input.siblings('label').data('titulo');
                        checado();
                        input.closest('.container-guia--box').addClass('active');
                        var html = '<div><i class="fas fa-check"></i><h2 class="sl-titulo-default sl-navy-blue" data-codarquivo="' + codarquivo + '">' + titulo + '</h2></div>';
                        $('#guia-estudo .arquivo-section').append(html);
                    
                    } else {
                        var listaItem = $('#guia-estudo .arquivo-section h2');
                        checado();
                        listaItem.each(function () {

                            if (codarquivo === $(this).data('codarquivo')) {
                                console.log($(this).data('codarquivo'));
                                $(this).closest('div').remove();
                            }  
                        });


                    }
                }, 100);
            }
        });
        //$('.container-guia-estudo .container-guia--box label').off().click(function () {
            
        //    var elemento = $(this);
        //    var todosInputs = $('.container-guia-estudo .container-guia--box [type="radio"]');
            
        //    setTimeout(function () {
                
        //        var inpuSelecionado = todosInputs.filter(':checked');
        //        var nomearquivo = inpuSelecionado.siblings('label').text().trim();
        //        var codarquivo = inpuSelecionado.siblings('label').data('codarquivo');

        //        if (!inpuSelecionado.closest('.container-guia--box').hasClass('active')) {
        //            $('.container-guia-estudo .container-guia--box').removeClass('active');
        //            inpuSelecionado.closest('.container-guia--box').addClass('active');
        //            inpuSelecionado.prop("checked", true);
        //        } else {
        //            $('.container-guia-estudo .container-guia--box').removeClass('active');
        //            inpuSelecionado.prop("checked", false);
        //        }

        //        var html = ' <i class="fas fa-check"></i><h2 class="sl-titulo-default sl-navy-blue" data-codarquivo="' + codarquivo + '">' + nomearquivo + '</h2>';

        //        $('.container-guia-estudo .arquivo-section').html(html);
        //        $('[name="guiaestudopdf"]').val(codarquivo);
        //    }, 100);
            
        //});
    }

    function checado() {
        $('#guia-estudo .container-guia--box').removeClass('active');
        $('#guia-estudo .container-guia--box [type="checkbox"]:checked').closest('div').addClass('active');
    }

    function marcarArquivoScorm() {
        $('.container-guia-estudo-scorm .container-guia--box label').off().click(function () {

            var elemento = $(this);
            var todosInputs = $('.container-guia-estudo-scorm .container-guia--box [type="radio"]');

            setTimeout(function () {

                var inpuSelecionado = todosInputs.filter(':checked');
                var nomearquivo = inpuSelecionado.siblings('label').text().trim();
                var codarquivo = inpuSelecionado.siblings('label').data('codarquivo');

                if (!inpuSelecionado.closest('.container-guia--box').hasClass('active')) {
                    $('.container-guia-estudo-scorm .container-guia--box').removeClass('active');
                    inpuSelecionado.closest('.container-guia--box').addClass('active');
                    inpuSelecionado.prop("checked", true);
                } else {
                    $('.container-guia-estudo-scorm .container-guia--box').removeClass('active');
                    inpuSelecionado.prop("checked", false);
                }

                var html = ' <i class="fas fa-check"></i><h2 class="sl-titulo-default sl-navy-blue" data-codarquivo="' + codarquivo + '">' + nomearquivo + '</h2>';

                $('.container-guia-estudo-scorm .arquivo-section').html(html);
                $('[name="guiaestudoscorm"]').val(codarquivo);
            }, 100);

        });
    }

    function pegaVideosChecados() {
        var arr = [];
        var listaItem = $('#guia-estudo .arquivo-section h2');
        listaItem.each(function () {
            var codigo = $(this).data('codarquivo');
            arr.push(codigo);
        });
        return arr;
    }


    function salvar() {
        
        var codUnidadeAprendizagem = $('#codunidadeaprendizagem').val();
        //var codConteudoGuiaEstudoPdf = obterCodigoGuiaPdf();
        //var codConteudoGuiaEstudoScorm = obterCodigoGuiaScorm();

        var codigosGuias = pegaVideosChecados();
        var data = {
            codunidadeaprendizagem: codUnidadeAprendizagem,
            codconteudolist: codigosGuias
        };
        

      
       
        new GCS().setObj({
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            url: urlSalvarGuiaEstudo,
            showLoad: false,
            success: function (data) {

                if (data.status) {

                    var etapaConclusao = $('.wizard_new .clickoption[data-href$="/UnidadeAprendizagem/LoadConclusao"]');
                    if (etapaConclusao.closest('li').hasClass('wizard_new--done')) {
                        $('.wizard_new a[data-href$="/UnidadeAprendizagem/LoadOrganizacao"]').click();
                    } else {
                        UnidadeAprendizagemListagemUas.vaiParaEtapa(3, data.codunidadeaprendizagem);
                    }

                } else {
                    Helper.OpenAlert({ title: "Ops", msg: 'Ocorreu um erro ao salvar', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            },
            error: function (err) {
                Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            }
        }).executar();
    }

    function obterCodigoGuiaPdf() {
        var todosInputsQTD = $('.container-guia-estudo .container-guia--box [type="radio"]').length;
        var todosInputs = $('.container-guia-estudo .container-guia--box [type="radio"]');
        if (todosInputsQTD) {
            var inpuSelecionado = todosInputs.filter(':checked').length;
            if (inpuSelecionado) {
                return parseInt($('[name="guiaestudopdf"]').val());
            } else {
                return -1;
            }
        } else {
            return 0;
        }
    }

    function obterCodigoGuiaScorm() {
        var todosInputsQTD = $('.container-guia-estudo-scorm .container-guia--box [type="radio"]').length;
        var todosInputs = $('.container-guia-estudo-scorm .container-guia--box [type="radio"]');
        if (todosInputsQTD) {
            var inpuSelecionado = todosInputs.filter(':checked').length;
            if (inpuSelecionado) {
                return parseInt($('[name="guiaestudoscorm"]').val());
            } else {
                return -1;
            }
        } else {
            return 0;
        }
    }

    return {
        init: init
    };
})();

$(GuiaEstudo.init);