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

    it('should tell clients if they are already registered and is in a pshop district', () => {
        state.vars.duplicated_user = JSON.stringify({AccountNumber: '67463748'});
        registerClientApi.mockReturnValueOnce(null);
        getClientDetails.mockReturnValueOnce({ClientName: 'Tyrion Lanyster', DistrictName: 'RRT P-Shops Gicumbi'});
        registerClient();
        expect(sayText).toHaveBeenCalledWith('Farmer with NID 1199766554567654 is already registered.\n' +
        'Names: Tyrion Lanyster\n' +
        'Account number: 67463748');
    });

    it('should show an error if client is registered but getClientApi is down', () => {
        state.vars.duplicated_user = JSON.stringify({AccountNumber: '67463748'});
        registerClientApi.mockReturnValueOnce(null);
        registerClient();
        expect(sayText).toHaveBeenCalledWith('There was a system error. Try again later');
    });

    it('should show an error if client is not regiseted and there is an error registering', () => {
        state.vars.duplicated_user = null;
        registerClientApi.mockReturnValueOnce(null);
        registerClient();
        expect(sayText).toHaveBeenCalledWith('There was a system error. Try again later');
        expect(state.vars.stop_services).toBe('true');
        expect(stopRules).toHaveBeenCalled();
    });

    it('should return an account number if client is registered as a new pshop client', () => {
        const rowMock = {save: jest.fn()};
        jest.spyOn(tableMock, 'createRow').mockReturnValueOnce(rowMock);
        state.vars.duplicated_user = null;
        registerClientApi.mockReturnValueOnce({AccountNumber: '67463748', DistrictName: 'Gicumbi'});
        const result = registerClient();
        expect(result).toBe('67463748');
        expect(rowMock.save).toHaveBeenCalled();
        expect(registerClientApi).toHaveBeenCalledTimes(1, {'districtId': undefined, 'firstName': undefined, 'lastName': undefined, 'nationalIdNumber': '1199766554567654', 'phoneNumber': undefined, 'siteId': undefined});
    });

    it('should return a pshop account number for core clients', () => {
        state.vars.duplicated_user = JSON.stringify({AccountNumber: '67463748'});
        getClientDetails.mockReturnValueOnce({ClientName: 'Tyrion Lanyster', DistrictName: 'Gicumbi'});
        const rowMock = {save: jest.fn()};
        jest.spyOn(tableMock, 'createRow').mockReturnValueOnce(rowMock);
        registerClientApi.mockReturnValueOnce({AccountNumber: '67463748'});
        registerClientApi.mockReturnValueOnce({AccountNumber: '0000000000'});
        const result = registerClient();
        expect(result).toBe('0000000000');
        expect(rowMock.save).toHaveBeenCalled();
        expect(registerClientApi).toHaveBeenCalledWith({'districtId': undefined, 'firstName': undefined, 'lastName': undefined, 'nationalIdNumber': 'RW-PSHOP-1199766554567654', 'phoneNumber': undefined, 'siteId': undefined});
    });

    it('should say client is already registered in a pshop', () => {
        state.vars.duplicated_user = JSON.stringify({AccountNumber: '67463748'});
        getClientDetails.mockReturnValueOnce({ClientName: 'Tyrion Lanyster', DistrictName: 'RRT P-Shops Gicumbi'});
        const rowMock = {save: jest.fn()};
        jest.spyOn(tableMock, 'createRow').mockReturnValueOnce(rowMock);
        registerClientApi.mockReturnValueOnce({AccountNumber: 'null'})
            .mockReturnValueOnce({AccountNumber: '67463748'});
        const result = registerClient();
        expect(result).toBe(null);
        expect(sayText).toHaveBeenCalledWith('Farmer with NID 1199766554567654 is already registered.\n' +
        'Names: Tyrion Lanyster\n' +
        'Account number: 67463748');
        expect(state.vars.stop_services).toBe('true');
        expect(stopRules).toHaveBeenCalled();
    });
});