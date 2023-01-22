(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function($) {
    $.punctuationChecker = function(element, options) {
        var plugin = this,
            $element = $(element),
            defaults = {
                api: '/api.php',
                editorSelector: '[data-editor]',
                languageSelector: '[data-language]',
                submitSelector: '[data-submit]',
                popupCorrectionSelector: '[data-popup-correction]',
                lineHeight: 18 // px
            };

        plugin.settings = {};

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);
            plugin.$editor = $element.find(plugin.settings.editorSelector);
            plugin.$language = $element.find(plugin.settings.languageSelector);
            plugin.$submit = $element.find(plugin.settings.submitSelector);
            plugin.$popupCorrection = $element.find(plugin.settings.popupCorrectionSelector);
            plugin.$editingTag = null;
            plugin.timeoutId = null;

            $element.on('click', plugin.settings.submitSelector, function () {
                plugin.check();
            });

            plugin.$editor.on('click, focus', function () {
                plugin.$editor.removeClass('empty');
            });

            plugin.$editor.on('blur', function () {
                if ('' == plugin.$editor.html().trim()) {
                    plugin.$editor.addClass('empty')
                }
            });

            $element.on('focus', plugin.settings.editorSelector, function () {
                plugin.$editor.addClass('focus');
            });

            $element.on('mouseover focus click', '.pwa[data-report]', function (event) {
                if ($(this).find('.pwa[data-report]').length) {
                    return;
                }

                var $this = $(this),
                    title = $this.attr('title'),
                    suggestions = $this.data('suggestions'),
                    position = null;

                plugin.$editingTag = $(this);

                // temporary hide title
                $this.attr('title', '');
                $this.one('mouseout', function () {
                    $this.attr('title', title);
                    $this.off('mousemove');
                });

                $this.on('mousemove', function (event) {
                    if (!plugin.$popupCorrection.hasClass('visible')) {
                        $(this).trigger('mouseover', event);
                    }
                });

                plugin.$popupCorrection.find('.pwa-popup-header').html(title);
                plugin.$popupCorrection.find('.pwa-popup-body').html('');
                if (suggestions) {
                    $.each(suggestions.split(','), function (i, value) {
                        plugin.$popupCorrection.find('.pwa-popup-body').append(
                            $('<div class="pwa-correction-item">' + value + '</div>')
                        );
                    });
                }
                position = plugin._getPopupCorrectionPosition(event, $this);

                clearTimeout(plugin.timeoutId);
                if (
                    plugin.$popupCorrection.data('tag')
                    && $this.data('tag-id') === plugin.$popupCorrection.data('tag').data('tag-id')) {
                    plugin.$popupCorrection.css(position).addClass('visible');
                } else {
                    plugin.$popupCorrection.data('tag', $this);
                    plugin.$popupCorrection.removeClass('visible');
                    plugin.$popupCorrection.css(position).addClass('visible');
                }
            });

            $element.on('mouseout', '.pwa[data-report]', function () {
                plugin.timeoutId  = setTimeout(function () {
                    plugin.$popupCorrection.removeClass('visible');
                    plugin.$popupCorrection.data('tag', null);
                    plugin.$editingTag = null;
                }, 200);
            });

            plugin.$popupCorrection.on('mouseover', function () {
                clearTimeout(plugin.timeoutId);
            });

            plugin.$popupCorrection.on('mouseout', function () {
                plugin.timeoutId  = setTimeout(function () {
                    plugin.$popupCorrection.removeClass('visible');
                    plugin.$popupCorrection.data('tag', null);
                    plugin.$editingTag = null;
                }, 200);
            });

            plugin.$popupCorrection.on('click', '.pwa-correction-item', function () {
                var correction = $(this).html(),
                    $tag = plugin.$popupCorrection.data('tag');

                if ('(omit)' === correction) {
                    correction = '';
                }

                $tag.replaceWith(correction);
                plugin.$popupCorrection.removeClass('visible');
                plugin.$popupCorrection.data('tag', null);
            });

            plugin.$popupCorrection.on('click', '.pwa-ignore-button', function () {
                var $tag = plugin.$popupCorrection.data('tag');

                $tag.replaceWith($tag.html());
                plugin.$popupCorrection.removeClass('visible');
                plugin.$popupCorrection.data('tag', null);

                return false;
            });

            $(window).on('keyup paste cut delete', function (event) {
                if (!plugin.$editingTag) {
                    return;
                }

                var text = plugin.$editingTag.html(),
                    originText = plugin.$editingTag.data('original-text');

                if (text === originText) {
                    return;
                }

                plugin.$editingTag.removeAttr('class');
                plugin.$editingTag.removeAttr('data-report');
                plugin.$editingTag.removeAttr('data-suggestions');
                plugin.$editingTag.removeAttr('data-index');
                plugin.$editingTag.removeAttr('data-category');
                plugin.$editingTag.removeAttr('data-sub-category');
                plugin.$editingTag.removeAttr('data-urls');
                plugin.$editingTag.removeAttr('data-help');
                plugin.$editingTag.removeAttr('data-original-text');
                plugin.$editingTag.removeAttr('data-tag-id');

                plugin.$editingTag.removeAttr('title');
                plugin.$editingTag.off('mouseout'); // remove callback for returning title, see line 46

                plugin.$popupCorrection.removeClass('visible');
                plugin.$popupCorrection.data('tag', null);

                plugin.$editingTag.one('mouseout', function () {
                    plugin.$editingTag.replaceWith(plugin.$editingTag.html());
                    plugin.$editingTag = null;
                });
            });

            $(window).scroll(function () {
                if (!plugin.$popupCorrection.hasClass('visible')) {
                    return;
                }

                var $tag = plugin.$popupCorrection.data('tag');
                $tag && $tag.trigger('mouseover');
            });
        };

        plugin.check = function() {
            var $tmpContext = $('<div></div>');

            // clear current errors
            $tmpContext.html(plugin.$editor.html());
            $tmpContext.find('.pwa[data-report]').each(function () {
                var $this = $(this);
                $this.replaceWith($this.html());
            });

            plugin.__loading(true);
            $.ajax({
                url: plugin.settings.api,
                method:  'POST',
                data: {
                    'text': $tmpContext.html(),
                    'language': plugin.$language.val()
                },
                dataType: 'json',
                success: function (response) {
                    if (200 == response.status) {
                        plugin.$editor.html(response.response);
                        plugin.__removeDoubleErrors();
                        plugin.__loading(false);
                    } else {
                        plugin.__loading(false);

                        plugin.$editor.attr('data-error', response.response);
                        plugin.$editor.addClass('has-error');
                        setTimeout(function () {
                            plugin.$editor.removeClass('has-error');
                        }, 2500);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    plugin.__loading(false);

                    plugin.$editor.attr('data-error', jqXHR.responseText);
                    plugin.$editor.addClass('has-error');
                    setTimeout(function () {
                        plugin.$editor.removeClass('has-error');
                    }, 2500);

                    return false;
                }
            });
        };

        plugin.__removeDoubleErrors = function () {
            plugin.$editor.find('.pwa[data-report] > .pwa[data-report]').each(function () {
                var $this = $(this),
                    $parent = $this.closest('.pwa[data-report]');

                if ($this.attr('data-original-text') === $parent.attr('data-original-text')) {
                    $this.replaceWith($this.html());
                }
            });
        };

        plugin.__loading = function(isLoading) {
            if (isLoading) {
                plugin.$popupCorrection.removeClass('visible');
                plugin.$submit.attr('disabled', true);
                plugin.$editor.parent().addClass('loading');
            } else {
                plugin.$submit.removeAttr('disabled');
                plugin.$editor.parent().removeClass('loading');
            }
        };

        plugin._getPopupCorrectionPosition = function(event, $mistake) {
            var mistakeOffset = $mistake.offset(),
                mistakeWidth = $mistake.width(),
                mistakeHeight = $mistake.height(),
                popupOffset = {'top': 0, left: 0};
                popupWidth = plugin.$popupCorrection.outerWidth(),
                popupHeight = plugin.$popupCorrection.outerHeight(),
                windowWidth = $(window).width(),
                windowHeight = $(window).height(),
                windowsSrollTop = $(window).scrollTop(),
                gapTop = -1,
                gapBottom = -1,
                position = 'bottom';

            // Is position top or bottom
            if (!event.pageY || event.pageY <= mistakeOffset.top + plugin.settings.lineHeight) {
                mistakeHeight = plugin.settings.lineHeight;
            }
            gapTop = mistakeOffset.top - windowsSrollTop - popupHeight;
            gapBottom = windowHeight - (mistakeOffset.top - windowsSrollTop + mistakeHeight - 1 + popupHeight);

            if (0 > gapBottom && 0 <= gapTop) {
                position = 'top'
            }

            switch (position) {
                case 'top':
                    popupOffset.top = mistakeOffset.top - windowsSrollTop - popupHeight + 1;
                    popupOffset.left = mistakeWidth < popupWidth
                        ? mistakeOffset.left + (mistakeWidth / 2) - (popupWidth / 2)
                        : event.pageX - (popupWidth / 2);
                    break;

                case 'bottom':
                default:
                    popupOffset.top = mistakeOffset.top - windowsSrollTop + mistakeHeight - 1;
                    popupOffset.left = mistakeWidth < popupWidth
                        ? mistakeOffset.left + (mistakeWidth / 2) - (popupWidth / 2)
                        : event.pageX - (popupWidth / 2);
            }

            if (0 > popupOffset.left) {
                popupOffset.left = 0;
            }

            return popupOffset;
        };

        plugin.init();
        return plugin;
    };

    $.fn.punctuationChecker = function(options) {
        return this.each(function() {
            if (undefined === $(this).data('punctuationChecker')) {
                var plugin = new $.punctuationChecker(this, options);
                $(this).data('punctuationChecker', plugin);
            }
        });
    }
}));
