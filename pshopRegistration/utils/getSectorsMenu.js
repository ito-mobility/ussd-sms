var translations = require('../translations/index.js');
var translator = require('../../utils/translator/translator');
var getMessage = translator(translations, state.vars.reg_lang);

module.exports = function getSectorsMenu() {
    var createMenu = require('../../shared/createMenu');
    var pshopLocationsTable = project.initDataTableById(service.vars.pshopLocationTableId);
    var cursor = pshopLocationsTable.queryRows({vars: {district_id: state.vars.district_id}});
    var uniqueSectors = {};
    while(cursor.hasNext()) {
        var row = cursor.next();
        // uniqueSectors[row.vars.sector_name] = row.vars.sector_id;
        uniqueSectors[row.vars.sector_id] = row.vars.sector_name;
    }
    state.vars.pshop_sectors = JSON.stringify(uniqueSectors);
    var sectorsMenu = createMenu(uniqueSectors, getMessage('next_screen', {}, state.vars.reg_lang), '', {});
    state.vars.current_sectors_screen = '1';
    state.vars.sectorsMenuScreens = JSON.stringify(sectorsMenu.screens);
    state.vars.sectorsMenuOptionValues = JSON.stringify(sectorsMenu.optionValues);
    return sectorsMenu.screens['1'];
};
