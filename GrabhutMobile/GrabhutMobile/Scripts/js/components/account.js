;
(function ($, app) {
    'use strict';

    $.extend(app.fn, {

        accounts: {}

    });

    $.extend(app.fn.accounts, {

        login: function (email, password, callback) {

            $.holdReady(true);
            app.ajax({

                url: app.api.accounts('login'),
                type: 'POST',
                data: JSON.stringify({
                    Email: email,
                    Password: password
                })

            }).done(function (response) {

                if (!!response) {

                    app.ajax = function (opts) {
                        $.extend(opts, {
                            headers: {
                                device: app.credentials.deviceHeader,
                                "authentication-token": response
                            }
                        });

                        return $.ajax(opts);
                    };
                }

                $.holdReady(false);
                if (callback) return callback(response);
            });
        },

        logout: function (callback) {

            $.holdReady(true);

            app.credentials = null;

            $.holdReady(false);
            if (callback) return callback("Logout successful!");
        }
    });

}(jQuery, window.app));