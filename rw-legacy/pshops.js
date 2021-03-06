/*
    Name: pshops.js
    Purpose: OAF RW PShops Client Portal; allows clients to register, get new codes, and check balance for SHS products
    Status: complete
*/
var defaultEnvironment;
if(service.active){
    defaultEnvironment = 'prod'
}else{
    defaultEnvironment = 'dev'
}

var env;
if(service.vars.env === 'prod' || service.vars.env === 'dev'){
    env = service.vars.env;
}else{
    env = defaultEnvironment;
}
if(env === 'prod'){
    service.vars.activation_code_table = 'ActivationCodes';
    service.vars.serial_number_table = 'SerialNumberTable';
    service.vars.pShop_main_menu = 'pshop_main_menu';
    service.vars.pshopLocationTableId = 'DT36fed49375e091b4';
    service.vars.pshopsClientsTableId = 'DTa40ff6716a261c3c'
}
else{
    service.vars.activation_code_table = 'dev_ActivationCodes';
    service.vars.serial_number_table = 'dev_SerialNumberTable';
    service.vars.pShop_main_menu = 'dev_pshop_main_menu';
    service.vars.pshopLocationTableId = 'DT2ef13a17146daf5d',
    service.vars.pshopsClientsTableId = 'DT3db6478bbdd00f8e'
}

service.vars.agrodealers_address_table = 'agrodealers_address_table'
service.vars.server_name = project.vars[env+'_server_name'];
service.vars.roster_api_key = project.vars[env+'_roster_api_key'];
service.vars.bundles_table = 'DTe5c918280e193dc0';
 
service.vars.roster_read_key = project.vars.roster_read_key;
state.vars.country = project.vars.country;
// load in necessary functions
var msgs = require('./lib/msg-retrieve'); // global message handler
var admin_alert = require('./lib/admin-alert'); // global admin alerter
var get_menu_option = require('./lib/get-menu-option');
var populate_menu = require('./lib/populate-menu');
var check_account_no = require('./lib/psh-check-account'); 
var registration_check = require('./lib/psh-reg-check');
var renew_code = require('./lib/psh-renew-code');
var serial_no_check = require('./lib/psh-serial-verify');
var slack = require('../slack-logger/index');
var notiFYELK = require('../notifications/elk-notification/elkNotification');
var agrodealerLocator = require('../agrodealer-locator/agrodealerLocator');
var pshopRegistration = require('../pshopRegistration/pshopRegistration');

// set various constants
var settings_table = project.getOrCreateDataTable('ussd_settings');
const max_digits_for_account_number = parseInt(settings_table.queryRows({'vars' : {'settings' : 'max_digits_an'}}).next().vars.value);
const max_digits = parseInt(settings_table.queryRows({'vars' : {'settings' : 'max_digits'}}).next().vars.value);
const timeout_length = 180; // this doesn't appear to work. data type error?
const lang = service.vars.lang || project.vars.cor_lang;
var menuTable = service.vars.pShop_main_menu;
var activation_code_table = service.vars.activation_code_table;
var serial_number_table = service.vars.serial_number_table ;
// display welcome message and prompt user to enter account number
global.main = function() {
    notiFYELK();
    sayText(msgs('pshops_main_splash', {}, lang));
    promptDigits('account_number_splash', { 'submitOnHash' : false,
                                            'maxDigits'    : max_digits_for_account_number,
                                            'timeout'      : timeout_length });
}
agrodealerLocator.registerInputHandlers(lang, service.vars.agrodealers_address_table);
pshopRegistration.registerInputHandlers(lang)
// input handler for account number
addInputHandler('account_number_splash', function(accnum){
    notiFYELK();
    try{
    // if account number is valid, save it as a state variable and display main menu
        if(accnum == 1) {
            // start pshops client registration
            pshopRegistration.start(lang);
        } else if(accnum.toString().trim() == 0) {
            agrodealerLocator.start(lang);
        }
        else if(check_account_no(accnum)){ 
            state.vars.accnum = accnum;
            var menu = populate_menu(menuTable, lang);
            state.vars.current_menu_str = menu;
            sayText(msgs('pshop_main_menu', {'$NAME' : state.vars.client_name}, lang));
            promptDigits('pshop_menu_select', { 'submitOnHash' : false,
                                                'maxDigits'    : max_digits,
                                                'timeout'      : timeout_length });
        }
        // if account is invalid, print incorrect account msg and prompt digits for account # again
        else{
            sayText(msgs('incorrect_account_number', {}, lang));
            promptDigits('account_number_splash', { 'submitOnHash' : false,
                                                    'maxDigits'    : max_digits_for_account_number,
                                                    'timeout'      : timeout_length });
        }
    }
    catch(error){
        // if error occurs, print client error message, log error, and alert the admin
        sayText(msgs('client_alert', {}, lang));
        console.log(error);
        slack.log('Error on USSD test integration' +error + '\n Account number:' + accnum, "Error, ERROR, ERROR" )
        admin_alert('Error on USSD test integration : '+ error + '\nAccount number: ' + accnum, "ERROR, ERROR, ERROR")
        stopRules();
    }
});

// input handler for main menu selections
addInputHandler('pshop_menu_select', function(input){
    notiFYELK();
    // clean input and save current step as a variable
    input = String(input.replace(/\D/g,''));
    state.vars.current_step = 'pshop_menu_select';
    var selection = get_menu_option(input, menuTable);

    // if menu selection is null/undefined, print error message and request new selection
    if(selection === null || selection === undefined){
        sayText(msgs('invalid_input', {}, lang));
        promptDigits('pshop_menu_select', { 'submitOnHash' : false, 
                                            'maxDigits'    : max_digits,
                                            'timeout'      : timeout_length});
        return null;
    }
    // if check balance selected, print message with some balance variables and prompt for main menu
    else if(selection === 'check_balance_option'){
        sayText(msgs('main_message', {  '$REPAY'    : state.vars.TotalRepay_Incl,
                                        '$CREDIT'   : state.vars.TotalCredit,
                                        '$BALANCE'  : state.vars.Balance}, lang)); 
        promptDigits('back_to_main', {  'submitOnHash' : false,
                                        'maxDigits'    : max_digits,
                                        'timeout'      : timeout_length });
    }
    // if solar codes option selected, run registration and lock status check then display relevant message/options
    else if(selection === 'solar_codes_option'){
        if(registration_check(state.vars.accnum)){
            if(state.vars.unlock){
                sayText(msgs('solar_unlocked', {'$SERIAL'  : state.vars.serial_no,
                                                '$ACTCODE' : state.vars.ActCode}, lang));
                promptDigits('back_to_main', {  'submitOnHash' : false,
                                                'maxDigits'    : max_digits,
                                                'timeout'      : timeout_length });
            }
            else{
                sayText(msgs('solar_locked', {  '$SERIAL'  : state.vars.serial_no,
                                                '$ACTCODE' : state.vars.ActCode}, lang));
                promptDigits('get_new_code', {  'submitOnHash' : false,
                                                'maxDigits'    : max_digits,
                                                'timeout'      : timeout_length });
            }
        }
        else if(state.vars.duplicate){ // if client has multiple products, ask them to enter the correct serial number
            sayText(msgs('solar_duplicate', {}, lang));
            promptDigits('serial_no_reg', { 'submitOnHash' : false,
                                            'maxDigits'    : max_digits_for_account_number,
                                            'timeout'      : timeout_length })
        }
        else{
            sayText(msgs('solar_nonreg', {}, lang));
            promptDigits('serial_no_reg', { 'submitOnHash' : false,
                                            'maxDigits'    : max_digits_for_account_number,
                                            'timeout'      : timeout_length });
        }
    }
    // if user enters invalid menu option, prompt user to select from main menu options
    else{
        sayText(msgs('invalid_input', {}, lang));
        promptDigits('pshop_menu_select', { 'submitOnHash' : false,
                                            'maxDigits'    : max_digits,
                                            'timeout'      : timeout_length });
    }
});

// input handler for new code (called from solar_codes_option)
addInputHandler('get_new_code', function(input){
    notiFYELK();
    // clean input and run renew_code function
    input = String(input.replace(/\D/g,''));
    var selection = get_menu_option(input, 'solar_codes_menu');
    renew_code(state.vars.accnum, state.vars.serial_no);

    // display various options depending on menu selection
    if(selection === 'new_code'){
        if(state.vars.NewCodeStatus === 'No'){
            sayText(msgs('insufficient_funds', {'$REMAIN_BAL' : state.vars.RemainBal,
                                                '$BALANCE'    : state.vars.Balance,}, lang));
            promptDigits('back_to_main', {  'submitOnHash' : false,
                                            'maxDigits'    : max_digits,
                                            'timeout'      : timeout_length });
        }
        else if(state.vars.NewCodeStatus === 'Unlock'){
            sayText(msgs('unlock_success', {'$ACTCODE' : state.vars.ActCode}, lang));
            promptDigits('back_to_main', {  'submitOnHash' : false,
                                            'maxDigits'    : max_digits,
                                            'timeout'      : timeout_length });
        }
        else{
            sayText(msgs('activation_code', {'$ACTCODE' : state.vars.ActCode}, lang));
            promptDigits('back_to_main', {  'submitOnHash' : false,
                                            'maxDigits'    : max_digits,
                                            'timeout'      : timeout_length });
        }
    }
    else{
        var menu = populate_menu(menuTable, lang);
        state.vars.current_menu_str = menu;
        sayText(menu);
        promptDigits('pshop_menu_select', { 'submitOnHash' : false,
                                            'maxDigits'    : max_digits,
                                            'timeout'      : timeout_length });
    }
});

// input handler for back to main; returns user to the main menu
addInputHandler('back_to_main', function(input){
    notiFYELK();
    var menu = populate_menu(menuTable, lang);
    state.vars.current_menu_str = menu;
    sayText(menu);
    promptDigits('pshop_menu_select', { 'submitOnHash' : false,
                                        'maxDigits'    : max_digits,
                                        'timeout'      : timeout_length });
});

// input handler for serial number (called from solar_codes_options)
addInputHandler('serial_no_reg', function(input){
    notiFYELK();
    // if user wants to register, run serial # registration check and display corresponding messages/options 
    input = String(input.replace(/\D/g,''));
    if(input === '99'){
        var menu = populate_menu(menuTable, lang);
        state.vars.current_menu_str = menu;
        sayText(menu);
        promptDigits('pshop_menu_select', { 'submitOnHash' : false,
                                            'maxDigits'    : max_digits,
                                            'timeout'      : timeout_length });
    }
    else{
        serial_no_check(state.vars.accnum, input);
        if(state.vars.SerialStatus === 'Reg'){
            sayText(msgs('reg_success', {'$ACTCODE' : state.vars.ActCode}, lang));
            promptDigits('back_to_main', {  'submitOnHash' : false,
                                            'maxDigits'    : max_digits,
                                            'timeout'      : timeout_length });
        }
        else if(state.vars.SerialStatus === 'AlreadyReg'){
            sayText(msgs('already_reg', {}, lang));
            promptDigits('serial_no_reg', { 'submitOnHash' : false,
                                            'maxDigits'    : max_digits_for_account_number,
                                            'timeout'      : timeout_length });
        }
        else if(state.vars.SerialStatus == 'failed_getting_serial_number'){
            sayText(msgs('client_alert', {}, lang));
        }
        else{
            sayText(msgs('serial_not_found', {}, lang));
            promptDigits('serial_no_reg', { 'submitOnHash' : false,
                                            'maxDigits'    : max_digits_for_account_number,
                                            'timeout'      : timeout_length });
        }
    }
});

