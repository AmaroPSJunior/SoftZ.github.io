"use strict";

var ListagemQuestoesTemplates = (function () {

    function obterTemplateFiltroTag(nome) {
        return `<div class="chip filtro-tag">
                <span class="nome">${nome}</span>
                <i class="close material-icons">close</i>
               <div>`;
    }

    function obterBotaoVerificarDuplicidade() {
        return `<td class="td-btn btnVerificarDuplicidades">
                    <button class="waves-effect waves-light btn right unificacao-btn-color unificar-questao-unidade">
                        <div class="verificar-duplicidades">
                            <i class="material-icons left">cached</i>Verificar Duplicidades
                        </div>
                    </button>
                    ${ obterBotaoCarregamento()}
                </td>`;
    }


    function obterBotaoUnificada(coditem, idColumnNumber) {
        var opcoesMenuResultado = {
            verificarDuplicidades: true,
            unificarResultados: false
        };

        return `<td class="td-btn btnUnificada">
                    <a class="waves-effect waves-light btn right unificacao-btn-color-unificada dropdown-button" data-activates='unificada-option-${ idColumnNumber }'>
                        <i class="material-icons left">fiber_manual_record</i>Unificada <i class="material-icons right">arrow_drop_down</i>
                    </a>
                    ${ obterOpcoesDropDownResultado(coditem, idColumnNumber, opcoesMenuResultado) }
                    ${ obterBotaoCarregamento()}
                </td>`;
    }

    function obterBotaoResultado(coditem, idColumnNumber) {
        var opcoesMenuResultado = {
            verificarDuplicidades: true,
            unificarResultados: true
        };

        return ` <td class="td-btn btnResultado">
                    <a class="waves-effect waves-light btn right unificacao-btn-color-resultado dropdown-button" data-activates='unificada-result-option-${ idColumnNumber }'>
                        <i class="material-icons left">fiber_manual_record</i>Resultados<i class="material-icons right">arrow_drop_down</i>
                    </a>
                    ${ obterOpcoesDropDownResultado(coditem, idColumnNumber, opcoesMenuResultado) }
                    ${ obterBotaoCarregamento()}
                </td>`;
    }

    function obterBotaoNenhumResultado(coditem, idColumnNumber) {
        var opcoesMenuResultado = {
            verificarDuplicidades: true,
            unificarResultados: false
        };
        return ` <td class="td-btn">
                    <a class="waves-effect waves-light btn right unificacao-btn-color-sem-resultado dropdown-button" data-activates='unificada-result-option-${ idColumnNumber }'>
                        <i class="material-icons left">fiber_manual_record</i>Sem Resultados<i class="material-icons right">arrow_drop_down</i>
                    </a>
                    ${ obterOpcoesDropDownResultado(coditem, idColumnNumber, opcoesMenuResultado) }
                    ${ obterBotaoCarregamento()}
                </td>`;
    }

    function obterBotaoCarregamento() {
        return `<button class="waves-effect waves-light btn right unificacao-btn-color btn-loading">
                    <div class="loader-unitario-valor">Verificando...</div>
                    <div class="loader-btn-unificacao progress progress-margin">
                        <div class="indeterminate"></div>
                    </div>
                </button>`;
    }

    function obterOpcoesDropDownResultado(coditem, idColumnNumber, opcoesMenuResultado) {
        var htmlVerificarDuplicidades = opcoesMenuResultado.verificarDuplicidades ? obterVerificarDuplicidadesDropDown() : "";
        var htmlUnificarQuestao = opcoesMenuResultado.unificarResultados ? obterUnificarQuestaoDropDown(coditem) : "";
        
        return `<ul id='unificada-option-${idColumnNumber}' data-questao="1" class='dropdown-content unificada-options'>
                    <li><a class="waves-effect waves-light btn transparent btn-verificar-duplicidade-unificada unificar-questao-unidade"><i class="material-icons left">cached</i>Verificar Duplicidades</a></li>
             </ul>
            <ul id='unificada-result-option-${idColumnNumber}' data-questao="1" class='dropdown-content unificada-options'>
                ${ htmlVerificarDuplicidades }
                ${ htmlUnificarQuestao }
            </ul>`;
    }

    function obterVerificarDuplicidadesDropDown() {
        return `<li>
                    <a class="waves-effect waves-light btn transparent btn-verificar-duplicidade-unificada unificar-questao-unidade">
                        <i class="material-icons left">cached</i>Verificar Duplicidades
                    </a>
                </li>`;
    }

    function obterUnificarQuestaoDropDown(coditem) {
        return `<li>
                    <a href="${ urlUnificarQuestao }?coditem=${coditem}" class="waves-effect waves-light btn transparent btn-verificar-duplicidade-unificada unificar-resultados">
                        <i class="material-icons left">format_align_right</i>Unificar Resultados
                    </a>
                </li>`;
    }

    return {
        obterTemplateFiltroTag,
        obterBotaoVerificarDuplicidade,
        obterBotaoUnificada,
        obterBotaoResultado,
        obterBotaoCarregamento,
        obterBotaoNenhumResultado
    };
})();
