var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');

var isPhoneNumberValid = function(phoneNumber){
    // Valid for Kenya
    if(state.vars.country == 'ke'){
        if (phoneNumber.length === 10 && phoneNumber.substring(0, 2)=="07"){
            return true;
        }
    }
    return false;
}
var handlerName = 'phone_number_handler';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onPhoneNumberValidated){
        return function (input) {
            if(isPhoneNumberValid(input)){
                onPhoneNumberValidated(input);
            }
            else{
                global.sayText(translate('invalid_phone_number',{},state.vars.reg_lang));
                global.promptDigits(handlerName);
            }
            
        };

    }
};