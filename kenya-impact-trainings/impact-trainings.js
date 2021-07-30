var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
var impactTrainingsMenuHandler = require('./inputHandlers/impactTrainingsMenuHandler');
var IPP_DUKA = require('./IPP-DUKA/kenya-impact-trainings');
var enrollment = require('./enrollment/trainings-enrollment');

function registerInputHandlers(trainingsMenuText, lang) {
    global.addInputHandler(impactTrainingsMenuHandler.handlerName, impactTrainingsMenuHandler.getHandler(lang));
    IPP_DUKA.registerInputHandlers(trainingsMenuText, lang);
    enrollment.registerInputHandlers(lang);
}

function start(lang) {
    var getMessage = translator(translations, lang);
    global.sayText(getMessage('choose_tr_option', {}, lang));
    global.promptDigits(impactTrainingsMenuHandler.handlerName);
}

module.exports = {
    start: start,
    registerInputHandlers: registerInputHandlers
};
