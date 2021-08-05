state.vars.reg_lang = 'en';
const OnValidatedFactory = require('./OnValidatedFactory');

describe('on validated factory', () => {
    it('should show the menu if the stop_services variable is falsy', () => {
        const nextHandler = {handlerName: 'next_handler_name'};
        const previousHandlerStateVariableName = 'prev_state_name';
        const messageOptions = {'func': jest.fn()};
        const onValidated = OnValidatedFactory('enter_last_name', nextHandler, previousHandlerStateVariableName, messageOptions);
        onValidated('state_value');
        expect(promptDigits).toHaveBeenCalledWith(nextHandler.handlerName);
        expect(sayText).toHaveBeenCalledWith('Insert Last name');
    });
});