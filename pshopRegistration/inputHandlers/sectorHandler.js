// fetch sectors and set the sectorsMenu as a state variable
var translations = require('../translations/index.js');
var translator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

var getMessage = translator(translations, state.vars.reg_lang);
var handlerName = 'pshps_enr_sect_handler';

module.exports = {
    handlerName: handlerName,
    getHandler: function(onSectorValidated) {
        return function(input) {
            notifyELK();
            var lang = state.vars.reg_lang;
            var sectorsMenuScreens = JSON.parse(state.vars.sectorsMenuScreens);
            var sectorsMenuOptionValues = JSON.parse(state.vars.sectorsMenuOptionValues); // {1: sectorId, 2: sectorId, ...}
            var pshop_sectors = JSON.parse(state.vars.pshop_sectors); // {[sectorId]: [sectorName]}

            if(sectorsMenuOptionValues[input]) {
                var choosen_sector_id = sectorsMenuOptionValues[input];
                state.vars.sector_id = choosen_sector_id;
                onSectorValidated(pshop_sectors[choosen_sector_id]);
            } else if(input == 99 && sectorsMenuScreens[parseInt(state.vars.current_sectors_screen) + 1]) {
                state.vars.current_sectors_screen = parseInt(state.vars.current_sectors_screen) + 1;
                global.sayText(sectorsMenuScreens[state.vars.current_sectors_screen]);
                global.promptDigits(handlerName);
            } else {
                // invalid input reprompt
                global.sayText(getMessage('enter_sector', {'$sectorsMenu': sectorsMenuScreens[state.vars.current_sectors_screen]}, lang));
                global.promptDigits(handlerName);
            }
        };
    }
};
