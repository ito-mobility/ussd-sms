var makePhones = require('../../utils/makePhones');
module.exports = function checkIfIPPClient(phoneNumber) {
    var possiblePhones = makePhones(phoneNumber);
    var impactTrainingsClientsTable = project.getOrCreateDataTable(service.vars.impact_tr_enr_table_name);
    var phoneFound = possiblePhones.filter(function(phone) {
        var farmerCursor = impactTrainingsClientsTable.queryRows({vars: {
            'farmer_phone': phone
        }});
        var hasNext = farmerCursor.hasNext();
        if(hasNext) {
            var farmerRow = farmerCursor.next();
            state.vars.impact_farmer_details = JSON.stringify({vars: farmerRow.vars});
        }
        return hasNext;
    });
    return phoneFound.length > 0;
};
