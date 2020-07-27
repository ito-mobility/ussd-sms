
var farmerHandler = require('./farmerHandler');



describe('Farmer handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });


    it('should handle the right choice', () => {
        state.vars.farmers = JSON.stringify({'1': {national_id: '13753675', id: 1, first_name: 'Mosh', last_name: 'Hamedani' }});
        state.vars.farmers_screens = JSON.stringify({'1': '1) Mosh Hamedani\n2) Brad Traversy\n* Komeza', '2': '3) Fun Function'});
        // state.vars.current_cells_screen = 1;
        farmerHandler(1);
        expect(state.vars.selected_farmer).toEqual('{"national_id":"13753675","id":1,"first_name":"Mosh","last_name":"Hamedani"}');

        expect(sayText).toHaveBeenCalledWith('Please enter the last four digits of the national ID you registered with.');
        expect(promptDigits).toHaveBeenCalledWith('last_four_nid_digits', {'maxDigits': 4, 'submitOnHash': false, 'timeout': 10});
    });
    it('should handle the option for next', () => {
        state.vars.current_farmers_screen = 1;
        farmerHandler('*');
        expect(state.vars.current_farmers_screen).toEqual(2);
        expect(sayText).toHaveBeenCalledWith('3) Fun Function');
        expect(promptDigits).toHaveBeenCalledWith('select_farmer', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });
});
