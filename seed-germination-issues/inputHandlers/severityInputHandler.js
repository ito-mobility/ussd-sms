var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');

var handlerName = 'rsgi_issues_severity';
module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var phoneNumberInputHandler = require('./phoneNumberInputHandler');

            var severity_screens = JSON.parse(state.vars.severity_screens);
            var issueLevels = JSON.parse(state.vars.severity_options);
            var current_severity_screen = parseInt(state.vars.current_severity_screen);

            var issueLevel = input && parseInt(input.replace(/\D/g, ''));
            var getMessage = translator(translations, lang);
            if((typeof issueLevel) === 'number' && issueLevels[issueLevel]) {
                state.vars.issues_severity = issueLevels[issueLevel];
                call.vars.issues_severity = issueLevels[issueLevel];
                global.sayText(getMessage('phone_prompt', {}, lang));
                global.promptDigits(phoneNumberInputHandler.handlerName);
            } else if(issueLevel == 77 && severity_screens[current_severity_screen + 1]) {
                state.vars.current_severity_screen = current_severity_screen + 1;
                global.sayText(severity_screens[state.vars.current_severity_screen]);
                global.promptDigits(handlerName);
            } else {
                // invalid option
                global.sayText(severity_screens[state.vars.current_severity_screen]);
                global.promptDigits(handlerName);
            }
        };
    }
};
