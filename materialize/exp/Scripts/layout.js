$(document).ready(function () {
    $('select').material_select();

    

    $('#asidebar').addClass(localStorage.getItem('asideStorage'));
    
    if (!$('#asidebar').hasClass('hidden-desktop')) {
        $('.navbar-fixed nav').addClass('hidden-desktop-nav');
        $('.nav-wrapper #botao').last().addClass('hide');
        $('#capta').css('left', 0);
    } else {

        $('.navbar-fixed nav').removeClass('hidden-desktop-nav');
        $('#capta').css('left', '2rem');
    }
    $('.modal').modal();

    /* Abrir modal de erro quando houver mensagem dentro dele */
    if ($('#modal-error .msg').length > 0 && $('#modal-error .msg').html().replace(/\s/g, '') !== '')
        $('#modal-error').modal('open');

    /*$("body").click(e => {
        if (e.target.classList.value == "modal-overlay") {
            $(".modal").modal('close')
        }
    });*/

    function FechaSideBar() {
        $('#conteudo, #conteudoTema, #conteudoInscricao').removeClass('m10');
        $('#conteudo, #conteudoTema, #conteudoInscricao').addClass('m12');
        $('#conteudo, #conteudoTema, #conteudoInscricao').removeClass('push-m2');
        $('#labelIMG').css('left', 80);
        ShowActive();
    }

    function AbreSibeBar() {
        $('#conteudo, #conteudoTema, #conteudoInscricao').removeClass('m12');
        $('#conteudo, #conteudoTema, #conteudoInscricao').addClass('m10');
        $('#conteudo, #conteudoTema, #conteudoInscricao').addClass('push-m2');
        $('#labelIMG').css('left', 60);
        ShowActive();
    }

    function ShowActive() {
        if ($('#aHrefBuscasSalvas').hasClass('active')) {
            $('#aHrefBuscasSalvas').click();
        }
        if ($('#aHrefBuscarPor').hasClass('active')) {
            $('#aHrefBuscarPor').click();
        }
    }

    $('#btn-sidenav-right').sideNav({
        menuWidth: 300, // Default is 300
        edge: 'right', // Choose the horizontal origin
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true, // Choose whether you can drag to open on touch screens,
        //onOpen: function (el) { AbreSibeBar(); }, // A function to be called when sideNav is opened
        //onClose: function (el) { FechaSideBar(); } // A function to be called when sideNav is closed
    });

    //$('#botao').sideNav('show');

    $("#botao").sideNav();

    $('.button-collapse-desktop').click(function () {
        
        if ($('#asidebar').hasClass('hidden-desktop')) {

            $('.nav-wrapper #botao').last().addClass('hide');
            $('#capta').css('left', 0);
            $('#asidebar').removeClass('hidden-desktop');
            $('.navbar-fixed nav').addClass('hidden-desktop-nav');
            localStorage.setItem('asideStorage', '');

        } else if ((!$('#asidebar').hasClass('hidden-desktop'))) {

            $('.nav-wrapper #botao').last().removeClass('hide');
            $('#capta').css('left', '2rem');
            $('#asidebar').addClass('hidden-desktop');
            $('.navbar-fixed nav').removeClass('hidden-desktop-nav');
            localStorage.setItem('asideStorage', 'hidden-desktop');
        }    
    });

    // siderbar        
    var linkmenu = $('#asidebar div.collapsible-body a').filter(function () {
        $(this).closest("li").removeClass("active");
        if (this.href == window.location.href) {            
            return true;
        }
    });
    var collapsibleHeader = linkmenu.closest(".menu-pai").find('.navegacao');
    $("#slide-out.collapsible").collapsible('open', $("#slide-out.collapsible .navegacao").index(collapsibleHeader));
    linkmenu.closest("li").addClass("active");

    if (requisicoes.length == 0) {

        Helper.hideLoad();
    }

    if ($.validator !== undefined) {
        FormValidations.init();
        $.validator.methods.number = function (value, element) {
            return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:[\s\.,]\d{3})+)(?:[\.,]\d+)?$/.test(value);
        };
    }

    $('#teste').change(readImage);

    function readImage() {
        debugger;
        if (this.files && this.files[0]) {
            var tipo = this.files[0].name.substring(this.files[0].name.lastIndexOf('.') + 1);

            if (tipo === 'jpg' || tipo === 'jpeg' || tipo === 'png') {

                $('[name="formatofotoperfil"]').val(this.files[0].name.substring(this.files[0].name.lastIndexOf('.') + 1));

                var file = new FileReader();
                file.onload = function (e) {
                    document.getElementById("imgperfil").src = e.target.result;
                    $('#imgperfil').removeClass('hide');
                    $('[name="fotoperfilbase64"]').val(e.target.result.split(',')[1]);
                };
                file.readAsDataURL(this.files[0]);
            } else {
                Helper.OpenAlert({ title: "Ops", msg: 'Só é aceito imagens', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            }
        }
    }

    $(".fa-home").click(() => {
        window.location.href = "/UA/Index";
    });

    $('.nome-home-user').text($('#name-user').text());
    




});