var Execucoes = (function () {

    function init() {
        bindFunctions();
        initCmps();
        FormValidations.init();
        changeCourse();
        changeTerms();
        changeSections();
        changeEnrollments();
        executanalise();
        $('.btn-retorna-lote').click(getRetornoImportacao);
    }

    function bindFunctions() {
        $('.etapa select').change(marcarSelectSelecionado);
        $('#btnExecutar').click(executanalise);
    }

    function initCmps() {
        $('select').material_select();
    }

    function changeTerms() {
        $('#periodoletivo').change(function () {

            var anossemestre = parseInt($(this).val());
            if (anossemestre) {
                if (anossemestre === 20180) {
                    bloqueiaOpcoes(0);
                } else {
                    bloqueiaOpcoes(1);
                }
            }
        });
    }

    function bloqueiaOpcoes(parametro) {

        debugger;
        var optionCurso = $('select.dropcourse option');
        var optionSections = $('select.dropsections option');
        var optionEnrollments = $('select.dropenrollments option');
        if (parametro === 0) {
            optionCurso.each(function (index) {
                $(this).prop('disabled', false);
                if (parseInt($(this).val()) === 4) {
                    $(this).prop('disabled', true);
                }
            });

            optionSections.each(function (index) {
                $(this).prop('disabled', false);
                if (parseInt($(this).val()) === 4) {
                    $(this).prop('disabled', true);
                }
            });

            optionEnrollments.each(function (index) {
                $(this).prop('disabled', false);
                if (parseInt($(this).val()) === 4) {
                    $(this).prop('disabled', true);
                }
            });

        } else {
            /*optionCurso.each(function () {
                $(this).prop('disabled', false);
                if (parseInt($(this).val()) !== 4) {
                    $(this).prop('disabled', true);
                }
            });

            optionSections.each(function () {
                $(this).prop('disabled', false);
                if (parseInt($(this).val()) !== 4) {
                    $(this).prop('disabled', true);
                }
            });

            optionEnrollments.each(function () {
                $(this).prop('disabled', false);
                if (parseInt($(this).val()) !== 4) {
                    $(this).prop('disabled', true);
                }
            });*/
        }

        //$('select').material_select();
    }

    function changeCourse() {
        $('.dropcourse').change(function () {

            $('.dropsections').val($('.dropcourse option:selected').val());
            $('.dropenrollments').val($('.dropcourse option:selected').val());

            $('select').material_select();

            $('.dropcourse input.select-dropdown').addClass('active_btn');
            $('.dropsections input.select-dropdown').addClass('active_btn');
            $('.dropenrollments input.select-dropdown').addClass('active_btn');
            $('.dropusers input.select-dropdown').addClass('active_btn');
            $('.dropterms input.select-dropdown').addClass('active_btn');
            $('.dropinstituicao input.select-dropdown').addClass('active_btn');
        });
    }


    function changeSections() {
        $('.dropsections').change(function () {

            $('.dropcourse').val($('.dropsections option:selected').val());
            $('.dropenrollments').val($('.dropsections option:selected').val());

            $('select').material_select();

            $('.dropcourse input.select-dropdown').addClass('active_btn');
            $('.dropsections input.select-dropdown').addClass('active_btn');
            $('.dropenrollments input.select-dropdown').addClass('active_btn');
            $('.dropusers input.select-dropdown').addClass('active_btn');
            $('.dropterms input.select-dropdown').addClass('active_btn');
            $('.dropinstituicao input.select-dropdown').addClass('active_btn');
        });
    }

    function changeEnrollments() {
        $('.dropenrollments').change(function () {

            $('.dropcourse').val($('.dropenrollments option:selected').val());
            $('.dropsections').val($('.dropenrollments option:selected').val());

            $('select').material_select();

            $('.dropcourse input.select-dropdown').addClass('active_btn');
            $('.dropsections input.select-dropdown').addClass('active_btn');
            $('.dropenrollments input.select-dropdown').addClass('active_btn');
            $('.dropusers input.select-dropdown').addClass('active_btn');
            $('.dropterms input.select-dropdown').addClass('active_btn');
            $('.dropinstituicao input.select-dropdown').addClass('active_btn');
        });
    }

    function marcarSelectSelecionado() {
        var elem = $(this),
            input = elem.parent().find('input.select-dropdown');

        if (elem.val() === '') {
            input.removeClass('active_btn');
        } else {
            input.addClass('active_btn');
        }
    }

    function executaIntegracaoFael() {
        new GCS().setObj({
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            url: window['urlExecutaIntegracaoFael'],
            success: function (data) {
                if (data.status) {
                    Helper.OpenAlert({ title: "Integração realizada com sucesso", msg: data.msg, classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                    $(".tabs.listas > li > a.active").click();
                }
                else {
                    Helper.OpenAlert({ title: "Ocorreu um erro ao realizar a integração", msg: data.msg, classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            }
        }).executar();

    }

    function executanalise() {

        if ($('#frmExecucoes').valid()) {
            $(this).addClass('disabled executando');
            $('.steps-item:not(:nth-child(-n+1))').attr('class', 'steps-item -todo');
            Analise();
        }
    }

    function Analise() {

        enviarTerms();

        /*new GCS().setObj({
            type: 'GET',
            contentType: 'text/html',
            dataType: 'html',
            url: window['urlExecutaAnalize'] + '?codmodalidade=' + $('.dropcourse :checked').val() + '&anosemestre=' + $('.dropterms :checked').val(),
            success: function (data) {

                var result = JSON.parse(data);
                if (result.status)
                    Helper.OpenAlert({ title: "Integração realizada com sucesso", msg: "", classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                else
                    Helper.OpenAlert({ title: "Ocorreu um erro ao realizar a integração", result: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });

                $('#btnExecutar').removeClass('disabled').removeClass('executando');
            }
        }).executar();*/
    }


    function enviarTerms() {
        if ($('#frmExecucoes').valid()) {
            $(this).addClass('disabled executando');
            $('.steps-item:not(:nth-child(-n+1))').attr('class', 'steps-item -todo');
            enviarArquivo('Terms', successEnviarTerms);
        }
    }

    function enviarUsers() {
        //enviarArquivo('Users', successEnviarUsers);
        if ($('#frmExecucoes').valid()) {
            $(this).addClass('disabled executando');
            $('.steps-item:not(:nth-child(-n+2))').attr('class', 'steps-item -todo');
            enviarArquivo('Users', successEnviarUsers);
        }
    }

    function enviarCourse() {
        enviarArquivo('Course', successEnviarCourse);
    }

    function enviarSections() {
        enviarArquivo('Sections', successEnviarSections);
    }

    function enviarEnrollments() {
        enviarArquivo('Enrollments', successEnviarEnrollments);
    }

    function enviarArquivo(arquivo, success) {
        var aquivoLower = arquivo.toLocaleLowerCase();
        setArquivoLoading('step' + arquivo);

        var valorarquivo;

        valorarquivo = aquivoLower === 'terms' ? 'course' : aquivoLower;

        valorarquivo = aquivoLower === 'terms' ? 'course' : aquivoLower === 'users' ? 'course' : aquivoLower;

        valorarquivo = aquivoLower === 'terms' ? 'course' : aquivoLower === 'users' ? 'course' : aquivoLower;

        new GCS().setObj({
            type: 'POST',
            url: window['urlEnviar' + arquivo],
            data: {
                ['codmodalidade' + aquivoLower]: parseInt($('#codmodalidade' + valorarquivo).val()),
                ['periodo']: '20192',
                ['instituicao']: $('.dropinstituicao option:selected').val()
            },
            success: success,
            error: function () {
                setArquivoError('step' + arquivo);
            },
            showLoad: false,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            processData: true
        }).executar();
    }

    function successEnviarTerms(data) {
        var idStep = 'stepTerms';

        if (data.status) {

            setArquivoDone(idStep);
            enviarUsers();
            console.log('successEnviarTerms: ', data);
        } else {
            setArquivoError(idStep);
        }
    }

    function successEnviarUsers(data) {
        var idStep = 'stepUsers';

        if (data.status) {
            setArquivoDone(idStep);
            enviarCourse();
            console.log('successenviarUsers: ', data);
        } else {
            setArquivoError(idStep);
        }
    }

    function successEnviarCourse(data) {
        var idStep = 'stepCourse';

        if (data.status) {
            setArquivoDone(idStep);
            enviarSections();
            console.log('successEnviarCourse: ', data);
        } else {
            setArquivoError(idStep);
        }
    }

    function successEnviarSections(data) {
        var idStep = 'stepSections';

        if (data.status) {
            setArquivoDone(idStep);
            enviarEnrollments();
            console.log('successEnviarSections: ', data);
        } else {
            setArquivoError(idStep);
        }
    }

    function successEnviarEnrollments(data) {
        var idStep = 'stepEnrollments';

        habilitarExecucao();

        if (data.status) {
            setArquivoDone(idStep);
            console.log('successEnviarEnrollments: ', data);
        } else {
            setArquivoError(idStep);
        }
    }

    function setArquivoError(idStep) {
        habilitarExecucao();

        $('#' + idStep).attr('class', 'steps-item -error');
    }

    function setArquivoLoading(idStep) {
        $('#' + idStep).attr('class', 'steps-item -doing');
    }

    function setArquivoDone(idStep) {
        $('#' + idStep).attr('class', 'steps-item -done');
    }

    function habilitarExecucao() {
        $('#btnExecutar').removeClass('disabled executando');
        //init();
    }

    function getRetornoImportacao() {

        new GCS().setObj({
            type: 'GET',
            url: '/IntegracaoDados/RetornaErroImportacao?idretorno=' + $(this).data('idretornointegracao'),
            success: function (data) {

                if (data.status)
                    Helper.OpenAlert({ title: "Lote retorno com sucesso", msg: data.msg, classtitle: "font-verde", iconclass: "satisfaction", icon: "fa-check-circle" });
                else
                    Helper.OpenAlert({ title: "Algo deu errado no retorno do lote", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            },
            error: function () {
                Helper.OpenAlert({ title: "Não foi possível localizar o lote", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            },
            showLoad: false
            //contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        }).executar();
    }

    return {
        init: init,
        executaIntegracaoFael: $('#exec-integ-fael').click(executaIntegracaoFael)
    };

})();
