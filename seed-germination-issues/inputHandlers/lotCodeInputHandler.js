var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');

var handlerName = 'rsgi_lot_code';
module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var dukaInputHandler = require('./dukaInputHandler');
            var getMessage = translator(translations, lang);
            var lot_code_screens = JSON.parse(state.vars.lot_code_screens);
            var current_lot_code_screen = parseInt(state.vars.current_lot_code_screen);

            if(input == 77) {
                // next screen
                if(lot_code_screens[current_lot_code_screen + 1]) {
                    state.vars.current_lot_code_screen = current_lot_code_screen + 1;
                    global.sayText(lot_code_screens[state.vars.current_lot_code_screen]);
                } else {
                    global.sayText(lot_code_screens[state.vars.current_lot_code_screen]);
                }
                global.promptDigits(handlerName);
                return;
            } else {
                state.vars.lot_code = input;
                global.sayText(getMessage('duka_title', {}, lang));
                global.promptDigits(dukaInputHandler.handlerName);
            }
        };
    }
};
