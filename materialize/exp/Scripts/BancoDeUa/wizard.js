"use strict";

var wizard = function () {

    function init() {
        bindFunctions();
    }

    function bindFunctions() {
        
        if ($('#hfnumpage')) {

            var item = null;
            var itemAtual = parseInt($('#hfnumpage').val());


            if (itemAtual == 1) {

                item = $('.steps-list li')[0];
                $(item).addClass('-current').removeClass('-done');
                $(item).find('i').addClass('fa-user').removeClass('fa-check');

                item = $('.steps-list li')[1];
                $(item).addClass('-todo').removeClass('-done').removeClass('-current');
                $(item).find('i').addClass('fa-check-square-o').removeClass('fa-check');

                item = $('.steps-list li')[2];
                $(item).addClass('-todo').removeClass('-done').removeClass('-current');
                $(item).find('i').addClass('fa-calendar').removeClass('fa-check');

            } else if (itemAtual == 2) {

                item = $('.steps-list li')[1];
                $(item).addClass('-current').removeClass('-done').removeClass('-todo');
                $(item).find('i').addClass('fa-check-square-o').removeClass('fa-check');

                item = $('.steps-list li')[0];
                $(item).addClass('-done').removeClass('-todo').removeClass('-current');
                $(item).find('i').addClass('fa-check').removeClass('fa-user');

                item = $('.steps-list li')[2];
                $(item).addClass('-todo').removeClass('-done').removeClass('-current');
                $(item).find('i').addClass('fa-calendar').removeClass('fa-check');
            }
            else {

                item = $('.steps-list li')[2];
                $(item).addClass('-current').removeClass('-done').removeClass('-todo');
                $(item).find('i').addClass('fa-calendar').removeClass('fa-check');

                item = $('.steps-list li')[0];
                $(item).addClass('-done').removeClass('-todo').removeClass('-current');
                $(item).find('i').addClass('fa-check').removeClass('fa-user');

                item = $('.steps-list li')[1];
                $(item).addClass('-done').removeClass('-todo').removeClass('-current');
                $(item).find('i').addClass('fa-check').removeClass('fa-check-square-o');
            }
        }
    }

    return {
        init: init
    };

}();
$(wizard.init);

