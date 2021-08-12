const impactTrainingsMenuHandler = require('./impactTrainingsMenuHandler');
const IPP_DUKA = require('../IPP-DUKA/kenya-impact-trainings');
const trainingsEnrollment = require('../enrollment/trainings-enrollment');

jest.mock('../IPP-DUKA/kenya-impact-trainings');
jest.mock('../enrollment/trainings-enrollment');

describe('impact training menu handler', () => {
    it('should reprompt if the input is not 1 or 2', () => {
        const handler = impactTrainingsMenuHandler.getHandler('en');
        handler(3);
        expect(sayText).toHaveBeenCalledWith('1) Access information & recommendations on your phone\n' +
        '2) Enrol for a demo training');
        expect(promptDigits).toHaveBeenCalledWith(impactTrainingsMenuHandler.handlerName);
    });

    it('should start IPP DUKA if client enters 1', () => {
        const handler = impactTrainingsMenuHandler.getHandler('en');
        handler(1);
        expect(IPP_DUKA.start).toHaveBeenCalledWith('en', 'TrainingSelect');
    });

    it('should start IPP DUKA if client enters 1', () => {
        const handler = impactTrainingsMenuHandler.getHandler('en');
        handler(2);
        expect(trainingsEnrollment.start).toHaveBeenCalledWith('en');
    });
});