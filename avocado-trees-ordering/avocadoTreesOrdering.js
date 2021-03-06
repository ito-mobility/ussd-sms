var translations = require('./translations');
var createTranslator = require('../utils/translator/translator');
var translate =  createTranslator(translations, service.vars.lang);
var notifyELK = require('../notifications/elk-notification/elkNotification');
var placeOrderHandler = require('./place-order-handler/placeOrderHandler');
var confirmOrderHandler = require('./confirm-order-handler/confirmOrderHandler');
var getClient = require('../shared/rosterApi/getClient');

module.exports = {
    registerHandlers: function (){
        addInputHandler(placeOrderHandler.handlerName, placeOrderHandler.getHandler(onOrderPlaced));
        addInputHandler(confirmOrderHandler.handlerName, confirmOrderHandler.getHandler(onOrderConfirmed));

    },
    start: function (account, country, lang) {
        notifyELK();
        state.vars.account = account;
        state.vars.country = country;
        state.vars.lang = lang;
        state.vars.client_json = state.vars.client_json || JSON.stringify(getClient(account, country));
        var avocadoEligibility = require('./avocado-eligibility/avocadoEligibility');
        var avocado_table = project.initDataTableById(service.vars.avocado_table_id);
        var possibleTrees = avocadoEligibility(avocado_table, state.vars.account,JSON.parse(state.vars.client_json));
        state.vars.possibleTrees = JSON.stringify(possibleTrees);
        
        if(possibleTrees){
            if(possibleTrees.possibleTrees >= 3){
                global.sayText(translate('eligible_repayment_message',{'$amount': possibleTrees.balance,'$number': possibleTrees.possibleTrees},state.vars.lang));
                global.promptDigits(placeOrderHandler.handlerName);
            } 
            else{
                global.sayText(translate('client_not_eligible',{},state.vars.lang));
            }
        }
        else{
            global.sayText(translate('client_not_found_in_table',{},state.vars.lang));
        }
    }
};

function onOrderPlaced(input){
    global.sayText(translate('confirm_order',{'$number': input}, state.vars.lang));
    state.vars.orderedNumber = input;
    global.promptDigits(confirmOrderHandler.handlerName);
}

function onOrderConfirmed(){

    //enroll order
    var requestBundles = [{
        'bundleId': service.vars.avocados_bundle_id,
        'bundleQuantity': state.vars.orderedNumber,
        'inputChoices': JSON.parse(service.vars.avocados_input_choices)
    }];
    var client = JSON.parse(state.vars.client_json);
    var groupId = client.GroupId;
    if(groupId == null){
        var table = project.initDataTableById(service.vars.rw_reg_client_table_id);
        var cursor = table.queryRows({'vars': {'account_number': client.AccountNumber}});
        if(cursor.hasNext()){
            var row = cursor.next();
            groupId = row.vars.groupId;
        }
        else{
            global.sayText(translate('order_not_finalized',{},state.vars.lang));
            global.stopRules();
        }
    }
    var requestData = {
        'districtId': client.DistrictId,
        'siteId': client.SiteId,
        'groupId': groupId,
        'accountNumber': client.AccountNumber,
        'clientId': client.ClientId,
        'isGroupLeader': 'false',
        'clientBundles': requestBundles
    };
    var enrollOrder = require('../Roster-endpoints/enrollOrder');
    if(enrollOrder(requestData)){
        var avocado_table = project.initDataTableById(service.vars.avocado_table_id);
        var avocadoCursor = avocado_table.queryRows({'vars': {'account_number': state.vars.account}});
        if(avocadoCursor.hasNext()){
            var avocadoRow = avocadoCursor.next();
            var a_avokaqty = avocadoRow.vars.a_avokaqty || 0;
            avocadoRow.vars.avoka_jit = (state.vars.orderedNumber - a_avokaqty);
            avocadoRow.vars.confirmed = '1';
            avocadoRow.save();
        }
        else{
            var new_avocado_row = avocado_table.createRow({
                vars: {
                    'avoka_jit': state.vars.orderedNumber,
                    'account_number': state.vars.account,
                    'confirmed': '1'
                }
            });
            new_avocado_row.save();
        }  
        var message = translate('final_message',{'$number': state.vars.orderedNumber},state.vars.lang);
        global.sayText(message);
        var msg_route = project.vars.sms_push_route;
        project.sendMessage({ 'to_number': contact.phone_number, 'route_id': msg_route, 'content': message }); 
    }
    else{
        global.sayText(translate('order_not_finalized',{},state.vars.lang));
    }
    
}
