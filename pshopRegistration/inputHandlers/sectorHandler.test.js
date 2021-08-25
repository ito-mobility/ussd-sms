state.vars.reg_lang = 'en';
const sectorHandler = require('./sectorHandler');

jest.mock('../../notifications/elk-notification/elkNotification');

describe('sector input handler', () => {
    beforeAll(() => {
        state.vars.sectorsMenuScreens = JSON.stringify({'1': 'Screen 1', '2': 'Screen 2', '3': 'Screen 3'});
        state.vars.sectorsMenuOptionValues = JSON.stringify({'1': 'd-1', '2': 'd-2', '3': 'd-3'});
        state.vars.pshop_sectors = JSON.stringify({'d-1': 'sector1', 'd-2': 'sector2', 'd-3': 'sector3'});
        state.vars.current_sectors_screen = '1';
    });
    const onSectorValidated = jest.fn();
    it('should reprompt for sector if input matches no sector', () => {
        const handler = sectorHandler.getHandler(onSectorValidated);
        handler('3456');
        expect(sayText).toHaveBeenCalledWith('Choose Sector\nScreen 1');
        expect(promptDigits).toHaveBeenCalledWith(sectorHandler.handlerName);
    });

    it('should show the next screen if input is 99', () => {
        const handler = sectorHandler.getHandler(onSectorValidated);
        handler('99');
        expect(sayText).toHaveBeenCalledWith('Screen 2');
        expect(promptDigits).toHaveBeenCalledWith(sectorHandler.handlerName);
        expect(state.vars.current_sectors_screen).toBe(2);
    });

    it('should call onSectorValidated with the sector id and save the sector name in the state variable', () => {
        const handler = sectorHandler.getHandler(onSectorValidated);
        handler('1');
        expect(onSectorValidated).toHaveBeenCalledWith('sector1');
        expect(state.vars.sector_id).toBe('d-1');
    });
});
