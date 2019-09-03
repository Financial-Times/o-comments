const oCommentApi = require('o-comment-api');
const oCommentUtilities = require('o-comment-utilities');

module.exports = function () {};
module.exports.setConfig = function () {};
module.exports.init = function () {};
module.exports.enableLogging = function () {};
module.exports.disableLogging = function () {};
module.exports.setLoggingLevel = function () {};
module.exports.on = function () {};
module.exports.off = function () {};
module.exports.utils = require('./src/javascripts/utils.js');
module.exports.i18n = require('./src/javascripts/i18n.js');
module.exports.auth = require('./src/javascripts/auth.js');
module.exports.userDialogs = require('./src/javascripts/userDialogs.js');

// Leaving this rather than mocking the whole component
module.exports.utilities = oCommentUtilities;
module.exports.dataService = oCommentApi;
