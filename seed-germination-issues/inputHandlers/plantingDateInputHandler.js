var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');
var createMenu = require('../../shared/createMenu');

var handlerName = 'rsgi_date';
module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var severityInputHandler = require('./severityInputHandler');
            var dateInput = input && input.split('/'); /// input should be dd/mm/yyyy
            var currentDate = new Date();
            var isValidDate = ((31 - parseInt(dateInput[0])) > 0) 
            && ((12 - parseInt(dateInput[1])) >= 0 && ((parseInt(dateInput[2]) == currentDate.getFullYear() ? parseInt(dateInput[1]) <= currentDate.getMonth() : true))) 
            && (parseInt(dateInput[2]) <= currentDate.getFullYear());
            var getMessage = translator(translations, lang);
            if(isValidDate) {
                state.vars.planting_date = input.trim();
                var severityMenus = createMenu(getMessage('severity', {}, lang), getMessage('next_option', {}, lang), getMessage('severity_title', {}, lang));
                state.vars.current_severity_screen = '1';
                var severityPrompt = severityMenus.screens['1'];
                state.vars.severity_screens = JSON.stringify(severityMenus.screens);
                state.vars.severity_options = JSON.stringify(severityMenus.optionValues);
                global.sayText(severityPrompt);
                global.promptDigits(severityInputHandler.handlerName);
            } else {
                // invalid option
                var date_screen = getMessage('planting_date', {}, lang);
                global.sayText(date_screen);
                global.promptDigits(handlerName);
            }    
        };
    }
};
