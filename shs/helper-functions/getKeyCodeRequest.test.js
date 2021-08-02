const getKeyCodeRequest = require('./getKeyCodeRequest');
const getCurrentDate = require('../../shared/getCurrentDate');
var getShsPrice =  require('./getShsPrice');
var clientTestData = require('./clientTestData');

jest.mock('../../shared/getCurrentDate');
jest.mock('./getShsPrice');

var codeTypes = {
    UNLOCK: 'UNLOCK',
    ACTIVATION: 'ACTIVATION',
    NOCODE: null
};

var getCurrentDateResult = {
    getMonth: jest.fn(),
    getFullYear: jest.fn()
};
describe.only('get Key Code Request', () => {
    beforeAll(() => {
        getCurrentDate.mockReturnValue(getCurrentDateResult);
        getShsPrice.mockReturnValue(20000);
    });
    // testing for getKeyCodeRequest at the end of A. the second activation code
    it('should return UNLOCK if client have paid all debt at the end of credit cycle A of their fist season', () => {
        state.vars.unit_to_update = JSON.stringify({
            'serialNumber': '10966520',
            'unitType': 'BIOLITE',
            'keyCode': '411344443132533',
            'keyCodeType': 'ACTIVATION',
            'expiry': 1632649974,
            'createdAt': '1629999999999'
        });
        jest.spyOn(getCurrentDateResult, 'getMonth').mockReturnValueOnce(11);
        jest.spyOn(getCurrentDateResult, 'getFullYear').mockReturnValueOnce(2021);
        var codeType = getKeyCodeRequest(clientTestData.reg_2022a_paid_all_end_of_a);
        expect(codeType).toEqual(codeTypes.UNLOCK);
    });

    it('should return ACTIVATION if client have 60% all debt at the end of credit cycle A of their fist season', () => {
        state.vars.unit_to_update = JSON.stringify({
            'serialNumber': '10966520',
            'unitType': 'BIOLITE',
            'keyCode': '411344443132533',
            'keyCodeType': 'ACTIVATION',
            'expiry': 1632649974,
            'createdAt': '1629999999999'
        });
        jest.spyOn(getCurrentDateResult, 'getMonth').mockReturnValueOnce(11);
        jest.spyOn(getCurrentDateResult, 'getFullYear').mockReturnValueOnce(2021);
        var codeType = getKeyCodeRequest(clientTestData.reg_2022a_paid_60percentplus_end_of_a);
        expect(codeType).toEqual(codeTypes.ACTIVATION);
    });

    it('should return ACTIVATION if client have 60% all debt at the end of credit cycle A of their fist season', () => {
        state.vars.unit_to_update = JSON.stringify({
            'serialNumber': '10966520',
            'unitType': 'BIOLITE',
            'keyCode': '411344443132533',
            'keyCodeType': 'ACTIVATION',
            'expiry': 1632649974,
            'createdAt': '1629999999999'
        });
        jest.spyOn(getCurrentDateResult, 'getMonth').mockReturnValueOnce(11);
        jest.spyOn(getCurrentDateResult, 'getFullYear').mockReturnValueOnce(2021);
        var codeType = getKeyCodeRequest(clientTestData.reg_2022a_paid_lessthank60percent_end_of_a);
        expect(codeType).toEqual(codeTypes.NOCODE);
    });

    // testing for getKeyCodeRequest at the end of B. the third activation code
    it('should return UNLOCK if client have paid all debt (half of units price) at the end of credit cycle B of their fist season', () => {
        state.vars.unit_to_update = JSON.stringify({
            'serialNumber': '10966520',
            'unitType': 'BIOLITE',
            'keyCode': '411344443132533',
            'keyCodeType': 'ACTIVATION',
            'expiry': 1632649974,
            'createdAt': '1629999999999'
        });
        jest.spyOn(getCurrentDateResult, 'getMonth').mockReturnValueOnce(8);
        jest.spyOn(getCurrentDateResult, 'getFullYear').mockReturnValueOnce(2021);
        var codeType = getKeyCodeRequest(clientTestData.reg_2022a_paid_all_end_of_b);
        expect(codeType).toEqual(codeTypes.UNLOCK);
    });

    it('should return ACTIVATION if client have 100% of their debt at the end of credit cycle B of their fist season', () => {
        state.vars.unit_to_update = JSON.stringify({
            'serialNumber': '10966520',
            'unitType': 'BIOLITE',
            'keyCode': '411344443132533',
            'keyCodeType': 'ACTIVATION',
            'expiry': 1632649974,
            'createdAt': '1629999999999'
        });
        jest.spyOn(getCurrentDateResult, 'getMonth').mockReturnValueOnce(8);
        jest.spyOn(getCurrentDateResult, 'getFullYear').mockReturnValueOnce(2021);
        var codeType = getKeyCodeRequest(clientTestData.reg_2022a_paid_100percentofdebt_end_of_b);
        expect(codeType).toEqual(codeTypes.ACTIVATION);
    });

    it('should return no activation or unlock if client have not paid 100% of their debt at the end of credit cycle B of their fist season', () => {
        state.vars.unit_to_update = JSON.stringify({
            'serialNumber': '10966520',
            'unitType': 'BIOLITE',
            'keyCode': '411344443132533',
            'keyCodeType': 'ACTIVATION',
            'expiry': 1632649974,
            'createdAt': '1629999999999'
        });
        jest.spyOn(getCurrentDateResult, 'getMonth').mockReturnValueOnce(8);
        jest.spyOn(getCurrentDateResult, 'getFullYear').mockReturnValueOnce(2021);
        var codeType = getKeyCodeRequest(clientTestData.reg_2022a_paid_lessthan100percentofdebt_end_of_b);
        expect(codeType).toEqual(codeTypes.NOCODE);
    });

    // testing for getKeyCodeRequest at the end of A. second season the fourth activation code
    it('should return UNLOCK if client have paid overpayment of their debt at the end of credit cycle A of their second(last) season', () => {
        state.vars.unit_to_update = JSON.stringify({
            'serialNumber': '10966520',
            'unitType': 'BIOLITE',
            'keyCode': '411344443132533',
            'keyCodeType': 'ACTIVATION',
            'expiry': 1632649974,
            'createdAt': '1598000000000' // 2020-08-21 21A
        });
        jest.spyOn(getCurrentDateResult, 'getMonth').mockReturnValueOnce(12);
        jest.spyOn(getCurrentDateResult, 'getFullYear').mockReturnValueOnce(2021);
        var codeType = getKeyCodeRequest(clientTestData.reg_2020a_paid_all_end_of_a_2nd_season);
        expect(codeType).toEqual(codeTypes.UNLOCK);
    });

    it('should return ACTIVATION if client have paid atleast 60% of their debt at the end of credit cycle A of their second(last) season', () => {
        state.vars.unit_to_update = JSON.stringify({
            'serialNumber': '10966520',
            'unitType': 'BIOLITE',
            'keyCode': '411344443132533',
            'keyCodeType': 'ACTIVATION',
            'expiry': 1632649974,
            'createdAt': '1598000000000' // 2020-08-21 21A
        });
        jest.spyOn(getCurrentDateResult, 'getMonth').mockReturnValueOnce(12);
        jest.spyOn(getCurrentDateResult, 'getFullYear').mockReturnValueOnce(2021);
        var codeType = getKeyCodeRequest(clientTestData.reg_2020a_paid_60percent_plus_end_of_a_2nd_season);
        expect(codeType).toEqual(codeTypes.ACTIVATION);
    });

    it('should return no activation or unlock if client have not paid atleast 60% of their debt at the end of credit cycle A of their second(last) season', () => {
        state.vars.unit_to_update = JSON.stringify({
            'serialNumber': '10966520',
            'unitType': 'BIOLITE',
            'keyCode': '411344443132533',
            'keyCodeType': 'ACTIVATION',
            'expiry': 1632649974,
            'createdAt': '1598000000000' // 2020-08-21 21A
        });
        jest.spyOn(getCurrentDateResult, 'getMonth').mockReturnValueOnce(12);
        jest.spyOn(getCurrentDateResult, 'getFullYear').mockReturnValueOnce(2021);
        var codeType = getKeyCodeRequest(clientTestData.reg_2020a_notpaid_60percent_plus_end_of_a_2nd_season);
        expect(codeType).toEqual(codeTypes.NOCODE);
    });

    // testing for getKeyCodeRequest at the end of B. last code 
    it('should return no activation or unlock if client have not paid 100% of their debt at the end of credit cycle B of their second(last) season', () => {
        state.vars.unit_to_update = JSON.stringify({
            'serialNumber': '10966520',
            'unitType': 'BIOLITE',
            'keyCode': '411344443132533',
            'keyCodeType': 'ACTIVATION',
            'expiry': 1632649974,
            'createdAt': '1598000000000' // 2020-08-21 21A
        });
        jest.spyOn(getCurrentDateResult, 'getMonth').mockReturnValueOnce(8);
        jest.spyOn(getCurrentDateResult, 'getFullYear').mockReturnValueOnce(2021);
        var codeType = getKeyCodeRequest(clientTestData.reg_2020a_paid_all_debt);
        expect(codeType).toEqual(codeTypes.UNLOCK);
    });

    it('should return no code when client have paid 100% of their debt at the end of credit cycle B of their second(last) season', () => {
        state.vars.unit_to_update = JSON.stringify({
            'serialNumber': '10966520',
            'unitType': 'BIOLITE',
            'keyCode': '411344443132533',
            'keyCodeType': 'ACTIVATION',
            'expiry': 1632649974,
            'createdAt': '1598000000000' // 2020-08-21 21A
        });
        jest.spyOn(getCurrentDateResult, 'getMonth').mockReturnValueOnce(8);
        jest.spyOn(getCurrentDateResult, 'getFullYear').mockReturnValueOnce(2021);
        var codeType = getKeyCodeRequest(clientTestData.reg_2020a_lessthan60percent_debt);
        expect(codeType).toEqual(codeTypes.NOCODE);
    });
});
