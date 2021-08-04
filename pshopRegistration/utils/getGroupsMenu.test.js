state.vars.reg_lang = 'en';
const getGroupsMenu = require('./getGroupsMenu');

const tableMock = {queryRows: jest.fn()};
const rowMock = {hasNext: jest.fn(), next: jest.fn()};
describe('get groups menu', () => {
    beforeAll(() => {
        service.vars.pshopLocationTableId = 'pshopLocationTableId';
        jest.spyOn(project, 'initDataTableById').mockReturnValue(tableMock);
        jest.spyOn(tableMock, 'queryRows').mockReturnValue(rowMock);
        state.vars.district_id = 'district_id';
        state.vars.site_id = 'site_id';
        state.vars.sector_id = 'sector_id';
    });
    it('it should return the group menu and save the necessary state variables', () => {
        jest.spyOn(rowMock, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(rowMock, 'next').mockReturnValueOnce({vars: {group_id: 'g-1', group_name: 'group 1'}});
        getGroupsMenu();
        expect(tableMock.queryRows).toHaveBeenCalledWith({'vars': {
            district_id: 'district_id',
            sector_id: 'sector_id',
            site_id: 'site_id'
        }});
        expect(project.initDataTableById).toHaveBeenCalledWith('pshopLocationTableId');
        expect(state.vars.pshop_groups).toEqual('{"g-1":"group 1"}');
        expect(state.vars.current_groups_screen).toEqual('1');
        expect(state.vars.groupsMenuScreens).toEqual('{"1":"1) group 1\\n"}');
        expect(state.vars.groupsMenuOptionValues).toEqual('{"1":"g-1"}');
    });
});