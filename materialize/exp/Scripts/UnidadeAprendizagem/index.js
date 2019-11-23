"use strict";

var UnidadeAprendizagemListagemUas = (function () {

    function init() {
        bindFunctions();


        //$.ajax({
        //    url: "https://portais.saolucas.edu.br/modulos/secretaria/avaliacoes.php5",
        //    type: 'GET',
        //    success: function (resp) {
        //        alert(resp);
        //    },
        //    error: function (e) {
        //        alert('Error: ' + e);
        //    }
        //});
    }

    function bindFunctions() {
        $('.clickoption').off().click(ClickWizard);
        //$('.lista-disciplina .collapsible-header').click(listaUAs);
    }


    // #region Atualiza o Wizard quando clica no Step

    function trocarParametroDefaultPorParametrosExcepcionaisWizard(url, codunidadeaprendizagem) {
        let Excepcionais = "";

        if (url.indexOf('LoadDefinicoesGerais') > -1) {
            let codcurso = $("#codcurso").val();
            let coddisciplina = $("#coddisciplina").val();

            Excepcionais = `?codcurso=${codcurso}&coddisciplina=${coddisciplina}&codunidadeaprendizagem=${codunidadeaprendizagem}`;
        }

        return Excepcionais;
    }
    
    function ClickWizard() {
       
        var elemento = $(this);
        var url = $(this).data('href');
        var codunidadeaprendizagem = $('#codunidadeaprendizagem').val() > 0 ? parseInt($('#codunidadeaprendizagem').val()) : 0;
        var parametrosExcepcionais = trocarParametroDefaultPorParametrosExcepcionaisWizard(url, codunidadeaprendizagem);
        var clicadoEstaFinalizado = $(this).parent().hasClass("wizard_new--done");

        verificaUAEstaFinalizada(codunidadeaprendizagem).then(x => {
            if ((x.status && !x.finalizado && clicadoEstaFinalizado) || (x.status && x.finalizado)) {
                new GCS().setObj({
                    type: 'GET',
                    contentType: 'text/html',
                    dataType: 'html',
                    url: url + (!parametrosExcepcionais ? '?codunidadeaprendizagem=' + codunidadeaprendizagem : parametrosExcepcionais),
                    success: function (data) {
                        
                        $('.divPartial').html(data);
                        if (url.indexOf('LoadGuiaEstudo') > -1) {
                            GuiaEstudo.init();
                        } else if (url.indexOf('LoadDefinicoesGerais') > -1) {
                            DefinicoesGerais.init();
                        } else if (url.indexOf('LoadVideo') > -1) {
                            Videos.init();
                        } else if (url.indexOf('LoadInfografico') > -1) {
                            Infografico.init();
                        } else if (url.indexOf('LoadMacrodesafio') > -1) {
                            Macrodesafio.init();
                        } else if (url.indexOf('LoadMicrodesafio') > -1) {
                            Microdesafio.init();
                        } else if (url.indexOf('LoadOrganizacao') > -1) {
                            Organizacao.init();
                        } else if (url.indexOf('LoadConclusao') > -1) {
                            Conclusao.init();
                        }

                        atualizaWizard(elemento, codunidadeaprendizagem);
                    }
                }).executar();
            }
        })


    }

    function verificaUAEstaFinalizada(codunidadeaprendizagem) {
        return new Promise((resolve, reject) => {
            new GCS().setObj({
                type: 'GET',
                url: '/UnidadeAprendizagem/UAEstaFinalizada' + '?codunidadeaprendizagem=' + codunidadeaprendizagem,
                success: function (data) {
                    resolve(data);
                },
                error: function (error) {
                    reject(error);
                }
            }).executar();
        });
    }

    function atualizaWizard(elemento, codunidadeaprendizagem, callback=null) {
        codunidadeaprendizagem > 0 ? codunidadeaprendizagem : 0;
        new GCS().setObj({
            type: 'GET',
            url: '/UnidadeAprendizagem/GetSituacaoEtapasWizard' + '?codunidadeaprendizagem=' + codunidadeaprendizagem,
            success: function (data) {
               
                confereEtapas(data, elemento);
                verificaUALiberada(data);
                if (callback) {
                    callback();
                }
            }
        }).executar();
    }

    function verificaUALiberada(data) {
        
        $('#uaestaliberada').val(data.uaEstaLiberada);
        $('#permissaoGravacao').val(data.permissaoGravacao);
        var UaLiberada = $('#uaestaliberada').val() === 'true' ? true : false;
        var permissaoGravacao = $('#permissaoGravacao').val() === 'true' ? true : false;

        if (UaLiberada || !permissaoGravacao) {
            $('input,button,.btn, [type="radio"] + label').attr('disabled', 'disabled').css('pointer-events', 'none');
            $('div.btn').css('background-color', '#DFDFDF').css('color', '#9F9F9F').css('pointer-events', 'none');
            $('div.btn.visualiza').removeAttr('disabled').css('pointer-events', 'unset').css('background-color','#3d7ae8').css('color','#fff');
            $('[type="radio"]:disabled + label').closest('.container-guia--box').css('background-color', '#DFDFDF').css('color', '#9F9F9F'); 
            $('[type="checkbox"]:disabled + label').closest('.container-video--box').css('background-color', '#DFDFDF').css('color', '#9F9F9F');
            $('[type="checkbox"]:disabled + label').closest('.container-infografico--box').css('background-color', '#DFDFDF').css('color', '#9F9F9F');
            $('[type="checkbox"]:disabled + label').closest('.container-destaques--box').css('background-color', '#DFDFDF').css('color', '#9F9F9F');
            $("i.fas.fa-times").hide();
            $("#modal-alert div *").attr('disabled', false).prop('disabled', false).css('pointer-events', '');
            $("#modal-confirm div *").attr('disabled', false).prop('disabled', false).css('pointer-events', '');
        }
    }


    function bloquearItensSelecionados() {

        var UaLiberada = $('#uaestaliberada').val() === 'true' ? true : false;
        var permissaoGravacao = $('#permissaoGravacao').val() === 'true' ? true : false;
        if (UaLiberada || !permissaoGravacao) {
            $('[type="checkbox"]:checked').attr('disabled', false).prop('disabled', false).css('pointer-events', '');
        }
    }

    function desabilita() {
        
        var UaLiberada = $('#uaestaliberada').val() === 'true' ? true : false;
        var permissaoGravacao = $('#permissaoGravacao').val() === 'true' ? true : false;
        if (UaLiberada || !permissaoGravacao) {
            $('input,button,.btn, [type="radio"] + label').attr('disabled', 'disabled').css('pointer-events', 'none');
            $('div.btn').css('background-color', '#DFDFDF').css('color', '#9F9F9F').css('pointer-events', 'none');
            $('div.btn.visualiza').removeAttr('disabled').css('pointer-events', 'unset').css('background-color', '#3d7ae8').css('color', '#fff');
            $('[type="radio"]:disabled + label').closest('.container-guia--box').css('background-color', '#DFDFDF').css('color', '#9F9F9F');
            $('[type="checkbox"]:disabled + label').closest('.container-video--box').css('background-color', '#DFDFDF').css('color', '#9F9F9F');
            $('[type="checkbox"]:disabled + label').closest('.container-infografico--box').css('background-color', '#DFDFDF').css('color', '#9F9F9F');
            $('[type="checkbox"]:disabled + label').closest('.container-destaques--box').css('background-color', '#DFDFDF').css('color', '#9F9F9F');
            $('.excluir').css('color', '#9F9F9F').css('pointer-events', 'none');
            $("i.fas.fa-times").hide();
            $("#modal-alert div *").attr('disabled', false).prop('disabled', false).css('pointer-events', '');
            $("#modal-confirm div *").attr('disabled', false).prop('disabled', false).css('pointer-events', '');
        }
    }

    function confereEtapas(data, elemento) {
        
        var etapasFinalizadas = data.EtapasFinalizadas;
        var etapasPendentes = data.EtapasPendentes;
        var li = $('#unidadeAprendizagem .wizard_new li');
        li.removeClass();
        if (etapasFinalizadas && etapasFinalizadas.length > 0) {
            etapasFinalizadas = etapasFinalizadas.map(x => x.ordem);

            $.each(li, function (index, elem) {
                
                var etapa = parseInt(li.eq(index).data('etapa'));

                if (etapasFinalizadas.filter(x => x === etapa).length > 0) {
                    
                    li.eq(index).addClass('wizard_new--done');
                } else {
                    li.eq(index).addClass('wizard_new--todo');
                }
            });
        }
        
        elemento.closest('li').removeClass().addClass('wizard_new--doing');
    }

    // #endregion

    //function listaUAs() {

    //    var elemento = $(this);
    //    if (!elemento.hasClass('active')) {
    //        var coddisciplinacollege = $(this).data('coddisciplinacollege');
    //        var codcurriculocollege = $(this).data('codcurriculocollege');

    //        new GCS().setObj({
    //            type: "GET",
    //            dataType: 'html',
    //            contentType: 'text/html',
    //            url: urlObterListaDisciplinaGrid + '?coddisciplinacollege=' + coddisciplinacollege + '&codcurriculocollege=' + codcurriculocollege,
    //            success: function (data) {
    //                $('.lista-disciplina .collapsible-header').siblings('.collapsible-body').html(data);
    //                Editar();
    //            }
    //        }).executar();

    //    }
    //}
    // #region Atualiza o Wizard quando a página abre
    function atualizaWizardQuandoAbreAPagina() {
        var codunidadeaprendizagem = 0;
        new GCS().setObj({
            type: 'GET',
            url: '/UnidadeAprendizagem/GetSituacaoEtapasWizard' + '?codunidadeaprendizagem=' + codunidadeaprendizagem,
            success: function (data) {
                confereEtapasQuandoAbreAPagina(data);
            }
        }).executar();
    }

    function confereEtapasQuandoAbreAPagina(data) {

        var etapasFinalizadas = data.etapasFinalizadas;
        var etapasPendentes = data.etapasPendentes;
        var li = $('#unidadeAprendizagem .wizard_new li');
        li.removeClass();
        if (etapasFinalizadas && etapasFinalizadas.length > 0) {
            etapasFinalizadas = etapasFinalizadas.map(x => x.ordem);

            $.each(li, function (index, elem) {

                var etapa = parseInt(li.eq(index).data('etapa'));

                if (etapasFinalizadas.filter(x => x === etapa).length > 0) {

                    li.eq(index).addClass('wizard_new--done');
                } else {
                    li.eq(index).addClass('wizard_new--todo');
                }
            });
        }
    }
    // #endregion

    function vaiParaEtapa(etapa, codunidadeaprendizagem) {
        
        //var codunidadeaprendizagem = $('#codunidadeaprendizagem').val() > 0 ? parseInt($('#codunidadeaprendizagem').val()) : 0;
        var elemento = $('#unidadeAprendizagem .wizard_new li[data-etapa="' + etapa + '"] a');
        var url = '';
        switch (etapa) {
            case 1:
                url = urlDefinicoesGeraisLoad;
                break;
            case 2:
                url = urlGuiaDeEstudoLoad;
                break;
            case 3:
                url = urlVideoLoad;
                break;
            case 4:
                url = urlInfograficoLoad;
                break;
            case 5:
                url = urlMacroDesafioLoad;
                break;
            case 6:
                url = urlMicroDesafioLoad;
                break;
            case 7:
                url = urlOrganizacaoLoad;
                break;
            case 8:
                url = urlConclusaoLoad;
                break;
            default:
        }

        new GCS().setObj({
            type: 'GET',
            contentType: 'text/html',
            dataType: 'html',
            url: url + '?codunidadeaprendizagem=' + codunidadeaprendizagem,
            success: function (data) {
                $('.divPartial').html(data);
                if (url.indexOf('LoadGuiaEstudo') > -1) {
                    GuiaEstudo.init();
                } else if (url.indexOf('LoadDefinicoesGerais') > -1) {
                    DefinicoesGerais.init();
                } else if (url.indexOf('LoadVideo') > -1) {
                    Videos.init();
                } else if (url.indexOf('LoadInfografico') > -1) {
                    Infografico.init();
                } else if (url.indexOf('LoadMacrodesafio') > -1) {
                    Macrodesafio.init();
                } else if (url.indexOf('LoadMicrodesafio') > -1) {
                    Microdesafio.init();
                } else if (url.indexOf('LoadOrganizacao') > -1) {
                    Organizacao.init();
                } else if (url.indexOf('LoadConclusao') > -1) {
                    Conclusao.init();
                }
            }
        }).executar();

        atualizaWizard(elemento, codunidadeaprendizagem);
    }

    //function Editar() {
    //    $('.collapsible-body .editar').click(function () {
    //        window.location = urlCadastro + '/?codunidadeaprendizagem=' + $(this).closest('tr').data('codunidadeaprendizagem')
    //            + '&coddisciplinacollege=' + $(this).closest('tr').data('coddisciplinacollege')
    //            + '&codcurriculocollege=' + $(this).closest('tr').data('codcurriculocollege');
    //    });
    //}

    return {
        init: init,
        atualizaWizardQuandoAbreAPagina: atualizaWizardQuandoAbreAPagina,
        vaiParaEtapa: vaiParaEtapa,
        atualizaWizard: atualizaWizard,
        desabilita: desabilita,
        bloquearItensSelecionados: bloquearItensSelecionados
    };

    })();

$(UnidadeAprendizagemListagemUas.init);
//$(UnidadeAprendizagemListagemUas.atualizaWizardQuandoAbreAPagina);

