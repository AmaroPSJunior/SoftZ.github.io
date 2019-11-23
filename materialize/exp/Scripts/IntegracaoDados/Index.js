var Index = (function () {


    function init() {
        initCmps();
        $('ul.tabs').tabs('select_tab', 'listaUsuarios');
    }

    function initCmps() {
        $('.tooltipped').tooltip({ html: true });
        $('ul.tabs').tabs({
            onShow: onTabShow
        });
    }

    function onTabShow(tab) {
        let url = tab.data('url');

        if (url) {
            let id = $(tab).attr('id'),
                callback;
            
            switch (id) {
                case 'execucoes':
                    callback = Execucoes.init;
                    break;

                case 'listaUsuarios':
                    callback = ListaUsuarios.init;
                    break;

                case 'listaDisciplinas':
                    callback = ListaDisciplinas.init;
                    break;

                case 'listaMatriculas':
                    callback = ListaMatriculas.init;
                    break;
                case 'listaAlunosFael':
                    Execucoes.executaIntegracaoFael;
                    callback = ListaAlunosFael.init;
                    break;

            }

            tab.find('.page-loader').addClass('active');

            new GCS().setObj({
                type: 'GET',
                contentType: 'text/html',
                dataType: 'html',
                url: url,
                success: function (data) {
                    $('#conteudoAbas > .active .conteudo').html(data);
                    clickPaginacao();

                    if (callback)
                        callback(tab);
                    $('.tooltipped').tooltip({ delay: 50 });
                },
                complete: function () {
                    tab.find('.page-loader').removeClass('active');
                }
            }).executar();
        }
    }

    function clickPaginacao() {

        $('.paginacao').off().click(function () {

            let idurl = $('#conteudoAbas > .active').data('url');

            if (idurl) {
                //let id = $(tab).attr('id'),
                //    callback;
                //
                //var aux = id;
                //
                //var idurl = $('#' + aux + '').data('url');

                var paginaatual = parseInt($(this).data('pagina'));

                new GCS().setObj({
                    type: 'GET',
                    contentType: 'text/html',
                    dataType: 'html',
                    url: idurl + '/?page=' + paginaatual,
                    success: function (data) {

                        let id = $('#conteudoAbas > .active').attr('id');
                        
                        switch (id) {

                            case 'listaUsuarios':
                                $('#divGridUsuario').html(data);
                                break;

                            case 'listaDisciplinas':
                                $('#divGridDisciplina').html(data);
                                break;

                            case 'listaMatriculas':
                                $('#divGridMatricula').html(data);
                                break;
                            case 'listaAlunosFael':
                                $('#divGridAlunosFael').html(data);
                                break;
                        }
                                               

                        clickPaginacao();
                    }
                }).executar();
            }
         });    
    }




    return {
        init: init
    };

})();

$(Index.init);