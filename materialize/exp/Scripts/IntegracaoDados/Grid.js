var Grid = (function () {
    var paginaAtual = 1,
        qtdPaginas = 0,
        $btnInicio = {},
        $btnAnterior = {},
        $btnProximo = {},
        $btnFim = {},
        $abaAtiva = {},
        $selectQtdPorPagina = {},
        $inputPesquisa = {};

    function init() {
        iniciarVariaveis();
        bindFunctions();
        setPaginacao();
        setOrdenacao();
    }

    function iniciarVariaveis() {
        $abaAtiva = $('#conteudoAbas > .active');

        // Paginação
        $btnInicio = $abaAtiva.find('.paginacao .inicio');
        $btnAnterior = $abaAtiva.find('.paginacao .anterior');
        $btnProximo = $abaAtiva.find('.paginacao .proximo');
        $btnFim = $abaAtiva.find('.paginacao .fim');
        $selectQtdPorPagina = $abaAtiva.find('select.selectPaginacao');
        $inputPesquisa = $abaAtiva.find('.input-pesquisa');

        $abaAtiva.find('.filtros .btn').removeClass('active');
    }

    function bindFunctions() {
        var botoesPaginacao = $('#conteudoAbas .active .botoes-paginacao');
        $btnInicio.off().click(irInicio);
        $btnAnterior.off().click(irAnterior);
        $btnProximo.off().click(irProximo);
        $btnFim.off().click(irFim);

        $selectQtdPorPagina.change(function () {
            atualizarFiltro(1);
        });
        $inputPesquisa.off();
        $inputPesquisa.bindWithDelay("keyup", pesquisar, 1000);
        $inputPesquisa.on('paste', pesquisar);

        $abaAtiva.find('.filtros .btn').off().click(filtroClick);
    }

    function irInicio() {
        var campoOrder = GetOrdenado();
        atualizarFiltro(1, campoOrder.campo, campoOrder.order);
    }

    function irAnterior() {
        var campoOrder = GetOrdenado();
        atualizarFiltro(paginaAtual - 1, campoOrder.campo, campoOrder.order);
    }

    function irProximo() {
        var campoOrder = GetOrdenado();
        atualizarFiltro(paginaAtual + 1, campoOrder.campo, campoOrder.order);
    }

    function irFim() {
        var campoOrder = GetOrdenado();
        atualizarFiltro(qtdPaginas, campoOrder.campo, campoOrder.order);
    }

    function irPagina(pagina) {
        var campoOrder = GetOrdenado();
        atualizarFiltro(pagina, campoOrder.campo, campoOrder.order);
    }

    function pesquisar() {
        var valor = $(this).val();
        var campos = [];
        var campoOrder = GetOrdenado();

        if (valor == undefined || valor == null) {
            valor = '';
        }

        $abaAtiva.find('th.ordena').each(function () {
            campos.push($(this).data('campo'))
        });

        atualizarFiltro(1, campoOrder.campo, campoOrder.order);
    }

    function filtroClick() {

        var $btn = $(this);
        var campoOrder = GetOrdenado();
        $btn.toggleClass('active');

        atualizarFiltro(1, campoOrder.campo, campoOrder.order);
    }

    function atualizarFiltro(page, orderby, ascdesc) {
        var paginacao = parseInt($selectQtdPorPagina.val()),
            pesquisa = getPesquisa(),
            data = {
                page: page,
                lines: paginacao,
                where: pesquisa.valor,
                columns: pesquisa.campos,
                filters: getFiltros()
            };

        if (typeof (orderby) !== 'undefined') {
            data.orderby = orderby;
            data.ascdesc = ascdesc;
        }

        if (typeof (qtdlinhas) !== 'undefined') {
            data.lines = qtdlinhas;
            $('.selectPaginacao').val(qtdlinhas);
            $('select').material_select();
        }

        new GCS().setObj({
            type: 'POST',
            url: $abaAtiva.data('url'),
            data: data,
            success: function (data) {

                $('#conteudoAbas .active .conteudo').html(data);
                setPaginacao();
                setOrdenacao();

                if (typeof (onGridReady) !== 'undefined')
                    onGridReady();

                defineCorBotoesUsuarios();
            },
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            processData: true,
            dataType: 'html'
        }).executar();
    }







    //Marca cor no botao de filtros

    function defineCorBotoesUsuarios(data) {
        var dadosDaTabela = $('#listaUsuarios table tbody tr');

        var ocorrenciaLeve = dadosDaTabela.find('.email_.warning');
    }














    function getPesquisa() {
        var valor = $inputPesquisa.val();
        var campos = [];

        if (valor == undefined || valor == null) {
            valor = '';
        }

        $abaAtiva.find('th.ordena').each(function () {
            campos.push($(this).data('campo'))
        });

        return {
            valor: valor,
            campos: campos
        };
    }

    function getFiltros() {
        var filtros = [];

        $abaAtiva.find('.filtros .btn.active').each(function () {
            filtros.push($(this).data('filtro'));
        });

        return filtros;
    }

    function GetOrdenado() {
        var order;
        var campo;

        var asc = $abaAtiva.find('i.sort-asc');
        var desc = $abaAtiva.find('i.sort-desc');

        if (asc.length > 0) {
            campo = asc.parent().data('campo');
            order = 'desc';
        }

        if (desc.length > 0) {
            campo = desc.parent().data('campo');
            order = 'asc';
        }

        return { campo: campo, order: order }
    }

    function setPaginacao() {
        if ($abaAtiva.find('.conteudo [name="qtdresgistros"]').val() !== '0') {
            // Dados
            var seAnterior = JSON.parse($abaAtiva.find('.conteudo [name="seanterior"]').val().toLowerCase()),
                seProximo = JSON.parse($abaAtiva.find('.conteudo [name="seproximo"]').val().toLowerCase());

            paginaAtual = parseInt($abaAtiva.find('.conteudo [name="paginaatual"]').val());
            qtdPaginas = parseInt($abaAtiva.find('.conteudo [name="qtdpaginas"]').val());

            // Controle de visibilidade
            if (seAnterior) {
                $btnInicio.removeClass('disabled');
                $btnAnterior.removeClass('disabled');

            } else {
                $btnInicio.addClass('disabled');
                $btnAnterior.addClass('disabled');
            }

            if (seProximo) {
                $btnProximo.removeClass('disabled');
                $btnFim.removeClass('disabled');

            } else {
                $btnProximo.addClass('disabled');
                $btnFim.addClass('disabled');
            }

            // Visualizacao
            //$abaAtiva.find('.paginacao .contador .pag-atual').text(paginaAtual);
            //$abaAtiva.find('.paginacao .contador .pag-total').text(qtdPaginas);

            //montarPaginacao(paginaAtual, qtdPaginas);

            $abaAtiva.find('.paginacao').removeClass('hide');
            $abaAtiva.find('.head-grid').removeClass('hide');
        } else {
            $abaAtiva.find('.paginacao').addClass('hide');
            $abaAtiva.find('.head-grid').addClass('hide');
        }
    }

    function setOrdenacao() {
        $abaAtiva.find('.grid .ordena').off().on('click', function () {
            atualizarFiltro(paginaAtual, $(this).data('campo'), $(this).find('i').hasClass('sort-asc') ? 'asc' : 'desc');
        })
    }

    function montarPaginacao(paginaAtual, qtdPaginas) {
        var conteudo = '';

        for (var i = 1; i <= qtdPaginas; i++) {
            var classe = paginaAtual == i ? 'active' : 'waves-effect';
            conteudo += '<li class="' + classe + '"><a href="#!" data-pagina="' + i + '">' + i + '</a></li>';
        }

        $abaAtiva.find('.pagination').html(conteudo);

        $('.pagination a').off().on('click', function () {
            irPagina($(this).data('pagina'));
        });
    }


    function clickPaginacao() {

        var paginaatual = parseInt($(this).data('pagina'));

        new GCS().setObj({
            type: 'GET',
            contentType: 'text/html',
            dataType: 'html',
            url: '/IntegracaoDados/ListaMatriculas?page=' + paginaatual,
            success: function (data) {
                $('#divGridMatricula').html(data);
                $('.paginacao').click(clickPaginacao);


            }
        }).executar();
    }






    return {
        init: init
    };

})();