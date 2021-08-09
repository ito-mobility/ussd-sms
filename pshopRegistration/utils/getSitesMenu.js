var translations = require('../translations/index.js');
var translator = require('../../utils/translator/translator');
var getMessage = translator(translations, state.vars.reg_lang);

module.exports = function getSitesMenu() {
    var createMenu = require('../../shared/createMenu');
    var pshopLocationsTable = project.initDataTableById(service.vars.pshopLocationTableId);
    var cursor = pshopLocationsTable.queryRows({vars: {sector_id: state.vars.sector_id, district_id: state.vars.district_id}});
    var uniqueSites = {};
    while(cursor.hasNext()) {
        var row = cursor.next();
        // uniqueSites[row.vars.site_name] = row.vars.site_id;
        uniqueSites[row.vars.site_id] = row.vars.site_name;
    }
    state.vars.pshop_sites = JSON.stringify(uniqueSites);
    var sitesMenu = createMenu(uniqueSites, getMessage('next_screen', {}, state.vars.reg_lang), '', {});
    state.vars.current_sites_screen = '1';
    state.vars.sitesMenuScreens = JSON.stringify(sitesMenu.screens);
    state.vars.sitesMenuOptionValues = JSON.stringify(sitesMenu.optionValues);
    return sitesMenu.screens['1'];
};
