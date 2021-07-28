var translations = require('./translations/index.js');
var translator = require('../utils/translator/translator');
var nationalIdHandler = require('../client-registration/national-id-handler/nationalIdHandler');
var phoneNumberHandler = require('../client-registration/phone-number-handler/phoneNumberHandler');
var firstNameHandler = require('../client-registration/first-name-handler/firstNameHandler');
var lastNameHandler = require('../client-registration/second-name-handler/secondNameHandler');

var districtHandler = require('./inputHandlers/districtHandler');
var sectorHandler = require('./inputHandlers/sectorHandler');
var sitesHandler = require('./inputHandlers/sitesHandler');
var groupHandler = require('./inputHandlers/groupHandler');

var getMessage = translator(translations, state.vars.reg_lang);

function start(lang, country) {
    global.sayText(getMessage('enter_nid', {}, lang));
    global.promptDigits(nationalIdHandler.handlerName);
}

function OnValidatedFactory(messageName, nextHandler, previousHandlerStateVariableName, messageOptions) {
    return function(input) {
        state.vars[previousHandlerStateVariableName] = input;
        global.sayText(getMessage(messageName, messageOptions, state.vars.reg_lang));
        nextHandler && global.promptDigits(nextHandler.handlerName);
    };
}

function getDistrictsMenu() {
    var createMenu = require('../shared/createMenu');
    var uniqueDistricts = {};
    var pshopLocationsTable = project.initTableById(service.vars.pshopLocationTableId); // table contains multiple entries of districts hence need to be filetered out to get unique districts
    var cursor = pshopLocationsTable.queryRows({vars: {}});
    

    while(cursor.hasNext()) {
        var row = cursor.next();
        uniqueDistricts[row.vars.district_name] = row.vars.district_id;
        uniqueDistricts[row.vars.district_id] = row.vars.district_name;
    }
    state.vars.pshop_districts = JSON.stringify(uniqueDistricts);
    var districtsMenu = createMenu(uniqueDistricts, getMessage('next_screen', {}, state.vars.reg_lang));
    state.vars.current_districts_screen = '1';
    state.vars.districtsMenuScreens = JSON.stringify(districtsMenu.screens);
    state.vars.districtsMenuOptionValues = JSON.stringify(districtsMenu.optionValues);
    return districtsMenu.screens['1'];
}

function getSectorsMenu() {
    var createMenu = require('../shared/createMenu');
    var pshopLocationsTable = project.initTableById(service.vars.pshopLocationTableId);
    var cursor = pshopLocationsTable.queryRows({vars: {district_id: state.vars.district_id}});
    var uniqueSectors = {};
    while(cursor.hasNext()) {
        var row = cursor.next();
        uniqueSectors[row.vars.sector_name] = row.vars.sector_id;
        uniqueSectors[row.vars.sector_id] = row.vars.sector_name;
    }
    state.vars.pshop_sectors = JSON.stringify(uniqueSectors);
    var sectorsMenu = createMenu(uniqueSectors, getMessage('next_screen', {}, state.vars.reg_lang));
    state.vars.current_sectors_screen = '1';
    state.vars.sectorsMenuScreens = JSON.stringify(sectorsMenu.screens);
    state.vars.sectorsMenuOptionValues = JSON.stringify(sectorsMenu.optionValues);
    return sectorsMenu.screens['1'];
}

function getSitesMenu() {
    var createMenu = require('../shared/createMenu');
    var pshopLocationsTable = project.initTableById(service.vars.pshopLocationTableId);
    var cursor = pshopLocationsTable.queryRows({vars: {sector_id: state.vars.sector_id, district_id: state.vars.district_id}});
    var uniqueSites = {};
    while(cursor.hasNext()) {
        var row = cursor.next();
        uniqueSites[row.vars.site_name] = row.vars.site_id;
        uniqueSites[row.vars.site_id] = row.vars.site_name;
    }
    state.vars.pshop_sites = JSON.stringify(uniqueSites);
    var sitesMenu = createMenu(uniqueSites, getMessage('next_screen', {}, state.vars.reg_lang));
    state.vars.current_sites_screen = '1';
    state.vars.sitesMenuScreens = JSON.stringify(sitesMenu.screens);
    state.vars.sitesMenuOptionValues = JSON.stringify(sitesMenu.optionValues);
    return sitesMenu.screens['1'];
}

function getGroupsMenu() {
    var createMenu = require('../shared/createMenu');
    var pshopLocationsTable = project.initTableById(service.vars.pshopLocationTableId);
    var cursor = pshopLocationsTable.queryRows({vars: {site_id: state.vars.site_id, sector_id: state.vars.sector_id, district_id: state.vars.district_id}});
    var uniqueGroups = {};
    while(cursor.hasNext()) {
        var row = cursor.next();
        uniqueGroups[row.vars.group_name] = row.vars.group_id;
        uniqueGroups[row.vars.group_id] = row.vars.group_name;
    }
    state.vars.pshop_groups = JSON.stringify(uniqueGroups);
    var groupsMenu = createMenu(uniqueGroups, getMessage('next_screen', {}, state.vars.reg_lang));
    state.vars.current_groups_screen = '1';
    state.vars.groupsMenuScreens = JSON.stringify(groupsMenu.screens);
    state.vars.groupsMenuOptionValues = JSON.stringify(groupsMenu.optionValues);
    return groupsMenu.screens['1'];
}

function registerClient() {
    var registerClientApi = require('../shared/rosterApi/registerClient');
    // do the final registration of the user
    var registrationData = {
        'districtId': state.vars.district_id,
        'siteId': state.vars.site_id,
        'firstName': state.vars.reg_first_name,
        'lastName': state.vars.reg_last_name,
        'nationalIdNumber': state.vars.reg_nid,
        'phoneNumber': state.vars.reg_phone
    };
    var registeredClient = registerClientApi(registrationData);
    // get the account number
    var accountNumber =  registeredClient.AccountNumber;
    // save the client in the data table
    var pshopsClientsTable = project.initTableById(service.vars.pshopsClientsTableId);
    pshopsClientsTable.createRow({
        vars: {
            'first_name': state.vars.reg_first_name,
            'last_name': state.vars.reg_last_name,
            'national_id': state.vars.reg_nid,
            'phone_number': state.vars.reg_phone,
            'account_number': accountNumber,
            district_name: state.vars.selected_district_name,
            sector_name: state.vars.sector_name,
            group_name: state.vars.selected_district_name,
            site_name: state.vars.selected_site_name
        }
    });
    // return the account number
    return accountNumber;
}
function registerInputHandlers() {
    var onNationalIdValidated = OnValidatedFactory('enter_phone', phoneNumberHandler, 'reg_nid', {});
    var onPhoneNumberValidated = OnValidatedFactory('enter_first_name', firstNameHandler, 'reg_phone', {});
    var onFirstNameValidated = OnValidatedFactory('enter_last_name', lastNameHandler, 'reg_first_name', {});
    var onLastNameValidated = OnValidatedFactory('enter_district', districtHandler, 'reg_last_name', {'$districtsMenu': getDistrictsMenu()});
    var onDistrictValidated = OnValidatedFactory('enter_sector', sectorHandler, 'district_id', {'$sectorsMenu': getSectorsMenu()});
    var onSectorValidated = OnValidatedFactory('enter_site', sitesHandler, 'sector_name', {'$sitesMenu': getSitesMenu()});
    var onSiteValidated = OnValidatedFactory('enter_group', groupHandler, 'site_id', {'$groupsMenu': getGroupsMenu()});
    var onGroupValidated = OnValidatedFactory('show_account_number', null, 'group_id', {'$accountNumber': registerClient()});
    
    global.addInputHandler(nationalIdHandler.handlerName, nationalIdHandler.getHandler(onNationalIdValidated));
    global.addInputHandler(phoneNumberHandler.handlerName, phoneNumberHandler.getHandler(onPhoneNumberValidated));
    global.addInputHandler(firstNameHandler.handlerName, firstNameHandler.getHandler(onFirstNameValidated));
    global.addInputHandler(lastNameHandler.handlerName, lastNameHandler.getHandler(onLastNameValidated));
    global.addInputHandler(districtHandler.handlerName, districtHandler.getHandler(onDistrictValidated));
    global.addInputHandler(sectorHandler.handlerName, sectorHandler.getHandler(onSectorValidated));
    global.addInputHandler(sitesHandler.handlerName, sitesHandler.getHandler(onSiteValidated));
    global.addInputHandler(groupHandler.handlerName, groupHandler.getHandler(onGroupValidated));
    
}

module.exports = {
    start: start,
    registerInputHandlers: registerInputHandlers
};
