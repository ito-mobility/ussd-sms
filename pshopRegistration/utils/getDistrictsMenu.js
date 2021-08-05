var translations = require('../translations/index.js');
var translator = require('../../utils/translator/translator');
var getMessage = translator(translations, state.vars.reg_lang);

// find a way to make a factory function for getMenus
module.exports = function getDistrictsMenu() {
    var createMenu = require('../../shared/createMenu');
    var uniqueDistricts = {};
    var pshopLocationsTable = project.initDataTableById(service.vars.pshopLocationTableId); // table contains multiple entries of districts hence need to be filetered out to get unique districts
    var cursor = pshopLocationsTable.queryRows({vars: {}});
    

    while(cursor.hasNext()) {
        var row = cursor.next();
        // uniqueDistricts[row.vars.district_name] = row.vars.district_id;
        uniqueDistricts[row.vars.district_id] = row.vars.district_name;
    }
    state.vars.pshop_districts = JSON.stringify(uniqueDistricts);
    var districtsMenu = createMenu(uniqueDistricts, getMessage('next_screen', {}, state.vars.reg_lang), '', {});
    state.vars.current_districts_screen = '1';
    state.vars.districtsMenuScreens = JSON.stringify(districtsMenu.screens);
    state.vars.districtsMenuOptionValues = JSON.stringify(districtsMenu.optionValues);
    return districtsMenu.screens['1'];
};
