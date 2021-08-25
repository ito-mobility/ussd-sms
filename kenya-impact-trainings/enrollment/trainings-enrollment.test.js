var checkIfIPPClient = require('./utils/checkIfIPPClient');
var trainingEnrollment = require('./trainings-enrollment');
var enrollmentTrainingsHandler = require('./inputHandlers/enrollmentTrainingsHandler');

jest.mock('./utils/checkIfIPPClient');
describe('training enrollment', () => {
    it('should start the trainings and prompt for enrollment', () => {
        checkIfIPPClient.mockReturnValueOnce(true);
        trainingEnrollment.start('en');
        expect(sayText).toHaveBeenCalledWith('1) Maize Intercrop\n' +
        '2) Maize Topdress\n' +
        '3) Pest & Diseases Mitigation\n' +
        '4) Maize Harvest');
        expect(promptDigits).toHaveBeenCalledWith(enrollmentTrainingsHandler.handlerName);
    });

    it('should tell a client if they are not IPP', () => {
        checkIfIPPClient.mockReturnValueOnce(false);
        trainingEnrollment.start('en');
        expect(sayText).toHaveBeenCalledWith('Thank you for your interest in enrolling for a demo training. We will confirm when this is available in your location.');
    });
});

describe('register input handler', () => {
    it('should register the enrollment trainings handler', () => {
        var handler = jest.fn();
        jest.spyOn(enrollmentTrainingsHandler, 'getHandler').mockReturnValueOnce(handler);
        trainingEnrollment.registerInputHandlers('en');
        expect(addInputHandler).toHaveBeenCalledWith(enrollmentTrainingsHandler.handlerName, handler);
    });
});