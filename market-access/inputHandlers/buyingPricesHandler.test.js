const buyingPricesHandler = require('./buyingPricesHandler');
const marketAccessHandler = require('./marketAccessHandler');

describe('buying prices handler', () => {
    beforeAll(() => {
        state.vars.marketLang = 'en';
        project.vars.maize_price = 300;
    });
    it('should reprompt if the input is not 1 or 0', () => {
        const handler = buyingPricesHandler.getHandler();
        handler(3);
        expect(sayText).toHaveBeenCalledWith('Please select the crop you would like to sell:\n' +
        '1. Maize\n' +
        '0. back\n');
        expect(promptDigits).toHaveBeenCalledWith(buyingPricesHandler.handlerName);
    });

    it('should show the maize price from the service variables', () => {
        service.vars.maize_price = 250;
        const handler = buyingPricesHandler.getHandler();
        handler(1);
        expect(sayText).toHaveBeenCalledWith('One Acre Fund farm-gate price for Maize is 250  RwF / Kg for grade 1 maize on the cob.');
        expect(stopRules).toHaveBeenCalled();
    });

    it('should show the maize price from the project variables', () => {
        service.vars.maize_price = undefined;
        const handler = buyingPricesHandler.getHandler();
        handler(1);
        expect(sayText).toHaveBeenCalledWith('One Acre Fund farm-gate price for Maize is 300  RwF / Kg for grade 1 maize on the cob.');
    });

    it('should return to the main menu if client enters 0', () => {
        const handler = buyingPricesHandler.getHandler();
        handler(0);
        expect(sayText).toHaveBeenCalledWith('Welcome to One Acre Fund Market Access program, select your option:\n' +
        '1. See the latest One Acre Fund buying prices\n' +
        '2. Find your nearest Market Access agent\n' +
        '3. Register a commitment (Agent only)\n' +
        '0. Back');
        expect(promptDigits).toHaveBeenCalledWith(marketAccessHandler.handlerName);
    });
});
