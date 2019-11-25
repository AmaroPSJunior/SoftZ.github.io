var requisicoes = [];
var GCS = function () {
    var obj = {
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        processData: false,
        showLoad: true
    };

    function setObj(novoObj) {
        $.extend(obj, novoObj);

        return this;
    };

    function executar() {
        if (obj.showLoad) {
            Master.showLoad();
        }

        requisicoes.push({ url: obj.url, showLoad: obj.showLoad });

        $.ajax({
            method: obj.type,
            url: obj.url,
            contentType: obj.contentType,
            dataType: obj.dataType,
            data: obj.data,
            processData: obj.processData,
            cache: false,
            success: function (data) {
                obj.success(data, obj.scope);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (typeof (obj.error) === 'undefined') _erroPadrao({ jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown });
                else obj.error({ jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown });
            },
            complete: function () {
                //debugger;
                var indexes = $.map(requisicoes, function (o, index) {
                    if (o.url === obj.url) {
                        return index;
                    }
                });

                var index = indexes[0];

                if (index !== -1)
                    requisicoes.splice(index, 1);

                var requisicoesShowLoad = $.map(requisicoes, function (o, index) {
                    if (o.showLoad) {
                        return o;
                    }
                });

                if (requisicoesShowLoad.length === 0 && obj.showLoad)
                    Master.hideLoad();

                if (obj.complete)
                    obj.complete();
            }
        });
    };

    function _erroPadrao(data) {
        console.error(data);
        if (navigator.onLine)
            Materialize.toast('Um erro ocorreu!', 4000);
        else
            Materialize.toast('Não há conexão com a Internet', 4000);
    }

    return {
        setObj: setObj,
        executar: executar
    };
};