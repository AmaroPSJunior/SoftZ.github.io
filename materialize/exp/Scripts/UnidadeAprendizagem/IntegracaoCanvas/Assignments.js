"use strict";

var Assignments = (function () {

    function init() {
        bindFunctions();
    }

    function bindFunctions() {
        Listassignments();
    }


    function Listassignments() {

        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Basic ' + btoa(unescape(encodeURIComponent(YOUR_USERNAME + ':' + YOUR_PASSWORD))))
            },
            url: 'https://saolucas.beta.instructure.com/api/v1/courses/1880/assignments',
            type: 'POST',
            data: {
                'assignment[name]': 'teste_api',
                'assignment[position]': '0',
                'assignment[submission_types]': ["external_tool"],
                'assignment[points_possible]': 4,
                'assignment[external_tool_tag_attributes]': { 'new_tab': 'false', 'url': 'https://slconstruct.saolucas.edu.br' },
            }
        }).done(function (data) {
            console.log(data);
        });

        //new GCS().setObj({
        //    type: 'POST',
        //    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        //    processData: true,
        //    url: 'https://saolucas.beta.instructure.com/api/v1/courses/1880/assignments',
        //    data: {
        //        'assignment[name]': 'teste_api',
        //        'assignment[position]': '0',
        //        'assignment[submission_types]': ["external_tool"],
        //        'assignment[points_possible]': 4,
        //        'assignment[external_tool_tag_attributes]': { 'new_tab': 'false', 'url': 'https://slconstruct.saolucas.edu.br' }
        //    },
        //    success: function (data) {
        //        console.log(data);
        //    }
        //}).executar();
    }

    return {
        init: init
    };
})();

$(Assignments.init);