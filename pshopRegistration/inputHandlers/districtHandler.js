// fetch districts and set the districtsMenu as a state variable
var translations = require('../translations/index.js');
var translator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

var getMessage = translator(translations, state.vars.reg_lang);
var handlerName = 'pshps_enr_dist_handler';

module.exports = {
    handlerName: handlerName,
    getHandler: function(onDistrictValidated) {
        return function(input) {
            notifyELK();
            var lang = state.vars.reg_lang;
            var districtsMenuScreens = JSON.parse(state.vars.districtsMenuScreens);
            var districtsMenuOptionValues = JSON.parse(state.vars.districtsMenuOptionValues); // {1: districtId, 2: districtId, ...}
            var pshop_districts = JSON.parse(state.vars.pshop_districts); // {[districtId]: [districtName]}

            if(districtsMenuOptionValues[input]) {
                var choosen_district_id = districtsMenuOptionValues[input];
                state.vars.selected_district_name = pshop_districts[choosen_district_id];
                onDistrictValidated(choosen_district_id);
            } else if(input == 99 && districtsMenuScreens[parseInt(state.vars.current_districts_screen) + 1]) {
                state.vars.current_districts_screen = parseInt(state.vars.current_districts_screen) + 1;
                global.sayText(districtsMenuScreens[state.vars.current_districts_screen]);
                global.promptDigits(handlerName);
            } else {
                // invalid input reprompt
                global.sayText(getMessage('enter_district', {'$districtsMenu': districtsMenuScreens[state.vars.current_districts_screen]}, lang));
                global.promptDigits(handlerName);
            }
        };
    }
};