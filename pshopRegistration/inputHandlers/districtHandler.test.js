state.vars.reg_lang = 'en';
const districtHandler = require('./districtHandler');

describe('district input handler', () => {
    beforeAll(() => {
        state.vars.districtsMenuScreens = JSON.stringify({'1': 'Screen 1', '2': 'Screen 2', '3': 'Screen 3'});
        state.vars.districtsMenuOptionValues = JSON.stringify({'1': 'd-1', '2': 'd-2', '3': 'd-3'});
        state.vars.pshop_districts = JSON.stringify({'d-1': 'district1', 'd-2': 'district2', 'd-3': 'district3'});
        state.vars.current_districts_screen = '1';
    });
    const onDistrictValidated = jest.fn();
    it('should reprompt for district if input matches no district', () => {
        const handler = districtHandler.getHandler(onDistrictValidated);
        handler('3456');
        expect(sayText).toHaveBeenCalledWith('Choose District\nScreen 1');
        expect(promptDigits).toHaveBeenCalledWith(districtHandler.handlerName);
    });

    it('should show the next screen if input is 99', () => {
        const handler = districtHandler.getHandler(onDistrictValidated);
        handler('99');
        expect(sayText).toHaveBeenCalledWith('Screen 2');
        expect(promptDigits).toHaveBeenCalledWith(districtHandler.handlerName);
        expect(state.vars.current_districts_screen).toBe(2);
    });

    it('should call onDistrictValidated with the district id and save the district name in the state variable', () => {
        const handler = districtHandler.getHandler(onDistrictValidated);
        handler('1');
        expect(onDistrictValidated).toHaveBeenCalledWith('d-1');
        expect(state.vars.selected_district_name).toBe('district1');
    });
});
