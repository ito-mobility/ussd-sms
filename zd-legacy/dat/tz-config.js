/*
config file for Tanzania Zendesk set up
**Store API key as project variable in Telerivet. do no store here.**
needs a config function to package custom variables saved as data_packer
*/

var data_packer = function(ticketDetails){ //very basic - update as needed
    return JSON.stringify({
        'ticket': {
            'subject': ticketDetails.call_category,
            'raw_subject': ticketDetails.call_category,
            'status': 'new',
            'description': 'USSD request for call back\nAccount number : ' + ticketDetails.account_number,
            'priority': 'normal',
            'custom_fields': ticketDetails.custom_fields,
            'tags': ticketDetails.tags
        }
    });
};

module.exports = {
    'url': 'https://oneacrefund-tz.zendesk.com/api/v2',
    'data_packer': data_packer,
    'ticket_table': 'ticket_table_name', // placeholder for now - needs update
    'update_table': false,
};
