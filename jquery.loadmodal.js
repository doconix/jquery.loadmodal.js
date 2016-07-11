/*
    Author: Conan C. Albrecht <ca@byu.edu>
    License: MIT
    Version: 1.1.21 (July 2016)

    Reminder on how to publish to GitHub:
        Change the version number in all the files.
        git commit -am 'message'
        git push origin master
        git tag 1.1.21
        git push origin --tags

    Dependencies:
      - JQuery 1.5+
      - Bootstrap (tested against v3)

    A JQuery plugin to open a Bootstrap modal (dialog) with content loaded via Ajax.
    You can do this with standard Bootstrap, but this plugin makes it easier.  It
    does the <div> structure for you, loads the content, and opens the dialog.

    Simple example:

        $.loadmodal('/your/server/url/');

    Advanced example:

        $.loadmodal({
          url: '/your/server/url',
          id: 'my-modal-id',
          title: 'My Title',
          width: '400px',
          closeButton: false,
          buttons: {
            "OK": function() {
              // do something here
              // a false return here cancels the automatic closing of the dialog
            },
            "Cancel": false,   // no-op - just having the option makes the dialog close
          },
          modal: {
            keyboard: false,
            // any other options from the regular $().modal call (see Bootstrap docs)
          },
          ajax: {
            dataType: 'html',
            method: 'GET',
            success: function(data, status, xhr) {
              console.log($('#custom_modal_id'));
            },//
            // any other options from the regular $.ajax call (see JQuery docs)
          },
          onShow: function(dlg) {
            console.log('The dialog just showed on the screen!');
            console.log(dlg);
          },
        });

    Closing a dialog: (this is standard bootstrap)

        $('#my-modal-id').modal('hide');


*/


(function($) {

    $.loadmodal = function(options) {

        // allow a simple url to be sent as the single option
        if ($.type(options) == 'string') {
            options = {
                url: options,
            }; //options
        } //if

        // set the default options
        options = $.extend(true, {
            url: null,                                          // a convenience place to specify the url
                                                                // required unless you specify the url in options.ajax.url.

            id: 'jquery-loadmodal-js',                          // the id of the modal

            idBody: 'jquery-loadmodal-js-body',                 // the id of the modal-body (the dialog content)

            prependToSelector: null,                            // force the modal to be prepended to this selector.
            appendToSelector: null,                             // force the modal to be appended to this selector.
                                                                // If both are null (the default), the modal is prepended to the body element.  This is usually preferred because
                                                                // it allows keyboard navigation to go directly from the browser controls to the modal's tabbable elements.

            title: window.document.title || 'Dialog',           // the title of the dialog

            width: '400px',                                     // 20%, 400px, or other css width

            dlgClass: 'fade',                                   // CSS class(es) to add to the <div class="modal"> main dialog element.  This default makes the dialog fade in.

            size: 'modal-lg',                                   // CSS class(es) to specify the dialog size ('modal-lg', 'modal-sm', '').  The default creates a large dialog.  See the Bootstrap docs for more info.

            closeButton: true,                                  // whether to have an 'X' button at top right to close the dialog

            buttons: {                                          // set titles->functions to add buttons to the bottom of the dialog
            }, //buttons                                        // return false from the function to prevent the automatic closing of the dialog

            modal: {                                            // options sent into $().modal (see Bootstrap docs for .modal and its options)
            }, //modal

            ajax: {                                             // options sent into $.ajax (see JQuery docs for .ajax and its options)
                url: null,                                      // required (but for convenience, you can specify url above instead)
            }, //ajax

            onSuccess: null,                                    // This method is called at the beginning of Ajax return handler.  If any callback
                                                                // returns false (an explicit false), the handler stops, the dialog doesn't show,
                                                                // and further callbacks are ignored.
                                                                // If any callback returns a string, it overrides the data, allowing you to change
                                                                // the content of the return.
                                                                // The arguments are the ones returned from $.ajax: data, status, xhr.
                                                                // This can be a single callback or an array of callbacks.

            onCreate: null,                                     // This method is called after the dialog is created by not yet shown.  This allows
                                                                // you to adjust the dialog before it shows.
                                                                // The arguments are the ones returned from $.ajax: data, status, xhr, and "this" is the dialog element.
                                                                // This can be a single callback or an array of callbacks.

            onShow: null,                                       // if set, this function will be called with a reference to the dialog once it has been
                                                                // successfully shown.
                                                                // The arguments are the ones sent to the shown event: event, and "this" is the dialog element.
                                                                // This can be a single callback or an array of callbacks.
                                                                // This is a convenience option - you could also use the Boostrap bs.modal.shown event.

            onClose: null,                                      // if set, this function will be called with a reference to the dialog upon close/hide,
                                                                // just before the dialog elements are removed from the DOM.
                                                                // The callback has no arguments, and it sets "this" to the dialog element.
                                                                // This can be a single callback or an array of callbacks.
                                                                // This is a convenience option - you could also use the Boostrap bs.modal.hide event.

        }, options);


        // ensure we have a url
        options.ajax.url = options.ajax.url || options.url;
        if (!options.ajax.url) {
            throw new Error('$().loadmodal requires a url.');
        } //if

        // ensure that the callbacks are arrays
        options.onSuccess = forceFuncArray(options.onSuccess);
        options.onCreate = forceFuncArray(options.onCreate);
        options.onShow = forceFuncArray(options.onShow);
        options.onClose = forceFuncArray(options.onClose);

        // close any dialog with this id first
        $('#' + options.id).modal('hide');

        // create our own success responder for the ajax
        options.ajax.success = $.isArray(options.ajax.success) ? options.ajax.success : options.ajax.success ? [options.ajax.success] : [];
        options.ajax.success.unshift(function(data, status, xhr) { // unshift puts this as the first success method
            // call the onSuccess methods
            for (var i = 0; i < options.onSuccess.length; i++) {
                var ret = options.onSuccess[i].apply(null, [ data, status, xhr ]);
                if (ret === false) {
                    return false;
                }else if ($.type(ret) === "string") {
                    data = ret;
                } //if
            }//for

            // create the modal html
            // the tabindex="0" is to allow bootstrap's enforceFocus method to keep the focus inside the dialog when keyboard navigation is used
            var div = $([
                        '<div id="' + options.id + '" class="modal ' + options.dlgClass + ' jquery-loadmodal-js" tabindex="0" role="dialog" aria-labeledby="' + options.id + '-title">',
                        '  <div class="modal-dialog ' + options.size + '" role="document">',
                        '      <div class="modal-content">',
                        '        <div class="modal-header">',
  options.closeButton ? '          <button class="close" data-dismiss="modal" type="button">x</button>' : '',
                        '          <h4 id="' + options.id + '-title" class="modal-title">' + options.title + '</h4>',
                        '        </div>',
                        '        <div id="' + options.idBody + '" class="modal-body">',
                        '        </div>',
                        '      </div>',
                        '    </div>',
                        '  </div>',
            ].join('\n'));

            // add the new modal div to the body
            if (options.appendToSelector && !options.prependToSelector) {
                $(options.appendToSelector).append(div);
            }else{
                $(options.prependToSelector || 'body').prepend(div);
            }//if
            div.find('.modal-body').html(data);
            div.find('.modal-dialog').css('width', options.width);

            // add buttons to the dialog, if any
            if (!$.isEmptyObject(options.buttons)) {
                div.find('.modal-body').append('<div class="button-panel"></div>');
                var button_class = 'btn btn-primary';
                $.each(options.buttons, function(key, func) {
                    var button = $('<button class="' + button_class + '">' + key + '</button>');
                    div.find('.button-panel').append(button);
                    button.on('click.button-panel', function(evt) {
                        var closeDialog = true; // any button closes the dialog
                        if (func && func(evt) === false) { // run the callback
                            closeDialog = false; // an explicit false returned from the callback stops the dialog close
                        } //if
                        if (closeDialog) {
                            div.modal('hide');
                        } //if
                    }); //click
                    button_class = 'btn btn-default'; // only the first is the primary
                }); //each
            } //if

            // trigger the onCreate callbacks
            for (var i = 0; i < options.onCreate.length; i++) {
                if (options.onCreate[i].apply(div.get(0), [ data, status, xhr ]) === false) {
                    return false;
                } //if
            } //for

            // add a callback to set the focus to the first selectable element within the dialog
            div.on('shown.bs.modal', function(event) {
                // do we have an autofocus element?
                if (div.find('[autofocus]').length > 0) {
                    div.find('[autofocus]').get(0).focus();
                // do we have any tabbable elements in the dialog content area?
                }else if (div.find('.modal-body').find(':tabbable').length > 0) {
                    div.find('.modal-body').find(':tabbable').get(0).focus();
                // do we have a close button?
                }else if (options.CloseButton) {
                    div.find('.close').get(0).focus();
                }//if
            }); //shown

            // add a callback to the onshow methods once the dialog shows (this doesn't run now)
            div.on('shown.bs.modal', function(event) {
                for (var i = 0; i < options.onShow.length; i++) {
                    options.onShow[i].apply(div.get(0), [ event ]);
                } //for
            }); //shown

            // event to remove the content on close (this doesn't run now)
            div.on('hidden.bs.modal', function(event) {
                // trigger the callbacks
                for (var i = 0; i < options.onClose.length; i++) {
                    options.onClose[i].apply(div.get(0), [ event ]);
                } //for

                // remove the dialog
                div.removeData();
                div.remove();
            });//hidden

            // finally, show the dialog!
            div.modal(options.modal);

        }); //unshift (add success method)

        // load the content from the server
        $.ajax(options.ajax);

    }; //loadmodal top-level function


    /* Helper function to ensure that the argument is an array.  Returns the array. */
    function forceFuncArray(ar) {
        // if undefined or null or false, return empty array
        if (!ar) {
            return [];
        } //if
        // if already an array, return it
        if ($.isArray(ar)) {
            return ar;
        } //if
        // if anything else, encapsulate in an array
        return [ar];
    } //forceFuncArray


})(jQuery);
