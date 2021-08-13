var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

var handlerName = 'imct_tr_menu_handler';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        var getMessage = translator(translations, lang);
        return function(input) {
            if(input == 1) {
                // access information  of training on your phone. two way sms impact trainings
                var IPP_DUKA = require('../IPP-DUKA/kenya-impact-trainings');
                IPP_DUKA.start(lang, 'TrainingSelect'); // string TrainingSelect is from ke-legacy/main.js an input handler name for impact trainings
            } else if(input == 2) {
                // Enroll in impact trainings
                var trainingsEnrollment = require('../enrollment/trainings-enrollment');
                trainingsEnrollment.start(lang);
            } else {
                // reprompt
                global.sayText(getMessage('choose_tr_option', {}, lang));
                global.promptDigits(handlerName);
            }
        };
    }
};
