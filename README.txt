jquery.loadmodal.js
====================


Author: Conan C. Albrecht <ca@byu.edu>
License: MIT
Version: 1.1 (Feb 2014)

Dependencies: 
  - JQuery 1.5+
  - Bootstrap (tested against v3)

A JQuery plugin to open a Bootstrap modal (dialog) with content loaded via Ajax.

Simple example: 

    $('#someid').loadmodal('/your/server/url/');

Advanced example:

    $('#someid').loadmodal(
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
    
    $('#someid').modal('hide'); 
