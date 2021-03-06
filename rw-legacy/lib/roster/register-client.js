
var logResponse = require('../utils/request-logger');
var registrationEndpoint = '/Api/Registrations/RegisterClient';
var slack = require('../../../slack-logger/index');
var Log = require('../../../logger/elk/elk-logger');


/**
 * 
 * @param {Object} clientJSON 
 * @param {number} districtId
 * @param {number} siteId
 * @param {number} groupId
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} nationalIdNumber
 * @param {string} phoneNumber
 * @param {string} lang 
 */

module.exports = function (clientJSON, lang) {

    var logger;
    var response;
    var fullUrl = service.vars.server_name + registrationEndpoint;
    var opts = { headers: {} };
    opts.headers['Authorization'] = 'Token ' + service.vars.roster_api_key;
    opts.headers['X-OAF-Lang'] = lang;
    opts.method = 'POST';
    opts.data = clientJSON;

    try {
        logger = new Log(project.vars.elk_logs_base_url);
    } catch (error) {
        slack.log('Error creating logger'+ error);
    }
    
    try {
        response = httpClient.request(fullUrl, opts);
        console.log('url:'+fullUrl+ ' options: '+ JSON.stringify(opts));
        var msgs = require('../msg-retrieve');
        console.log(JSON.stringify(response));
        if (response.status == 200) {
            return response.content;
        }
        else if (response.status == 409) {
            logResponse(fullUrl, response);
            //If the account number is returned in the content, return it to the user
            if(JSON.parse(response.content).AccountNumber){
                var accountNumber = parseInt(JSON.parse(response.content).AccountNumber.replace(/\"/g, ' '));
                if((isNaN(accountNumber)) || (accountNumber == null) || (typeof(accountNumber) == undefined)){
                    sayText(msgs('FAILURE_REGISTERING', {}, lang));
                    if(logger) logger.warn('Error Registering a new Client',{tags: [service.vars.env],data: {response: response, request: opts.data}});
                    stopRules();
                    return null;
                }
                else{
                    sayText(msgs('enrolled_national_id', {'$AccountNumber': accountNumber}, lang));
                    stopRules();
                    return null;
                }
            }  
            else{
                sayText(msgs('FAILURE_REGISTERING', {}, lang));
                if(logger) logger.warn('Error Registering a new Client',{tags: [service.vars.env],data: {response: response, request: opts.data}});
                stopRules();
                return null;
            }  
        }
        else {
            logResponse(fullUrl, response);
            sayText(msgs('FAILURE_REGISTERING'), {}, lang);
            if(logger) logger.warn('Error Registering a new Client',{tags: [service.vars.env],data: {response: response, request: opts.data}});
            stopRules();
            return null;
        }
    } catch (e) {
        if(logger) logger.error('Error Registering a new Client',{tags: [service.vars.env],data: {error: e,response: response}});
        console.log('Error Registering a new Client'+ e + JSON.stringify(response));
    }

};