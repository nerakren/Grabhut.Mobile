;
(function ($, app) {
    'use strict';

    var
        __cred = {
            Merchant: '635180925195321704',
            DeviceCode: 'f974c1da570946f183f4f4640534a343',
            ClientKey: '38913b36f10d47e4916671ba51e2184c'
        }
    ;

    /*------------------------------------------------------------
       This is how to extend app.fn
       1) Create the component
    ------------------------------------------------------------*/

    $.extend(app.fn, {

        devices: {}

    });

    /*------------------------------------------------------------
       2) Then create the functions
       3) In creating a function, always add an extra parameter called 'callback'
    ------------------------------------------------------------*/

    $.extend(app.fn.devices, {

        login: function (merchant, devicecode, clientkey, callback) {

            $.holdReady(true);

            $.ajax({

                url: app.api.devices('Login'),
                type: 'POST',
                data: {

                    Merchant: merchant,
                    DeviceCode: devicecode,
                    ClientKey: clientkey
                }

            }).done(function (response) {

                if (!!response) {

                    var
                        ts = app.util.getTimeStamp(),
                        hash = app.util.hash(ts, response.salt),
                        deviceHeader = app.util.createDeviceHeader(response.sessionid, hash, ts)
                    ;

                    // Save credentials for future use

                    $.extend(app.credentials, {

                        merchant: __cred.Merchant,
                        deviceHeader: JSON.stringify(deviceHeader)

                    });

                    // Save the salt for future use
                    window.__s = response.salt;

                    // Save session id for future use
                    window.__i = response.sessionid;

                    // Save Device Header, so that it will be automatically included
                    // on further calls to APIs

                    app.ajax = function (opts) {
                        $.extend(opts, {
                            headers: {
                                device: app.credentials.deviceHeader
                            },
                            contentType: 'application/json',
                            dataType: 'json',
                            cache: false
                        });

                        return $.ajax(opts);
                    };

                } else {
                    app.ajax = $.ajax;
                }

                // Always call $.holdReady(false); after ajax call
                // to reactivate jQuery events

                $.holdReady(false);

                // This is how to return a callback
                if (callback) return callback(response);
            });
        }
    });

    /*------------------------------------------------------------
     Init function.
     It is only created once.
   ------------------------------------------------------------*/

    (function () {

        /*------------------------------------------------------------
            LogIn Device on first load on the app.
        ------------------------------------------------------------*/

        app.fn.devices.login(__cred.Merchant, __cred.DeviceCode, __cred.ClientKey, function (m) {

            console.log('Device Login Successful');
        });

    })();

}(jQuery, window.app));