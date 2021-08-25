// fetch sites and set the sitesMenu as a state variable
var translations = require('../translations/index.js');
var translator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

var getMessage = translator(translations, state.vars.reg_lang);
var handlerName = 'pshps_enr_sites_handler';

module.exports = {
    handlerName: handlerName,
    getHandler: function(onSiteValidated) {
        return function(input) {
            notifyELK();
            var lang = state.vars.reg_lang;
            var sitesMenuScreens = JSON.parse(state.vars.sitesMenuScreens);
            var sitesMenuOptionValues = JSON.parse(state.vars.sitesMenuOptionValues); // {1: siteId, 2: siteId, ...}
            var pshop_sites = JSON.parse(state.vars.pshop_sites); // {[siteId]: [siteName]}

            if(sitesMenuOptionValues[input]) {
                var choosen_site_id = sitesMenuOptionValues[input];
                state.vars.selected_site_name = pshop_sites[choosen_site_id];
                onSiteValidated(choosen_site_id);
            } else if(input == 99 && sitesMenuScreens[parseInt(state.vars.current_sites_screen) + 1]) {
                state.vars.current_sites_screen = parseInt(state.vars.current_sites_screen) + 1;
                global.sayText(sitesMenuScreens[state.vars.current_sites_screen]);
                global.promptDigits(handlerName);
            } else {
                // invalid input reprompt
                global.sayText(getMessage('enter_site', {'$sitesMenu': sitesMenuScreens[state.vars.current_sites_screen]}, lang));
                global.promptDigits(handlerName);
            }
        };
    }
};
