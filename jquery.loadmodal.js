/*
    Author: Conan C. Albrecht <ca@byu.edu>
    License: MIT
    Version: 1.1.6 (Feb 2014)

    Reminder on how to publish to GitHub:
        Change the version number in all the files.
        git commit -am 'message'
        git push origin master
        git tag 1.1.10
        git push origin --tags

    Dependencies: 
      - JQuery 1.5+
      - Bootstrap (tested against v3)

    A JQuery plugin to open a Bootstrap modal (dialog) with content loaded via Ajax.

    Simple example: 

        $('body').loadmodal('/your/server/url/');

    Advanced example:

        $('body').loadmodal({
          url: '/your/server/url',
          id: 'custom_modal_id',
          title: 'My Title',
          width: '400px',
          ajax: {
            dataType: 'html',
            method: 'GET',
            success: function(data, status, xhr) {
              console.log($('#custom_modal_id'));
            },//
            // any other options from the regular $.ajax call (see JQuery docs)
          },
        });

    Closing a dialog: (this is standard bootstrap)
        
        $('body').modal('hide'); 


*/
(function($) {

	$.fn.loadmodal = function(options) {

    // get the first item from the array as the element we'll work on
    var elem = this.first();
    if (elem.length == 0) {
      return;
    }//if

    // allow a simple url to be sent as the single option
    if ($.type(options) == 'string') {
      options = { 
        url: options,
      };//options
    }//if
    
    // set the default options
    options = $.extend({
      url: null,                               // a convenience place to specify the url - this is moved into ajax.url
      
      id: 'jquery-loadmodal-js',               // the id of the modal
      
      title: window.document.title || 'Dialog',// the title of the dialog
      
      width: '400px',                          // 20%, 400px, or other css width
      
      ajax: {                                  // options sent into $.ajax (see JQuery docs for .ajax for the options)
        url: null,                             // required (for convenience, you can specify url above instead)
      },//ajax
      
    }, options);  
      
    // ensure we have a url
    options.ajax.url = options.ajax.url || options.url;
    if (!options.ajax.url) {
      throw new Error('$().loadmodal requires a url.');
    }//if
    
    // close any dialog with this id first
    $('#' + options.id).modal('hide');
    
    // create our own success responder for the ajax
    var orig_success = options.ajax.success;
    options.ajax.success = function(data, status, xhr) {
      // create the modal html
      var div = $([
        '<div id="' + options.id + '" class="modal fade">',
        '  <div class="modal-dialog modal-lg">',
        '      <div class="modal-content">',
        '        <div class="modal-header">',
        '          <button class="close" data-dismiss="modal" type="button">x</button>',
        '          <h4 class="modal-title">' + options.title + '</h4>',
        '        </div>',
        '        <div class="modal-body">',
        '        </div>',
        '      </div>',
        '    </div>',
        '  </div>',
      ].join('\n'));
      
      // add the new modal div to the element and show it!
      elem.after(div);
      div.find('.modal-body').html(data);
      div.modal();
      div.find('.modal-dialog').css('width', options.width);

      // event to remove the content on close
      div.on('hidden.bs.modal', function (e) {
        div.remove();
      });

      // run the user success function, if there is one
      if (orig_success) {
        orig_success(data, status, xhr);
      }//if
      
    }//success
    
    // load the content from the server
    $.ajax(options.ajax);
    
    // return this to allow chaining
    return this;
  };//setTimer function
  
})(jQuery);
















