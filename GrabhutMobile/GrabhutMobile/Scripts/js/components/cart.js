;
(function ($, app) {
    'use strict';

    $.extend(app.fn, {

        cart: {}

    });

    $.extend(app.fn.cart, {

        gccibt: function (userkey, transactionid, callback) {

            app.ajax({
                url: app.api.cart('gccibt') + '?u=' + userkey + '&t=' + transactionid,
                type: 'GET'
            }).done(function (response) {

                if (callback) return callback(response);

            });
        },

        gpd: function (userkey, transactionid, callback) {

            app.ajax({
                url: app.api.cart('gpd') + '?u=' + userkey + '&t=' + transactionid,
                type: 'GET'
            }).done(function (response) {

                if (callback) return callback(response);

            });
        }

    });


})(jQuery, window.app);