"use strict";

var UnificarQuestaoTemplates = (function () {

    function obterAbasQuestaoMatriz() {
        return `<div class="row">
                <div class="col s12">
                    <ul class="tabs">
                        <li class="tab col s3"><a class="active" href="#questao-unificada">Questão</a></li>
                        <li class="tab col s3"><a href="#matriz-unificada">Matriz</a></li>
                    </ul>
                </div>
                <div id="questao-unificada" class="content-tab col s12">
                </div>
                <div id="matriz-unificada" class="content-tab col s12">
                </div>
            </div>`;
    }

    return {
        obterAbasQuestaoMatriz
    };
})();
