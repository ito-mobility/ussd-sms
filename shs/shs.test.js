const shs = require('./shs');
var notifyELK = require('../notifications/elk-notification/elkNotification');
var shsMenuHandler = require('./shs-menu-handler/shsMenuHandler');
var serialNumberHandler = require('./serial-number-handler/serialNumberHandler');
var gLMenuHandler = require('./gL-menu-handler/gLMenuHandler');
var shsTypeHandler = require('./shs-type-handler/shsTypeHandler');
var accountNumberHandler = require('./accountNumberHandler/accountNumberHandler');
var getCodeSerialHandler = require('./get-code-serial-handler/getCodeSerialHandler');
var registrationTypeHandler = require('./registrationTypeHandler/registrationTypeHandler');


jest.mock('../notifications/elk-notification/elkNotification');
jest.mock('./shs-menu-handler/shsMenuHandler');
jest.mock('./serial-number-handler/serialNumberHandler');
jest.mock('./gL-menu-handler/gLMenuHandler');
jest.mock('./shs-type-handler/shsTypeHandler');
jest.mock('./accountNumberHandler/accountNumberHandler');
jest.mock('./get-code-serial-handler/getCodeSerialHandler');
jest.mock('./registrationTypeHandler/registrationTypeHandler');


const mockserialNumberHandler = jest.fn();
const mockgetCodeSerialHandler = jest.fn();

var account = '24450523';
var country = 'KE';
var shsLang = 'en';
var isGroupLeader = '';
var callback;

var serialNumbers = [
    {
        'unitType': 'biolite',
        'unitSerialNumber': '23456789',
        'keyCode': '123 456 789',
        'keyCodeType': 'activation'
    },
    {
        'unitType': 'sunking',
        'unitSerialNumber': '23456789',
        'keyCode': '123 466 799',
        'keyCodeType': 'unlock'
    }
];

describe('shs', () => {
    it('should have a start function', () => {
        expect(shs.start).toBeInstanceOf(Function);
    });
    it('should add the serialNumberHandler to the input handlers', () => {
        shs.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(serialNumberHandler.handlerName, serialNumberHandler.getHandler(mockserialNumberHandler));            
    });
    it('should add the shsMenuHandler to the input handlers', () => {
        shs.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(shsMenuHandler.handlerName, shsMenuHandler.getHandler());            
    });
    it('should add the gLMenuHandler to the input handlers', () => {
        shs.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(gLMenuHandler.handlerName, gLMenuHandler.getHandler());            
    });
    it('should add the shsTypeHandler to the input handlers', () => {
        shs.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(shsTypeHandler.handlerName, shsTypeHandler.getHandler());            
    });
    it('should add the accountNumberHandler to the input handlers', () => {
        shs.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(accountNumberHandler.handlerName, accountNumberHandler.getHandler());            
    });
    it('should add the getCodeSerialHandler to the input handlers', () => {
        shs.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(getCodeSerialHandler.handlerName, getCodeSerialHandler.getHandler(mockgetCodeSerialHandler));            
    });
    it('should add the registrationTypeHandler to the input handlers', () => {
        shs.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(registrationTypeHandler.handlerName, registrationTypeHandler.getHandler());            
    });


    describe('start', ()=>{
        it('should set the state variables',()=>{
            state.vars.account = '';
            state.vars.country = '';
            state.vars.isGroupLeader = '';
            state.vars.shsLang = '';
            shs.start(account, country, shsLang,isGroupLeader);
            expect(state.vars).toMatchObject({account,country,isGroupLeader,shsLang});
        });
        it('should call notify ELK',()=>{
            shs.start(account, country, shsLang,isGroupLeader);
            expect(notifyELK).toHaveBeenCalled();
        });
        it('should display the shs menu and prompt for input if the user is not a group leader',()=>{
            shs.start(account, country, shsLang,isGroupLeader);
            expect(sayText).toHaveBeenCalledWith('What do you want to do?\n1)Register New SHS Unit \n2)Get Activation/ Unlock Code\n3)View Recent Activation/Unlock Code \n4)Back');
            expect(promptDigits).toHaveBeenCalledWith(shsMenuHandler.handlerName);
        });
        it('should display the GL shs menu and prompt for input if the user is a group leader',()=>{
            isGroupLeader = true;
            shs.start(account, country, shsLang,isGroupLeader);
            expect(sayText).toHaveBeenCalledWith('Select a Service\n1) My SHS Unit\n2)SHS Unit for another Client\n3) Back');
            expect(promptDigits).toHaveBeenCalledWith(gLMenuHandler.handlerName);
        });

    });

    describe('serialNumberHandler handler successful callback', ()=>{ 
        beforeEach(() => {
            shs.registerHandlers();
            callback = serialNumberHandler.getHandler.mock.calls[0][0];                
        });
        it('should prompt for the date',()=>{
            callback(serialNumbers[0]);
            expect(sayText).toHaveBeenCalledWith(`Your activation code is ${serialNumbers[0].keyCode}`);
            expect(stopRules).toHaveBeenCalled();
        });
    });
});
    