"use strict";

var ListagemAlunos = (function () {

    function init() {
        bindFunctions(); 
    }

    function bindFunctions() {
        getListagemAlunos();
        visualizarComoAluno();
    }

    function getListagemAlunos() {
        $('.lista-alunos').off().click(function () {
            
            var codunidadeaprendizagem = parseInt($('#codunidadeaprendizagem').val()),
                codcursocollege = parseInt($('#codcursocollege').val()),
                coddisciplinacollege = parseInt($('#coddisciplinacollege').val()),
                codturmacollege = parseInt($('#codturmacollege').val());

            new GCS().setObj({
                type: "GET",
                contentType: 'text/html',
                dataType: 'html',
                url: ListaAlunosTurma + '?codunidadeaprendizagem=' + codunidadeaprendizagem
                    + '&codcursocollege=' + codcursocollege
                    + '&coddisciplinacollege=' + coddisciplinacollege
                    + '&codturmacollege=' + codturmacollege,
                showLoad:false,
                success: function (data) {
                    
                    $('#listagem-turma-alunos').html(data);
                    visualizarComoAluno();
                }
            }).executar();

        });
    }

    function visualizarComoAluno() {
            
        $('.visualizar').off().click(function (e) {
            e.stopPropagation();
            $("#modal-visualiza-aluno").removeClass('hide');
            $("body").addClass("bodyWithNoScroll");
            $("#modal-visualiza-aluno").fadeIn();

            var codpessoa = $(this).closest("tr").attr("data-codpessoa");
            var coddisciplina = $("#coddisciplinacollege").attr("value");
            var codturma = $("#codturmacollege").attr("value");
            var url = "http://aluno.slconstruct.saolucas.edu.br/";

            if (location.href.indexOf("homologacao") > -1 || location.href.indexOf("localhost") > -1) {
                url = "http://homologacaoaluno.slconstruct.saolucas.edu.br/";
            } else if (location.href.indexOf("estabilizacao") > -1) {
                url = "http://estabilizacaoaluno.slconstruct.saolucas.edu.br/";
            }
            var teste = `${url}?codpessoa=${codpessoa}&coddisciplina=${coddisciplina}&codturma=${codturma}`;
            console.log(teste);
            
            $("#iframe-visualiza-aluno").html(`<iframe src="${url}?codpessoa=${codpessoa}&coddisciplina=${coddisciplina}&codturma=${codturma}" style="width: 100%; height: 100%;"></iframe>`);

            $('#fechar-visualizacao-aluno').off().click(function () {
                $("body").removeClass("bodywithnoscroll");
                $("#iframe-visualiza-aluno").empty();
                $("#modal-visualiza-aluno").fadeOut();
                $("#modal-visualiza-aluno").addClass('hide');
            });
        });
    }

    return {
        init: init
    };

})();

$(ListagemAlunos.init);

