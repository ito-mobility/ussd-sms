const lotCodeinputHandler = require('./lotCodeInputHandler');
const dukaInputHandler = require('./dukaInputHandler');

describe('Lotcode input handler', () => {
    beforeAll(() => {
        state.vars.lot_code_screens = JSON.stringify({1: 'lot code screen 1', 2: 'lot code screen 2'});
        state.vars.current_lot_code_screen = 1;
    });
    it('should save the necessary state variables', () => {
        const handler = lotCodeinputHandler.getHandler('en-ke');
        handler('AMRNGKZ');
        expect(state.vars.lot_code).toEqual('AMRNGKZ');
    });

    it('should prompt for the duka if the lotcode is valid', () => {
        const handler = lotCodeinputHandler.getHandler('en-ke');
        handler('AMRNGKZ');
        expect(sayText).toHaveBeenCalledWith('In which Duka did you purchase the seed?');
        expect(promptDigits).toHaveBeenCalledWith(dukaInputHandler.handlerName);
    });

    it('should show the next screen and reprompt for lot code once the input is 77 and there is a next screen', () => {
        const handler = lotCodeinputHandler.getHandler('en-ke');
        handler('77');
        expect(sayText).toHaveBeenCalledWith('lot code screen 2');
        expect(promptDigits).toHaveBeenCalledWith(lotCodeinputHandler.handlerName);
    });

    it('should reprompt for lot code handler if the input is 77 and there is not next screen', () => {
        const handler = lotCodeinputHandler.getHandler('en-ke');
        handler('77');
        expect(sayText).toHaveBeenCalledWith('lot code screen 2');
        expect(promptDigits).toHaveBeenCalledWith(lotCodeinputHandler.handlerName);
    });
});
