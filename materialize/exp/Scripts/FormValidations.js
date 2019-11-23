'use strict';

var ValidationMethods = {
    cpfValidate: function cpfValidate(cpf) {
        var stripped = cpf.replace(/(\.|-)/g, '');
        if (stripped.length !== 11 || /^(.)\1+$/.test(stripped)) return false;
        var arr = stripped.split('').map(Number);

        return [10, 11].every(function (n) {
            var calc = arr.slice(0, n - 1).reduce(function (p, d, i) {
                return p + parseInt(d, 10) * (n - i);
            }, 0);
            var remainder = calc * 10 % 11;

            if (remainder === 10 || remainder === 11) remainder = 0;
            return remainder === parseInt(arr.slice(n - 1, n).join(''), 10);
        });
    },

    Future: function Future(value) {
        //debugger;
        moment.locale('pt-BR');
        var dataInicio = moment(value, 'DD/MM/YYYY');
        var DataAtual = moment();
        var DataMinima = moment('01/01/1900', "DD/MM/YYYY");
        console.log(dataInicio <= DataAtual);
        console.log(dataInicio >= DataMinima);
        return dataInicio <= DataAtual && dataInicio >= DataMinima;

    },
    date: function date(value, element) {
        //debugger;
        var dataValida = this.optional(element) || /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/.test(value);
        if ($(element).hasClass('future-date')) {
            var dataFutura = ValidationMethods.Future(value);
            return dataValida && dataFutura;
        } else {
            return dataValida;
        }
    },
    cpf: function cpf(value, element) {
        return this.optional(element) || ValidationMethods.cpfValidate(value);
    },
    futureDate: function futureDate(value, element) {
        //debugger;
        var dataValida = this.optional(element) || /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/.test(value);
        var dataFutura = ValidationMethods.Future(value);
        return dataValida && dataFutura;
    },
    url: function url(value, element) {
        return /(http|https|ftp):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(value);
    }
};

var FormValidations = {
    errorClass: 'invalid',
    init: function init() {
        var _this = this;

        this.forms = {};
        this.addRules();

        $('form[data-js="form-validate"]').each(function (index, form) {
            return _this.addValidation($(form));
        });
    },
    addValidation: function addValidation($form) {
        var _this2 = this;

        var rand = '' + Math.floor(Math.random() * 100000);
        $form.removeAttr('instance');
        $form.attr('instance', rand);

        this.forms[rand] = $form.validate({
            ignore: ':hidden:not(.select-wrapper:visible select)',
            errorClass: this.errorClass,
            errorPlacement: function errorPlacement() { },

            highlight: function highlight(element) {
                _this2.highlightUnhighlight($(element), 'highlight');
            },
            unhighlight: function unhighlight(element) {
                _this2.highlightUnhighlight($(element), 'unhighlight');
            }
        });
    },
    destroy: function destroy($form) {
        this.forms[$form.attr('instance')].destroy();
    },
    highlightUnhighlight: function highlightUnhighlight($el, action) {
        
        if ($el.is('input[type="file"]')) {
            this.validateSelect($el, $el.closest('.file-field').find('.file-path'));
        }
        if ($el.is('input.select-dropdown')) {
            this.validateSelect($el.next().next(), $el);
        } else if ($el.is('select')) {
            this.validateSelect($el.prev().prev(), $el);
        } else if ($el.is(':radio')) {
            this[action]($el.add($('input[name="' + $el.attr('name') + '"]').not($el)));
        } else {
            this[action]($el);
        }
    },
    highlight: function highlight($el) {
        $el.addClass(this.errorClass);
    },
    unhighlight: function unhighlight($el) {
        $el.removeClass(this.errorClass);
    },
    validateSelect: function validateSelect($select, $input) {
        var _this3 = this;

        setTimeout(function () {
            if ($select.valid()) {
                _this3.unhighlight($input);
            } else {
                _this3.highlight($input);
            }
        }, 50);
    },
    addRules: function addRules() {
        //debugger;
        $.validator.addMethod('v-date', ValidationMethods.date, 'Informe uma data válida');
        $.validator.addMethod('date', ValidationMethods.date, 'Informe uma data válida');
        $.validator.addMethod('cpf', ValidationMethods.cpf, 'Informe um CPF válido');
        $.validator.addMethod('url', ValidationMethods.url, 'Informe uma URL válida');
        //$.validator.addMethod('future-date', ValidationMethods.futureDate, 'Data maior que a data atual');

        $.validator.addClassRules({
            'v-date': {
                date: true
            },
            'future-date': {
                date: true
            },
            'date': {
                date: true
            },
            'year': {
                minlength: 4
            },
            'cep': {
                minlength: 9
            },
            'cpf': {
                minlength: 14,
                cpf: true
            },
            'telefone': {
                minlength: 14
            },
            'url': {
                url: true
            }
        });
    }
};