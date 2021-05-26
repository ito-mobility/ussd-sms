service.vars.lang = 'en';
const {handlerName,getHandler} = require ('./changeOrderConfirmation');
var notifyELK = require('../../notifications/elk-notification/elkNotification'); 
var CheckChickenCapByDistrict = require('../check-chicken-cap-by-district/CheckChickenCapByDistrict');
var backToMain = require('../../rw-legacy/lib/backToMainMenu');
const {client}  = require('../test-client-data'); 

jest.mock('../check-chicken-cap-by-district/CheckChickenCapByDistrict');
jest.mock('../../notifications/elk-notification/elkNotification');
jest.mock('../../rw-legacy/lib/backToMainMenu');

describe('change_order_confirm', () => {
    var changeOrderHandler;
    var onOrderFinalized;
    const confirmed_number = '2';
    beforeAll(()=>{
        state.vars.client_json = JSON.stringify(client);
    });
    beforeEach(() => {
        sayText.mockReset();
        onOrderFinalized = jest.fn();
        state.vars.confirmed_number = confirmed_number;
        changeOrderHandler = getHandler(onOrderFinalized);
        project.vars.cor_lang = 'en';
    });
    it('should be a function', () => {
        expect(changeOrderHandler).toBeInstanceOf(Function);
    });
    it('should call notifyELK ', () => {
        changeOrderHandler('1');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should return the user to main if 0 is selected', () => {
        changeOrderHandler('0');
        expect(backToMain).toHaveBeenCalled();
    });
    it('should show a message for retry if is not zero', () => {
        
        changeOrderHandler('7');
        expect(sayText).toHaveBeenCalledWith(`Invaid input, please try again.  You are confirming ${confirmed_number} ` 
        + `chickens. Your total credit for chickens is ${confirmed_number * 2400} `
        +'Rwf. Your chickens will be ready within 2 months! 1: Confirm 0: Return home');
    });
    it('should show prompt for retry if is not zero', () => {
        changeOrderHandler('7');
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });
    it('should call the onFinalized handler if successful', () => {
        CheckChickenCapByDistrict.mockReturnValue(4);
        state.vars.confirmed_number = 2;
        changeOrderHandler('1');
        expect(onOrderFinalized).toBeCalled();
    });
    it('should display a message asking the client to try again later if the maximum number of chicken would be greater than the district cap when an order is confirmed', () => {
        CheckChickenCapByDistrict.mockReturnValue(4);
        state.vars.confirmed_number = 6;
        changeOrderHandler('1');
        expect(sayText).toBeCalledWith('We are very sorry, we have reached the limit of chickens for your sector. Please try to confirm your chickens again next season');
    });

});