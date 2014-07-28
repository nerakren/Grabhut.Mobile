
window.app = (function ($, app) {
    'use strict';

    /*------------------------------------------------------------
        This app.js will contain primary functions only.
        All other function for API must be put on other files.
        You can add or extend function here if it is needed to be
        accessible everywhere.

        NOTE: For Class Names, first letter must be capitalized
              For functions, first letter must be small
              For properties, usually server properties is followed
              That is the basic standard naming pattern (ECMA Script)

        Double underscore '__' or single '_' is a naming convention for private variable or method, or function.

        Always call $.holdReady(true); when calling api
        and after that call $.holdReady(false); so that jQuery events will be activated again.
    ------------------------------------------------------------*/

    var
       __domain = 'https://127.0.0.1/',
       //__domainapi = 'https://grabhutqa.basecamptech.ph/',

       __domainapi = __domain + 'api/'
    ;

    /*------------------------------------------------------------
        All of these are globally accessible within the app
        
        dom - will contain containers such as divs
        fn - will contain functions
        templates - will contain your templates that can be used widely
        api - will contain all available api
        util - will contain all other functions

        Extend this app on specific components.
        For example, if you want to extend the 'dom' to cache a User Div,
        do it in user script, not here.
    ------------------------------------------------------------*/

    $.extend(app, {
        dom: {},
        fn: {},
        templates: {},
        api: {},
        util: {},
        credentials: {},
        avatars: {}
    });

    /*------------------------------------------------------------
        The functions here can be used in any script inheriting the app variable.
        This also shows on how to extend app.util
    ------------------------------------------------------------*/

    $.extend(app.util, {

        getTimeStamp: function () {
            return new Date().getTime();
        },

        hash: function (plainText, salt) {
            var
                key = plainText || this.GetTimeStamp(),
				privateSalt = salt || window.__s
            ;

            return CryptoJS.SHA256(key + privateSalt).toString(CryptoJS.enc.Base64);
        },

        createDeviceHeader: function (session, nonce, timestamp) {

            var
                dh = {
                    s: session || window.__i,
                    n: nonce,
                    t: timestamp
                };

            return dh;
        },

        removenull: function (s) {
            if (s == null || s == 'null') return "";
            return s;
        }
    });

    /*------------------------------------------------------------
        API link constructor
    ------------------------------------------------------------*/

    $.extend(app.api, {
        devices: function (actionName) {
            return __domainapi + 'Devices/' + actionName;
        },
        merchant: function (actionName) {
            return __domainapi + 'Merchant/' + actionName;
        },
        user: function (actionName) {
            return __domainapi + 'User/' + actionName;
        },
        accounts: function (actionName) {
            return __domainapi + 'Accounts/' + actionName;
        },
        categories: function (actionName) {
            return __domainapi + 'Categories/' + actionName;
        },
        cart: function (actionName) {
            return __domainapi + 'ShoppingCart/' + actionName;
        },
        orders: function (actionName) {
            return __domainapi + 'Orders/' + actionName;
        },
        products: function (actionName) {
            return __domainapi + 'Product/' + actionName;
        }
    });

    /*------------------------------------------------------------
        AVATARS
    ------------------------------------------------------------*/

    $.extend(app.avatars, {

        defaultavatar: __domain + 'css/i/avatar.png',
        primary: function (m, i, s) {
            return __domainapi + 'public/a673d31132704de58aaa76ac92fa32a1?m=' + m + '&i=' + i + '&s=' + s;
        }

    });

    /*------------------------------------------------------------
		jQuery Init function
    ------------------------------------------------------------*/

    $(function () {

        /*------------------------------------------------------------
            This is how to extend app.dom
        ------------------------------------------------------------*/

        $.extend(app.dom, {
            body: $('body'),
            document: $(document),
            main: $('#main')
        });

        $.extend(app.templates, {
            div: $('<div></div>')
        });

        /*------------------------------------------------------------
            Prevent Defaults for a tag's href=#
        ------------------------------------------------------------*/

        $('body').on('click', 'a[href="#"]', function (e) { e.preventDefault(); });

        /*------------------------------------------------------------
            Global error handler
        ------------------------------------------------------------*/

        app.dom.document.ajaxError(function (event, jqXHR, ajaxSettings, thrownError) {

            // You can improve this part
            alert("Error: " + thrownError);
        });

    });

    return app;

}(jQuery, jQuery({})));

