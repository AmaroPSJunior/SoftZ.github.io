'use strict';

var Helper = (function () {
    function init() {
        $('ul.tabs').tabs();
        $('select').material_select();

        ExportHtmlToExcel();

    };

    function showImageFilePreview(input, acao) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = acao;/*function (e) {
                $('#preview').attr('src', e.target.result);
                $('.cont-img.img-tema').removeClass('hide');
                $('#uploadTema').addClass('hide');
            }*/

            reader.readAsDataURL(input.files[0]);
        }

        return this;
    };

    function debounce(func, wait) {
        let timer = null;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(func, wait);
        }
    }

    function validarRespostasMicro() {

        let promises = [];
        if ($("#qtdOpcoesResposta").val()) {
            let qtd = JSON.parse($("#qtdOpcoesResposta").val());

            for (let i = 1; i <= qtd; i++) {
                promises.push(new Promise((resolve, reject) =>
                    resolve(Helper.validateCKEditor(`editor-micro${i}`))
                ));
            }
        }

        return Promise.all(promises);
    }

    function equalAnswers(editors) {
        if (editors.length > 1) {
            var answers = editors.map((ed, index) => removeHTMLTagFromText(CKEDITOR.instances[`editor-micro${index + 1}`].getData().replace(/&nbsp;/g, "")).trim(), true);
            var removeEquals = answers.filter((ed, index) => answers.indexOf(ed) === index);
            if (removeEquals.length < editors.length) return false;
        }
        return true;
    }

    function refreshGoogleDocsIframe() {
        setTimeout(() => {
            var iframeConteudo = document.querySelector("iframe");
            if (iframeConteudo && iframeConteudo.contentWindow.length == 0) {
                for (var i = 0; i < 3; i++) {
                    if (document.querySelector("iframe").contentWindow.length > 0)
                        break;

                    var ifrmTemp = document.createElement("iframe");
                    ifrmTemp.setAttribute("src", iframeConteudo.src);
                    ifrmTemp.setAttribute('width', '100%');
                    ifrmTemp.setAttribute('height', '560px');
                    ifrmTemp.setAttribute('frameBorder', '0');

                    if (iframeConteudo.outerHTML && ifrmTemp.outerHTML) {
                        document.querySelector("iframe").outerHTML = ifrmTemp.outerHTML;
                    }
                }
            }
        }, 4000);
    }

    function addClassScroll() {
        $('table').each(function () {

            var qtdColunasHead = $($(this).find("thead tr")[0]).find("th").length;

            var trBody = $(this).find("tbody tr");
            var qtdColunasBody = trBody.length > 0 ? $(trBody[0]).find("td").length : 0;


            if (qtdColunasHead == qtdColunasBody) {

                $(this).closest('table').closest("div").addClass('scroll');
            }
        });
    }

    function inicializarMascaras() {
        var SPMaskBehavior = function (val) {
            return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
        },
            spOptions = {
                onKeyPress: function (val, e, field, options) {
                    field.mask(SPMaskBehavior.apply({}, arguments), options);
                }
            };

        $('.date , .future-date').mask('00/00/0000');
        $('.time').mask('00:00:00');
        $('.time2').mask('000:00');
        $('.time-short').mask('00:00');
        $('.date_time').mask('00/00/0000 00:00');
        $('.tagHoraDataProva').mask('00');
        $('.cep').mask('00000-000');
        $('.phone').mask('0000-0000');
        $('.phone_with_ddd').mask('(00) 0000-0000');
        $('.phone_cel').mask('(00) 0000-0000');
        $('.money').mask('000.000.000.000.000,00', { reverse: true });
        $('.money2').mask('000.000.000.000.000,000', { reverse: true });
        $('.nota').mask('0000,00', { reverse: true });
        $('.nota-avaliacao').mask('Z00,00', {
            reverse: true,
            translation: {
                'Z': {
                    pattern: /[1]/
                }
            }
        });
        $('.rg').mask('99999999999999');

        $('.cnpj').mask('00.000.000/0000-00');
        $('.cpf').mask('000.000.000-00');
        $('.matricula').mask('00000000000');
        $('.telefone').mask(SPMaskBehavior, spOptions);

        //$.mask.rules.n = /[0-9])?/;
        $('.latitude').mask('-00.000000');
        $('.longitude').mask('-00.000000');
        $('.ensinomask').mask('ZY00', {
            translation: {
                'Z': {
                    pattern: /[1-2]/
                },
                'Y': {
                    pattern: /[0-9]/
                }
            }
        });
        //$('#AnoEnsinoMedioInicio').mask('0000');
        //$('#AnoEnsinoMedio').mask('0000');
        $('.ano').mask('0000');
        $('.carga-horaria').mask('000');
        $('.porcentagem').mask('000,00', { reverse: true });
        $('.porcentagem2').mask('000,000', { reverse: true });
        //$('.porcentagem-decimal').mask('000,00');
        //$('.valorporcentagem').mask('000');
    };

    function scrollTopElement(elScroll, top = 350, elPai = 'html, body') {
        $(elPai).animate({
            scrollTop: $(elScroll).offset().top = top
        }, 1000);
    }

    function updateOptionsNovo($select, options, label = 'Selecione') {
        var html = '<option value="" disabled ' + (options.length === 1 ? '' : 'selected ') + '>' + label + '</option>';//'<option value="" disabled selected>' + $select.find('option:first').text() + '</option>';
        html += options.map(function (option) {
            return '<option value="' + option.value + '">' + option.text + '</option>';
        }).join('');

        $select.html(html);

        if (options.length > 0) {
            $select.removeAttr('disabled');
            if (options.length === 1) {
                setTimeout(function () {
                    $select.val($select.find('option:not([disabled]):first').val());

                    $select.trigger('change');
                    $select.material_select();

                }, 1);
            }
        } else {
            $select.attr('disabled', 'disabled');
        }
        //_styleSelect2['default'].customize($select);
        //$select.trigger('change');
        //$select.material_select();
    };

    function validateCKEditor(idCKE) {

        let ckeEditor = $(`#cke_${idCKE}`);

        if (!removeHTMLTagFromText(CKEDITOR.instances[idCKE].getData().replace(/&nbsp;/g, "")).trim() && CKEDITOR.instances[idCKE].getData().indexOf("img") <= 0) {
            ckeEditor.attr("class", "component-invalid");
            return false;
        }

        ckeEditor.removeAttr("class", "component-invalid");
        return true;
    }

    function updateOptions($select, options, label = 'Selecione') {

        var html = '';
        if (options.length !== 1) {
            html = '<option value="" disabled selected="selected">' + label + '</option>';//'<option value="" disabled selected>' + $select.find('option:first').text() + '</option>';
        }

        html += options.map(function (option) {
            return '<option value="' + option.value + '" ' + (options.length === 1 ? 'selected="selected"' : '') + '>' + option.text + '</option>';
        }).join('');

        $select.html(html);

        if (options.length > 0) {
            $select.removeAttr('disabled');

        } else {
            $select.attr('disabled', 'disabled');
        }

        $select.trigger('change');
        $select.material_select();
        setTimeout(function () {
            if (options.length === 1) {
                $select[0].options[0].selected = true;
            }
        }, 1);
    }

    function updateRadios($container, radios) {
        var html = '';//'<option value="" disabled selected>' + $select.find('option:first').text() + '</option>';
        html += radios.map(function (radio) {

            //<input name="group1" type="radio" id="test1" />
            //<label for="test1">Red</label>
            var name = $container.data('name');

            return '<div class="item-radio">' +
                '<input name="' + name + '" type="radio" id="' + name + '_' + radio.value + '" value="' + radio.value + '" required />' +
                '<label for="' + name + '_' + radio.value + '">' + radio.text + '</label>' +
                '</div>';
        }).join('');

        $container.html(html);

        $container.find('input[type="radio"]').trigger('change');
    };

    function stringToDate(dateStr) {
        var data = dateStr.split("/");

        return new Date(data[2], data[1] - 1, data[0]);
    };

    function pegarDataERetornarDiaSemana(elData, elDiaSemana) {
        elDiaSemana.each(function (index, el) {
            $(el).text(stringToDate(elData.text()).toLocaleString(window.navigator.language, { weekday: 'long' }).split("-")[0]);
        });
    };

    function pegarDataERetornarMes(elData, elDiaMes, tipo) {
        console.log(elDiaMes);
        elDiaMes.each(function (index, el) {
            console.log(stringToDate(elData.text()).toLocaleString(window.navigator.language, { month: tipo }));
            $(el).text(stringToDate(elData.text()).toLocaleString(window.navigator.language, { month: tipo }));
        });
    };

    function getFormData($form) {
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function (n, i) {
            indexed_array[n['name']] = n['value'];
        });

        return indexed_array;
    };

    function getFormDataStringify($form) {
        return JSON.stringify(Helper.getFormData($form));
    };

    function removeHTMLTagFromText(text, excludeImageLink = false) {
        if (excludeImageLink)
            return text.replace(/(<([^>]+)>)/ig, "");
        else
            return text.replace(/(<(?!img|href)([^>]+)>)/ig, "");
    }

    function isJSON(data) {
        try {
            JSON.parse(data);
            return true;
        } catch (e) {
            return false;
        }
    }


    //mensagens
    function OpenConfirm(option) {
        //option{ open, close, no, yes, icon, iconclass, title, classtitle, msg, classmsg, classmodal, textsim, textno }
        option.icon = option.icon ? option.icon : "fa-check-circle";
        option.iconclass = option.iconclass ? option.iconclass : "satisfaction";
        option.classtitle = option.classtitle ? option.classtitle : "font-verde";
        option.classmsg = option.classmsg ? option.classmsg : "";
        option.title = option.title ? option.title : "";
        option.msg = option.msg ? option.msg : "";
        option.textsim = option.textsim ? option.textsim : "Sim";
        option.textno = option.textno ? option.textno : "Não";


        $("#modal-confirm").modal({
            dismissible: false,
            ready: function (modal) {

                modal.find(".icon-msg")
                    .removeClass()
                    .addClass("fa " + option.icon + " icon-msg " + option.iconclass);

                modal.find(".title-msg")
                    .removeClass()
                    .addClass("--semi-bold -capitalize title-msg " + option.classtitle)
                    .html(option.title);

                modal.find(".msg")
                    .removeClass()
                    .addClass("msg " + option.classmsg)
                    .html(option.msg);

                modal.find(".btn-no").unbind();
                if (option.no)
                    $("#modal-confirm").find(".btn-no").bind('click', option.no);

                modal.find(".btn-yes").unbind();
                if (option.yes)
                    $("#modal-confirm").find(".btn-yes").bind('click', option.yes);

                if (option.textsim)
                    modal.find(".btn-yes").html(option.textsim);


                if (option.textno)
                    modal.find(".btn-no").html(option.textno);

                if (option.classmodal)
                    modal.addClass(option.classmodal);

                if (option.open)
                    option.open();
            },
            complete: function () {
                if (option.close)
                    option.close();
            }
        });
        $("#modal-confirm").modal('open');
    };

    function CloseConfirm() {
        $("#modal-confirm").modal('close');
    };

    /**
     * @param {object} option {open, close, icon, iconclass, title, classtitle, msg, classmsg, textobtn, classmodal}
     */
    function OpenAlert(option) {
        option.icon = option.icon ? option.icon : "fa-check-circle";
        option.iconclass = option.iconclass ? option.iconclass : "satisfaction";
        option.classtitle = option.classtitle ? option.classtitle : "font-verde";
        option.classmsg = option.classmsg ? option.classmsg : "";
        option.title = option.title ? option.title : "";
        option.msg = option.msg ? option.msg : "";
        option.textobtn = option.textobtn ? option.textobtn : 'fechar';

        $("#modal-alert").modal({
            dismissible: false,
            ready: function (modal) {
                modal.find(".icon-msg")
                    .removeClass()
                    .addClass("fa " + option.icon + " icon-msg " + option.iconclass);

                modal.find(".title-msg")
                    .removeClass()
                    .addClass("--semi-bold -capitalize title-msg " + option.classtitle)
                    .html(option.title);

                modal.find(".msg")
                    .removeClass()
                    .addClass("msg " + option.classmsg)
                    .html(option.msg);

                modal.find(".modal-close")
                    .text(option.textobtn);

                if (option.classmodal) {
                    modal.addClass(option.classmodal);
                }

                if (option.open)
                    option.open();
            },
            complete: function () {
                if (option.close)
                    option.close();
            }
        });
        $("#modal-alert").modal('open');
    };

    function CloseAlert() {
        $("#modal-alert").modal('close');
    };

    function OpenLoad(option) {

        //option{ open, close, icon, iconclass, title, classtitle, msg, classmsg }
        option.icon = option.icon ? option.icon : "fa-check-circle";
        option.iconclass = option.iconclass ? option.iconclass : "satisfaction";
        option.classtitle = option.classtitle ? option.classtitle : "font-verde";
        option.classmsg = option.classmsg ? option.classmsg : "";
        option.classprogress = option.classprogress ? option.classprogress : "";
        option.title = option.title ? option.title : "";
        option.msg = option.msg ? option.msg : "";


        $("#modal-load").modal({
            dismissible: false,
            ready: function (modal) {
                modal.find(".icon-msg")
                    .removeClass()
                    .addClass("fa " + option.icon + " icon-msg " + option.iconclass);

                modal.find(".title-msg")
                    .removeClass()
                    .addClass("--semi-bold -capitalize title-msg " + option.classtitle)
                    .html(option.title);

                modal.find(".msg")
                    .removeClass()
                    .addClass("msg " + option.classmsg)
                    .html(option.msg);

                modal.find('.progress').addClass(option.classprogress);

                if (option.open)
                    option.open();
            },
            complete: function () {
                if (option.close)
                    option.close();
            }
        });
        $("#modal-load").modal('open');
    };

    function CloseLoad() {
        $("#modal-load").modal('close');

    };

    function OpenGeneric(option) {
        //option{ open, close, content, footer }
        $("#modal-generic").modal({
            dismissible: false,
            ready: function (modal) {
                modal.find(".modal-content").html("");
                modal.find(".modal-content").html(option.content);

                modal.find(".modal-footer").html("");
                modal.find(".modal-footer").html(option.footer);

                if (option.open)
                    option.open();
            },
            complete: function () {
                if (option.close)
                    option.close();
            }
        });
        $("#modal-generic").modal('open');
    }

    function CloseGeneric() {
        $("#modal-generic").modal('close');

    };

    function getBase64(file, hidden) {
        if (file && file.size == 0) {
            Helper.OpenAlert({ title: "Ops", msg: "Arquivo inválido", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            return;
        }

        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            var array = reader.result.split(",");
            var base64 = array[array.length - 1];
            hidden.val(base64).trigger('change');
        };
        reader.onerror = function (error) {
            console.log('Error in convert base64: ', error);
        };
    };

    function getBase64callback(file, callback, element) {
        if (file && file.size == 0) {
            Helper.OpenAlert({ title: "Ops", msg: "Arquivo inválido", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            return;
        }



        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            var array = reader.result.split(",");
            var base64 = array[array.length - 1];
            callback(base64, element);
        };
        reader.onerror = function (error) {
            console.log('Error in convert base64: ', error);
        };
    };

    function showLoad() {
        $('.page-loader').css('zIndex', 9999)
        $('.page-loader').addClass('active');

    };

    function hideLoad() {
        $('.page-loader').css('zIndex', "")
        $('.page-loader').removeClass('active');
    };

    /**
     * @param {any} obj {url, fileName, success}
     */
    function downloadFile(obj) {
        var ajax = new XMLHttpRequest();
        ajax.open("GET", obj.url, true);
        ajax.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    //console.log(typeof this.response); // should be a blob
                    var blob = new Blob([this.response], { type: "application/octet-stream" });
                    var fileName = obj.fileName;
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();

                    if (obj.success) {
                        obj.success();
                    }

                } else if (this.responseText != "") {
                    console.log(this.responseText);
                }
            } else if (this.readyState == 2) {
                if (this.status == 200) {
                    this.responseType = "blob";
                } else {
                    this.responseType = "text";
                }
            }
        };
        ajax.send(null);
    }

    function ExportHtmlToExcel() {
        (function ($, window, document, undefined) {

            var pluginName = "table2excel",

                defaults = {
                    exclude: ".noExl",
                    name: "Table2Excel",
                    filename: "table2excel",
                    fileext: ".xlsx",
                    exclude_img: true,
                    exclude_links: true,
                    exclude_inputs: true
                };

            // The actual plugin constructor
            function Plugin(element, options) {
                this.element = element;
                // jQuery has an extend method which merges the contents of two or
                // more objects, storing the result in the first object. The first object
                // is generally empty as we don't want to alter the default options for
                // future instances of the plugin
                //
                this.settings = $.extend({}, defaults, options);
                this._defaults = defaults;
                this._name = pluginName;
                this.init();
            }

            Plugin.prototype = {
                init: function () {
                    var e = this;

                    var utf8Heading = "<meta http-equiv=\"content-type\" content=\"application/vnd.ms-excel; charset=UTF-8\">";
                    e.template = {
                        head: "<html xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:excel\" xmlns=\"http://www.w3.org/TR/REC-html40\">" + utf8Heading + "<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>",
                        sheet: {
                            head: "<x:ExcelWorksheet><x:Name>",
                            tail: "</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>"
                        },
                        mid: "</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>",
                        table: {
                            head: "<table background-color: red;>",
                            tail: "</table>"
                        },
                        foot: "</body></html>"
                    };

                    e.tableRows = [];

                    // get contents of table except for exclude
                    $(e.element).each(function (i, o) {
                        var tempRows = "";
                        $(o).find("tr").not(e.settings.exclude).each(function (i, p) {

                            tempRows += "<tr>";
                            $(p).find("td,th").not(e.settings.exclude).each(function (i, q) { // p did not exist, I corrected

                                var rc = {
                                    rows: $(this).attr("rowspan"),
                                    cols: $(this).attr("colspan"),
                                    flag: $(q).find(e.settings.exclude)
                                };

                                if (rc.flag.length > 0) {
                                    tempRows += "<td> </td>"; // exclude it!!
                                } else {
                                    if (rc.rows & rc.cols) {
                                        tempRows += "<td>" + $(q).html() + "</td>";
                                    } else {
                                        tempRows += "<td";
                                        if (rc.rows > 0) {
                                            tempRows += " rowspan=\'" + rc.rows + "\' ";
                                        }
                                        if (rc.cols > 0) {
                                            tempRows += " colspan=\'" + rc.cols + "\' ";
                                        }
                                        tempRows += "/>" + $(q).html() + "</td>";
                                    }
                                }
                            });

                            tempRows += "</tr>";
                            //console.log(tempRows);

                        });
                        // exclude img tags
                        if (e.settings.exclude_img) {
                            tempRows = exclude_img(tempRows);
                        }

                        // exclude link tags
                        if (e.settings.exclude_links) {
                            tempRows = exclude_links(tempRows);
                        }

                        // exclude input tags
                        if (e.settings.exclude_inputs) {
                            tempRows = exclude_inputs(tempRows);
                        }
                        e.tableRows.push(tempRows);
                    });

                    e.tableToExcel(e.tableRows, e.settings.name, e.settings.sheetName);
                },

                tableToExcel: function (table, name, sheetName) {
                    var e = this, fullTemplate = "", i, link, a;

                    e.format = function (s, c) {
                        return s.replace(/{(\w+)}/g, function (m, p) {
                            return c[p];
                        });
                    };

                    sheetName = typeof sheetName === "undefined" ? "Sheet" : sheetName;

                    e.ctx = {
                        worksheet: name || "Worksheet",
                        table: table,
                        sheetName: sheetName
                    };

                    fullTemplate = e.template.head;

                    if ($.isArray(table)) {
                        for (i in table) {
                            //fullTemplate += e.template.sheet.head + "{worksheet" + i + "}" + e.template.sheet.tail;
                            fullTemplate += e.template.sheet.head + sheetName + i + e.template.sheet.tail;
                        }
                    }

                    fullTemplate += e.template.mid;

                    if ($.isArray(table)) {
                        for (i in table) {
                            fullTemplate += e.template.table.head + "{table" + i + "}" + e.template.table.tail;
                        }
                    }

                    fullTemplate += e.template.foot;

                    for (i in table) {
                        e.ctx["table" + i] = table[i];
                    }
                    delete e.ctx.table;

                    var isIE = /*@cc_on!@*/false || !!document.documentMode; // this works with IE10 and IE11 both :)            
                    //if (typeof msie !== "undefined" && msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // this works ONLY with IE 11!!!
                    if (isIE) {
                        if (typeof Blob !== "undefined") {
                            //use blobs if we can
                            fullTemplate = e.format(fullTemplate, e.ctx); // with this, works with IE
                            fullTemplate = [fullTemplate];
                            //convert to array
                            var blob1 = new Blob(fullTemplate, { type: "text/html" });
                            window.navigator.msSaveBlob(blob1, getFileName(e.settings));
                        } else {
                            //otherwise use the iframe and save
                            //requires a blank iframe on page called txtArea1
                            txtArea1.document.open("text/html", "replace");
                            txtArea1.document.write(e.format(fullTemplate, e.ctx));
                            txtArea1.document.close();
                            txtArea1.focus();
                            sa = txtArea1.document.execCommand("SaveAs", true, getFileName(e.settings));
                        }

                    } else {
                        var blob = new Blob([e.format(fullTemplate, e.ctx)], { type: "application/vnd.ms-excel" });
                        window.URL = window.URL || window.webkitURL;
                        link = window.URL.createObjectURL(blob);
                        a = document.createElement("a");
                        a.download = getFileName(e.settings);
                        a.href = link;

                        document.body.appendChild(a);

                        a.click();

                        document.body.removeChild(a);
                    }

                    return true;
                }
            };

            function getFileName(settings) {
                return (settings.filename ? settings.filename : "table2excel");
            }

            // Removes all img tags
            function exclude_img(string) {
                var _patt = /(\s+alt\s*=\s*"([^"]*)"|\s+alt\s*=\s*'([^']*)')/i;
                return string.replace(/<img[^>]*>/gi, function myFunction(x) {
                    var res = _patt.exec(x);
                    if (res !== null && res.length >= 2) {
                        return res[2];
                    } else {
                        return "";
                    }
                });
            }

            // Removes all link tags
            function exclude_links(string) {
                return string.replace(/<a[^>]*>|<\/a>/gi, "");
            }

            // Removes input params
            function exclude_inputs(string) {
                var _patt = /(\s+value\s*=\s*"([^"]*)"|\s+value\s*=\s*'([^']*)')/i;
                return string.replace(/<input[^>]*>|<\/input>/gi, function myFunction(x) {
                    var res = _patt.exec(x);
                    if (res !== null && res.length >= 2) {
                        return res[2];
                    } else {
                        return "";
                    }
                });
            }

            $.fn[pluginName] = function (options) {
                var e = this;
                e.each(function () {
                    if (!$.data(e, "plugin_" + pluginName)) {
                        $.data(e, "plugin_" + pluginName, new Plugin(this, options));
                    }
                });

                // chain jQuery functions
                return e;
            };

        })(jQuery, window, document);
    }


    return {
        init: init,
        showImageFilePreview: showImageFilePreview,
        inicializarMascaras: inicializarMascaras,
        updateOptions: updateOptions,
        updateRadios: updateRadios,
        stringToDate: stringToDate,
        pegarDataERetornarDiaSemana: pegarDataERetornarDiaSemana,
        pegarDataERetornarMes: pegarDataERetornarMes,
        getFormData: getFormData,
        getFormDataStringify: getFormDataStringify,
        OpenConfirm: OpenConfirm,
        OpenAlert: OpenAlert,
        CloseConfirm: CloseConfirm,
        CloseAlert: CloseAlert,
        OpenLoad: OpenLoad,
        CloseLoad: CloseLoad,
        getBase64: getBase64,
        OpenGeneric: OpenGeneric,
        CloseGeneric: CloseGeneric,
        showLoad: showLoad,
        hideLoad: hideLoad,
        downloadFile: downloadFile,
        getBase64callback: getBase64callback,
        ExportHtmlToExcel: ExportHtmlToExcel,
        removeHTMLTagFromText: removeHTMLTagFromText,
        validateCKEditor: validateCKEditor,
        validarRespostasMicro: validarRespostasMicro,
        isJSON: isJSON,
        refreshGoogleDocsIframe: refreshGoogleDocsIframe,
        scrollTopElement: scrollTopElement,
        debounce: debounce,
        addClassScroll: addClassScroll,
        equalAnswers: equalAnswers
    };
})();

$(Helper.init);

