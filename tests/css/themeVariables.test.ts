import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const themesDir = path.resolve(__dirname, '../../css/colors-and-themes/themes');
const sourceOfTruthFile = 'dark.css';
const filesToVerify = [
    'light.css',
    'forest.css'
];

function extractCssVariables(filePath: string): Set<string> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const variableRegex = /--[\w-]+:/g;
    const variables = new Set(content.match(variableRegex)?.map(variable => variable.slice(0, -1)));
    return variables;
}

describe('Theme CSS Variables', () => {
    const sourceOfTruthPath = path.join(themesDir, sourceOfTruthFile);
    const sourceOfTruthVariables = extractCssVariables(sourceOfTruthPath);

    filesToVerify.forEach((file) => {
        it(`should have the same CSS variables as ${sourceOfTruthFile} in ${file}`, () => {
            const themePath = path.join(themesDir, file);
            const themeVariables = extractCssVariables(themePath);

            sourceOfTruthVariables.forEach(variable => {
                if (!themeVariables.has(variable)) {
                    throw new Error(`Missing variable ${variable} in ${file}`);
                }
            });

            themeVariables.forEach(variable => {
                if (!sourceOfTruthVariables.has(variable)) {
                    throw new Error(`Extra variable ${variable} in ${file}`);
                }
            });
        });
    });
});