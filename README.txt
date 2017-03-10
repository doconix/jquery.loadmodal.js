jquery.loadmodal.js
====================


Author: Conan C. Albrecht <ca@byu.edu>
License: MIT

Dependencies:

        - JQuery 1.7+
        - Bootstrap 3


A JQuery plugin to open a Bootstrap modal (dialog) with content loaded via Ajax.
Normally, Bootstrap requires that you manually create the dialog <div>s before
loading content into it.  This plugin creates the modal divs for you and makes
it easier to call dialogs directly from Javascript without any corresponding
HTML.


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
            // any other options from the regular $.ajax call (see JQuery docs)
          },

        }).done(function(data) {
            console.log('Ajax response is here!');

        }).create(function(event) {
            console.log('Modal is created but not yet visible,')

        }).show(function(event) {
            console.log('Modal is now showing.')

        }).close(function(event) {
            console.log('Modal just closed!')
        });


Closing a dialog: (this is standard bootstrap)

        $('#custom_modal_id').modal('hide');
