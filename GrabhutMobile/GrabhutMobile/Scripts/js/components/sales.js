;
(function ($, app) {
    'use strict';

    $.extend(app.fn, {

        sales: {}

    });

    $.extend(app.fn.sales, {

        getsalesbydate: function (year, month, day, callback) {

            app.ajax({
                url: app.api.sales('ByDate?year=') + year + '&month=' + month + '&day=' + day,
                type: 'GET'
            }).done(function (response) {
                if (callback) return callback(response);
            });
        },

        getinvoiceitems: function (transactionid, callback) {

            app.ajax({
                url: app.api.sales('InvoiceItems?transactionid=') + transactionid,
                type: 'GET'
            }).done(function (response) {
                if (callback) return callback(response);
            });
        }

    });


})(jQuery, window.app);