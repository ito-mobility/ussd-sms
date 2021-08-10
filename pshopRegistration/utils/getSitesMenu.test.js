state.vars.reg_lang = 'en';
const getSitesMenu = require('./getSitesMenu');

const tableMock = {queryRows: jest.fn()};
const rowMock = {hasNext: jest.fn(), next: jest.fn()};
describe('get sites menu', () => {
    beforeAll(() => {
        service.vars.pshopLocationTableId = 'pshopLocationTableId';
        jest.spyOn(project, 'initDataTableById').mockReturnValue(tableMock);
        jest.spyOn(tableMock, 'queryRows').mockReturnValue(rowMock);
        state.vars.district_id = 'district_id';
        state.vars.sector_id = 'sector_id';
    });
    it('it should return the site menu and save the necessary state variables', () => {
        jest.spyOn(rowMock, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(rowMock, 'next').mockReturnValueOnce({vars: {site_id: 's-1', site_name: 'site 1'}});
        getSitesMenu();
        expect(tableMock.queryRows).toHaveBeenCalledWith({'vars': {district_id: 'district_id', sector_id: 'sector_id'}});
        expect(project.initDataTableById).toHaveBeenCalledWith('pshopLocationTableId');
        expect(state.vars.pshop_sites).toEqual('{"s-1":"site 1"}');
        expect(state.vars.current_sites_screen).toEqual('1');
        expect(state.vars.sitesMenuScreens).toEqual('{"1":"1) site 1\\n"}');
        expect(state.vars.sitesMenuOptionValues).toEqual('{"1":"s-1"}');
    });
});