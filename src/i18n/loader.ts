import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export const loadLocales = (lang: 'en' | 'ja') => {
    const filePath = path.join(__dirname, 'locales', `${lang}.yaml`);
    const content = fs.readFileSync(filePath, 'utf8');
    return yaml.load(content) as any;
};

export const strings = {
    en: loadLocales('en'),
    ja: loadLocales('ja')
}; 