
var defaultEnvironment;
if(service.active){
    defaultEnvironment = 'prod';
}else{
    defaultEnvironment = 'dev';
}

var env;
if(service.vars.env === 'prod' || service.vars.env === 'dev'){
    env = service.vars.env;
}else{
    env = defaultEnvironment;
}

service.vars.server_name = project.vars[env+'_server_name'];
service.vars.roster_api_key = project.vars[env+'_roster_api_key'];
service.vars.roster_read_key = project.vars.roster_read_key;

var notifyELK = require('../notifications/elk-notification/elkNotification');
var lang = project.vars.lang;

state.vars.lang = lang;

var translations = require('./tranlations');
var translator = require('../utils/translator/translator');
var getMessage = translator(translations, lang);

var inputHandlers = require('./inputHandlers/inputHandlers');
var buyBackTransactions = require('../buyback-transactions/buyBackTransactions');

global.main = function(){
    notifyELK();
    sayText(getMessage('splash', {}, lang));
    promptDigits('account_number', {
        'submitOnHash': false,
        'maxDigits': 8,
        'timeout': 10,
    });
};

addInputHandler('account_number', inputHandlers.accountNumberInputHandler);
buyBackTransactions.registerInputHandlers();