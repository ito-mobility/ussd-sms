const getCurrentDate = require('./getCurrentDate');

describe('current current date', () => {
    it('should return the current date', () => {
        expect(getCurrentDate()).toEqual(new Date());
    });
});