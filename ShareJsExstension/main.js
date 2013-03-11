/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, window, sharejs, $ */
define(function (require, exports, module) {
    
    'use strict';
    
    require(['bcsocket']);

    var CommandManager  = brackets.getModule("command/CommandManager"),
        EditorManager   = brackets.getModule("editor/EditorManager"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        Menus           = brackets.getModule("command/Menus"),
        doc = null;
    
    var SHARE_START = "share.start",
        SHARE_STOP = "share.stop";  
    
    function _shareStart() {
        require(['share', 'SharejsCodemirror'], function(){
            CommandManager.get(SHARE_START).setEnabled(false);
            CommandManager.get(SHARE_STOP).setEnabled(true);

            sharejs.open('blag', 'text', 'http://localhost:8099/channel', function (error, newDoc) {
                doc = newDoc;
                doc.attach_codemirror(EditorManager.getCurrentFullEditor()._codeMirror, true);
            });   
        });
    }

    function _shareStop() {
        CommandManager.get(SHARE_START).setEnabled(true);
        CommandManager.get(SHARE_STOP).setEnabled(false);

        if(doc){
            doc.detach_codemirror();
            doc.close();
            doc = null;
        }                    
    }

    function _changeDoc(){
        if(!doc) return;

        doc.detach_codemirror();
        doc.attach_codemirror(EditorManager.getCurrentFullEditor()._codeMirror, true);
    }
    
    function _init() {
        var c_menu = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);
        c_menu.addMenuItem(SHARE_START);
        c_menu.addMenuItem(SHARE_STOP);
        
        CommandManager.get(SHARE_START).setEnabled(true);    

        $(DocumentManager).on('currentDocumentChange', _changeDoc);
    }
    
    CommandManager.register("Start Share", SHARE_START, _shareStart).setEnabled(true);
    CommandManager.register("Stop Share", SHARE_STOP, _shareStop).setEnabled(false);
    
    _init();

});