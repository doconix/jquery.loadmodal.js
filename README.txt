jquery.loadmodal.js
====================


Author: Conan C. Albrecht <ca@byu.edu>
License: MIT

Dependencies: 

        - JQuery 1.5+
        - Bootstrap (tested against v3)


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
          id: 'custom_modal_id',
          title: 'My Title',
          width: '400px',
          ajax: {
            dataType: 'html',
            method: 'POST',
            success: function(data, status, xhr) {
              console.log($('#custom_modal_id'));
            },//
            // any other options from the regular $.ajax call (see JQuery docs)
          },
        });


Closing a dialog: (this is standard bootstrap)
    
        $('#custom_modal_id').modal('hide'); 
