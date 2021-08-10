var translations = require('./translations/index');
var translator = require('../../utils/translator/translator');
var enrollmentTrainingsHandler = require('./inputHandlers/enrollmentTrainingsHandler');
var checkIfIPPClient = require('./utils/checkIfIPPClient');

function registerInputHandlers(lang) {
    global.addInputHandler(enrollmentTrainingsHandler.handlerName, enrollmentTrainingsHandler.getHandler(lang));
}


function start(lang) {
    var getMessage = translator(translations,lang);
    var isIPPClient = checkIfIPPClient(contact.phone_number);

    if(!isIPPClient) {
        global.sayText(getMessage('not_ipp_client', {}, lang));
        global.stopRules();
        return;
    }
    global.sayText(getMessage('impact_trainings_menu', {}, lang));
    global.promptDigits(enrollmentTrainingsHandler.handlerName);
}

module.exports = {
    start: start,
    registerInputHandlers: registerInputHandlers
};