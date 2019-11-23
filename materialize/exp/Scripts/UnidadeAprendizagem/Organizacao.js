"use strict";

var Organizacao = (function () {

    function init() {
        functionBase();
        bindFunctions();
    }

    function functionBase() {
        sortable();
        addItemModal();
    }


    function sortable() {
        var sortableComponent = $(".sortable");
        if (sortableComponent.length > 0) {
            sortableComponent.sortable();
            sortableComponent.disableSelection();
        }
    }

    function addItemModal() {
        $(".btn-addItem").on("click", function () {
            $('#addItem-modal').modal({ dismissible: false }).modal('open');
        });
    }

    function SalvarOrdem($el) {
        var array = [];

        //$('.sortable li').map(function () {
        //    array.push($(this).data('codunidadeaprendizagemtrilha'));
        //});

        $el.map(function () {
            array.push($(this).data('codunidadeaprendizagemtrilha'));
        });

        var anosemestre = $el.closest('.abas-vertical').find('ul li a.active');

        var obj = {
            listaobj: array,
            codunidadeaprendizagem: $('#codunidadeaprendizagem').val(),
            ano: anosemestre.data('ano'),
            semestre: anosemestre.data('semestre')
        };

        new GCS().setObj({
            dataType: 'json',
            url: urlSalvarOrganizacao,
            data: JSON.stringify(obj),
            type: 'POST',
            success: function (data) {
                UnidadeAprendizagemListagemUas.vaiParaEtapa(8, $('#codunidadeaprendizagem').val());
            },
            error: function (data) {
                //Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            }
        }).executar();
    }

    function LoadItensAnoSemestre() {

        $('.abas-vertical ul li a').click(function () {

            var ano = $(this).data('ano');
            var semestre = $(this).data('semestre');
            var codunidadeaprendizagem = $('#codunidadeaprendizagem').val();

            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: '/UnidadeAprendizagem/LoadOrganizacaoAnoSemestre?codunidadeaprendizagem=' + codunidadeaprendizagem + '&ano=' + ano + '&semestre=' + semestre,
                success: function (data) {

                    var id = ano + '_' + semestre;
                    $('#' + id).html(data);
                    sortable();
                    salvarorganizacao();
                    UnidadeAprendizagemListagemUas.desabilita();
                },
                error: function (err) {
                    Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            }).executar();
        });
    }

    function salvarorganizacao() {

        $('.salvarorganizacao').click(function () {

            SalvarOrdem($(this).closest('.active').find('ul li'));
        });
    }

    function bindFunctions() {
        $('#btnSalvarOrganizacao').click(function () {
            var codunidadeaprendizagem = $('#codunidadeaprendizagem').val();
            var atualEtapaUA = parseInt($(".wizard_new .wizard_new--doing").data("etapa"));
            var proximaEtapaUA = atualEtapaUA + 1;

            if (codunidadeaprendizagem) {
                new GCS().setObj({
                    type: 'GET',
                    url: urlFinalizarEtapaWizard + '?codUnidadeAprendizagem=' + codunidadeaprendizagem + '&etapaCadastroUnidadeAprendizagemEnum=' + atualEtapaUA,
                    success: function (data) {
                        if (data && data.status) {
                            UnidadeAprendizagemListagemUas.vaiParaEtapa(proximaEtapaUA, codunidadeaprendizagem);
                        }
                    },
                    error: function (err) {
                        Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                    }
                }).executar();
            }
        });

        $('ul.tabs').tabs();
        LoadItensAnoSemestre();
        $('.abas-vertical ul li a.active').click();
    }

    return {
        init: init
    };
})();

$(Organizacao.init);