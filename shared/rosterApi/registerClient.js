var Log = require('../../logger/elk/elk-logger');

/**
 * registers a new client
 * @param {Object} clientJSON an obnject with the clients data for registration
 */
module.exports = function registerClient(clientJSON) {
    var logger = new Log();
    var fullUrl = service.vars.server_name + '/Api/Registrations/RegisterClient';
    var opts = { headers: {} };
    opts.headers['Authorization'] = 'Token ' + service.vars.roster_api_key;
    opts.headers['Content-Type'] = 'application/json';
    opts.method = 'POST';
    opts.data = JSON.stringify(clientJSON);
    try {
        var response = httpClient.request(fullUrl, opts);
        if (response.status == 200) {
            var data = JSON.parse(response.content);
            return data;
        }
        else {
            logger.error('Error while registering user', {data: JSON.stringify(response)});
        }
    } catch (error) {
        logger.error('API Error while registering user', {data: JSON.stringify(error)});
    }
};