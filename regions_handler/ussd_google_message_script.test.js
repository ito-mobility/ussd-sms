const ussd_google_message_script = require('./ussd_google_message_script');

describe('ussd google message script', () => {
    it('should call httpClient.request with the right details', () => {
        ussd_google_message_script.send_ussd_response('0750567488','external_IssueLevel1','external_IssueLevel2Ans','external_IssueLevel3Ans','external_payroll_id','22/05/2020');
        expect(httpClient.request).toHaveBeenCalledWith('https://script.google.com/macros/s/AKfycbw5dbxkDFpAg8Q0YFnzY8NFpcJcLVzLlAhnHrgKhsF9orMRZXN4/exec', {
            'data': '{"phone_number":"0750567488","email_address":"","issue_level1":"external_IssueLevel1","issue_level2":"external_IssueLevel2Ans","issue_level3":"external_IssueLevel3Ans","payroll_id":"external_payroll_id","creation_date":"22/05/2020","platform_name":"USSD"}',
            'method': 'POST'});
    });
});