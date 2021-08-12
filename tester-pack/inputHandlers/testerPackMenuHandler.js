// var confirmation = require('../confirmation/confirmTesterPackReception'); // confirmation is stopped for a while
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var status = require('../status/status');
var registration = require('../registration/testerPackRegistration');

module.exports = function testerPackMenuHandler(input) {
    var lang = state.vars.lang;
    var getMessage = translator(translations, lang);
    if(input == 2) {
        status.startTesterPackStatus();
        // } else if(input == 2) {
        //     confirmation.startTesterPackConfirmation();
    } else if(input == 1) {
        registration.startTesterPackRegistration();
    } else{
        sayText(getMessage('invalid_input', {'$Menu': getMessage('tester_pack_menu', {}, lang)}, lang));
        promptDigits('tester_pack_menu', {submitOnHash: false, maxDigits: 2, timeout: 5});
    }
};
