/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function (config) {
    config.language = 'pt-br';

    config.toolbarGroups = [
        { name: 'clipboard', groups: ['undo', 'clipboard'] },
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
        '/',
        { name: 'styles', groups: ['styles'] },
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'links', groups: ['links'] },
        { name: 'insert', groups: ['insert'] },
        { name: 'forms', groups: ['forms'] },
        { name: 'tools', groups: ['tools'] },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] }
        //{ name: 'about', groups: ['about'] }
    ];

    config.removeButtons = 'Superscript,PasteFromWord,Paste,Copy,Cut,Subscript,Strike,Anchor,About,SpecialChar,Source';

    config.extraPlugins = 'justify,dragresize,font';
};