var scriptLoader = require('js-scriptLoader'),
    Events = require('js-events'),
    envConfig = require('./config.js');

/**
 * Load Livefyre's core Javascript library
 */
exports.loadLivefyreCore = (function () {
    "use strict";

    var status = {
        loaded: false,
        status: '',
        inProgress: false,
        event: new Events()
    };

    return function (callback) {
        if (status.loaded === true) {
            if (status.status === 'success') {
                callback();
            } else {
                callback(status.error);
            }
        } else {
            status.event.on('done', function () {
                if (status.status === 'success') {
                    callback();
                } else {
                    callback(status.error);
                }
            });

            if (!status.inProgress) {
                status.inProgress = true;

                scriptLoader(
                    {
                        url: envConfig.get().livefyre.resourceDomainBase + envConfig.get().resourceUrls.livefyreJs,
                        cache: true
                    },
                    function (err) {
                        if (err) {
                            status.loaded = true;
                            status.status = 'error';
                            status.error = err;
                            status.event.trigger('done');

                            return;
                        }

                        if (typeof fyre === 'undefined') {
                            status.loaded = true;
                            status.status = 'error';
                            status.error = new Error("Script not loaded.");
                            status.event.trigger('done');

                            return;
                        }
                    
                        status.loaded = true;
                        status.status = 'success';
                        status.event.trigger('done');
                    }
                );
            }
        }
    };
})();


/**
 * Load a CSS override file
 */
exports.loadCssOverrides = (function () {
    "use strict";

    var loaded = [];
    var head = document.head || document.getElementsByTagName('head')[0];

    return function (url) {
        if (loaded.indexOf(url) === -1) {
            loaded.push(url);

            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = url;
            head.appendChild(link);
        }
    };
})();