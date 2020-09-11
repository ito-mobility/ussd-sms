const confrmNationalIdHandler = require('./confirm-national-id-handler/confirmNationalIdHandler');
const confrmPhoneNumberHandler = require('./confirm-phone-number-hundler/confirmPhoneNumberHandler');
const firstNameHandler = require('./first-name-handler/firstNameHandler');
const nationalIdHandler = require('./national-id-handler/nationalIdHandler');
const phoneNumberHandler = require('./phone-number-handler/phoneNumberHandler');
const secondNameHandler = require('./second-name-handler/secondNameHandler');
var bundleChoiceHandler = require('./bundle-choice-handler/bundleChoiceHandler');
var addOrderHandler = require('./add-order-handler/addOrderHandler');
var varietyConfirmationHandler = require('./variety-confirmation-handler/varietyConfirmationHandler');
var orderConfirmationHandler = require('./order-confirmation-handler/orderConfirmationHandler');
var rosterRegisterClient = require('../rw-legacy/lib/roster/register-client');
const groupLeaderQuestionHandler = require('./group-leader-question-handler/groupLeaderQuestionHandler');
var getFOInfo = require('../Roster-endpoints/Fo-info/getFoInfo');
var {client}  = require('../client-enrollment/test-client-data'); 
var notifyELK = require('../notifications/elk-notification/elkNotification');


jest.mock('../rw-legacy/lib/roster/register-client');
jest.mock('../notifications/elk-notification/elkNotification');
jest.mock('../Roster-endpoints/Fo-info/getFoInfo');
jest.mock('./confirm-national-id-handler/confirmNationalIdHandler');
jest.mock('./confirm-phone-number-hundler/confirmPhoneNumberHandler');
jest.mock('./first-name-handler/firstNameHandler');
jest.mock('./national-id-handler/nationalIdHandler');
jest.mock('./phone-number-handler/phoneNumberHandler');
jest.mock('./second-name-handler/secondNameHandler');
jest.mock('./group-leader-question-handler/groupLeaderQuestionHandler');
jest.mock('./bundle-choice-handler/bundleChoiceHandler');
jest.mock('./add-order-handler/addOrderHandler');
jest.mock('./variety-confirmation-handler/varietyConfirmationHandler');
jest.mock('./order-confirmation-handler/orderConfirmationHandler');

const mockConfrmNationalIdHandler = jest.fn();
const mockConfrmPhoneNumberHandler = jest.fn();
const mockFirstNameHandler = jest.fn();
const mockNationalIdHandler = jest.fn();
const mockPhoneNumberHandler = jest.fn();
const mockSecondNameHandler = jest.fn();
const mockGroupLeaderQuestionHandler = jest.fn();
var mockTable = { createRow: jest.fn(), queryRows: jest.fn()};
var mockRow = {save: jest.fn()};

const clientRegistration = require('./clientRegistration');
const account = 123456789;
const country = 'KE';
const reg_lang = 'en-ke';
const nationalId = 12345678;
const phone = '0786182099';
var foPhone = '0786192039';

var mockedTable = { queryRows: jest.fn()};
var mockedRow = {hasNext: jest.fn(), next: jest.fn(),vars: {'national_id': nationalId,'account_number': account}};
var mockRows = [{vars: {'bundleId': '-2009','bundleInputId': '-1709','bundle_name': 'Second possible name bundle','price': '2251','input_name': 'second input'}},{vars: {'bundleId': '-9009','bundleInputId': '-5709','bundle_name': 'third possible name bundle','price': '6251','input_name': 'third input'}},{vars: {'bundleId': '-1009','bundleInputId': '-8709','bundle_name': 'fourth possible name bundle','price': '5251','input_name': 'fourth input'}},{vars: {'bundleId': '-2009','bundleInputId': '-18909','bundle_name': 'Second possible name bundle','price': '2251','input_name': 'second input'}}];
var mockBundleRow = {vars: {'bundleId': '-3009','bundleInputId': '-12109','bundle_name': 'Knapsack Sprayer','price': '2251','input_name': 'Knapsack Sprayer'}};
var mockMaizeRows = [{vars: {'bundleId': '-2009','bundleInputId': '-1709','bundle_name': 'Second possible name bundle','price': '2251','input_name': 'second input'}},{vars: {'bundleId': '-9009','bundleInputId': '-5709','bundle_name': 'third possible name bundle','price': '6251','input_name': 'third input'}}];
var mockBundleInputs = [{'bundleId': '-2009','bundleInputId': '-1709','bundleName': 'Second possible name bundle','price': '2251','inputName': 'second input'},{'bundleId': '-9009','bundleInputId': '-5709','bundleName': 'third possible name bundle','price': '6251','inputName': 'third input'},{'bundleId': '-1009','bundleInputId': '-8709','bundleName': 'fourth possible name bundle','price': '5251','inputName': 'fourth input'},{'bundleId': '-2009','bundleInputId': '-18909','bundleName': 'Second possible name bundle','price': '2251','inputName': 'second input'}];
var mockBundleInput = [{'bundleId': '-3009','bundleInputId': '-12109','bundleName': 'Knapsack Sprayer','price': '2251','inputName': 'Knapsack Sprayer'}];
describe('clientRegistration', () => {

    it('should have a start function', () => {
        expect(clientRegistration.start).toBeInstanceOf(Function);
    });
    beforeEach(() => {
        confrmNationalIdHandler.getHandler.mockReturnValue(mockConfrmNationalIdHandler);
        confrmPhoneNumberHandler.getHandler.mockReturnValue(mockConfrmPhoneNumberHandler);
        firstNameHandler.getHandler.mockReturnValue(mockFirstNameHandler);
        nationalIdHandler.getHandler.mockReturnValue(mockNationalIdHandler);
        phoneNumberHandler.getHandler.mockReturnValue(mockPhoneNumberHandler);
        secondNameHandler.getHandler.mockReturnValue(mockSecondNameHandler);
        groupLeaderQuestionHandler.getHandler.mockReturnValue(mockGroupLeaderQuestionHandler);
        state.vars.reg_lang ='en-ke';
    });

    it('should add national Id Confirmation handler to input handlers', () => {
        clientRegistration.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(confrmNationalIdHandler.handlerName, confrmNationalIdHandler.getHandler());            
    });
    it('should add phone number Confirmation handler to input handlers', () => {
        clientRegistration.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(confrmPhoneNumberHandler.handlerName, confrmPhoneNumberHandler.getHandler());            
    });
    it('should add firstName handler to input handlers', () => {
        clientRegistration.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(firstNameHandler.handlerName, firstNameHandler.getHandler());            
    });
    it('should add national Id handler to input handlers', () => {
        clientRegistration.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(nationalIdHandler.handlerName, nationalIdHandler.getHandler());            
    });
    it('should add phone Number handler to input handlers', () => {
        clientRegistration.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(phoneNumberHandler.handlerName, phoneNumberHandler.getHandler());            
    });
    it('should add second Name handler to input handlers', () => {
        clientRegistration.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(secondNameHandler.handlerName, secondNameHandler.getHandler());            
    });
    it('should add group leader question handler to input handlers', () => {
        clientRegistration.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(groupLeaderQuestionHandler.handlerName, groupLeaderQuestionHandler.getHandler());            
    });
    describe('National Id Submission success callback', () => {
        var callback;
        beforeEach(() => {
            clientRegistration.registerHandlers();
            callback = nationalIdHandler.getHandler.mock.calls[0][0];                
        });
        it('should display a message with an account number if a duplicate national id is found in the tables', () => {
            project.initDataTableById = jest.fn().mockReturnValue(mockedTable);
            mockedTable.queryRows.mockReturnValue(mockedRow);
            mockedRow.hasNext.mockReturnValue(true);
            mockedRow.next.mockReturnValue(mockedRow);
            callback(nationalId);
            expect(sayText).toHaveBeenCalledWith(`You have already enrolled this season and your account number is ${account}`+
            '. Reach out to your FO to help you add inputs to your order.');
        });
        it('should tell the client to confirm the national Id they have entered', () => {
            mockedRow.hasNext.mockReturnValue(false);
            var differentId = '12385679';
            callback(differentId);
            expect(sayText).toHaveBeenCalledWith(`You enter ${differentId} ID`+
            '. Enter\n1) To confirm\n2) To try again');
        });
        it('should prompt for the client to confirm their national Id', () => {
            var differentId = '12385679';
            callback(differentId);
            expect(promptDigits).toHaveBeenCalledWith(confrmNationalIdHandler.handlerName);
        });
    });
    describe('National Id confirmation success callback', () => {
        var callback;
        beforeEach(() => {
            clientRegistration.registerHandlers();
            callback = confrmNationalIdHandler.getHandler.mock.calls[0][0];                
        });
        it('should tell the client to enter their first name after they confirm their ID', () => {
            callback();
            expect(sayText).toHaveBeenCalledWith('Please reply with the first name of the member you want to add to your group');
        });
        it('should prompt for the client for their first name', () => {
            callback();
            expect(promptDigits).toHaveBeenCalledWith(firstNameHandler.handlerName);
        });
    });
    describe('First name prompt success callback', () => {
        var callback;
        beforeEach(() => {
            clientRegistration.registerHandlers();
            callback = firstNameHandler.getHandler.mock.calls[0][0];                
        });
        it('should tell the client to enter their last name after they have entered their first name', () => {
            callback();
            expect(sayText).toHaveBeenCalledWith('Please reply with the second name of the member you want to add to your group');
        });
        it('should prompt for the client for their last name', () => {
            callback();
            expect(promptDigits).toHaveBeenCalledWith(secondNameHandler.handlerName);
        });
    });
    describe('second name prompt success callback', () => {
        var callback;
        beforeEach(() => {
            clientRegistration.registerHandlers();
            callback = secondNameHandler.getHandler.mock.calls[0][0];                
        });
        it('should tell the client to enter their phone number after they have entered their last name', () => {
            callback();
            expect(sayText).toHaveBeenCalledWith('Reply with the Phone number of the farmer');
        });
        it('should prompt for the client for phone number', () => {
            callback();
            expect(promptDigits).toHaveBeenCalledWith(phoneNumberHandler.handlerName);
        });
    });
    describe('phone number prompt success callback', () => {
        var callback;
        beforeEach(() => {
            clientRegistration.registerHandlers();
            callback = phoneNumberHandler.getHandler.mock.calls[0][0];                
        });
        it('should tell the client to confirm their phone number after they have entered it', () => {
            callback(phone);
            expect(sayText).toHaveBeenCalledWith(`You enter ${phone}`+
            ' Phone number. Enter\n1) To confirm\n2) To try again');
        });
        it('should prompt to ask the user if the would like to be a GL', () => {
            callback(phone);
            expect(promptDigits).toHaveBeenCalledWith(confrmPhoneNumberHandler.handlerName);
        });
    });
    describe('confirm phone number success callback', () => {
        var callback;
        const mockCursor = { next: jest.fn(), 
            hasNext: jest.fn()
        };
        beforeAll(()=>{
            state.vars.client_json = JSON.stringify(client);
            state.vars.newClient = JSON.stringify(client);
            clientRegistration.start(account, country,reg_lang);
            jest.clearAllMocks();
            project.initDataTableById = jest.fn().mockReturnValue(mockTable);
            mockTable.queryRows.mockReturnValue(mockCursor);
            
        });
        beforeEach(() => {
            
            clientRegistration.registerHandlers();
            callback = confrmPhoneNumberHandler.getHandler.mock.calls[0][0];                
        });
        it('should ask the client if they are willing to become a group leader after they have entered their last name', () => {
            callback();
            expect(sayText).toHaveBeenCalledWith('Does the farmer want to be a Group Leader of a new group?\n1) Yes\n2) No');
        });
        it('should prompt the client for the group leader interest question', () => {
            callback();
            expect(promptDigits).toHaveBeenCalledWith(groupLeaderQuestionHandler.handlerName);
        });
        it('should not prompt for group leader handler if the current menu allows enrolling',()=>{
            state.vars.canEnroll = true;
            callback();
            expect(sayText).not.toHaveBeenCalledWith('Does the farmer want to be a Group Leader of a new group?\n1) Yes\n2) No');
            expect(promptDigits).not.toHaveBeenCalledWith(groupLeaderQuestionHandler.handlerName);

        });
        it('should display the bundles if the menu choosed allow enrollment',()=>{
            state.vars.canEnroll = true;
            mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(true);
            mockCursor.next.mockReturnValueOnce(mockBundleRow).mockReturnValueOnce(mockRows[0]).mockReturnValueOnce(mockRows[1]).mockReturnValueOnce(mockRows[2]);
            callback();
            expect(state.vars.main_menu).toEqual(`Select a product\n1) ${mockBundleRow.vars.bundle_name}`+
            ` ${mockBundleRow.vars.price}`+
            `\n2) ${mockRows[0].vars.bundle_name}`+
            ` ${mockRows[0].vars.price}`+
            `\n3) ${mockRows[1].vars.bundle_name}`+
            ` ${mockRows[1].vars.price}`+
            '\n77)Next page');
        });
        it('should display only unique bundles(if two bundle inputs in the same bundle are found) and if the prepayment condition is satified ', () => {

            mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(true);
            mockCursor.next.mockReturnValueOnce(mockBundleRow).mockReturnValueOnce(mockRows[0]).mockReturnValueOnce(mockRows[3]);
            callback();
            expect(sayText).not.toHaveBeenCalledWith(expect.stringContaining('You do not qualify for a top up,'));
            expect(state.vars.main_menu).toEqual(`Select a product\n1) ${mockBundleRow.vars.bundle_name}`+
            ` ${mockBundleRow.vars.price}`+
            `\n2) ${mockRows[0].vars.bundle_name}`+
            ` ${mockRows[0].vars.price}`+
            '\n');
        });
        it('should remove maize bundles from the displayed bundles if the prepayment condition is satisfied and the client already choosed a maize bundle',()=>{
            
            mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(false).mockReturnValueOnce(true);
            mockCursor.next.mockReturnValueOnce(mockBundleRow).mockReturnValueOnce(mockRows[0]).mockReturnValueOnce(mockRows[1]).mockReturnValueOnce(mockMaizeRows[0]).mockReturnValueOnce(mockMaizeRows[1]);
            state.vars.orders = JSON.stringify([mockMaizeRows[0]]);
            callback();
            expect(sayText).not.toHaveBeenCalledWith(expect.stringContaining('You do not qualify for a top up,'));
            expect(state.vars.main_menu).toEqual(`Select a product\n1) ${mockBundleRow.vars.bundle_name}`+
            ` ${mockBundleRow.vars.price}`+
            `\n2) ${mockRows[0].vars.bundle_name}`+
            ` ${mockRows[0].vars.price}`+
            '\n');
        });
    });
    describe('group leader question success callback', () => {
        var callback;

        beforeAll(()=>{ 
            project.sendMessage = jest.fn(); 
            project.initDataTableById = jest.fn();
            mockTable.createRow.mockReturnValue(mockRow);
            project.initDataTableById.mockReturnValue(mockTable); 
            contact.phone_number = '0789098965';
            state.vars.phoneNumber = '0789777767';
            getFOInfo.mockImplementation(() => {return {'firstName': 'sabin','lastName': 'sheja','phoneNumber': foPhone};});
            state.vars.client_json = JSON.stringify(client);
            state.vars.newClient = JSON.stringify(client);
            rosterRegisterClient.mockImplementation(()=>{return JSON.stringify(client);});
        });
        beforeEach(() => {
            clientRegistration.registerHandlers();
            callback = groupLeaderQuestionHandler.getHandler.mock.calls[0][0];

        });
        it('should not send message or save a row if the returned JSON from registering the client is null ', () => {
            rosterRegisterClient.mockImplementationOnce(()=>{return null;});
            callback();
            expect(project.sendMessage).not.toHaveBeenCalled();
            expect(mockRow.save).not.toHaveBeenCalled();
        });
        it('should send a message containing the FO phone number to the Group leader phone number if the FO contact is available', () => {
            callback();
            expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
                content: `Thank you for expressing your interest to enroll with OAF. Your Account Number is ${client.AccountNumber}`+
                `. Please visit the FO to add inputs or call the FO on ${foPhone}`, 
                to_number: contact.phone_number
            }));
        });
        it('should send a message containing the FO phone number to the new client phone number if the FO contact is available', () => {  
            callback();
            expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
                content: `Thank you for expressing your interest to enroll with OAF. Your Account Number is ${client.AccountNumber}`+
                `. Please visit the FO to add inputs or call the FO on ${foPhone}`, 
                to_number: state.vars.phoneNumber
            }));
        });
        it('should show a message containing the FO phone number if the FO contact is available', () => {  
            callback();
            expect(sayText).toHaveBeenCalledWith(`Thank you for expressing your interest to enroll with OAF. Your Account Number is ${client.AccountNumber}`+
                `. Please visit the FO to add inputs or call the FO on ${foPhone}`);
        });
        it('should send a message with no FO phone number to the GL phone number if the FO phone is not available', () => {  
            getFOInfo.mockImplementationOnce(() => {return {'firstName': 'sabin','lastName': 'sheja','phoneNumber': null};});
            callback();
            expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
                content: `Thank you for expressing your interest to enroll with OAF. Your Account Number is: ${client.AccountNumber}`+
                '. Your FO will reach out to you to add inputs to your order.',
                to_number: contact.phone_number
            }));
        });
        it('should save a row in the datatables with clients information if registration is successful', () => {  
            state.vars.canEnroll = false;
            state.vars.groupLeader = 1; 
            callback();
            expect(mockTable.createRow).toHaveBeenCalledWith({
                'contact_id': contact.id,
                'vars': {
                    'account_number': client.AccountNumber,
                    'national_id': client.NationalId,
                    'client_phone_number': state.vars.phoneNumber,
                    'first_name': client.FirstName,
                    'last_name': client.LastName,
                    'district': client.DistrictId,
                    'site': client.SiteId,
                    'new_client': '1',
                    'gl_phone_number': contact.phone_number,
                    'gl_interested': state.vars.groupLeader
                }
            });
            expect(mockRow.save).toHaveBeenCalled();
        });
        it('should save a row in the datatables with clients information if registration is successfull', () => {  
            state.vars.canEnroll = true; 
            callback();
            expect(mockTable.createRow).toHaveBeenCalledWith({
                'contact_id': contact.id,
                'vars': {
                    'account_number': client.AccountNumber,
                    'national_id': client.NationalId,
                    'client_phone_number': state.vars.phoneNumber,
                    'first_name': client.FirstName,
                    'last_name': client.LastName,
                    'district': client.DistrictId,
                    'site': client.SiteId,
                    'new_client': '1',
                    'gl_phone_number': contact.phone_number,
                    'gl_interested': '0'
                }
            });
            expect(mockRow.save).toHaveBeenCalled();
        });
        it('should send a message with no FO phone number to the new client phone number if the FO phone is not available', () => {  
            getFOInfo.mockImplementationOnce(() => {return {'firstName': 'sabin','lastName': 'sheja','phoneNumber': null};});
            callback();
            expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
                content: `Thank you for expressing your interest to enroll with OAF. Your Account Number is: ${client.AccountNumber}`+
                '. Your FO will reach out to you to add inputs to your order.',
                to_number: state.vars.phoneNumber
            }));
        });
        it('should send a message with no FO phone number to the new client phone number if the FO phone number is not available', () => {  
            getFOInfo.mockImplementationOnce(() => {return {'firstName': 'sabin','lastName': 'sheja','phoneNumber': null};});
            callback();
            expect(sayText).toHaveBeenCalledWith(`Thank you for expressing your interest to enroll with OAF. Your Account Number is: ${client.AccountNumber}`+
                '. Your FO will reach out to you to add inputs to your order.');
        });
        
        it('should send a message with no FO phone number to the GL phone number if the FO contact is not available', () => {  
            getFOInfo.mockImplementationOnce(() => {return null;});
            callback();
            expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
                content: `Thank you for expressing your interest to enroll with OAF. Your Account Number is: ${client.AccountNumber}`+
                '. Your FO will reach out to you to add inputs to your order.',
                to_number: contact.phone_number
            }));
        });
        it('should send a message with no FO phone number to the new client phone number if the FO phone is not available', () => {  
            getFOInfo.mockImplementationOnce(() => {return null;});
            callback();
            expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
                content: `Thank you for expressing your interest to enroll with OAF. Your Account Number is: ${client.AccountNumber}`+
                '. Your FO will reach out to you to add inputs to your order.',
                to_number: state.vars.phoneNumber
            }));
        });
        it('should show a message with no FO phone number if the FO details is not available', () => {  
            
            getFOInfo.mockImplementationOnce(() => {return null;});
            callback();
            expect(sayText).toHaveBeenCalledWith(`Thank you for expressing your interest to enroll with OAF. Your Account Number is: ${client.AccountNumber}`+
                '. Your FO will reach out to you to add inputs to your order.');
        });
    });
    describe('bundle Choice Handler successfull callback',()=>{
        var callback;
        beforeEach(() => {
            clientRegistration.registerHandlers();
            callback = bundleChoiceHandler.getHandler.mock.calls[0][0];    
            state.vars.bundleInputs =  JSON.stringify(mockBundleInputs);      
        });

        it('should display the varieties for the bundle choosed, if the bundle has multiple varieties',()=>{
            callback(mockBundleInputs[0].bundleId);
            expect(sayText).toHaveBeenCalledWith(`Select seed variety\n1) ${mockBundleInputs[0].inputName}`+
            `\n2) ${mockBundleInputs[3].inputName}`+
            '\n');
        });
        it('should display the order placed by the user and prompt to add order or finalize order',()=>{
            state.vars.bundleInputs =  JSON.stringify(mockBundleInput);  
            state.vars.orders = ' ';
            var orderMessage = mockBundleInput[0].bundleName + ' ' + mockBundleInput[0].price + '\n';
            callback(mockBundleInput[0].bundleId);
            expect(sayText).toHaveBeenCalledWith(`Order placed\n ${orderMessage}`+
            ' \n 1) Add product\n 2) Finish ordering');
            expect(promptDigits).toHaveBeenCalledWith(addOrderHandler.handlerName);
        });

    });
    describe('variety Confirmation Handler successfull callback',()=>{
        var callback;
        beforeEach(() => {
            clientRegistration.registerHandlers();
            state.vars.orders = ' ';
            callback = varietyConfirmationHandler.getHandler.mock.calls[0][0];    
            state.vars.bundleInputs =  JSON.stringify(mockBundleInputs);        
        });
        it('should show the order placed',()=>{
            callback(mockBundleInputs[3].bundleId,true,mockBundleInputs[3].bundleInputId);
            var orderMessage = mockBundleInputs[3].bundleName + ' ' + mockBundleInputs[3].price + '\n';
            expect(sayText).toHaveBeenCalledWith(`Order placed\n ${orderMessage}`+
            ' \n 1) Add product\n 2) Finish ordering');

        });

    });
    describe('add Order Handler successfull callback',()=>{
        var callback;
        beforeEach(() => {
            clientRegistration.registerHandlers();
            state.vars.orders = JSON.stringify(mockBundleInput);
            callback = addOrderHandler.getHandler.mock.calls[0][0];          
        });
        it('should show the order placed',()=>{
            callback();
            var orderMessage = mockBundleInput[0].bundleName + ' ' + mockBundleInput[0].price + '\n';
            expect(sayText).toHaveBeenCalledWith(`Order placed\n ${orderMessage}`+
            ' \n1) Confirm order');
        });
    });
    describe('order Confirmation Handler successfull callback',()=>{
        var callback;
        beforeAll(()=>{
            state.vars.orders = JSON.stringify(mockBundleInput);
            state.vars.newClient = JSON.stringify(client);
        });
        beforeEach(() => {
            
            clientRegistration.registerHandlers();
            callback = orderConfirmationHandler.getHandler.mock.calls[0][0];           
        });

        it('should display a message confirming the order is complete if the order is saved in roster',()=>{
            httpClient.request.mockReturnValue({status: 201});
            contact.phone_number = phone;
            var message = `Thanks for ordering ${mockBundleInput[0].bundleName}`+
            ` ${mockBundleInput[0].price}  `+'. Make sure you pay at least Ksh 500 qualification amount to receive input on input delivery day.';
            callback();
            expect(sayText).toHaveBeenCalledWith(message);
            expect(project.sendMessage).toHaveBeenCalledWith({content: message, to_number: phone});
        });
        it('should display a message asking the user to try again later the order is not saved in roster',()=>{
            httpClient.request.mockReturnValue({status: 500});
            callback();
            expect(sayText).toHaveBeenCalledWith('Please try again later. Most people are applying right now!');
        });
    });

    describe('start', () => {
        it('should set the  state vars to the provided account and country', () => {
            state.vars.account = '';
            state.vars.country = '';
            state.vars.reg_lang = '';
            
            clientRegistration.start(account, country,reg_lang);
            expect(state.vars).toMatchObject({account,country,reg_lang});
        });
        it('should call notifyELK', () => {
            clientRegistration.start(account, country,reg_lang);
            expect(notifyELK).toHaveBeenCalled();
        });
        it('should show a what is the farmer\'s national Id message', () => {
            clientRegistration.start(account, country, reg_lang);
            expect(sayText).toHaveBeenCalledWith('What is their national ID?');
            expect(sayText).toHaveBeenCalledTimes(1);
        });
        it('should prompt for the farmer\'s national Id', () => {
            clientRegistration.start(account, country, reg_lang);
            expect(promptDigits).toHaveBeenCalledWith(nationalIdHandler.handlerName);
            expect(promptDigits).toHaveBeenCalledTimes(1);
        });
    });
});