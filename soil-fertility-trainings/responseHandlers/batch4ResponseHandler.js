
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var batch5ResponseHandler = require('./batch5ResponseHandler');

var HandlerName = 'sms_4_response';
module.exports = {
    handlerName: HandlerName,
    getHandler: function(lang) {
        return function() {

            var getMessage = translator(translations, lang);
            var messages = ['sms-5.1', 'sms-5.2', 'sms-5.3', 'sms-5.4', 'sms-5.5'];

            messages.forEach(function(message) {
                sendReply(getMessage(message, {}, lang));
            });

            waitForResponse(batch5ResponseHandler.handlerName);
        };
    }
};