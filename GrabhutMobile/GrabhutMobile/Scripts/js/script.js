(function ($, app) {
    'use strict';

    $(function () {

        // DOM

        var
			app_login_page = app.dom.main.find('#app_login_page'),
            app_header_page = app.dom.main.find('#app_header_page'),
            app_home_page = app.dom.main.find('#app_home_page'),
            app_order_page = app.dom.main.find('#app_order_page'),
            app_sales_page = app.dom.main.find('#app_sales_page'),

            app_neworder_detail_page = app.dom.main.find('#app_neworder_detail_page'),
            app_inprogorder_detail_page = app.dom.main.find('#app_inprogorder_detail_page'),
            app_completedorder_detail_page = app.dom.main.find('#app_completedorder_detail_page'),
            app_cancelledorder_detail_page = app.dom.main.find('#app_cancelledorder_detail_page'),

            app_order_shipment_page = app.dom.main.find('#app_order_shipment'),
            app_product_page = app.dom.main.find('#app_product_page'),
            app_order_removecart = app.dom.main.find('#order-action'),
            app_sales_detail_page = app.dom.main.find('#app_sales_detail_page')
        ;

        // Functions

        var
            hideinnerpages = function () {
                app_home_page.hide();
                app_order_page.hide();
                app_order_shipment_page.hide();
                app_product_page.hide();
                app_sales_page.hide();

                app_sales_detail_page.hide();
                app_neworder_detail_page.hide();
                app_inprogorder_detail_page.hide();
                app_completedorder_detail_page.hide();
                app_cancelledorder_detail_page.hide();
            },

            hidepageshipmethod = function () {

                app_order_shipment_page.find('#page_ship_pickup').hide();
                app_order_shipment_page.find('#page_ship_meetup').hide();
                app_order_shipment_page.find('#page_ship_deliver').hide();
            },

            changetitle = function (title) {

                app_header_page.find('.ui-title').text(title);
            },

            getallordersbystatus = function (data, status, callback) {

                var arrays = [];

                $.each(data, function (i, e) {

                    if (e.Status == status) arrays.push(e);

                });

                if (callback) return callback(arrays);
            },

            createorderitems = function (data, itemclone, optionArray) {

                $.each(data, function (i, e) {

                    var clone = itemclone.clone().data('u', e.UserKey).data('t', e.TransactionId).addClass(e.Status);
                    clone.find('.tid').text(e.TransactionId.toUpperCase());
                    clone.find('.ordtime').text(moment(e.OrderDate).format('LLLL'));
                    clone.find('.stat').text(e.Status);

                    if (e.IsCreditCard) {
                        clone.find('.paytype').text('Credit Card');
                    } else {
                        clone.find('.paytype').text('Cash');
                    }

                    optionArray.push(clone);
                });
            },

            loadorders = function (status) {

                app_header_page.find('#back_btn').hide();
                app_header_page.find('#dashrefresh').hide();
                hideinnerpages();
                app_order_page.loadpage({ url: 'pages/orders.html' }).show();
                changetitle('Orders');

                app.fn.orders.getorders(status, function (data) {

                    var ol = app_order_page.find('ol'),
                        header_clone = ol.find('.header_clone').clone().removeClass('clone'),
                        item_clone = ol.find('.item_clone').clone().removeClass('clone'),
                        optionArray = []
                    ;

                    if (status != '') {

                        getallordersbystatus(data, status, function (arr) {
                            var header = header_clone.clone();
                            header.find('h3').text(status);
                            header.find('.ui-li-count').text(arr.length);

                            optionArray.push(header);
                            createorderitems(arr, item_clone, optionArray);
                        });

                    } else {

                        getallordersbystatus(data, 'New', function (arr) {
                            var header = header_clone.clone();
                            header.find('h3').text('New');
                            header.find('.ui-li-count').text(arr.length);

                            optionArray.push(header);
                            createorderitems(arr, item_clone, optionArray);
                        });

                        getallordersbystatus(data, 'InProgress', function (arr) {
                            var header = header_clone.clone();
                            header.find('h3').text('InProgress');
                            header.find('.ui-li-count').text(arr.length);

                            optionArray.push(header);
                            createorderitems(arr, item_clone, optionArray);
                        });

                        getallordersbystatus(data, 'Completed', function (arr) {
                            var header = header_clone.clone();
                            header.find('h3').text('Completed');
                            header.find('.ui-li-count').text(arr.length);

                            optionArray.push(header);
                            createorderitems(arr, item_clone, optionArray);
                        });

                        getallordersbystatus(data, 'Cancelled', function (arr) {
                            var header = header_clone.clone();
                            header.find('h3').text('Cancelled');
                            header.find('.ui-li-count').text(arr.length);

                            optionArray.push(header);
                            createorderitems(arr, item_clone, optionArray);
                        });
                    }

                    ol.append(optionArray);
                });
            },

            loaddashboard = function () {

                changetitle('Dashboard');
                app_header_page.find('#back_btn').hide();
                app_header_page.find('#dashrefresh').show();
                hideinnerpages();
                app_home_page.fadeIn('fast');

                app.fn.orders.getordercounts(function (list) {

                    $.each(list, function (i, n) {

                        if (i == 'New') {
                            app_home_page.find('.bg-one h1').text(n);
                        } else if (i == 'InProgress') {
                            app_home_page.find('.bg-two h1').text(n);
                        } else if (i == 'Completed') {
                            app_home_page.find('.bg-three h1').text(n);
                        } else if (i == 'Cancelled') {
                            app_home_page.find('.bg-four h1').text(n);
                        }
                    });
                });

            },

            loadneworderdetails = function (u, t) {

                var merchant = '';

                hideinnerpages();
                app_header_page.find('#back_btn').removeClass('hidden').show();
                $('body').data('userkey', u);

                app_neworder_detail_page.loadpage({
                    url: 'pages/orders-new-details.html',
                    callback: function () {

                        app_neworder_detail_page.find('#details_new_order').find('li').not('.clone, .nodelete').remove();

                        changetitle('Order details');

                        app.fn.cart.gpd(u, t, function (pd) {

                            app_neworder_detail_page.find('#transactionid').text(pd.TransactionId);
                            app_neworder_detail_page.find('#remarks').text(pd.Remark);
                            merchant = pd.Merchant;

                            app.fn.cart.gccibt(u, t, function (data) {

                                var
                                    item_clone = app_neworder_detail_page.find('.item_clone').clone().removeClass('clone'),
                                    arr = []
                                ;

                                $.each(data, function (i, n) {

                                    var cloneitem = item_clone.clone();

                                    cloneitem.find('.product_name').text(n.ProductName);
                                    cloneitem.find('.quantity').text(n.Quantity);
                                    cloneitem.find('.price').text(n.Price);
                                    cloneitem.find('.ship_method').text(n.ShippingMethod);
                                    cloneitem.find('.avatar').prop('src', app.avatars.primary(merchant, n.ProductRowKey, 70));

                                    if (pd.IsCreditCard) {
                                        cloneitem.find('.removeitem').remove();
                                    } else {
                                        cloneitem.find('.removeitem').data('p', n.PartitionKey).data('r', n.RowKey);
                                    }

                                    cloneitem.find('.showshipment').data('cartitem', n);

                                    if (!n.IsVerified) cloneitem.find('.isverified').removeClass('ord_verified').text('Unverified');

                                    arr.push(cloneitem);
                                });

                                app_neworder_detail_page.find('#details_new_order').append(arr);
                            });
                        });

                        app.fn.orders.getorder(t, function (data) {

                            app_neworder_detail_page.find('#customer_email').text(data.Email);
                            app_neworder_detail_page.find('#customer_name').text(data.UserName);
                            app_neworder_detail_page.find('#mobile_number').text(data.MobileNumber);
                            app_neworder_detail_page.find('#order_status').text(data.Status);
                            app_neworder_detail_page.find('#order_date').text(moment(data.ConvertedOrderDate).format('LLLL'));

                        });



                        app_neworder_detail_page.find('#confirm_order').data('u', u).data('t', t);
                    }

                }).show();
            },

            loadinprogressorderdetails = function (u, t) {

                var merchant = '';

                hideinnerpages();

                app_inprogorder_detail_page.loadpage({
                    url: 'pages/orders-inprog-details.html',
                    callback: function () {
                        app_inprogorder_detail_page.find('#details_inprog_order').find('li').not('.clone, .nodelete').remove();
                        app_inprogorder_detail_page.find('#complete_order').data('i', t).data('u', u);
                    }

                }).show();

                changetitle('Order details');

                app.fn.cart.gpd(u, t, function (data) {

                    app_inprogorder_detail_page.find('#transactionid').text(data.TransactionId);
                    app_inprogorder_detail_page.find('#remarks').text(data.Remark);
                    merchant = data.Merchant;
                });

                app.fn.orders.getorder(t, function (data) {

                    app_inprogorder_detail_page.find('#customer_email').text(data.Email);
                    app_inprogorder_detail_page.find('#customer_name').text(data.UserName);
                    app_inprogorder_detail_page.find('#mobile_number').text(data.MobileNumber);
                    app_inprogorder_detail_page.find('#order_status').text(data.Status);
                    app_inprogorder_detail_page.find('#order_date').text(moment(data.ConvertedOrderDate).format('LLLL'));

                });

                app.fn.cart.gccibt(u, t, function (data) {

                    var
                        item_clone = app_inprogorder_detail_page.find('.item_clone').clone().removeClass('clone'),
                        arr = []
                    ;

                    $.each(data, function (i, n) {

                        var cloneitem = item_clone.clone();

                        cloneitem.find('.product_name').text(n.ProductName);
                        cloneitem.find('.quantity').text(n.Quantity);
                        cloneitem.find('.price').text(n.Price);
                        cloneitem.find('.ship_method').text(n.ShippingMethod);
                        cloneitem.find('.avatar').prop('src', app.avatars.primary(merchant, n.ProductRowKey, 70));

                        if (!n.IsVerified) cloneitem.find('.isverified').removeClass('ord_verified').text('Unverified');

                        arr.push(cloneitem);
                    });

                    app_inprogorder_detail_page.find('#details_inprog_order').append(arr);
                });

            },

            loadshipmethodpickup = function () {

                app.fn.merchant.getaddress(function (data) {

                    var page = app_order_shipment_page.find('#page_ship_pickup');

                    page.find('select').children('option').text(data.AddressLine);
                    page.find('select').selectmenu('refresh');

                    page.find('.addressline').text(data.AddressLine);
                    page.find('.locality').text(data.Locality);
                    page.find('.country').text(data.CountryRegion);
                    page.find('.postalcode').text(data.PostalCode);
                    page.find('.landmark').text(app.util.removenull(data.LandMark));

                });

            },

            loadshipmethoddeliver = function () {

                var page = app_order_shipment_page.find('#page_ship_deliver'),
                    cartitem = $('body').data('cartitem')
                ;

                if (cartitem.AddressPartitionKey != '' && cartitem.AddressRowKey != '') {
                    app.fn.orders.getaddress(cartitem.AddressPartitionKey, cartitem.AddressRowKey, function (data) {

                        page.find('.addressline').text(data.AddressLine);
                        page.find('.locality').text(data.Locality);
                        page.find('.country').text(data.CountryRegion);
                        page.find('.postalcode').text(data.PostalCode);
                        page.find('.landmark').text(app.util.removenull(data.LandMark));

                    });
                }
            },

            getallsalesbydate = function (data, year, month, day, callback) {

                var arrays = [];
                $.each(data, function (i, e) {

                    if (e.year == year) arrays.push(e);
                    if (e.month == month) arrays.push(e);
                    if (e.day == day) arrays.push(e);
                });

                if (callback) return callback(arrays);
            },

            createsalesitems = function (data, itemclone, optionArray) {

                $.each(data, function (i, e) {

                    var clone = itemclone.clone();

                    clone.find('.sales_tid').text(data.TransactionId.toUpperCase());
                    clone.find('.sales_date').text(moment(data.SalesInvoice.OrderDate).format('LLLL'));
                    clone.find('.cus_name').text(data.username.toUpperCase());

                    optionArray.push(clone);
                });
            },

            loadsales = function (year, month, day) {

                var optionArray = [];

                changetitle('Sales');
                app_header_page.find('#back_btn').hide();
                app_header_page.find('#dashrefresh').hide();
                hideinnerpages();

                app_sales_page.loadpage({
                    url: 'pages/sales.html',
                    callback: function () {

                        app.fn.sales.getsalesbydate(year, month, day, function (invoices) {

                            var ol = app_sales_page.find('ol'),
                                header_clone = ol.find('.header_clone').clone().removeClass('clone'),
                                item_clone = ol.find('.item_clone').clone().removeClass('clone')
                            ;

                            var header = header_clone.clone();

                            header.find('h3').text('Sales Count');
                            header.find('.ui-li-count').text(invoices.length);

                            optionArray.push(header);

                            $.each(invoices, function (i, n) {

                                var clone = item_clone.clone();

                                clone.data('invoice', n);
                                clone.find('.sales_tid').text(n.TransactionId);
                                clone.find('.cus_name').text(n.UserName);
                                clone.find('.sales_amount').text(n.NetValue);
                                clone.find('.sales_date').text(moment(n.InvoiceDate).format('LLLL'));

                                optionArray.push(clone);
                            });
                            console.log();
                            ol.append(optionArray);
                        });
                    }

                }).show();
            },

            loadsalesinvoiceitems = function (invoice) {

                changetitle('Sales Invoice Items');
                hideinnerpages();

                app_sales_detail_page.loadpage({
                    url: 'pages/sales-details.html',
                    callback: function () {

                        app_sales_detail_page.find('#transactionid').text(invoice.TransactionId);
                        app_sales_detail_page.find('#customer_name').text(invoice.UserName);
                        app_sales_detail_page.find('#order_status').text(invoice.Status);
                        app_sales_detail_page.find('#sales_total').text(invoice.NetValue);
                        app_sales_detail_page.find('#order_date').text(moment(invoice.InvoiceDate).format('LLLL'));

                        app.fn.sales.getinvoiceitems(invoice.TransactionId, function (items) {
                            var ol = app_sales_detail_page.find('ol'),
                                item_clone = ol.find('.item_clone').clone().removeClass('clone'),
                                optionArray = []
                            ;

                            $.each(items, function (i, n) {

                                var clone = item_clone.clone();

                                clone.find('.product_name').text(n.ProductName);
                                clone.find('.ship_method').text(n.ShippingMethod);
                                clone.find('.avatar').prop('src', app.avatars.primary(invoice.Merchant, n.ProductRowKey, 70));

                                optionArray.push(clone);

                            });
                            
                            ol.append(optionArray);
                        });
                    }

                }).show();
            }
        ;

        //loading

        $(document).on({
            ajaxStart: function () {
                $.mobile.loading('show');
            },
            ajaxStop: function () {
                $.mobile.loading('hide');
            }
        });

        // Login page Events

        app_login_page
            .on('click', '#signin_btn', function () {

                var
                    self = $(this).prop('disabled', true),
                    username = app_login_page.find('#email').val(),
                    password = app_login_page.find('#pw').val()

                ;

                app.fn.accounts.login(username, password, function (m) {

                    if (!!m) {

                        app_login_page.hide();
                        
                        app_header_page.loadpage({ url: 'pages/header.html' }).show();
                        app_home_page.loadpage({ url: 'pages/home.html' }).show();
                        changetitle('Dashboard');
                        app_login_page.hide();
                        app_header_page.find('#back_btn').hide();
                        loaddashboard();

                    } else {

                        alert('Failed to login');
                    }

                    self.prop('disabled', false);
                });

            });

        // Home page events

        app_home_page
            .on('click', '.bg-one', function () {
                changetitle('New Orders');
                loadorders('New');
            })
            .on('click', '.bg-two', function () {
                changetitle('In progress Orders');
                loadorders('InProgress');
            })
            .on('click', '.bg-three', function () {
                changetitle('Completed Orders');
                loadorders('Completed');
            })
            .on('click', '.bg-four', function () {
                changetitle('Cancelled Orders');
                loadorders('Cancelled');
            })

        ;

        //Order page

        app_order_page
            .on('click', 'li.item_clone.New', function () {

                var self = $(this);

                loadneworderdetails(self.data('u'), self.data('t'));
            })
            .on('click', 'li.item_clone.InProgress', function () {

                var self = $(this);

                loadinprogressorderdetails(self.data('u'), self.data('t'));
            })
        ;

        // Order detail page

        app_neworder_detail_page
            .on('click', 'li .showshipment', function () {

                var self = $(this);

                changetitle('Shipment');
                hideinnerpages();
                app_header_page.find('#back_btn').removeClass('hidden').show();

                app_order_shipment_page.loadpage({
                    url: 'pages/shipment.html',
                    callback: function () {

                        var cartitem = self.data('cartitem');

                        $('body').data('cartitem', cartitem).data('shipmethod', cartitem.ShippingMethod).data('oldshipmethod', cartitem.ShippingMethod);

                        if (cartitem.ShippingMethod == 'Pickup') {

                            hidepageshipmethod();
                            app_order_shipment_page.find('#page_ship_pickup').fadeIn();

                            loadshipmethodpickup();


                        } else if (cartitem.ShippingMethod == 'Meetup') {

                            hidepageshipmethod();

                            app_order_shipment_page.find('#page_ship_meetup').fadeIn();

                        } else if (cartitem.ShippingMethod == 'Deliver') {

                            hidepageshipmethod();
                            app_order_shipment_page.find('#page_ship_deliver').data('cartitem', cartitem).fadeIn();

                            loadshipmethoddeliver();
                        }

                        app_order_shipment_page.find('#applyall_shipmethod strong').text(cartitem.ShippingMethod);
                    }

                }).show();

            })
            .on('click', '.removeitem', function () {

                $('body').data('cancelcartitem', $(this));
            })
            .on('click', '#confirm_order', function () {

                var self = $(this).prop('disabled', true);

                app.fn.orders.confirmorder(self.data('u'), self.data('t'), function (data) {

                    if (!!data && data.Success) {

                        changetitle('New Orders');
                        loadorders('New');

                    } else {
                        alert(data.Message);
                        self.prop('disabled', false);
                    }

                });
            })
        ;

        app_inprogorder_detail_page
            .on('click', '#complete_order', function () {

                var self = $(this).prop('disabled', true);

                app.fn.orders.completesales(self.data('i'), self.data('u'), function (data) {

                    if (!!data) {

                        loaddashboard();

                    } else {
                        alert("Failed to complete orders.");
                        self.prop('disabled', false);
                    }

                });

            })
        ;

        app_order_shipment_page
            .on('change', '#options_shipping_method #radio-choice-h-2a', function () {

                hidepageshipmethod();
                app_order_shipment_page.find('#page_ship_pickup').fadeIn();
                loadshipmethodpickup();
                $('body').data('shipmethod', 'Pickup');

            })
            .on('change', '#options_shipping_method #radio-choice-h-2b', function () {

                hidepageshipmethod();
                app_order_shipment_page.find('#page_ship_meetup').fadeIn();
                $('body').data('shipmethod', 'Meetup');

            })
            .on('change', '#options_shipping_method #radio-choice-h-2c', function () {

                hidepageshipmethod();
                app_order_shipment_page.find('#page_ship_deliver').fadeIn();
                loadshipmethoddeliver();
                $('body').data('shipmethod', 'Deliver');

            })
            .on('click', '#verify_cartitem', function () {

                var
                    self = $(this).prop('disabled', true),
                    cartitem = $('body').data('cartitem'),
                    item = {
                        PartitionKey: cartitem.PartitionKey,
                        RowKey: cartitem.RowKey,
                        ShippingMethod: $('body').data('shipmethod'),
                        ShippingCompany: app_order_shipment_page.find('#page_ship_deliver #ship_company').val(),
                        ShippingExpectedDate: app_order_shipment_page.find('#page_ship_deliver #ship_date').val(),
                        AddressPartitionKey: cartitem.AddressPartitionKey,
                        AddressRowKey: cartitem.AddressRowKey,
                        When: app_order_shipment_page.find('#page_ship_meetup #meet_when').val(),
                        Where: app_order_shipment_page.find('#page_ship_meetup #meet_where').val(),
                        OtherComments: ''
                    };

                app.fn.orders.confirmcartitem(item, $('body').data('userkey'), $('body').data('oldshipmethod'),
                    app_order_shipment_page.find('#applyall_shipmethod input[type="checkbox"]').prop('checked'), function (data) {

                        if (data.Success) {

                            loadorders('New');
                        } else {
                            alert(data.Message);
                        }

                        self.prop('disabled', false);
                    });

            })
        ;

        //Sales page

        app_sales_page
            .on('click', 'li.item_clone', function () {

                loadsalesinvoiceitems($(this).data('invoice'));

            })

        ;

        // Global events

        $('body')
            .on('click', '#order-action #remove_cartitem', function () {

                var self = $('body').data('cancelcartitem');

                app.fn.orders.confirmremove(self.data('p'), self.data('r'), function (data) {

                    if (!!data) {
                        self.closest('li').remove();
                    } else {
                        alert('Failed to remove item.');
                    }

                });
            })
        ;


        // Header page events

        app_header_page
            .on('click', '#back_btn', function () {
                loadorders('New');
            })
            .on('click', '#dashrefresh', function () {
                loaddashboard();
            })
            .on('click', '#home_header_btn', function () {
                loaddashboard();
            })
            .on('click', '#order_header_btn', function () {
                loadorders('');
            })
            .on('click', '#inventory_header_btn', function () {

                app_header_page.find('#dashrefresh').hide();
                hideinnerpages();
                app_product_page.fadeIn('fast');
                app_order_page.loadpage({ url: 'pages/inventory.html' }).show();
            })
            .on('click', '#restock_header_btn', function () {
                app_header_page.find('#dashrefresh').hide();
            })
            .on('click', '#sales_header_btn', function () {

                var today = new Date(),
                    month = today.getMonth() + 1,
                    day = today.getDate(),
                    year = today.getFullYear()
                ;

                loadsales(year, month, day);
            })
            .on('click', '#logout', function () {

                app.fn.accounts.logout(function (data) {
                    window.location.reload();
                });

            })
        ;

        app_login_page.loadpage({ url: 'pages/login.html', force: false });

    });

}(jQuery, window.app));