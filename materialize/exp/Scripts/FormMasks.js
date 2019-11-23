var FormMasks = {
    init: function () {
        this.addRules();
    },
    addRules: function () {
        var telephoneBehavior = function (val) {
            return val.replace(/\\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
        };
        $('.v-date, .future-date').mask('00/00/0000');
        $('.v-year').mask('0000');
        $('.v-cep').mask('00000-000');
        $('.v-cpf').mask('000.000.000-00');
        $('.v-rg').mask('99999999999999');
        $('.nota').mask('0000,00', { reverse: true });
        $('.v-telephone').mask(telephoneBehavior, {
            onKeyPress: function () {
                console.log('onKeyPress');
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];

                }
                var field = args[2];
                var options = args[3];
                field.mask(telephoneBehavior.apply({}, args), options);
            }
        });
    }
};

