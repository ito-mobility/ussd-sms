var enrollmentTrainingsHandler = require('./enrollmentTrainingsHandler');

var tableMock = {queryRows: jest.fn()};
var cursorMock = {hasNext: jest.fn(), next: jest.fn()};
describe('enrollmentTrainingsHandler', () => {
    beforeAll(() => {
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(tableMock);
        jest.spyOn(tableMock, 'queryRows').mockReturnValue(cursorMock);
        state.vars.impact_farmer_details = JSON.stringify({
            vars: {
                agent_phone: '0787876765',
                agent_name: 'Agent Name',
                farmer_phone: '0789009890',
                farmer_name: 'Farmer Name',
                farmer_surname: 'Farmer surname'
            }
        });
    });

    it('should reprompt if the client enters an invalid input', () => {
        var handler = enrollmentTrainingsHandler.getHandler('en');
        handler('0');
        expect(promptDigits).toHaveBeenCalledWith(enrollmentTrainingsHandler.handlerName);
        expect(sayText).toHaveBeenCalledWith('1) Maize Intercrop\n' +
        '2) Maize Topdress\n' +
        '3) Pest & Diseases Mitigation\n' +
        '4) Maize Harvest');
    });

    it('should save the data and show the details on the screen', () => {
        jest.spyOn(cursorMock, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(cursorMock, 'next').mockReturnValueOnce({vars: {}, save: jest.fn()});
        var handler = enrollmentTrainingsHandler.getHandler('en');
        handler('1');
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Hi Agent Name. Farmer Name Farmer surname, a farmer in your site of phone number 0789009890 has enrolled for the Maize Intercrop training. Add them to the list of farmers attending your next ExpoFarm training.', 'to_number': '0787876765'});
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Hi Agent Name. Farmer Name Farmer surname, a farmer in your site of phone number 0789009890 has enrolled for the Maize Intercrop training. Add them to the list of farmers attending your next ExpoFarm training.', 'to_number': '+254718992515'});
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Hi Agent Name. Farmer Name Farmer surname, a farmer in your site of phone number 0789009890 has enrolled for the Maize Intercrop training. Add them to the list of farmers attending your next ExpoFarm training.', 'to_number': '+25416587447'});
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Hi Agent Name. Farmer Name Farmer surname, a farmer in your site of phone number 0789009890 has enrolled for the Maize Intercrop training. Add them to the list of farmers attending your next ExpoFarm training.', 'to_number': '+254750855113'});
        expect(sayText).toHaveBeenCalledWith('Congratulations Farmer Name Farmer surname for enrolling for the Maize Intercrop! You will receive communication from your Field Officer on the next steps.');
        expect(stopRules).toHaveBeenCalled();
    });

    it('should save the data and show the details on the screen', () => {
        jest.spyOn(cursorMock, 'hasNext').mockReturnValueOnce(false);
        var handler = enrollmentTrainingsHandler.getHandler('en');
        handler('1');
        expect(sayText).toHaveBeenCalledWith('Farmer not found.');
        expect(stopRules).toHaveBeenCalled();
    });
});
