var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');
var lotCodeInputHandler = require('./lotCodeInputHandler');
var handlerName = 'rsgi_custom_seed_variety';
module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var variety = input && input.trim();
            var getMessage = translator(translations, lang);
            if(!variety) {
                global.sayText(getMessage('custom_seed_variety', {}, lang));
                global.promptDigits(handlerName);
                return;
            }
            state.vars.rsgi_seed_variety = input;
            var lotCodePrompt = getMessage('lot_code', {}, lang);
            var lotCodePromptMenu1 = {
                1: lotCodePrompt.slice(0, 100) + '...' + '\n' + getMessage('next_option', {}, lang), 
                2: lotCodePrompt.slice(100)
            };
            state.vars.lot_code_screens = JSON.stringify(lotCodePromptMenu1);
            state.vars.current_lot_code_screen = 1;
            global.sayText(lotCodePromptMenu1[1]);
            global.promptDigits(lotCodeInputHandler.handlerName);
        };
    }
};
