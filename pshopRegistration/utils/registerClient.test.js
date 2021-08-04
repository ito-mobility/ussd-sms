state.vars.reg_lang = 'en';
const registerClient = require('./registerClient');
const registerClientApi = require('../../shared/rosterApi/registerClient');
const getClientDetails = require('../../shared/rosterApi/getClient');

jest.mock('../../shared/rosterApi/registerClient');
jest.mock('../../shared/rosterApi/getClient');

const tableMock = {createRow: jest.fn()};
describe('register client', () => {
    beforeAll(() => {
        state.vars.reg_nid = '1199766554567654';
        jest.spyOn(project, 'initDataTableById').mockReturnValue(tableMock);
    });
    // it('should return account number if the client is not already registered', () => {
    //     registerClientApi.mockReturnValueOnce();
    // });
    it('should tell clients if they are already registered', () => {
        state.vars.duplicated_user = JSON.stringify({AccountNumber: '67463748'});
        registerClientApi.mockReturnValueOnce(null);
        getClientDetails.mockReturnValueOnce({ClientName: 'Tyrion Lanyster'});
        registerClient();
        expect(sayText).toHaveBeenCalledWith('Farmer with NID 1199766554567654 is already registered.\n' +
        'Names: Tyrion Lanyster\n' +
        'Account number: 67463748');
    });

    it('should show an error if client is registered but getClientApi is down', () => {
        state.vars.duplicated_user = JSON.stringify({AccountNumber: '67463748'});
        registerClientApi.mockReturnValueOnce(null);
        getClientDetails.mockReturnValueOnce(null);
        registerClient();
        expect(sayText).toHaveBeenCalledWith('There was a system error. Try again later');
    });

    it('should show an error if client is not regiseted and there is an error registering', () => {
        state.vars.duplicated_user = null;
        registerClientApi.mockReturnValueOnce(null);
        getClientDetails.mockReturnValueOnce(null);
        registerClient();
        expect(sayText).toHaveBeenCalledWith('There was a system error. Try again later');
        expect(state.vars.stop_services).toBe('true');
        expect(stopRules).toHaveBeenCalled();
    });

    it('should return an account number if client is registered.', () => {
        const rowMock = {save: jest.fn()};
        jest.spyOn(tableMock, 'createRow').mockReturnValueOnce(rowMock);
        state.vars.duplicated_user = null;
        registerClientApi.mockReturnValueOnce({AccountNumber: '67463748'});
        getClientDetails.mockReturnValueOnce(null);
        const result = registerClient();
        expect(result).toBe('67463748');
        expect(rowMock.save).toHaveBeenCalled();
    });
});