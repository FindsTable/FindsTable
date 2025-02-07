import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const localesDir = path.resolve(__dirname, '../../locales');

function compareKeys(obj1: any, obj2: any, path: string[] = [], direction: string, fileName: string) {
    for (const key in obj1) {
        const currentPath = [...path, key];
        if (!obj2.hasOwnProperty(key)) {
            console.error(`Missing key "${currentPath.join('.')}" in ${direction}/${fileName}`);
            throw new Error(`Missing key "${currentPath.join('.')}" in ${direction}/${fileName}`);
        }
        if (typeof obj1[key] === 'object' && obj1[key] !== null) {
            compareKeys(obj1[key], obj2[key], currentPath, direction, fileName);
        }
    }
}

describe('Locale JSON files', () => {
    const enFiles = fs.readdirSync(path.join(localesDir, 'en')).filter(file => file.endsWith('.json'));

    enFiles.forEach((file) => {
        if (file.endsWith('.json')) {
            it(`should have the same keys in both en and fr for ${file}`, () => {
                const enFilePath = path.join(localesDir, 'en', file);
                const frFilePath = path.join(localesDir, 'fr', file);

                if (fs.existsSync(frFilePath)) {
                    const enContent = JSON.parse(fs.readFileSync(enFilePath, 'utf-8'));
                    const frContent = JSON.parse(fs.readFileSync(frFilePath, 'utf-8'));

                    compareKeys(enContent, frContent, [], 'fr', file);
                    compareKeys(frContent, enContent, [], 'en', file);
                } else {
                    throw new Error(`Missing file ${file} in fr`);
                }
            });
        }
    });
});