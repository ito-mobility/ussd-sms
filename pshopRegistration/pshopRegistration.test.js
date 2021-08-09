state.vars.reg_lang = 'en';
const pshopRegistration = require('./pshopRegistration');

var nationalIdHandler = require('../client-registration/national-id-handler/nationalIdHandler');
var phoneNumberHandler = require('../client-registration/phone-number-handler/phoneNumberHandler');
var firstNameHandler = require('../client-registration/first-name-handler/firstNameHandler');
var lastNameHandler = require('../client-registration/second-name-handler/secondNameHandler');

var sectorHandler = require('./inputHandlers/sectorHandler');
var sitesHandler = require('./inputHandlers/sitesHandler');
var groupHandler = require('./inputHandlers/groupHandler');
var districtHandler = require('./inputHandlers/districtHandler');

// utils
var OnValidatedFactory = require('./utils/OnValidatedFactory');
var getDistrictsMenu = require('./utils/getDistrictsMenu');
var getSectorsMenu = require('./utils/getSectorsMenu');
var getSitesMenu = require('./utils/getSitesMenu');
var getGroupsMenu = require('./utils/getGroupsMenu');
var registerClient = require('./utils/registerClient');


jest.mock('./utils/OnValidatedFactory');

describe('pshop registration', () => {
    it('should prompt for national id on start', () => {
        pshopRegistration.start('en');
        expect(sayText).toHaveBeenCalledWith('Welcome to the PShop new client registration page! Insert  NID ');
        expect(promptDigits).toHaveBeenCalledWith(nationalIdHandler.handlerName);
    });
});

describe('registering input handlers', () => {
    it('should register the national id input handler', () => {
        const onNationalIdValidatedMock = jest.fn();
        const nationalIdHandlerMock = jest.fn();
        jest.spyOn(nationalIdHandler, 'getHandler').mockReturnValueOnce(nationalIdHandlerMock);
        OnValidatedFactory.mockReturnValueOnce(onNationalIdValidatedMock);
        pshopRegistration.registerInputHandlers('en');

        expect(addInputHandler).toHaveBeenCalledWith(nationalIdHandler.handlerName, nationalIdHandlerMock);
        expect(nationalIdHandler.getHandler).toHaveBeenCalledWith(onNationalIdValidatedMock);
        expect(OnValidatedFactory).toHaveBeenCalledWith('enter_phone', phoneNumberHandler, 'reg_nid', {});
    });

    it('should register the phone number input handler', () => {
        const onPhoneNumberValidatedMock = jest.fn();
        const phoneNumberHandlerMock = jest.fn();
        jest.spyOn(phoneNumberHandler, 'getHandler').mockReturnValueOnce(phoneNumberHandlerMock);
        OnValidatedFactory.mockReturnValueOnce(jest.fn()).mockReturnValueOnce(onPhoneNumberValidatedMock);
        pshopRegistration.registerInputHandlers('en');

        expect(addInputHandler).toHaveBeenCalledWith(phoneNumberHandler.handlerName, phoneNumberHandlerMock);
        expect(OnValidatedFactory).toHaveBeenCalledWith('enter_first_name', firstNameHandler, 'reg_phone', {});
        expect(phoneNumberHandler.getHandler).toHaveBeenCalledWith(onPhoneNumberValidatedMock);
    });

    it('should register the first name input handler', () => {
        const onFirstNameValidatedMock = jest.fn();
        const firstNameHandlerMock = jest.fn();
        jest.spyOn(firstNameHandler, 'getHandler').mockReturnValueOnce(firstNameHandlerMock);
        OnValidatedFactory.mockReturnValueOnce(jest.fn()).mockReturnValueOnce(jest.fn()).mockReturnValueOnce(onFirstNameValidatedMock);
        pshopRegistration.registerInputHandlers('en');

        expect(addInputHandler).toHaveBeenCalledWith(firstNameHandler.handlerName, firstNameHandlerMock);
        expect(OnValidatedFactory).toHaveBeenCalledWith('enter_last_name', lastNameHandler, 'reg_first_name', {});
        expect(firstNameHandler.getHandler).toHaveBeenCalledWith(onFirstNameValidatedMock);
    });

    it('should register the last name input handler', () => {
        const onLastNameValidatedMock = jest.fn();
        const lastNameHandlerMock = jest.fn();
        jest.spyOn(lastNameHandler, 'getHandler').mockReturnValueOnce(lastNameHandlerMock);
        OnValidatedFactory.mockReturnValueOnce(jest.fn()).mockReturnValueOnce(jest.fn()).mockReturnValueOnce(jest.fn()).mockReturnValueOnce(onLastNameValidatedMock);
        pshopRegistration.registerInputHandlers('en');

        expect(addInputHandler).toHaveBeenCalledWith(lastNameHandler.handlerName, lastNameHandlerMock);
        expect(OnValidatedFactory).toHaveBeenCalledWith('enter_district',districtHandler, 'reg_last_name', {'$districtsMenu': getDistrictsMenu});
        expect(lastNameHandler.getHandler).toHaveBeenCalledWith(onLastNameValidatedMock);
    });

    it('should register district input handler', () => {
        const onDistrictValidatedMock = jest.fn();
        const districtHandlerMock = jest.fn();
        jest.spyOn(districtHandler, 'getHandler').mockReturnValueOnce(districtHandlerMock);
        OnValidatedFactory.mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(onDistrictValidatedMock);
        pshopRegistration.registerInputHandlers('en');

        expect(addInputHandler).toHaveBeenCalledWith(districtHandler.handlerName, districtHandlerMock);
        expect(OnValidatedFactory).toHaveBeenCalledWith('enter_sector', sectorHandler, 'district_id', {'$sectorsMenu': getSectorsMenu});
        expect(districtHandler.getHandler).toHaveBeenCalledWith(onDistrictValidatedMock);
    });

    it('should register sector input handler', () => {
        const onSectorValidatedMock = jest.fn();
        const sectorHandlerMock = jest.fn();
        jest.spyOn(sectorHandler, 'getHandler').mockReturnValueOnce(sectorHandlerMock);
        OnValidatedFactory.mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(onSectorValidatedMock);
        pshopRegistration.registerInputHandlers('en');

        expect(addInputHandler).toHaveBeenCalledWith(sectorHandler.handlerName, sectorHandlerMock);
        expect(OnValidatedFactory).toHaveBeenCalledWith('enter_site', sitesHandler, 'sector_name', {'$sitesMenu': getSitesMenu});
        expect(sectorHandler.getHandler).toHaveBeenCalledWith(onSectorValidatedMock);
    });

    it('should register sites input handler', () => {
        const onSitesValidatedMock = jest.fn();
        const sitesHandlerMock = jest.fn();
        jest.spyOn(sitesHandler, 'getHandler').mockReturnValueOnce(sitesHandlerMock);
        OnValidatedFactory.mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(onSitesValidatedMock);
        pshopRegistration.registerInputHandlers('en');

        expect(addInputHandler).toHaveBeenCalledWith(sitesHandler.handlerName, sitesHandlerMock);
        expect(OnValidatedFactory).toHaveBeenCalledWith('enter_group', groupHandler, 'site_id', {'$groupsMenu': getGroupsMenu});
        expect(sitesHandler.getHandler).toHaveBeenCalledWith(onSitesValidatedMock);
    });

    it('should register group input handler', () => {
        const onGroupValidatedMock = jest.fn();
        const groupHandlerMock = jest.fn();
        jest.spyOn(groupHandler, 'getHandler').mockReturnValueOnce(groupHandlerMock);
        OnValidatedFactory.mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(jest.fn())
            .mockReturnValueOnce(onGroupValidatedMock);
        pshopRegistration.registerInputHandlers('en');

        expect(addInputHandler).toHaveBeenCalledWith(groupHandler.handlerName, groupHandlerMock);
        expect(OnValidatedFactory).toHaveBeenCalledWith('show_account_number', null, 'group_id', {'$accountNumber': registerClient});
        expect(groupHandler.getHandler).toHaveBeenCalledWith(onGroupValidatedMock);
    });
});