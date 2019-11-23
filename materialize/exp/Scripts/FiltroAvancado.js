var FiltroAvancado = (function () {
    var $cmpFiltroAvancado,
        $filtroAvancado,
        $btns = {},
        $selects = {},
        $inputValor = {},
        $linhaChips = {},
        $chipFiltro = {},
        $btnInicio = {},
        $btnAnterior = {},
        $btnProximo = {},
        $btnFim = {},
        filtros = [],
        //numberId = 0,
        paginaAtual = 0,        
        qtdPaginas = 0;

    function init() {
        iniciarComponentes();
        iniciarVariaveis();
        getConfig();
        removerGridFiltroMobile();
        checkChipsExistentes();
    }

    function checkChipsExistentes() {
        var chipsAtuais = JSON.parse(localStorage.getItem("filtro-" + controller));
        if (chipsAtuais != null && chipsAtuais.length > 0) {
            $chipFiltro.each(function () {
                $(this).material_chip({
                    data: chipsAtuais
                });
            })

            removerHtmlDoChip($chipFiltro);

            $linhaChips.removeClass('hide');

            atualizarFiltro(1);
        }
    }

    function iniciarVariaveis() {
        $cmpFiltroAvancado = $('.cmp-filtro-avancado');
        $filtroAvancado = $('.filtro-avancado');

        // Filtro condições
        $selects.filtros = $filtroAvancado.find('select.selectCampo');
        $selects.condicoes = $filtroAvancado.find('select.selectCondicao');
        $selects.valor = $filtroAvancado.find('.selectSimNao');

        $inputValor = $filtroAvancado.find('input.inputValor');

        $btns.adicionar = $filtroAvancado.find('.btnAdicionarFiltro');
        $btns.buscar = $filtroAvancado.find('.btnBuscar');

        // Filtro chips
        $linhaChips = $filtroAvancado.find('.linha-chips');
        $chipFiltro = $linhaChips.find('.chips.tags-filtro');

        // Paginação
        $btnInicio = $cmpFiltroAvancado.find('.paginacao .inicio'),
        $btnAnterior = $cmpFiltroAvancado.find('.paginacao .anterior'),
        $btnProximo = $cmpFiltroAvancado.find('.paginacao .proximo'),
        $btnFim = $cmpFiltroAvancado.find('.paginacao .fim');
    }

    function getConfig() {
        new GCS().setObj({
            type: 'GET',
            contentType: false,
            url: '/' + controller + '/GetFiltros',
            success: getConfigSuccess
        }).executar();

        /*
        getConfigSuccess({
            filtros: [
                { nome: 'Nome', tipo: 'text', nomebanco: 'nome', mascara: '' },
                { nome: 'Data da Prova', tipo: 'date', nomebanco: 'dataprova', mascara: '00/00/0000' }
            ],
            controller: 'Acompanhamento'
        });
        */
    }

    function removerGridFiltroMobile() {
        $('.filtro-avancado-mobile .head-grid, .filtro-avancado-mobile .grid-pag').remove();
    }

    function getConfigSuccess(data) {
        filtros = data.filtros;

        montarSelectOpcoesFiltro();
        bindFunctions();

        FormValidations.init();
    }

    function montarSelectOpcoesFiltro() {
        Helper.updateOptions($selects.filtros, filtros.map(function (filtro, index) {
            return { value: index, text: filtro.nome }
        }), 'Escolha um filtro');
    }

    function bindFunctions() {
        $selects.filtros.on('change', changeSelectFiltros);
        $selects.condicoes.on('change', changeSelectCondicoes);
        $btns.buscar.on('click', clickBtnBuscar);
        $btns.adicionar.on('click', clickBtnAdicionar);
        $chipFiltro.on('chip.delete', deleteChip);
        $inputValor.on("keydown", pesquisarOnEnter);

        $('.btn-filtro-mobile').click(abrirFiltroMobile);
        // Paginação
        $btnInicio.on('click', function () {            
            var camppoorder = GetOrdenado();
            atualizarFiltro(1, camppoorder.campo, camppoorder.order);
        });

        $btnAnterior.on('click', function () {
            var camppoorder = GetOrdenado();
            atualizarFiltro(paginaAtual - 1, camppoorder.campo, camppoorder.order);
        });

        $btnFim.on('click', function () {            
            var camppoorder = GetOrdenado();
            atualizarFiltro(qtdPaginas, camppoorder.campo, camppoorder.order);
        });

        $btnProximo.on('click', function () {            
            var camppoorder = GetOrdenado();
            atualizarFiltro(paginaAtual + 1, camppoorder.campo, camppoorder.order);
        });

        $cmpFiltroAvancado.find('select.selectPaginacao').change(function () {
            atualizarFiltro(1);
        });
    }

    function abrirFiltroMobile() {
        $('.filtro-avancado-mobile').modal('open');
    }

    function pesquisarOnEnter(event) {
        
        if (event.which == 13) {            
            if ($selects.condicoes.val() === '') {
                $btns.buscar.click();
            }
            else {
                $(this).closest('.filtro-avancado').find('.btnAdicionarFiltro').click();
                //$btns.adicionar.click();
            }
        }
    }

    function deleteChip(e, chip) {
        var chipsAtuais = $chipFiltro.material_chip('data');

        

        if ($chipFiltro.length > 1) {
            $.each(chipsAtuais, function (i) {
                if (chipsAtuais[i].id === chip.id) {
                    chipsAtuais.splice(i, 1);
                    return false;
                }
            });

            for (var i = 1; i < length; i++) {
                $chipFiltro.eq(i).material_chip({
                    data: chipsAtuais
                });
            }
        }

        if (chipsAtuais.length == 0)
            $linhaChips.addClass('hide');

        localStorage.setItem("filtro-" + controller, JSON.stringify(chipsAtuais));
    }

    function changeSelectFiltros() {
        var item = filtros[parseInt($(this).val())];
        definirSelectCondicao(item.tipo);
        definirMascaraValor(item.mascara);
        definirTipoElementoValor(item.tipo, item.tipobanco, item.opcoes);
    }

    function changeSelectCondicoes() {
        var valor = $(this).val();

        if (valor === 'between')
            definirTipoElementoValor(valor);
        else
            ocultarValorAux();

        focusInputValor(valor);
    }

    function focusInputValor(valor) {
        if (valor !== null) {

            $inputValor.focus();
        }
    }

    function definirSelectCondicao(tipo) {
        var options = [{ value: '', text: 'Condição' }];

        switch (tipo) {
            case 'text':
                options.push({ value: '=', text: 'Igual a' });
                options.push({ value: '<>', text: 'Diferente de' });
                options.push({ value: 'like', text: 'Contenha' });
                options.push({ value: 'like%', text: 'Inicia com' });
                break;

            case 'date':
                options.push({ value: 'between', text: 'Entre' });
            case 'number':
                options.push({ value: '>', text: 'Maior que' });
                options.push({ value: '<', text: 'Menor que' });
            case 'bool':
            case 'dropdown':
                options.push({ value: '=', text: 'Igual a' });
                options.push({ value: '<>', text: 'Diferente de' });
                break;

            default:
                break;
        }

        Helper.updateOptions($selects.condicoes, options);
    }

    function definirMascaraValor(mascara) {
        if (mascara === '')
            $inputValor.unmask();
        else
            $inputValor.mask(mascara);
    }

    function definirTipoElementoValor(tipo, tipobanco, opcoes) {
        if (tipo === 'bool') {
            $('.selectCustomizado').addClass('hide');
            $('.selectSimNao').removeClass('hide');
            $inputValor.addClass('hide');

            if (tipobanco === 'bool') {
                $('.selectSimNao option').eq(1).val(true).end().eq(2).val(false);
            } else {
                $('.selectSimNao option').eq(1).val('sim').end().eq(2).val('nao');
            }
        } else if (tipo === 'between') {
            mostrarValorAux();
        } else if (tipo === 'dropdown') {
            $('.selectCustomizado').removeClass('hide');
            $('.selectSimNao').addClass('hide');
            $inputValor.addClass('hide');

            montarSelectOpcoesCustomizadas(opcoes);
        } else {
            ocultarValorAux();
            $('.selectSimNao').addClass('hide');
            $('.selectCustomizado').addClass('hide');
            $inputValor.removeClass('hide');
        }
    }

    function montarSelectOpcoesCustomizadas(opcoes) {
        Helper.updateOptions($('select.selectCustomizado'), opcoes.map(function (opcao, index) {
            return { value: opcao.Key, text: opcao.Value }
        }), 'Condição');
        console.log(opcoes);
    }

    function mostrarValorAux() {
        $('#divValores')
            .removeClass('m6')
            .addClass('m3')
            .find('input').attr('placeholder', 'Data inicial');
        $('#divValoresAux').removeClass('hide');
        console.log('apaerecer com outro input');
    }

    function ocultarValorAux() {
        if (!$('#divValoresAux').hasClass('hide')) {
            $('#divValoresAux').addClass('hide');
            $('#divValores')
                .removeClass('m3')
                .addClass('m6')
                .find('input').attr('placeholder', 'Digite sua pesquisa');
        }
    }

    function clickBtnBuscar() {
        $('.modal').modal('close');
        atualizarFiltro(1, undefined, undefined, $(this));
    }

    function atualizarFiltro(page, orderby, ascdesc, elem) {
        //if ($filtroAvancado.valid()) {
            var valores = $chipFiltro.material_chip('data').map(function (el) { return el.value; }).join('; '),
                paginacao = parseInt($cmpFiltroAvancado.find('select.selectPaginacao').val()),
                data = {};

            if (valores.length === 0) {
                elem.closest('.filtro-avancado').find('.btnAdicionarFiltro').click();// clickBtnAdicionar();
                setTimeout(atualizarFiltro(page, orderby, ascdesc), 500);
                return;
            }

            data = {
                page: page,
                condicoes: valores,
                lines: paginacao
            }

            if (typeof (orderby) !== 'undefined') {
                data.orderby = orderby;
                data.ascdesc = ascdesc;
            }

            if (typeof (joinadd) !== 'undefined')
            {
                data.joinadd = joinadd;
            }

            if (typeof (qtdlinhas) !== 'undefined') {
                data.lines = qtdlinhas;
                $('.selectPaginacao').val(qtdlinhas);
                $('select').material_select();
            }

            new GCS().setObj({
                type: 'GET',
                url: '/' + controller + '/Pesquisa',
                data: data,
                success: function (data) {
                    $cmpFiltroAvancado.find('.grid').html(data);
                    setPaginacao();
                    setOrdenacao();
                    setAcoesQTDRegistrosMobile();

                    if (typeof (onGridReady) !== 'undefined')
                        onGridReady();
                },
                contentType: false,
                processData: true,
                dataType: 'html'
            }).executar();
        //}
    }


    function atualizarFiltroExcel(page, orderby, ascdesc, elem) {
        //if ($filtroAvancado.valid()) {
       
        var valores = $chipFiltro.material_chip('data').map(function (el) { return el.value; }).join('; '),
            paginacao = parseInt($cmpFiltroAvancado.find('select.selectPaginacao').val()),
            data = {};

        if (valores.length === 0) {
            elem.closest('.filtro-avancado').find('.btnAdicionarFiltro').click();// clickBtnAdicionar();
            setTimeout(atualizarFiltro(page, orderby, ascdesc), 500);
            return;
        }

        data = {
            page: page,
            condicoes: valores,
            lines: 500000
        }

        if (typeof (orderby) !== 'undefined') {
            data.orderby = orderby;
            data.ascdesc = ascdesc;
        }

        if (typeof (joinadd) !== 'undefined') {
            data.joinadd = joinadd;
        }

        if (typeof (qtdlinhas) !== 'undefined') {
            data.lines = qtdlinhas;
            $('.selectPaginacao').val(qtdlinhas);
            $('select').material_select();
        }

        new GCS().setObj({
            type: 'GET',
            url: '/' + controller + '/PesquisaExcel',
            data: data,
            success: function (data) {
                montaHtmlTabelaHide(data);

     
            },
            contentType: false,
            processData: true,
            dataType: 'html',
        }).executar();
        //}
    }

    function montaHtmlTabelaHide(data) {
        var html = '';
        var dados = JSON.parse(data);
        //console.log(dados);
        var datcampo = [];
        $('.grid table:first thead tr th').not('.width-acao').each(function () {
            
            datcampo.push($(this).data("campo"));
            

        });
        console.log(datcampo);

        for (var i = 0; i < datcampo.length; i++) {
            $('.grid-hide table thead tr').append('<th>' + datcampo[i] + '</th>');
        }

        $.each(dados, function (index, data) {
            html += '<tr>';

            $.each(data, function (indice, el) {
                
                if (datcampo.indexOf(indice) >= 0) {
                    if (el !== null) {
                        html += '<td>' + el + '</td>';
                    } else {
                        html += '<td>Sem registro</td>';
                    }                 
                };              
            });
            html += '</tr>';
        });
        $('.grid-hide table tbody').append(html);
        console.log(html);
    }

    function remontaEstrutura(tabela) {
        //debugger;
        setTimeout(function () {
            tabela.remove();
            var estrutura = '<table><thead><tr></tr></thead><tbody></tbody></table>';
            $('.filtro-avancado-desktop').find('.grid-hide').append(estrutura);
        }, 1500);
    }

    function setAcoesQTDRegistrosMobile() {
        $('.acoesQTDregistrosMobile').removeClass('hide');
    }
    
    function setPaginacao() {
        if ($cmpFiltroAvancado.find('.grid [name="qtdresgistros"]').val() !== '0') {
            // Dados
            var seAnterior = JSON.parse($cmpFiltroAvancado.find('.grid [name="seanterior"]').val().toLowerCase()),
                seProximo = JSON.parse($cmpFiltroAvancado.find('.grid [name="seproximo"]').val().toLowerCase());

            paginaAtual = parseInt($cmpFiltroAvancado.find('.grid [name="paginaatual"]').val());
            qtdPaginas = parseInt($cmpFiltroAvancado.find('.grid [name="qtdpaginas"]').val());

            // Controle de visibilidade
            if (seAnterior) {
                $btnInicio.removeClass('hide');
                $btnAnterior.removeClass('hide');

            } else {
                $btnInicio.addClass('hide');
                $btnAnterior.addClass('hide');
            }

            if (seProximo) {
                $btnProximo.removeClass('hide');
                $btnFim.removeClass('hide');

            } else {
                $btnProximo.addClass('hide');
                $btnFim.addClass('hide');
            }

            // Visualizacao
            $cmpFiltroAvancado.find('.paginacao .contador .pag-atual').text(paginaAtual);
            $cmpFiltroAvancado.find('.paginacao .contador .pag-total').text(qtdPaginas);

            $cmpFiltroAvancado.find('.paginacao').removeClass('hide');
            $cmpFiltroAvancado.find('.head-grid').removeClass('hide');
        } else {
            $cmpFiltroAvancado.find('.paginacao').addClass('hide');
            $cmpFiltroAvancado.find('.head-grid').addClass('hide');
        }
    }

    function setOrdenacao() {
        $cmpFiltroAvancado.find('.grid .ordena').off().on('click', function () {
            atualizarFiltro(paginaAtual, $(this).data('campo'), $(this).find('i').hasClass('fa-sort-desc') ? 'desc' : 'asc');
        })
    }

    function clickBtnAdicionar() {
        //console.log($(this));
        preenchendoTodosValores($(this));

        if ($filtroAvancado.valid()) {
            //console.log(filtros);
            var chipsAtuais = $chipFiltro.material_chip('data'),
                valor = $inputValor.hasClass('hide') ?
                    /*$selects.valor.val()*/ $('#divValores select:not(.hide)').val() :
                    typeof ($($inputValor).data('mask')) !== 'undefined' && filtros[parseInt($selects.filtros.val())].removermascara ? 
                        $inputValor.cleanVal() :
                        $('#divValoresAux').hasClass('hide') ? $inputValor.val() : $inputValor.val() + '|' + $('#inputValorAux').val(),
                chip = criarNovaChips($selects.filtros.val(), $selects.condicoes, valor);

            if (chipsAtuais.length === 0 || chipsAtuais[chipsAtuais.length - 1].value !== chip.value) {
                chipsAtuais.push(chip);

                $chipFiltro.each(function () {
                    $(this).material_chip({
                        data: chipsAtuais
                    });
                })

                removerHtmlDoChip($chipFiltro);

                localStorage.setItem("filtro-" + controller, JSON.stringify($chipFiltro.material_chip('data')));

                $linhaChips.removeClass('hide');
            } else {
                $btns.buscar.click();
            }
        }
    }

    /**
     * @description Verifica se há mais de um filtro na página (Ex.: Mobile e desktop) e duplica os valores preenchidos
     */
    function preenchendoTodosValores($elem) {

        if ($filtroAvancado.length > 1) {
            $closestCmpFiltroAvancado = $elem.closest('.cmp-filtro-avancado');

            $selects.filtros.val($closestCmpFiltroAvancado.find('select.selectCampo').val());
            $selects.condicoes.val($closestCmpFiltroAvancado.find('select.selectCondicao').val());
            $selects.valor.val($closestCmpFiltroAvancado.find('select.selectSimNao').val());
            $inputValor.val($closestCmpFiltroAvancado.find('input.inputValor').val());
        }
    }

    function filterValDiffEmpty() {
        return this.value !== '';
    }

    function removerHtmlDoChip($chipFiltro) {
        $chipFiltro.find('.chip').each(function () {
            var el = $(this);
            var icone = el.find('i').get(0).outerHTML;

            el.html(el.text().replace('close', icone))
        });
    }

    function criarNovaChips(selectCampo, selectCondicao, inputValor) {
        var item = filtros[parseInt(selectCampo)];

        //numberId++;

        if (item.tipo === 'time') {
            if (inputValor.length === 1 || inputValor.length === 2) { inputValor += " hs"; }
            else if (inputValor.length === 3) { inputValor += "hs"; }
            else if (inputValor.length === 6) { inputValor = inputValor.substring(0, 5); }
        }

        filtroValor = item.nomebanco + selectCondicao.val() + inputValor;
        //filtroValor = filtroValor.replace(/\s/g, '');
        filtroValor = filtroValor.trim(' ');

        //console.log(selectCondicao.eq(0).find('option:selected').text());
        //console.log(selectCondicao.eq(1).find('option:selected').text());
        //console.log(selectCondicao.val());

        filtroLabel = item.nome + '<strong> ' + selectCondicao.eq(0).find('option:selected').text() + '</strong> ' + inputValor;
        /*switch (selectCondicao) {
            case "=":
                filtroLabel += ' igual a ';
                break;
            case "<>":
                filtroLabel += ' diferente de ';
                break;
            case "<":
                filtroLabel += ' menor que ';
                break;
            case ">":
                filtroLabel += ' maior que ';
                break;
            case "like":
                filtroLabel += ' que contenha ';
                break;
            case "between":
                filtroLabel += ' entre ';
                break;
            case "like%":
                filtroLabel += ' inicia com ';
                break;
            default:
                filtroLabel += '';
                break;
        }
        filtroLabel += '</strong> ' + inputValor;*/

        return { tag: filtroLabel, value: filtroValor, id: Date.now() };

        //return '<input type="checkbox" class="filled-in" id="' + filtroId + '" value="' + filtroValor + '" checked="checked" />' + '<label class="estilizaChipsBusca" for="' + filtroId + '">' + filtroLabel + '</label>';
    }

    function iniciarComponentes() {
        $('.dropdown-button').dropdown({
            constrainWidth: false,
            belowOrigin: true,
            stopPropagation: true
        });

       

        $('ul.tabs').tabs();
        $('select').material_select();
        $('.modal').modal();
        $('.chips').material_chip();
    }

    function limpaBusca() {
        $chipFiltro.material_chip({ data: [] });
    }

    function GetOrdenado()
    {
        var order = undefined;
        var campo = undefined;
        var asc = $cmpFiltroAvancado.find('i.fa-sort-asc');
        var desc = $cmpFiltroAvancado.find('i.fa-sort-desc');

        if (asc.length > 0) {
            campo = $(asc).parent().data('campo');
            order = 'desc';
        }
        
        if (desc.length > 0) {
            campo = $(desc).parent().data('campo');
            order = 'asc';
        }
            
        return {campo:campo, order:order}
    }

    return {
        init: init,
        atualizarFiltro: atualizarFiltro,
        atualizarFiltroExcel: atualizarFiltroExcel,
        remontaEstrutura: remontaEstrutura
    }

})();

$(FiltroAvancado.init);