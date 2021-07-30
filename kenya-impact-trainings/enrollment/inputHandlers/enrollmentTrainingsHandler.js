var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');

var handlerName = 'enr_impact_train_hand_name';
var trainings = {
    '1': 'Maize Intercrop',
    '2': 'Maize Topdress',
    '3': 'Pest & Diseases Mitigation',
    '4': 'Maize Harvest'
};

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        var getMessage = translator(translations, lang);
        return function(input) {
            if(trainings[input]) {
                state.vars.selected_training = trainings[input];
                global.sayText(getMessage('thanks_for_enrolling', {
                    '$name': state.vars.name,
                    '$training': trainings[input]
                }, lang));
                
                // track the FO
                // send the sms to makandi and the FO
                // save client to the data table
                global.stopRules();
            } else {
                global.sayText('impact_trainings_menu', {}, lang);
                global.promptDigits(handlerName);
            }
        };
    }
};
