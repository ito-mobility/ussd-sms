var translations = require('../translations/index.js');
var translator = require('../../utils/translator/translator');
var getMessage = translator(translations, state.vars.reg_lang);

module.exports = function registerClient() {
    var registerClientApi = require('../../shared/rosterApi/registerClient');
    // do the final registration of the user
    var registrationData = {
        'districtId': state.vars.district_id,
        'siteId': state.vars.site_id,
        'firstName': state.vars.reg_first_name,
        'lastName': state.vars.reg_last_name,
        'nationalIdNumber': 'RW-PSHOP-' + state.vars.reg_nid,
        'phoneNumber': state.vars.reg_phone
    };
    var registeredClient = registerClientApi(registrationData);
    // check if client already exists
    if(!registeredClient) {
        if(state.vars.duplicated_user) {
            var registeredAccountNumber = JSON.parse(state.vars.duplicated_user).AccountNumber;
            // get client details
            var getClientDetails = require('../../shared/rosterApi/getClient');
            var clientDetails = getClientDetails(registeredAccountNumber, project.vars.country);
            if(clientDetails) {
                // show account number already registered message
                global.sayText(getMessage('client_already_registered', {
                    '$nid': state.vars.reg_nid,
                    '$account_number': registeredAccountNumber,
                    '$client_name': clientDetails.ClientName
                }, state.vars.reg_lang));
            } else {
                global.sayText(getMessage('error_try_again', {}, state.vars.reg_lang));
            }
        } else {
            global.sayText(getMessage('error_try_again', {}, state.vars.reg_lang));
        }
        state.vars.stop_services = 'true';
        global.stopRules();
        return null;
    }
    // get the account number
    var accountNumber =  registeredClient.AccountNumber;
    // save the client in the data table
    var pshopsClientsTable = project.initDataTableById(service.vars.pshopsClientsTableId);
    var row = pshopsClientsTable.createRow({
        vars: {
            'first_name': state.vars.reg_first_name,
            'last_name': state.vars.reg_last_name,
            'national_id': 'RWPSHOP' + state.vars.reg_nid,
            'phone_number': state.vars.reg_phone,
            'account_number': accountNumber,
            'district_name': state.vars.selected_district_name,
            'sector_name': state.vars.sector_name,
            'group_name': state.vars.selected_district_name,
            'site_name': state.vars.selected_site_name
        }
    });
    row.save();
    // return the account number
    return accountNumber;
};
