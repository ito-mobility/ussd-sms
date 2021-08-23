state.vars.reg_lang = 'en';
const groupHandler = require('./groupHandler');

jest.mock('../../notifications/elk-notification/elkNotification');

describe('group input handler', () => {
    beforeAll(() => {
        state.vars.groupsMenuScreens = JSON.stringify({'1': 'Screen 1', '2': 'Screen 2', '3': 'Screen 3'});
        state.vars.groupsMenuOptionValues = JSON.stringify({'1': 'd-1', '2': 'd-2', '3': 'd-3'});
        state.vars.pshop_groups = JSON.stringify({'d-1': 'group1', 'd-2': 'group2', 'd-3': 'group3'});
        state.vars.current_groups_screen = '1';
    });
    const onGroupValidated = jest.fn();
    it('should reprompt for group if input matches no group', () => {
        const handler = groupHandler.getHandler(onGroupValidated);
        handler('3456');
        expect(sayText).toHaveBeenCalledWith('Choose Village/Group\nScreen 1');
        expect(promptDigits).toHaveBeenCalledWith(groupHandler.handlerName);
    });

    it('should show the next screen if input is 99', () => {
        const handler = groupHandler.getHandler(onGroupValidated);
        handler('99');
        expect(sayText).toHaveBeenCalledWith('Screen 2');
        expect(promptDigits).toHaveBeenCalledWith(groupHandler.handlerName);
        expect(state.vars.current_groups_screen).toBe(2);
    });

    it('should call onGroupValidated with the group id and save the group name in the state variable', () => {
        const handler = groupHandler.getHandler(onGroupValidated);
        handler('1');
        expect(onGroupValidated).toHaveBeenCalledWith('d-1');
        expect(state.vars.selected_group_name).toBe('group1');
    });
});
