var translations = require('../translations/index.js');
var translator = require('../../utils/translator/translator');
var getMessage = translator(translations, state.vars.reg_lang);

module.exports = function OnValidatedFactory(messageName, nextHandler, previousHandlerStateVariableName, messageOptions) {
    return function(input) {
        var messageOption = Object.keys(messageOptions)[0];
        state.vars[previousHandlerStateVariableName] = input;
        var dataGenerator = messageOptions[messageOption];
        var message = {};
        message[messageOption] = typeof(dataGenerator) === 'function' && dataGenerator();

        !state.vars.stop_services && global.sayText(getMessage(messageName, message, state.vars.reg_lang));
        nextHandler && global.promptDigits(nextHandler.handlerName);
    };
};
