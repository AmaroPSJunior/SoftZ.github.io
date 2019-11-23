"use strict";

var controller = 'UnidadeAprendizagem',
    base64imagem = '',
    DefinicoesGerais = (function () {

        function init() {
            FormValidations.init();
            functionBase();
            bindFunctions();
            inicializaComponentes();
            //carregaImagemCapa();
            verificaURLQueryString();
            atualizaWizard();
            validaExibicaoBotaoSalvar();
            deabilitaCamposEBotoes();
            $('.modal').modal();
            visualizaCapa();
        }

        function visualizaCapa() {
            //var valorInputCapa = $('#capacaminhonome').closest('.file-field').find('.file-path-wrapper input').val();
            //if (valorInputCapa) {
            //    $('.visualiza').removeClass('off');
            //} else {
            //    $('.visualiza').addClass('off');
            //}

            $('.visualiza').off().click(function () {
                
                var valorInputCapa = $('#capacaminhonome').closest('.file-field').find('.file-path-wrapper input').val();
                var img = $('<img/>');
                var modal = $('#modal-imagem-capa-visualiza .modal-content');
                if (valorInputCapa.indexOf('https://unislavaliacoes.s3.amazonaws.com') > -1) {
                    img.attr('src', valorInputCapa).css('width', 'auto');
                    modal.html(img);
                    $('#modal-imagem-capa-visualiza').modal({ dismissible: false }).modal('open');
                } else if ($('#conteudoBase64Completa').val() !== "") {
                    var base64completa = $('#conteudoBase64Completa').val();
                    img.attr('src', base64completa).css('width', 'auto');
                    modal.html(img);
                    $('#modal-imagem-capa-visualiza').modal({ dismissible:false }).modal('open');
                } else {
                    Helper.OpenAlert({ title: "Ops", msg: 'Não há nenhum arquivo para ser exibido.', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }
            });
        }

        function deabilitaCamposEBotoes() {

            setTimeout(function () {
               
                var UaLiberada = $('#uaestaliberada').val() === 'true' ? true : false;
                if (UaLiberada) {
                    $('input,button, [type="radio"] + label').attr('disabled', 'disabled').css('pointer-events', 'none');
                }
            }, 450);
        }

        function inicializaComponentes() {
            $('select').material_select();
        }

        function atualizaWizard() {
            var elemento = $('#unidadeAprendizagem .wizard_new li[data-etapa="' + 1 + '"] a');
            var codunidadeaprendizagem = $('#codunidadeaprendizagem').val();
            UnidadeAprendizagemListagemUas.atualizaWizard(elemento, codunidadeaprendizagem);
        }

        function functionBase() {
            //$('select').material_select();

            $('.chip .fa-times').off().click(function () {
                
                var codhabilidade = $(this).closest('div').data('codhabilidade');
                var habilidadoExclusao = JSON.parse($(this).closest('div').data('habilidado-exclusao').toLowerCase());

                if (habilidadoExclusao) {
                    var texto = $(this).closest('div').text().trim();
                    var inputsHidden = $('.listagem-habilidades input[type="hidden"]');
                    var option = '';
                    inputsHidden.each(function (index, elem) {

                        if (inputsHidden.eq(index).val() == codhabilidade) {
                            inputsHidden.eq(index).remove();
                            option += '<option value="' + codhabilidade + '">' + texto + '</option>';
                            $('#habilidades').prepend(option);
                            var options = $('#habilidades option').not('[value=""]');
                            var arr = options.map(function (_, o) { return { t: $(o).text(), v: o.value }; }).get();
                            arr.sort(function (o1, o2) { return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0; });
                            options.each(function (i, o) {
                                o.value = arr[i].v;
                                $(o).text(arr[i].t);
                            });
                            $('select#habilidades').html(options);
                            $('select#habilidades').prepend('<option selected disabled value="">Selecione</option>');
                        }
                    });
                    $(this).closest('.chip').parent().remove();
                    $('select#habilidades').prop("disabled", false)
                    $('select#habilidades').material_select();
                    validaExibicaoBotaoSalvar();
                } else {
                    Helper.OpenAlert({ title: "Não será possível excluír", msg: 'A habilidade está vinculada à uma questão', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                }

            });

            $('#capacaminhonome').change(function () {
               
                var $inputFile = $(this),
                    files = this.files;

                var item = files[0],
                nomeArquivo = $(this).val().toLowerCase().split('\\')[2],
                extension = nomeArquivo ? extension = nomeArquivo.substring(nomeArquivo.lastIndexOf('.') + 1) : '';
                if (extension !== 'jpg' && extension !== 'png') {
                    $(this).val('');
                    $('#conteudoBase64Completa').val('');
                    $('#base64capa').val('');
                    Helper.OpenAlert({ title: "Ops", msg: 'Apenas são aceitas extensões .png e .jpg', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                } else {
                    $('#modal-imagem-capa').modal({ dismissible: false }).modal('open');
                    var hiddenField = $('#base64capa');
                    Helper.getBase64(item, hiddenField);

                    var reader = new FileReader();
                    reader.readAsDataURL(item);
                    reader.onload = function () {
                        $('#conteudoBase64Completa').val(reader.result);
                    };
                    //PegaTamanhoImagem(item);
                }
            });
            
        }

        //function PegaTamanhoImagem(file) {
            
        //    var reader = new FileReader();
        //    reader.readAsDataURL(file);
        //    reader.onload = function () {
        //        var array = reader.result.split(",");
        //        var base64 = array[array.length - 1];
        //        $('#ttt').attr('src', reader.result);
        //    };
        //    reader.onerror = function (error) {
        //        console.log('Error in convert base64: ', error);
        //    };
        //    setTimeout(function () {
                
        //        var largura = $('#ttt').width();
        //        var altura = $('#ttt').height();
        //        if (largura > 250) {
        //            $('[name="capacaminhonome"]').val('');
        //            Helper.OpenAlert({ title: "A largura máxima é de 250px, a imagem contém " + largura + "px de largura", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
        //        } else if (altura > 250) { 
        //            $('[name="capacaminhonome"]').val('');
        //            Helper.OpenAlert({ title: "A altura máxima é de 250px, a imagem contém " + altura + "px de altura", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
        //        }
        //    }, 500);
        //}

        function bindFunctions() {
            
            $('#definicoes-gerais .associar').off().click(associarHabilidade);
            $('#definicoes-gerais .salvar').off().click(salvar);
            $('#definicoes-gerais #Pacote').off().change(montaHabilidades);
            $(".listagem-habilidades").on("listagem-habilidade-change", x => validaExibicaoBotaoSalvar());
            imagemCapa();
        }

        function imagemCapa() {
            var options =
            {
                ratio: 2 / 3,
                thumbBox: '.thumbBox',
                //spinner: '.spinner',
                //imgSrc: 'avatar.png'
            };
            var cropper = $('.imageBox').cropbox(options);
            $('#capacaminhonome').on('change', function () {
                var reader = new FileReader();
                reader.onload = function (e) {
                    options.imgSrc = e.target.result;
                    
                    $('#conteudoBase64Completa').val(e.target.result);
                    base64imagem = e.target.result.split(',')[1];
                    $('#base64capa').val(base64imagem);
                    cropper = $('.imageBox').cropbox(options);
                },
                reader.readAsDataURL(this.files[0]);
                
            });
            $('#btnCrop').on('click', function () {
                var img = cropper.getDataURL();
                console.log(img);
                base64imagem = img.split(',')[1];
                $('#base64capa').val(base64imagem);
                $('.cropped').html('<img src="' + img + '">');
            });
            $('#btnZoomIn').on('click', function () {
                cropper.zoomIn();
            });
            $('#btnZoomOut').on('click', function () {
                cropper.zoomOut();
            });
            $('#btnSave').click(function () {
                var img = cropper.getDataURL();
                console.log(img);
                base64imagem = img.split(',')[1];
                $('#base64capa').val(base64imagem);
                $('#conteudoBase64Completa').val(img);
                $('#modal-imagem-capa .modal-content .cropped').html('');
                $('#modal-imagem-capa').modal('close');
            });
            $('#modal-imagem-capa .modal-close').off().click(function () {
                $('#conteudoBase64Completa').val('');
                $('#base64capa').val('');
                $('#capacaminhonome').val('');
                $('#capacaminhonome').closest('.file-field').find('.file-path-wrapper input').val('');
            });
        }

        function validaExibicaoBotaoSalvar() {
            if ($(".listagem-habilidades").children().length > 0) {
                $("#definicoes-gerais > .botao-salvar .salvar").show();
            } else {
                $("#definicoes-gerais > .botao-salvar .salvar").hide();
            }
        }

        //function carregaImagemCapa() {
        //    $('.anexa-imgcapa').off().change(changeArquivo);
        //}
        //
        //function changeArquivo() {
        //    //debugger;
        //    if (this.files.length > 0) {
        //        var type = this.files[0].type,
        //            nomeArquivo = $(this).val().toLowerCase(),
        //            extension = nomeArquivo ? extension = nomeArquivo.substring(nomeArquivo.lastIndexOf('.') + 1) : '';
        //
        //        //if (this.files.length > 0) {
        //        //    var item = this.files[0];
        //        //    var hiddenField = $('#capacaminhonome');
        //        //
        //        //    hiddenField.val(nomeArquivo);
        //        //}
        //    }
        //}

        function associarHabilidade() {
            
            var elemento = $(this);
            var habilidadetexto = elemento.closest('.formulario').find('#habilidades option:selected').text().trim();
            var codhabilidade = parseInt(elemento.closest('.formulario').find('#habilidades').val());

            var chip = ' <div class="col s12"><div class="chip" data-codhabilidade="' + codhabilidade + '" data-habilidado-exclusao="True">' + habilidadetexto + ' <i class="fas fa-times"></i> </div></div>';
            var chips = $('.listagem-habilidades .chip');

            if (habilidadetexto !== 'Selecione' && habilidadetexto !== '') {

                if (chips) {
                    var count = 0;
                    chips.each(function (index, elem) {

                        if (codhabilidade === parseInt(elem.getAttribute('data-codhabilidade'))) {
                            count++;
                            Helper.OpenAlert({ title: "Habilidade já esta selecionada", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                            return false;
                        }
                    });
                    var input = '';
                    var index = '';
                    if (count === 0) {
                        input = '<input type="hidden" name="habilidadelist[0].codhabilidade" value="' + codhabilidade + '" />';
                        $('.listagem-habilidades').append(chip);
                        $('.listagem-habilidades').append(input);
                        $('.listagem-habilidades').trigger("listagem-habilidade-change");

                        $('#habilidades option:selected').remove();
                        $('select#habilidades').material_select();
                    }
                }
            } else {
                Helper.OpenAlert({ title: "Selecione uma habilidade!", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            }
            setTimeout(function () {
                functionBase();
            }, 500);
        }

        function montaHabilidades() {
            
            var coddisciplina = parseInt($('#coddisciplina').val());
            var codcurso = parseInt($('#codcurso').val());

            var codunidadeaprendizagem = parseInt($('#codunidadeaprendizagem').val());
            var codbaseunidadeaprendizagem = parseInt($(this).val());
            if (codbaseunidadeaprendizagem) {
                new GCS().setObj({
                    type: 'GET',
                    url: urlLoadHabilidadeUnidadeAprendizagem + '?codunidadeaprendizagem=' + codunidadeaprendizagem + '&coddisciplina=' + coddisciplina + '&codcurso=' + codcurso + '&codbaseunidadeaprendizagem=' + codbaseunidadeaprendizagem,
                    success: function (data) {
                        var items = [];
                        for (var i = 0; i < data.length; i++) {
                            var obj = {
                                value: data[i].Value,
                                text: data[i].Text
                            };
                            items.push(obj);
                        }
                        var select = $('#habilidades');
                        Helper.updateOptions(select, items);
                    }
                }).executar();
            }
        }

        function salvar() {
            
            ordenaInputsHabilidades();
            var form = new FormData($("#frmCadastroUnidadeAprendizagem")[0]);

            var editar = $('#editar[type="hidden"]').val().toLowerCase();
            var caminhonome = $('#capacaminhonome').val();
            var formValido = '';

            //if (editar === 'false') {
            //    if (caminhonome) {
            //if (editar === 'false' && !caminhonome) {
            //    Helper.OpenAlert({ title: "Ops", msg: 'A capa é obrigatória', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            //    return;
            //}

                    formValido = $('#frmCadastroUnidadeAprendizagem').valid();
                    if (formValido) {
                        new GCS().setObj({
                            type: 'POST',
                            contentType: false,
                            
                            data: form,
                            url: urlSalvarDefinicoesGerais,
                            error: function (data) {
                                Helper.OpenAlert({ title: "Acesso não autorizado", msg: "", classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
                            },
                            success: function (data) {
                                
                                if (data.status) {
                                    
                                    $('#codunidadeaprendizagem').val(data.codunidadeaprendizagem);
                                    UnidadeAprendizagemListagemUas.vaiParaEtapa(2, data.codunidadeaprendizagem);
                                }
                            }
                        }).executar();
                    }
            //    } else {
            //        Helper.OpenAlert({ title: "Ops", msg: 'A capa é obrigatória', classtitle: "font-vermelho-claro", iconclass: "dissatisfaction", icon: "fa-exclamation-triangle" });
            //    }
            //} else if (editar === 'true'){
            //    formValido = $('#frmCadastroUnidadeAprendizagem').valid();
            //    if (formValido) {
            //        new GCS().setObj({
            //            type: 'POST',
            //            contentType: false,
                        
            //            data: form,
            //            url: urlSalvarDefinicoesGerais,
            //            success: function (data) {
            //                debugger
            //                if (data.status) {
            //                    debugger;
            //                    UnidadeAprendizagemListagemUas.vaiParaEtapa(2);
            //                }
            //            }
            //        }).executar();
            //    }
            //}
        }

        function ordenaInputsHabilidades() {
            
            var inputs = $('.listagem-habilidades input[name="habilidadelist[0].codhabilidade"]');
            inputs.each(function (index, elem) {
                $(this).attr('name', 'habilidadelist[' + index + '].codhabilidade');
            });
        }

        function verificaURLQueryString() {
            
            setTimeout(function () {
                
                var editar = $('#editar').val().toLowerCase();
                if (editar === 'true') {
                    $('#definicoes-gerais #Pacote').off().change(montaHabilidades);
                    $('#definicoes-gerais #Pacote').change();
                    $('#definicoes-gerais #Pacote').closest('.select-wrapper').find('[type="text"].select-dropdown').attr('disabled', true);
                }
            },100);
        }

        return {
            init: init
        };
    })();

$(DefinicoesGerais.init);