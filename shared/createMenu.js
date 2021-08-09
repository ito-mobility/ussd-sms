
/**
 * a util to return menu and option values given the option names
 * @param {Array} optionNames an object of key value pairs (option_key: option value)
 * @param {String} nextScreenOption option for next screen -- 44) next screen --
 * @param {String} title title that goes on the first screen
 * @param {Number} maxCharacters | sorting max characters per screen (fall back to 140) send true to use sorting
 */
module.exports = function (optionNames, nextScreenOption, title, maxCharacters) {
    var screen = 1;
    var screens = {};
    var message = title ? title + '\n' : '';
    maxCharacters = maxCharacters || 140;
    nextScreenOption = nextScreenOption || '';
    var optionValues = {};
    var optionKeys = [];
    if(typeof maxCharacters === 'object') {
        maxCharacters = maxCharacters.max || 140;
        optionKeys = Object.keys(optionNames).sort(function(optA, optB){
            if(optionNames[optA] < optionNames[optB]) { return -1; }
            if(optionNames[optA] > optionNames[optB]) { return 1; }
            return 0;
        });
    } else {
        optionKeys = Object.keys(optionNames);
    }
    console.log(JSON.stringify({optionKeys: optionKeys}));
    optionKeys.forEach(function(allowedOption, index) {
        var label = index + 1 + ') ';
        if((message + label + optionNames[allowedOption]  + '\n' + nextScreenOption).length <= maxCharacters) {
            message += label + optionNames[allowedOption] + '\n';
            optionValues[index + 1] = allowedOption;
        }

        if((message + label + optionNames[allowedOption] + '\n' + nextScreenOption).length > maxCharacters || Object.keys(optionNames).length == index + 1) {
            if(Object.keys(optionNames).length == index + 1) {
                screens[screen] = message;
            } else {
                screens[screen] = message + nextScreenOption;
                screen = screen + 1;
                message = '';
            }
        }
    });
    console.log(JSON.stringify({screens: screens}));
    return {screens: screens, optionValues: optionValues};
};

