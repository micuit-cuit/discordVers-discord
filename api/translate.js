//module de traduction du bot, utilise un système de key-value pour les traductions
// exemple:
const Log = require('mi-log');
const log = new Log([{ style: 'circle', color: 'yellow', text: 'translate-api' }]);
const fs = require('fs');
const translations = {}

const translationsPath = "./config/translations/";
const files = fs.readdirSync(translationsPath);
files.forEach(file => {
    const lang = file.split(".")[0];
    const data = fs.readFileSync(translationsPath + file);
    translations[lang] = JSON.parse(data);
});


module.exports = {
    translate(lang, key, ...args) {
        if (!translations[lang]) {
            lang = "en-US";//default language
            log.w(`No translation found for lang ${lang}, using en-US instead`);
        }
        if (!translations[lang][key]) {
            //test en anglais
            if (!translations["en-US"][key]) {
                log.e(`No translation found for key ${key} in ${lang} and en-US`);
                return `No translation found for key ${key} in ${lang} and en-US`;
            }
            log.w(`No translation found for key ${key} in ${lang}, using en-US instead`);
            lang = "en-US";
        }
        let translation = translations[lang][key];
        for (let i = 0; i < args.length; i++) {
            translation = translation.replace(`{${i}}`, args[i]);
        }
        //replace // with \n
        translation = translation.replace(/\/\//g, '\n');
        return translation;
    },
    translateALL(key, ...args) {
        let translations = {};
        for (const lang in translations) {
            translations[lang] = this.translate(lang, key, ...args);
        }
        return translations;
    }

};