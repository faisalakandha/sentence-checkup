(function (factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
}(function ($) {
  $.punctuationDeepCheck = function (element, options) {
    var plugin = this,
      $element = $(element),
      defaults = {
        editorSelector: '[data-editor]',
        submitSelector: '[data-deep-check]',
        trackingLink: 'https://irbis.grammarly.com/aff_c?aff_id=15837&source=gl&aff_sub=gceditor',
        url: 'https://irbis.grammarly.com/api/funnels/embedded/check'
      };
    
    plugin.settings = {};
    
    plugin.init = function () {
      plugin.settings = $.extend({}, defaults, options);
      plugin.$editor = $element.find(plugin.settings.editorSelector);
      plugin.$submit = $element.find(plugin.settings.submitSelector);
      
      $element.on('click', plugin.settings.submitSelector, function () {
        var params = plugin._getUrlParams(plugin.settings.trackingLink);
        
        params.text = plugin.$editor.html().replace(/<\/?[^>]+(>|$)/g, ' ').replace('  ', ' ');
  
        if (params.text == '') {
          plugin._showError('Please enter text to start the Deep Lookup');
          return false;
        }
      
        plugin._loading(true);
        jQuery.ajax({
          url: plugin.settings.url,
          data: params,
          type: 'POST',
          success: function (response) {
            window.location = response.reportUrl;
          },
          error: function (e) {
            console.error(e)
          }
        });
  
        return false;
      });
    };
    
    plugin._getUrlParams = function (urlPart) {
      var result = {};
      urlPart = urlPart || window.location.search;
      var params = (urlPart.split('?')[1] || '').split('&');
      for (var param in params) {
        if (params.hasOwnProperty(param)) {
          var paramParts = params[param].split('=');
          result[paramParts[0]] = decodeURIComponent(paramParts[1] || "");
        }
      }
      return result;
    };
    
    plugin._showError = function(error) {
      plugin.$editor.attr('data-error', error);
      plugin.$editor.addClass('has-error');
      setTimeout(function () {
        plugin.$editor.removeClass('has-error');
      }, 2500);
    };
  
    plugin._loading = function(isShow) {
      if (isShow) {
        var src = ''
          + '<div id="punctuation-deep-check-loader" class="loading-box">'
          + '<div class="background"></div>'
          + '<div class="pbox">'
          + '        <img src="/wp-content/themes/astra/punctuationcheck/assets/src/img/loader.svg" />'
          + '        <div style="text-align:center;">Check in progress...</div>'
          + '</div>';
        $('body').append(src);
        $('body').css({'overflow-y': 'hidden'});
      } else {
        $('#punctuation-deep-check-loader').remove();
      }
    };
    
    plugin.init();
    return plugin;
  };
  
  $.fn.punctuationDeepCheck = function (options) {
    return this.each(function () {
      if (undefined === $(this).data('punctuationDeepCheck')) {
        var plugin = new $.punctuationDeepCheck(this, options);
        $(this).data('punctuationDeepCheck', plugin);
      }
    });
  }
}));