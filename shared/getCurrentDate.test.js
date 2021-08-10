const getCurrentDate = require('./getCurrentDate');

describe('current current date', () => {
    it('should return the current date', () => {
        const returnedDate = getCurrentDate();
        const currentDate = new Date();
        expect((returnedDate.toISOString()).split('T')[0]).toEqual((currentDate.toISOString()).split('T')[0]);
    });
});