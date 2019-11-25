

$("nav i").sideNav();

$(".img-perfil").off().click(function () {
    
});

$('#img_perfil').change(function () {
            
    var img = this.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {

        $('.elementoRender').attr('src', e.target.result);
    }

    reader.readAsDataURL(img);

});