var sectorHandler = require('./sectorHandler');

describe('market access locator handler', () => {
    beforeAll(() => {
        state.vars.marketLang = 'en';
        state.vars.mkt_access_entrepreneurs =  JSON.stringify([
            {
                sector: 'Gitega',
                name: 'Tyrion',
                surname: 'Lanyster',
                phone_number: '0780475911'
            }
        ]);
    });
    it('should reprompt for market access locator if the input matches no sector', () => {
        var handler = sectorHandler.getHandler();
        handler('Kimisagara');
        expect(sayText).toHaveBeenCalledWith('Please enter the sector where you live.');
        expect(promptDigits).toHaveBeenCalledWith(sectorHandler.handlerName);
    });

    it('should show market access locator info if the input matches the sector', () => {
        var handler = sectorHandler.getHandler();
        handler('gitega');
        expect(sayText).toHaveBeenCalledWith('Your closest Market Access agent is Tyrion Lanyster, contact him at 0780475911');
        expect(stopRules).toHaveBeenCalled();
    });
});
