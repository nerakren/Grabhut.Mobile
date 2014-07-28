;
(function ($, app) {
    'use strict';

    $.extend(app.fn, {

        categories: {}

    });

    $.extend(app.fn.categories, {

        get: function (callback) {

            app.ajax({

                url: app.api.categories('get') + '?merchantId=' + app.credentials.merchant,
                type: 'GET'

            }).done(function (response) {

                if (callback) return callback(response);

            });
        }

    });


})(jQuery, window.app);