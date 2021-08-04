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

// utils
var OnValidatedFactory = require('./utils/OnValidatedFactory');
var getDistrictsMenu = require('./utils/getDistrictsMenu');
var getSectorsMenu = require('./utils/getSectorsMenu');
var getSitesMenu = require('./utils/getSitesMenu');
var getGroupsMenu = require('./utils/getGroupsMenu');
var registerClient = require('./utils/registerClient');

function start(lang) {
    var getMessage = translator(translations, lang);
    state.vars.reg_lang = lang;
    global.sayText(getMessage('enter_nid', {}, lang));
    global.promptDigits(nationalIdHandler.handlerName);
}


function registerInputHandlers(lang) {
    state.vars.reg_lang = lang;
    var onNationalIdValidated = OnValidatedFactory('enter_phone', phoneNumberHandler,  'reg_nid', {});
    var onPhoneNumberValidated = OnValidatedFactory('enter_first_name', firstNameHandler, 'reg_phone', {});
    var onFirstNameValidated = OnValidatedFactory('enter_last_name', lastNameHandler, 'reg_first_name', {});
    var onLastNameValidated = OnValidatedFactory('enter_district', districtHandler, 'reg_last_name', {'$districtsMenu': getDistrictsMenu});
    var onDistrictValidated = OnValidatedFactory('enter_sector', sectorHandler, 'district_id', {'$sectorsMenu': getSectorsMenu});
    var onSectorValidated = OnValidatedFactory('enter_site', sitesHandler, 'sector_name', {'$sitesMenu': getSitesMenu});
    var onSiteValidated = OnValidatedFactory('enter_group', groupHandler, 'site_id', {'$groupsMenu': getGroupsMenu});
    var onGroupValidated = OnValidatedFactory('show_account_number', null, 'group_id', {'$accountNumber': registerClient});
    
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
