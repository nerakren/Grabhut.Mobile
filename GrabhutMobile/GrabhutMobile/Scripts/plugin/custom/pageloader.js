;
(function ($) {
    'use strict';

    var methods = {
        init: function (opts) {

            var o = $.extend({

                url: 'pages/login.html',
                force: true,
                callback: $.noop()

            }, opts || o);


            if (methods.isEmpty(this) || o.force) {

                if (o.force) this.not('.clone, .nodelete').empty();

                var that = this;
                this.load(o.url, function () {

                    that.trigger('create');

                    if (opts.callback) opts.callback();
                });
            }

            return this;
        },

        isEmpty: function (el) {
            
            if ($.trim(el.html()) == '') {
                return true;
            } else {
                return false;
            }
        }
    };

    $.fn.loadpage = function (opts) {
        if (methods[opts]) {
            return methods[opts].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof opts === 'object' || !opts) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + opts + ' does not exist on jQuery.loadpage');
        }
    };


})(jQuery);