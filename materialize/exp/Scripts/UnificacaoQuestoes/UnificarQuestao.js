"use strict";

var UnificarQuestao = (function () {


    function init() {
        bindFunctions();
    }

    function bindFunctions() {
        $('.modal-open').off().click(openModalInfoGerais);
        initialStateQuestions();
        activeQuestionsSideBar();
        activeQuestionsItemActive();
        activeQuestionsIconNext();
        checkSelected();
        HaveSomeSelected();
        verifyNextOrPrevStyle(1);
        $('ul.tabs .tab a').first().click();
        anchorAlternatives();
        unificarQuestoes();
    }

    function anchorAlternatives() {
        $('.alternativas a').click(function () {
            $('#unificacaoquestao').animate({
                scrollTop: $('.unifica-content__content-question-alternatives').position().top
            }, 500);
            return false;
        });
    }

    function HaveSomeSelected() {
        var count = $('.unifica-content__list-questions [type="checkbox"]:checked').length;
        if (count) {
            $('.unifica-content__save').addClass('active');
        } else {
            $('.unifica-content__save').removeClass('active');
        }
    }

    function checkSelected() {
        $('.unifica-content__list-questions [type="checkbox"]').off().change(function (e) {

            var elementVanilla = e;
            var elementJQuery = $(this);
            var idElement = parseInt(elementJQuery.closest('li').data('codindice'));
            var divs = $('.unifica-content__question-active');

            if (elementVanilla.target.checked) {

                divs.each(function (i, e) {
                    var div = $(this);
                    if (parseInt(e.dataset.codindice) === idElement) {
                        div.find('.content-button').first().addClass('hide');
                        div.find('.content-button').last().removeClass('hide');
                        div.find('.unifica-content__card-content').addClass('active');
                    }
                });
            } else {
                divs.each(function (i, e) {
                    var div = $(this);
                    if (parseInt(e.dataset.codindice) === idElement) {
                        div.find('.content-button').first().removeClass('hide');
                        div.find('.content-button').last().addClass('hide');
                        div.find('.unifica-content__card-content').removeClass('active');

                    }
                });
            }

            HaveSomeSelected();
        });
    }

    function activeQuestionsSideBar() {
        $('.block--').off().click(function () {

            $('.block--').closest('li').find('label').removeClass('active');
            $(this).closest('li').find('label').addClass('active');

            var codIndice = $(this).closest('li').data('codindice');

            var divs = $('.unifica-content__question-active');
            divs.addClass('hide');
            divs.each(function (i, e) {

                if (parseInt(e.dataset.codindice) === codIndice) {
                    $(this).removeClass('hide');
                }
            });
            HaveSomeSelected();
            verifyNextOrPrevStyle(codIndice);
        });
    }

    function activeQuestionsIconNext() {
        $('.unifica-content__options > div:last-child .fas').off().click(function () {

            var element = $(this);
            var NEXT_OR_PREV = element.data('nextorprev') === 'next' ? 1 : -1;
            var elementId = parseInt(element.closest('.unifica-content__question-active').data('codindice')) + NEXT_OR_PREV;
            var ItemListCheckbox = $('.unifica-content__list-questions ul li');

            ItemListCheckbox.each(function (i, e) {

                if (parseInt(e.dataset.codindice) === elementId) {

                    var checks = $('.unifica-content__list-questions ul li');
                    checks.each(function (i, el) {
                        var li = $(this);

                        if (parseInt(el.dataset.codindice) === elementId) {
                            li.find('.block--').click();
                        }
                    });
                }
            });
            HaveSomeSelected();
            verifyNextOrPrevStyle(elementId);
        });
    }

    function verifyNextOrPrevStyle(NEXT_OR_PREV) {
        
        var ItemList = $(`.unifica-content__list-questions ul li[data-codindice="${NEXT_OR_PREV}"]`);


        var styleTrue = { "color": "#131a1d", "pointer-events": "unset" };
        var styleFalse = { "color": "#84a6bd", "pointer-events": "none" };

        var stylesNext = ItemList.next().length > 0 ? styleTrue : styleFalse;
        var stylesPrev = ItemList.prev().length > 0 ? styleTrue : styleFalse;

        $('[data-nextorprev="next"]').css(stylesNext);
        $('[data-nextorprev="prev"]').css(stylesPrev);

        questaoAtual(NEXT_OR_PREV);
    }

    function questaoAtual(atual) {
        var total = $('.unifica-content__list-questions ul li').length;
        $('.unifica-content__save p').html(`${atual}/${total}`);
    }

    function activeQuestionsItemActive() {
        $('.unifica-content__card-content + div button').off().click(function () {

            var element = $(this);
            var elementId = parseInt(element.closest('.unifica-content__question-active').data('codindice'));
            var ItemListCheckbox = $('.unifica-content__list-questions ul li');

            ItemListCheckbox.each(function (i, e) {

                if (parseInt(e.dataset.codindice) === elementId) {

                    var checks = $('.unifica-content__list-questions ul li');
                    checks.each(function (i, el) {
                        var li = $(this);

                        if (parseInt(el.dataset.codindice) === elementId) {
                            li.find('[type="checkbox"]').click();
                        }
                    });
                }
            });

        });
    }


    function initialStateQuestions() {

        var divs = $('.unifica-content__question-active');
        divs.addClass('hide');
        divs.first().removeClass('hide');
    }

    function bindButtomPrevNextModal(elem) {

        var questoesList = [{ coditem: $('.main-question').data('coditem') }];
        var questaoAtual;

        if ($(elem).closest('.unifica-content__div1')) {
            questaoAtual = $('#modal-unificar-questao').attr('data-atual');

            if (questaoAtual === undefined) {
                questaoAtual = 0;
            }
        }

        if ($(elem).closest('.unifica-content__question-active').data('codindice')) {
            questaoAtual = $(elem).closest('.unifica-content__question-active').data('codindice');
        }

        $('.unifica-content__list-questions').find('li').each(function () {

            questoesList.push({
                coditem: $(this).data('coditem')
            });

            console.log(questoesList);
        });

        if (questaoAtual < questoesList.length - 1) {

            $('#modal-unificar-questao .next').off().click(function () {
                questaoAtual = $('.sidebar section p').html();
                if (questaoAtual === "Q") {
                    questaoAtual = 0;
                }
                questaoAtual++;

                if (typeof (questaoAtual) === 'number' && questoesList.length - 1) {
                    $('#modal-unificar-questao').attr('data-atual', questaoAtual);
                    $('#modal-unificar-questao').data('atual', questaoAtual);
                    ObterInformacoesGeraisQuestao(questoesList[questaoAtual].coditem, true);
                }
            });
            $('.header .next').removeClass('inativo');
        } else {
            $('.header .next').addClass('inativo');
        }

        if (questaoAtual > 0) {

            $('#modal-unificar-questao .prev').off().click(function () {
                questaoAtual = parseInt($('.sidebar section p').html());
                questaoAtual--;

                if (typeof (questaoAtual) === 'number' && questaoAtual >= 0) {
                    $('#modal-unificar-questao').attr('data-atual', questaoAtual);
                    $('#modal-unificar-questao').data('atual', questaoAtual);
                    ObterInformacoesGeraisQuestao(questoesList[questaoAtual].coditem, true);
                }
            });
            $('.header .prev').removeClass('inativo');
        } else {
            $('.header .prev').addClass('inativo');
        }
    }

    function unificarQuestoes() {

        $('.unifica-content__save .btn').off().click(function () {

            var codItemPrincipal = $('.main-question').data('coditem');
            var codItensDuplicados = [];
            var obj = {
                codItemPrincipal: codItemPrincipal,
                codItensDuplicados: codItensDuplicados
            };

            $('.unifica-content__list-questions ul li input').each(function () {

                if ($(this).is(':checked')) {
                    codItensDuplicados.push($(this).parent().data('coditem'));
                }
            });

            if (codItensDuplicados.length > 0) {
                Helper.OpenConfirm({
                    title: "Deseja realmente unificar questões?",
                    icon: 'fa-exclamation-triangle',
                    iconclass: 'satisfaction-yellow',
                    msg: '',
                    classtitle: 'font-preto',
                    yes: function () {
                        Helper.CloseConfirm();
                        openModalUnificando();

                        new GCS().setObj({
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(obj),
                            url: urlSalvarUnificacao,
                            showLoad: false,
                            success: function (data) {

                                if (data.status) {

                                    setTimeout(function () {

                                        $('#modal-unificando').modal('close');
                                        openModalInfoGerais(codItemPrincipal, false);
                                    }, 2000);
                                }
                            },
                            error: function (data) {
                                Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                            }
                        }).executar();
                    },
                    no: function () { },
                    textno: 'Não',
                    textsim: 'Sim'
                });
            }

            
        });
    }

    function ObterInformacoesGeraisQuestao(coditem, modalInfoGerais, elem) {

        new GCS().setObj({
            type: 'GET',
            contentType: 'text/html',
            dataType: 'html',
            showLoad: false,
            url: urlObterInformacoesGeraisQuestao + `?coditem=${coditem}`,
            success: function (data) {

                if (modalInfoGerais) {
                    $('#modal-unificar-questao').html(data);
                    ObterMatrizesAssociadas(coditem, modalInfoGerais, elem);
                    bindButtomPrevNextModal(elem);

                    $('.fechar').off().click(function () {
                        $(this).closest('.modal').modal('close');
                    });
                } else {

                    $('#modal-unificar-questao').html(data);
                    $('#modal-unificar-questao').addClass('modal-questao-unificada');
                    $('#modal-unificar-questao').find(".header div").html('<i class="fas fa-check-circle"></i>');
                    $('#modal-unificar-questao').find(".header p").html('Questão unificada!');
                    $("#modal-unificar-questao .content").html(UnificarQuestaoTemplates.obterAbasQuestaoMatriz());

                    $('#modal-unificar-questao .fechar').off().click(function () {
                        $('.modal-questao-unificada').modal('close');
                        $('#modal-load-unificacao').modal({
                            dismissible: false,
                            ready: function () {
                                $(this).closest('.modal').modal('close');
                                location.reload();
                            }
                        }).modal('open');
                    });

                    ObterQuestao(coditem);
                    ObterMatrizesAssociadas(coditem, modalInfoGerais, elem);
                    $('ul.tabs').tabs();
                }
            }
        }).executar();
    }

    function ObterMatrizesAssociadas(coditem, modalInfoGerais, elem) {

        new GCS().setObj({
            type: 'GET',
            contentType: 'text/html',
            dataType: 'html',
            showLoad: false,
            url: urlObterMatrizesAssociadas + `?coditem=${coditem}`,
            success: function (data) {

                if (modalInfoGerais) {

                    $('#modal-unificar-questao .content').html(data);
                    updateCard(elem);
                } else {
                    $('#matriz-unificada').html(data);
                    addClass('Q');
                }
            }
        }).executar();
    }

    function ObterQuestao(coditem) {

        new GCS().setObj({
            type: 'GET',
            contentType: 'text/html',
            dataType: 'html',
            url: urlObterQuestao + `?coditem=${coditem}`,
            showLoad: false,
            success: function (data) {

                $('#questao-unificada').html(data);
            }
        }).executar();
    }

    function openModalInfoGerais(coditem, modalInfoGerais = true) {

        $('#modal-unificar-questao').attr('data-atual', 0);
        var elem = coditem.target;

        if ($(elem).closest('.unifica-content__div1').length > 0) {
            coditem = $('.main-question').data('coditem');
        }

        if ($(elem).closest('.unifica-content__div2').length > 0) {
            coditem = $('.unifica-content__question-active').data('coditem');
        }

        if (modalInfoGerais) {

            $('#modal-unificar-questao').modal({
                dismissible: false,
                ready: function () {
                    ObterInformacoesGeraisQuestao(coditem, modalInfoGerais, elem);
                },
                complete: function () {
                    $('#modal-unificar-questao').removeClass('modal-questao-unificada');
                    $('#modal-unificar-questao').html('');
                }
            }).modal('open');

        } else {

            $('#modal-unificar-questao').modal({
                dismissible: false,
                ready: function () {

                    ObterInformacoesGeraisQuestao(coditem, modalInfoGerais, elem);

                },
                complete: function () {
                    $('#modal-unificar-questao').removeClass('modal-questao-unificada');
                    $('#modal-unificar-questao').html('');
                }
            }).modal('open');
        }
    }

    function openModalUnificando() {

        $('#modal-unificando').modal({dismissible: false}).modal('open');
    }

    function updateCard(elem) {

        var questaoAtual;

        if ($(elem).closest('.unifica-content__div1').length > 0) {
            var letra = $(elem).closest('.unifica-content__div1').find('.unifica-content__letter p').html();
            addClass(letra);
        } else if ($(elem).closest('.unifica-content__question-active').length > 0) {
            questaoAtual = $(elem).closest('.unifica-content__question-active').data('codindice');
            addClass(questaoAtual);
        } else {
            questaoAtual = $('#modal-unificar-questao').data('atual');

            if (questaoAtual === 0) {
                var questaoPrincipal = $('.unifica-content__letter p').html();
                addClass(questaoPrincipal);
            } else {
                addClass(questaoAtual);
            }
        }
    }

    function addClass(data) {

        if (data.constructor === Number) {
            $('#modal-unificar-questao').find(".header p").html('Informações gerais: Questão duplicada');
            $('.sidebar section').removeClass('letra');
            $('.sidebar section').addClass('numero');
            $('.sidebar .numero p').html(data);

        } else {
            $('.sidebar section').removeClass('numero');
            $('.sidebar section').addClass('letra');
            $('.sidebar .letra p').html(data);
        }
    }

    return {
        init: init
    };

})();

$(UnificarQuestao.init);