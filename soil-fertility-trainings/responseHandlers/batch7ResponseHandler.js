
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

var HandlerName = 'sms_7_response';
module.exports = {
    handlerName: HandlerName,
    getHandler: function(lang) {
        return function() {

            var getMessage = translator(translations, lang);
            var messages = ['sms-7.1', 'sms-7.2'];
            
            global.sendReply(getMessage(messages[0], {}, lang));
            global.sendReply(getMessage(messages[1], {}, lang));
            
        };
    }
};
