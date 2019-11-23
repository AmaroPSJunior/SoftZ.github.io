"use strict";

var ListagemPerfis = (function () {

    function init() {
        bindFunctions();
    }

    function bindFunctions() {
        excluir();
    }

    function excluir() {
        $('.excluir').off().click(function () {

            var codPerfil = $(this).closest('tr').find('.acao').data('codperfil');
            var tr = $(this).parents("tr");


            Helper.OpenConfirm({
                title: "Deseja excluir?",
                icon: 'fa-exclamation-triangle',
                iconclass: 'satisfaction-yellow',
                msg: '',
                classtitle: 'font-preto',
                yes: function () {

                    new GCS().setObj({
                        type: 'GET',
                        url: urlExcluirPerfil + '?codperfil=' + codPerfil,
                        success: function (data) {
                            if (data.status) {
                                //sucesso
                                tr.remove();
                                
                            } else {
                                if (data.msgUser) {
                                    Helper.OpenAlert({ title: "Não foi possível excluir", msg: data.msgUser, classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                                } else {
                                    Helper.OpenAlert({ title: "Não foi possível excluir", msg: 'Ocorreu um erro ao excluir', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                                }
                            }
                        },
                        Error: function () {
                            Helper.OpenAlert({ title: "Não foi possível excluir", msg: 'Ocorreu um erro ao excluir', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                        }
                    }).executar();
                    Helper.CloseConfirm();
                },
                no: function () {

                },
                textno: 'Cancelar',
                textsim: 'Excluir'
            }); 
        });
    }

    return {
        init: init
    };

})();

$(ListagemPerfis.init);