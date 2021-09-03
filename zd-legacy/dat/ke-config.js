/*
config file for Kenya Zendesk set up
**Store API key as project variable in Telerivet. do no store here.**
*/

//finds a user on KE zendesk. now should create if one is not there
var find_user = function(account_number){
    console.log(opts.url);
    var response = httpClient.request(opts.url + '/users.json?query=account_number:' + account_number, {
        method: 'GET',
        basicAuth: project.vars.zd_user + '/token:' + project.vars.zd_api_key
    });
    try{
        var users = JSON.parse(response.content).users;
    }
    catch(err){
        console.log(err);
        users = [];
    }
    if(response.status < 300 && users.length > 0){
        console.log('got a user!!' + response.status);
        var id = users[0].id;
        //console.log(id)
        return id;
    }
    else{
        console.log('failed at find user ' + response.status +'/ not ncreating blank user');
        //console.log(JSON.stringify(response.content));;
        return null;
    }
};

/* works but don't use because we don't want to add unknown users to database
var create_user = function(account_number){
    console.log("createing a user");
    user_dat = JSON.stringify({
        'user' : {
            'name' : 'UNKnOWN USSD CONTACT',
            'role' : 'end-user',
            'email' : 'unknown@unknown.com',
            'user_fields' : {
                'account_number' : account_number
            }
        }
    }),
    console.log(user_dat)
    var response = httpClient.request(opts.url + '/users.json', {
        method : "POST",
        data : user_dat,
        basicAuth : project.vars.zd_user + '/token:' + project.vars.zd_api_key
    });
    if(response.status < 300){
        console.log('created a user!!' + response.status);
        //console.log(JSON.stringify(response));
        return response.content.user.id;
    }
    else if(response.status > 300){
        console.log('failed at create user ' + response.status);
        console.log(response.content);
        return null;
    }
}
*/

/**
 * Configurations for Kenya Zendesk ticket creation
 * @param {Object} ticketDetails {call_category, account_number!, description, customFields, assignee_email}
 * @returns Stringified object of the request
 */
// account_number, call_category, customFields, description, tags
var data_packer = function(ticketDetails){
    try{
        return JSON.stringify({
            'ticket': {
                'subject': ticketDetails.call_category,
                'raw_subject': ticketDetails.call_category,
                'requester_id': find_user(ticketDetails.account_number),
                'status': 'new',
                'description': ticketDetails.description,
                'custom_fields': ticketDetails.customFields,
                'tags': ticketDetails.tags,
                'assignee_email': ticketDetails.assignee_email,
            }
        });
    }
    catch(error){
        console.log(error);
        return {}; // placeholder for now so that we don't crash things when it happens
    }
};

var table_updater = function(ticketDetails, ticket_id, phone_number){
    var ticket_table = project.getOrCreateDataTable(opts.ticket_table);
    ticket_table.createRow({vars: {
        'account_number': ticketDetails.account_number,
        'call_category': ticketDetails.call_category,
        'phone_number': phone_number,
        'ticket_id': ticket_id
    }});
};

var opts = {
    'url': 'https://oneacrefund-ke.zendesk.com/api/v2',
    'data_packer': data_packer,
    'ticket_table': 'CallBackUSSD', //true as of 26 mar 2020
    'update_table': true,
    'table_updater': table_updater
};

module.exports = opts;
