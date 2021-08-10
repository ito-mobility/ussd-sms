var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var registerSerial = require('../endpoints/registerSerial');
var getkeyCodeType = require('./getkeyCodeType');
var getkeyCodeForRequest = require('../helper-functions/getKeyCodeRequest');
var getCode = require('../endpoints/getCode');

var countries = {
    'KE': '404',
    'RW': '646'
};

module.exports = function registerSerialNumber(serialNumber,unitType,replacement){
    var countryCode;
    var client = JSON.parse(state.vars.client);
    countryCode = countries[state.vars.country];
    // check the initial registration time for RW
    var keyCodeType = getkeyCodeType(state.vars.country, client.BalanceHistory[0]);
    if(state.vars.unit_to_update) {
        // client is updating the unit (requesting for a new activation or unlock code) this currently works for Rwanda only
        keyCodeType = getkeyCodeForRequest(client);
        console.log('getting key: ' + keyCodeType);
    }
    if(keyCodeType === null) {
        // global.sayText(translate('previous_loan_message', {}, state.vars.shsLang));
        // return null;
        var codes =  getCode(client.AccountNumber);
        return codes;
    }
    console.log('getting key 2: ' + keyCodeType);
    var requestData = {};
    if(client.BalanceHistory[0].SeasonName == service.vars.current_enrollment_season_name){
        requestData = {
            accountNumber: state.vars.account,
            countryCode: countryCode,
            unitSerialNumber: serialNumber,
            keyCodeType: keyCodeType,
            unitType: unitType,
            isReplacement: replacement
        };
        console.log('requ'+JSON.stringify(requestData));
        return registerSerial(requestData);
    } else if(keyCodeType === 'UNLOCK' && state.vars.country === 'RW') {
        requestData = {
            accountNumber: state.vars.account,
            countryCode: countryCode,
            unitSerialNumber: serialNumber,
            keyCodeType: keyCodeType,
            unitType: unitType,
            isReplacement: replacement
        };
        console.log('requ'+JSON.stringify(requestData));
        return registerSerial(requestData);
    }
    else{
        // if client wants an unlock code after they have paid all
        if(client.BalanceHistory[0].TotalCredit <= client.BalanceHistory[0].TotalRepayment_IncludingOverpayments && state.vars.country === 'KE'){
            requestData = {
                accountNumber: state.vars.account,
                countryCode: countryCode,
                unitSerialNumber: serialNumber,
                keyCodeType: 'UNLOCK',
                unitType: unitType,
                isReplacement: replacement
            };
            return registerSerial(requestData);
        } else if(state.vars.country === 'RW') {
            // IF COUNTRY IS Rwanda, the a client is requesting for registering a unit that they did not order.
            global.sayText(translate('not_enrolled', {}, state.vars.shsLang));
            global.stopRules();
            return;
        }
        console.log('>>>>>>>>>>>>>>>current season' + client.BalanceHistory[0].SeasonName + ' === ' + service.vars.current_enrollment_season_name);
        global.sayText(translate('previous_loan_message',{},state.vars.shsLang));
        return null;
    }
    
};
