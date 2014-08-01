;
(function ($, app) {
    'use strict';

    $.extend(app.fn, {

        sales: {}

    });

    $.extend(app.fn.sales, {

        getsales: function (transactionid, callback) {
            app.ajax({
                url: app.api.sales('GetSalesToday'),
                type: 'GET'
            }).done(function (response) {

                if (callback) return callback(response);

            });
        }

    });


})(jQuery, window.app);