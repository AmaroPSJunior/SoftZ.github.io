"use strict";

var Conclusao = (function () {

    function init() {
        bindFunctions();
    }

    function bindFunctions() {
        Editar();
        Finalizar();
    }

    function Editar() {
        $('#conclusao .editar').off().click(function () {
            $(".wizard_new li").filter((x, elem) => $(elem).data("etapa") == 1).find("a").click();
        });
    }

    function Finalizar() {
        $('#conclusao .finalizar').off().click(function () {
            var codunidadeaprendizagem = $('#codunidadeaprendizagem').val();
            var atualEtapaUA = parseInt($(".wizard_new .wizard_new--doing").data("etapa"));
            var proximaEtapaUA = atualEtapaUA + 1;

            if (codunidadeaprendizagem) {
                new GCS().setObj({
                    type: 'GET',
                    url: urlSalvarConclusao + '?codunidadeaprendizagem=' + codunidadeaprendizagem,
                    success: function (data) {
                        if (data && data.status) {
                            Helper.OpenAlert({ title: "UA concluída com sucesso!", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                            setTimeout(function () { window.location = "Catalogo"; }, 3000);
                        } else {
                            Helper.OpenAlert({ title: "Ops", msg: 'Não foi possível concluir.', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                        }
                    }
                }).executar();
            }
        });
    }

    return {
        init: init
    };
})();

$(Conclusao.init);