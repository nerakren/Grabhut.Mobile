;
(function ($, app) {
    'use strict';

    $.extend(app.fn, {

        orders: {}

    });

    $.extend(app.fn.orders, {

        getorder: function (transactionid, callback) {

            app.ajax({
                url: app.api.orders('GetOrder') + '?i=' + transactionid,
                type: 'GET'
            }).done(function (response) {

                if (callback) return callback(response);

            });
        },

        getorders: function (status, callback) {

            app.ajax({
                url: app.api.orders('GetOrders') + '?status=' + status,
                type: 'GET'
            }).done(function (response) {

                if (callback) return callback(response);

            });
        },

        getordercounts: function (callback) {

            app.ajax({
                url: app.api.orders('GetOrderCounts'),
                type: 'GET'
            }).done(function (response) {

                if (callback) return callback(response);

            });
        },

        confirmremove: function (p, r, callback) {

            app.ajax({
                url: app.api.orders('CancelOrderItem?p=') + p + '&r=' + r,
                type: 'GET'
            }).done(function (data) {
                if (callback) return callback(data);
            });
        },

        completesales: function (i, u, callback) {

            app.ajax({
                url: app.api.orders('CompleteSales?i=') + i + '&u=' + u,
                type: 'GET'
            }).done(function (data) {
                if (callback) return callback(data);
            });
        },

        confirmorder: function (u, t, callback) {

            app.ajax({
                url: app.api.orders('ConfirmOrder?u=') + u + '&t=' + t,
                type: 'GET'
            }).done(function (data) {
                if (callback) return callback(data);
            });
        },

        confirmcartitem: function (item, u, origShipMethod, applyToAll, callback) {

            app.ajax({
                url: app.api.orders('ConfirmCartItem?u=') + u + '&origShipMethod=' + origShipMethod + '&applyToAll=' + applyToAll,
                type: 'POST',
                data: item
            }).done(function (data) {
                if (callback) return callback(data);
            });
        },

        getaddress: function (p, r, callback) {

            app.ajax({
                url: app.api.orders('GetAddress?p=') + p + '&r=' + r,
                type: 'GET'
            }).done(function (data) {
                if (callback) return callback(data);
            });
        }

    });


})(jQuery, window.app);