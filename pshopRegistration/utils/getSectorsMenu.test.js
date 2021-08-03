state.vars.reg_lang = 'en';
const getSectorsMenu = require('./getSectorsMenu');

const tableMock = {queryRows: jest.fn()};
const rowMock = {hasNext: jest.fn(), next: jest.fn()};
describe('get sectors menu', () => {
    beforeAll(() => {
        service.vars.pshopLocationTableId = 'pshopLocationTableId';
        jest.spyOn(project, 'initDataTableById').mockReturnValue(tableMock);
        jest.spyOn(tableMock, 'queryRows').mockReturnValue(rowMock);
        state.vars.district_id = 'district_id';
    });
    it('it should return the sector menu and save the necessary state variables', () => {
        jest.spyOn(rowMock, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(rowMock, 'next').mockReturnValueOnce({vars: {sector_id: 's-1', sector_name: 'sector 1'}});
        getSectorsMenu();
        expect(tableMock.queryRows).toHaveBeenCalledWith({'vars': {district_id: 'district_id'}});
        expect(project.initDataTableById).toHaveBeenCalledWith('pshopLocationTableId');
        expect(state.vars.pshop_sectors).toEqual('{"s-1":"sector 1"}');
        expect(state.vars.current_sectors_screen).toEqual('1');
        expect(state.vars.sectorsMenuScreens).toEqual('{"1":"1) sector 1\\n"}');
        expect(state.vars.sectorsMenuOptionValues).toEqual('{"1":"s-1"}');
    });
});