

module.exports = function(chicken_table, acc_nber, client_json){

    var chickenCursor = chicken_table.queryRows({'vars': {'account_number': acc_nber}});
    var prepRequired = 0;
    var totalCredit = 0;
    
    var row;
    if(chickenCursor.hasNext()){
        row = chickenCursor.next();
        //prepRequired = row.vars.prep_required; //Replaced by percentage healthpath from november
        state.vars.chcken_nber = 15;
        state.vars.farmer_name  = JSON.parse(state.vars.client_json).FirstName;
    }
    else{
        state.vars.client_notfound = true;
        return;
        //var logger = new Log();
        //var logMessage = 'Client ' + client_json.FirstName + ' not found in chicken table';
        //logger.log(logMessage);
    }  
    client_json.SectorName = row.vars.sector;
    client_json.DistrictName = row.vars.district;
    state.vars.client_json = JSON.stringify(client_json);
    //calculate the prepayment
    if(client_json.BalanceHistory.length>0){
        client_json.BalanceHistory = client_json.BalanceHistory[0];
    }
    if(client_json.BalanceHistory.TotalCreditPerCycle[project.vars.creditCycleChickenService] != undefined){
        totalCredit = client_json.BalanceHistory.TotalCreditPerCycle[project.vars.creditCycleChickenService];
    }
    else{
        state.vars.client_notfound = true;
        return;
    }
    //new prepayment calculation from November
    prepRequired =  (totalCredit * parseInt(project.vars.chickenRequiredPercentage))/100;
    var prepayment_amount = client_json.BalanceHistory.TotalRepayment_IncludingOverpayments - prepRequired;
    // if prepayment satisfies the mminimum condition( > than 2 chicken prepayment amount(2000))
    if(prepayment_amount >= 1000){
        state.vars.minimum_amount_paid = true;
        // If the prepayment is greater than the maximum number of chicken necessary(5) 
        if((prepayment_amount / 500) > 15){
            state.vars.max_chicken = 15;
        }
        // else calculate the client's possible maximum
        else{
            state.vars.max_chicken = parseInt(prepayment_amount / 500);
        }
        if(state.vars.max_chicken > state.vars.chcken_nber ){
            state.vars.max_chicken  = state.vars.chcken_nber;
        }
    }
    //doesn't satify the minimum amount
    else{
        state.vars.minimum_amount_paid = false;
    }
    
    // If the client confirmed and just want to check
    if(row.vars.confirmed == 1){
        state.vars.confirmed_chicken = true;
        return;
    }
    // If the client did not confirm or wants to change
    else{
        state.vars.confirmed_chicken = false;
    }
    

};