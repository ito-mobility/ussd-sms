var impactTrainingsMenuHandler = require('./inputHandlers/impactTrainingsMenuHandler');
var IPP_DUKA = require('./IPP-DUKA/kenya-impact-trainings');
var enrollment = require('./enrollment/trainings-enrollment');
var impactTrainings = require('./impact-trainings');

jest.mock('./IPP-DUKA/kenya-impact-trainings');
jest.mock('./enrollment/trainings-enrollment');
jest.mock('./inputHandlers/impactTrainingsMenuHandler');

describe('impact-trainings', () => {
    it('should start the impact trainings', () => {
        impactTrainings.start('en');
        expect(sayText).toHaveBeenCalledWith('1) Access information & recommendations on your phone\n' +
        '2) Enrol for a demo training');
        expect(promptDigits).toHaveBeenCalledWith(impactTrainingsMenuHandler.handlerName);
    });

    it('should register input handlers', () => {
        var handler = jest.fn();
        jest.spyOn(impactTrainingsMenuHandler, 'getHandler').mockReturnValueOnce(handler);
        impactTrainings.registerInputHandlers('trainings menu text', 'en');
        expect(IPP_DUKA.registerInputHandlers).toHaveBeenCalledWith('trainings menu text', 'en');
        expect(enrollment.registerInputHandlers).toHaveBeenCalledWith('en');
        expect(addInputHandler).toHaveBeenCalledWith(impactTrainingsMenuHandler.handlerName, handler);
    });
});