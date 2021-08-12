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
                var farmerDetails = JSON.parse(state.vars.impact_farmer_details);
                var selected_training = trainings[input];
         
                // track the FO
                var FOphone = farmerDetails.vars.agent_phone;
                var FOname = farmerDetails.vars.agent_name;
                var farmer_phone = farmerDetails.vars.farmer_phone;
                var farmer_firstName = farmerDetails.vars.farmer_name;
                var farmer_surName = farmerDetails.vars.farmer_surname;
                
                var makandiTeamPhones = [FOphone, '+254718992515', '+25416587447', '+254750855113'];
                // create a message to send to Makandi and the FO
                var messageToFO = getMessage('enrollment_msg_to_fo', {
                    '$fo_name': FOname,
                    '$farmer_first_name': farmer_firstName,
                    '$farmer_last_name': farmer_surName,
                    '$farmer_phone': farmer_phone,
                    '$training_name': selected_training,
                }, lang);


                // save client to the data table
                var impactTrainingsClientsTable = project.getOrCreateDataTable(service.vars.impact_tr_enr_table_name);
                var farmerCursor = impactTrainingsClientsTable.queryRows({vars: {
                    farmer_phone: farmer_phone
                }});

                if(farmerCursor.hasNext()) {
                    var farmerRow = farmerCursor.next();
                    farmerRow.vars.selected_trainings = (farmerRow.vars.selected_trainings ? farmerRow.vars.selected_trainings : '') + selected_training + ', ';
                    farmerRow.vars.enrolled = '1';
                    farmerRow.save();
                } else {
                    // show a technical error message
                    sayText(getMessage('farmer_not_found', {}, lang));
                    return global.stopRules();
                }

                // show a confirmation to the farmer
                global.sayText(getMessage('thanks_for_enrolling', {
                    '$name': farmer_firstName + ' ' + farmer_surName,
                    '$training': selected_training
                }, lang));
                
                // send the sms to Makandi and the FO
                makandiTeamPhones.forEach(function(phone) {
                    project.sendMessage({
                        content: messageToFO,
                        to_number: phone,
                    });
                });
                //end the session
                global.stopRules();
            } else {
                global.sayText(getMessage('impact_trainings_menu', {}, lang));
                global.promptDigits(handlerName);
            }
        };
    }
};
