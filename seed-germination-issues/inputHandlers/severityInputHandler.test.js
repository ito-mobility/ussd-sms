const phoneNumberInputHandler = require('./phoneNumberInputHandler');
const severityInputHandler = require('./severityInputHandler');

describe('issue severity', () => {
    beforeAll(() => {
        state.vars.severity_screens = JSON.stringify({1: 'screen 1', 2: 'screen 2'});
        state.vars.severity_options = JSON.stringify({1: '0-25%', 2: '26-50%', 3: '51-75%', 4: '76-100%'});
        state.vars.current_severity_screen = '1';
    });
    it('should reprompt for severity if the user enters an invalid input', () => {
        var handler = severityInputHandler.getHandler('en-ke');
        handler('9');
        expect(sayText).toHaveBeenCalledWith('screen 1');
        expect(promptDigits).toHaveBeenCalledWith(severityInputHandler.handlerName);
    });

    it('should prompt for phone if the input is valid (1-4)', () => {
        var handler = severityInputHandler.getHandler('en-ke');
        handler('2');
        expect(state.vars.issues_severity);
        expect(sayText).toHaveBeenCalledWith('Please provide your phone number so we can follow up with you');
        expect(promptDigits).toHaveBeenCalledWith(phoneNumberInputHandler.handlerName);
    });

    it('should prompt show the next screen and reprompt for 77 if a client enters 77', () => {
        var handler = severityInputHandler.getHandler('en-ke');
        handler('77');
        expect(state.vars.issues_severity);
        expect(sayText).toHaveBeenCalledWith('screen 2');
        expect(promptDigits).toHaveBeenCalledWith(severityInputHandler.handlerName);
        expect(state.vars.current_severity_screen).toEqual(2);
    });
});