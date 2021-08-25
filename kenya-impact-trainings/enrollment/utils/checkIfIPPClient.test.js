var makePhones = require('../../utils/makePhones');
var checkIfIPPClient = require('./checkIfIPPClient');

jest.mock('../../utils/makePhones');

var tableMock = {queryRows: jest.fn()};
var cursorMock = {hasNext: jest.fn(), next: jest.fn()};
describe('checkIfIPPClient', () => {
    beforeAll(() => {
        makePhones.mockReturnValue([
            '0725492164',
        ]);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(tableMock);
        jest.spyOn(tableMock, 'queryRows').mockReturnValue(cursorMock);
    });
    it('should return false if phone doesn\'t match the inputs', () => {
        jest.spyOn(cursorMock, 'hasNext').mockReturnValueOnce(false);
        var isIPPClient = checkIfIPPClient('254725492164');
        expect(isIPPClient).toEqual(false);
    });

    it('should return TRUE if the input match the phone number and save the state variable', () => {
        jest.spyOn(cursorMock, 'hasNext').mockReturnValueOnce(true).mockReturnValueOnce(true);
        jest.spyOn(cursorMock, 'next').mockReturnValueOnce({vars: {farmer_phone: '725492164'}});
        var isIPPClient = checkIfIPPClient('254725492164');
        expect(isIPPClient).toEqual(true);
        expect(state.vars.impact_farmer_details).toEqual('{"vars":{"farmer_phone":"725492164"}}');
    });
});
