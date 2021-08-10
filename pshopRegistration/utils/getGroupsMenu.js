var translations = require('../translations/index.js');
var translator = require('../../utils/translator/translator');
var getMessage = translator(translations, state.vars.reg_lang);

module.exports = function getGroupsMenu() {
    var createMenu = require('../../shared/createMenu');
    var pshopLocationsTable = project.initDataTableById(service.vars.pshopLocationTableId);
    var cursor = pshopLocationsTable.queryRows({vars: {site_id: state.vars.site_id, sector_id: state.vars.sector_id, district_id: state.vars.district_id}});
    var uniqueGroups = {};
    while(cursor.hasNext()) {
        var row = cursor.next();
        // uniqueGroups[row.vars.group_name] = row.vars.group_id;
        uniqueGroups[row.vars.group_id] = row.vars.group_name;
    }
    state.vars.pshop_groups = JSON.stringify(uniqueGroups);
    var groupsMenu = createMenu(uniqueGroups, getMessage('next_screen', {}, state.vars.reg_lang), '', {});
    state.vars.current_groups_screen = '1';
    state.vars.groupsMenuScreens = JSON.stringify(groupsMenu.screens);
    state.vars.groupsMenuOptionValues = JSON.stringify(groupsMenu.optionValues);
    return groupsMenu.screens['1'];
};
