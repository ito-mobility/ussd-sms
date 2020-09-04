var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var maizeResponseHandler = require('./maizeResponseHandler');

var seasonResponseHandlerName = 'season';
module.exports = {
    handlerName: maizeResponseHandler,
    getHandler: function(lang, maize_recommendation_table) {
        return function() {
            var getMessage = translator(translations, lang);
            var seasonConfirmation = content.trim().toUpperCase();
            var table = project.getOrCreateDataTable(maize_recommendation_table);
            var row = table.queryRows({
                vars: {
                    district: state.vars.district
                }
            });
            var low_productivity;
            var medium_productivity;
            var high_productivity;

            if(row.hasNext()) {
                var record = row.next();
                low_productivity = record.vars.low_productivity;
                medium_productivity = record.vars.medium_productivity;
                high_productivity = record.vars.high_productivity;
            } 

            var recommendation;
            if(seasonConfirmation == 'A') {
                if(state.vars.bags == 'B') {
                    recommendation = getMessage('experts_recommendation', {'$recommendation': medium_productivity}, lang);
                    sendReply(recommendation);
                } else {
                    recommendation = getMessage('experts_recommendation', {'$recommendation': high_productivity}, lang);
                    sendReply(recommendation);
                }
            } else if(seasonConfirmation == 'B') {
                if(state.vars.bags == 'B') {
                    recommendation = getMessage('experts_recommendation', {'$recommendation': low_productivity}, lang);
                    sendReply(recommendation);
                } else {
                    recommendation = getMessage('experts_recommendation', {'$recommendation': medium_productivity}, lang);
                    sendReply(recommendation);
                }
            } else {
                sendReply(state.vars.bags_message);
                waitForResponse(seasonResponseHandlerName);
            }
        };
    }
};