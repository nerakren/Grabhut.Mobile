;
(function ($, app) {
    'use strict';

    $.extend(app.fn, {

        merchant: {}

    });

    $.extend(app.fn.merchant, {

        getaddress: function (callback) {
            app.ajax({
                url: app.api.merchant('GetAddress'),
                type: 'GET'
            }).done(function (data) {
                if (callback) return callback(data);
            });
        }

    });


})(jQuery, window.app);