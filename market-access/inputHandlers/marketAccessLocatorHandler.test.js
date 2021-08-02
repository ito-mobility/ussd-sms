const marketAccessLocatorHandler = require('./marketAccessLocatorHandler');
const sectorHandler = require('./sectorHandler');

let tableMock;
let rowMock;
describe('market access locator handler', () => {
    beforeAll(() => {
        state.vars.marketLang = 'en';
        rowMock = {hasNext: jest.fn(), next: jest.fn()};
        tableMock = {queryRows: jest.fn()};
        jest.spyOn(project, 'initDataTableById').mockReturnValue(tableMock);
        jest.spyOn(tableMock, 'queryRows').mockReturnValue(rowMock);
    });
    it('should reprompt for market access locator if the input matches no district', () => {
        jest.spyOn(rowMock, 'hasNext').mockReturnValueOnce(false);
        const handler = marketAccessLocatorHandler.getHandler();
        handler(0);
        expect(sayText).toHaveBeenCalledWith('Please enter the district where you live.');
        expect(promptDigits).toHaveBeenCalledWith(marketAccessLocatorHandler.handlerName);
    });

    it('should reprompt for market access locator if the input matches no district', () => {
        jest.spyOn(rowMock, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(rowMock, 'next').mockReturnValueOnce({vars: {district: 'Burera'}});
        const handler = marketAccessLocatorHandler.getHandler();
        handler('Burera');
        expect(tableMock.queryRows).toHaveBeenCalledWith({'vars': {'district': 'Burera'}});
        expect(state.vars.mkt_access_entrepreneurs).toEqual('[{"district":"Burera"}]');
        expect(state.vars.mkt_access_district).toEqual('Burera');
        expect(sayText).toHaveBeenCalledWith('Please enter the sector where you live.');
        expect(promptDigits).toHaveBeenCalledWith(sectorHandler.handlerName);
    });
});
