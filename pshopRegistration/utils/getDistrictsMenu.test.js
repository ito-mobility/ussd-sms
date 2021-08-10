state.vars.reg_lang = 'en';
const getDistrictsMenu = require('./getDistrictsMenu');

const tableMock = {queryRows: jest.fn()};
const rowMock = {hasNext: jest.fn(), next: jest.fn()};
describe('get districts menu', () => {
    beforeAll(() => {
        service.vars.pshopLocationTableId = 'pshopLocationTableId';
        jest.spyOn(project, 'initDataTableById').mockReturnValue(tableMock);
        jest.spyOn(tableMock, 'queryRows').mockReturnValue(rowMock);
    });
    it('it should return the district menu and save the necessary state variables', () => {
        jest.spyOn(rowMock, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(rowMock, 'next').mockReturnValueOnce({vars: {district_id: 'd-1', district_name: 'District 1'}});
        getDistrictsMenu();
        expect(project.initDataTableById).toHaveBeenCalledWith('pshopLocationTableId');
        expect(state.vars.pshop_districts).toEqual('{"d-1":"District 1"}');
        expect(state.vars.current_districts_screen).toEqual('1');
        expect(state.vars.districtsMenuScreens).toEqual('{"1":"1) District 1\\n"}');
        expect(state.vars.districtsMenuOptionValues).toEqual('{"1":"d-1"}');
        expect(tableMock.queryRows).toHaveBeenCalledWith({'vars': {}});
    });
});