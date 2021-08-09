state.vars.reg_lang = 'en';
const siteHandler = require('./sitesHandler');

describe('site input handler', () => {
    beforeAll(() => {
        state.vars.sitesMenuScreens = JSON.stringify({'1': 'Screen 1', '2': 'Screen 2', '3': 'Screen 3'});
        state.vars.sitesMenuOptionValues = JSON.stringify({'1': 'd-1', '2': 'd-2', '3': 'd-3'});
        state.vars.pshop_sites = JSON.stringify({'d-1': 'site1', 'd-2': 'site2', 'd-3': 'site3'});
        state.vars.current_sites_screen = '1';
    });
    const onsiteValidated = jest.fn();
    it('should reprompt for site if input matches no site', () => {
        const handler = siteHandler.getHandler(onsiteValidated);
        handler('3456');
        expect(sayText).toHaveBeenCalledWith('Choose Cell/site\nScreen 1');
        expect(promptDigits).toHaveBeenCalledWith(siteHandler.handlerName);
    });

    it('should show the next screen if input is 99', () => {
        const handler = siteHandler.getHandler(onsiteValidated);
        handler('99');
        expect(sayText).toHaveBeenCalledWith('Screen 2');
        expect(promptDigits).toHaveBeenCalledWith(siteHandler.handlerName);
        expect(state.vars.current_sites_screen).toBe(2);
    });

    it('should call onsiteValidated with the site id and save the site name in the state variable', () => {
        const handler = siteHandler.getHandler(onsiteValidated);
        handler('1');
        expect(onsiteValidated).toHaveBeenCalledWith('d-1');
        expect(state.vars.selected_site_name).toBe('site1');
    });
});
