// fetch groups and set the groupsMenu as a state variable
var translations = require('../translations/index.js');
var translator = require('../../utils/translator/translator');

var getMessage = translator(translations, state.vars.reg_lang);
var handlerName = 'pshps_enr_dist_handler';

module.exports = {
    handlerName: handlerName,
    getHandler: function(onGroupValidated) {
        return function(input) {
            var lang = state.vars.reg_lang;
            var groupsMenuScreens = JSON.parse(state.vars.groupsMenuScreens);
            var groupsMenuOptionValues = JSON.parse(state.vars.groupsMenuOptionValues); // {1: groupId, 2: groupId, ...}
            var pshop_groups = JSON.parse(state.vars.pshop_groups); // {[groupId]: [groupName]}

            if(groupsMenuOptionValues[input]) {
                var choosen_group_id = groupsMenuOptionValues[input];
                state.vars.selected_group_name = pshop_groups[choosen_group_id];
                onGroupValidated(choosen_group_id);
            } else if(input == 99 && groupsMenuScreens[parseInt(state.vars.current_groups_screen) + 1]) {
                state.vars.current_groups_screen = parseInt(state.vars.current_groups_screen) + 1;
                global.sayText(groupsMenuScreens[state.vars.current_groups_screen]);
                global.promptDigits(handlerName);
            } else {
                // invalid input reprompt
                global.sayText(getMessage('enter_group', {'$groupsMenu': groupsMenuScreens[state.vars.current_groups_screen]}, lang));
                global.promptDigits(handlerName);
            }
        };
    }
};