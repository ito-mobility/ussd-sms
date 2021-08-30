var translator = require('../utils/translator/translator');
var translations = require('./translations/index');
var Log = require('../logger/elk/elk-logger');

var config = {
    langs: {
        'tz': {
            'en': 'en',
            'sw': 'sw-tz',
            'default': 'sw-tz',
        },
        'ke': {
            'en-ke': 'en',
            'sw': 'sw-ke',
            'default': 'sw-ke',
        }
    }
};
try {
    var lang = config.langs[project.vars.country][contact.vars.lang] || config.langs[project.vars.country]['default'];

    var getMessage = translator(translations, lang);
    var messageContent = getMessage('registration-notification', {
        '$Name': contact.vars.firstName,
        '$AccountNumber': contact.vars.accountnumber
    }, lang);

    project.sendMessage({
        content: messageContent,
        to_number: contact.phone_number,
        route_id: project.vars.repayments_sms_route,
        message_type: 'sms'
    });

} catch (ex) {
    console.log('#########################error sending message#########################');
    var logger = new Log();
    logger.error('Failed to send registration notification SMS:', { 
        Message: 'RegistrationSMSError', 
        data: {
            TAG: 'RegistrationNotificationSMSError',
            exception: ex, 
            country: project.vars.country,
            vars: contact.vars,
            phoneNumber: contact.phone_number
        }
    });
}