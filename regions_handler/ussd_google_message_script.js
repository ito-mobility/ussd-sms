// - .... .. ... ....... -.-. --- -.. . -... .- ... . ....... .- -. -.. ....... .. -. - . --. .-. .- - .. --- -. ....... .... .- ...- . ....... -... . . -. ....... -.. . ...- . .-.. --- .--. . -.. ....... -... -.-- ....... -.. . ...- .-.. .. --. . -. -.-. . ....... .-.. .. -- .. - . -.. --..-- ....... .-- .. - .... ....... -.-. --- .-.. .-.. .. -. ... ....... .- ... ....... .-.. . .- -.. .-.-.- ....... .. -. ....... -.-. .- ... . ....... -.-- --- ..- ....... ..-. .. -. -.. ....... - .... .. ... ....... .... .. -.. -.. . -. ....... -.-. --- -.. . ....... -.-- --- ..- ....... .-- .. .-.. .-.. ....... .... .- ...- . ....... - .-. .. . -.. ....... ...- . .-. -.-- ....... -- ..- -.-. .... ....... -- -.-- ....... ..-. .-. .. . -. -.. --..-- ....... -.- .. -. -.. .-.. -.-- ....... .-.. --- --- -.- ....... ..-. --- .-. ....... -.. . ...- .-.. .. --. . -. -.-. . ....... .- -. -.. ....... -.-- --- ..- ....... .-- .. .-.. .-.. ....... ..-. .. -. -.. ....... -- . 

// exposed public function that will recieve data from main.js
function send_ussd_response(external_phone_number,external_IssueLevel1,external_IssueLevel2Ans,external_IssueLevel3Ans,external_payroll_id,external_creation_date) {

    // private function per region that will process the received data.
    kenyan_send_ussd_response(external_phone_number,external_IssueLevel1,external_IssueLevel2Ans,external_IssueLevel3Ans,external_payroll_id,external_creation_date);
}

function kenyan_send_ussd_response(phone_number,IssueLevel1,IssueLevel2Ans,IssueLevel3Ans,payroll_id,creation_date){
    var kenyan_appscript_url = 'https://script.google.com/macros/s/AKfycbw5dbxkDFpAg8Q0YFnzY8NFpcJcLVzLlAhnHrgKhsF9orMRZXN4/exec';

    //construct the final data to be passed to the google sheet and make a post request to google spreedsheet.
    var JSONdata = JSON.stringify({
        'phone_number': phone_number,
        'email_address': '',
        'issue_level1': IssueLevel1,
        'issue_level2': IssueLevel2Ans,
        'issue_level3': IssueLevel3Ans,
        'payroll_id': payroll_id,
        'creation_date': creation_date,
        'platform_name': 'USSD'
    })

    //post request to google sheet
    httpClient.request(kenyan_appscript_url, {
        method:'POST',
        data:JSONdata
    });
}

module.exports = {
    send_ussd_response: send_ussd_response
};
