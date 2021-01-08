module.exports = function(translations, lang, key) {
    if (!translations) throw new Error('No Translations Provided');
    if (!lang) throw new Error('No default language provided');

    var entry = translations[key];
    if (entry === undefined) throw 'No Entry For "' + key + '"';
    var content = entry[lang];
    if (content === undefined) throw '"' + lang + '" is not a supported language';

    if (typeof content === 'string') {
        playAudio(content);
    } else if (Array.isArray(content)) {
        content.forEach(function(link) {
            playAudio(link);
        });
    } else {
        throw new Error('Unsupported data type');
    }
};