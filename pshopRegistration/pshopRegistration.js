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

function registerInputHandlers() {

    var onNationalIdValidated = OnValidatedFactory('enter_phone', phoneNumberHandler, 'reg_nid', {});
    var onPhoneNumberValidated = OnValidatedFactory('enter_first_name', firstNameHandler, 'reg_phone', {});
    var onFirstNameValidated = OnValidatedFactory('enter_last_name', lastNameHandler, 'reg_first_name', {});
    var onLastNameValidated = OnValidatedFactory('enter_district', districtHandler, 'district_id', {'$districtsMenu': getDistrictsMenu()});
    var onDistrictValidated = OnValidatedFactory('enter_sector', sectorHandler, 'sector_name', {'$sectorsMenu': getSectorsMenu()});
    var onSectorValidated = OnValidatedFactory('enter_site', sitesHandler, 'site_id', {'$sitesMenu': getSitesMenu()});
    var onSiteValidated = OnValidatedFactory('enter_group', groupHandler, 'group_id', {'$groupsMenu': getGroupsMenu()});
    var onGroupValidated = OnValidatedFactory('show_account_number', null, 'account_number', {'$accountNumber': getAccountNumber()});
    
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
