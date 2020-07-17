
const logResponse = require('../../rw-legacy/lib/utils/request-logger');
const slack = require('../../slack-logger/index');
module.exports = function (districtId,siteId, lang) {

    var response;
    var getFOEndpoint = '/Api/FieldOfficer/Get/?districtId='+districtId+'&siteId='+siteId;
    var fullUrl = service.vars.server_name + getFOEndpoint;
    console.log("####FULL-URL: " + fullUrl);
    var opts = { headers: {} };
    opts.headers['Authorization'] = "Token " + service.vars.roster_api_key;
    opts.method = "GET";
    try {
        response = httpClient.request(fullUrl, opts);
        if (response.status == 200) {
            return response.content;
        }
        else {
            console.log('failure registering');
            slack.log('Failed to get Fo info: ' + response);
            stopRules();
            return null;
        }
    } catch (e) {
        console.log('Error' + e);
        slack.log('Failed to get Fo info: ' + e);
    }  
};