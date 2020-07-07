var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');



var ListTransactions = function (transactionHistory, page) {
    var translate = createTranslator(translations, project.vars.lang);
    var offset = ((page || 1)-1) * 4;
    var to_show = transactionHistory.slice(offset, offset + 4);
    var options_list = '';
    to_show.forEach(function (transaction, index) {
        var date = transaction.RepaymentDate.substring(0, 10).replace(/\//g, '-');
        options_list = options_list + translate('payment_list_item', {
            '$option': offset + index + 1,
            '$date': date,
            '$amount': transaction.Amount
        }) + '\n';
    });
    options_list = options_list + translate('continue');
    sayText(options_list);
};


module.exports = {
    list: ListTransactions,
    show: function (transaction) {
        var translate = createTranslator(translations, project.vars.lang);
        var RepaymentDate = transaction.RepaymentDate.substring(0,10).replace( /\//g,'-');
        
        sayText(translate('payment_detail',{
            '$RepaymentId': transaction.RepaymentId,
            '$RepaymentDate': RepaymentDate,
            '$Season': transaction.Season,
            '$Amount': transaction.Amount,
            '$PaidFrom': transaction.PaidFrom
        }));
    }
};