#!/usr/bin/env node

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { access } from 'fs/promises';
import Enquirer from 'enquirer';
const { Input } = Enquirer as any;

const MIN_YEAR = 2024;
const MAX_DAY = 25;

const DEFAULT_YEAR = 2024;
const DEFAULT_DAY = 1;

/**
 * Runs the Advent of Code script selection and interaction process.
 * 
 * @description Prompts the user to select a year and day for Advent of Code,
 * then attempts to run the corresponding solution script.
 * 
 * @async
 * @throws {Error} If there are issues with user input or script execution
 * @returns {Promise<void>}
 */
async function runAdventOfCode() {
    try {
        const yearPrompt = new Input({
            name: 'year',
            message: `Enter year (starting from ${MIN_YEAR}):`,
            initial: DEFAULT_YEAR,
            validate: (value: string) => {
                const yearNum = Number(value);
                return !isNaN(yearNum) && yearNum >= MIN_YEAR ? true : 'Invalid year. Please try again.';
            }
        });

        const year = await yearPrompt.run();

        const dayPrompt = new Input({
            name: 'day',
            message: 'Enter day:',
            initial: DEFAULT_DAY,
            validate: (value: string) => {
                const dayNum = Number(value);
                return !isNaN(dayNum) && dayNum >= 1 && dayNum <= MAX_DAY ? true : `Please enter a day between 1 and ${MAX_DAY}.`;
            }
        });

        const day = await dayPrompt.run();

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        const scriptPath = join(__dirname, year, day.padStart(2, '0'), 'index.ts');

        try {
            // Check if the script exists before attempting to run
            await access(scriptPath);

            console.log('');
            console.log(`🎄 Getting Solution for "Advent of Code ${year}" Day ${day}`);
            console.log('');

            const child = spawn('bun', ['run', scriptPath], { stdio: 'inherit' });

            child.on('close', (code) => {
                process.exit(code || 0);
            });
        } catch (notFoundError) {
            console.error(`❌ Solution not available yet for Year ${year}, Day ${day}`);
            console.log('Please check back later or contribute a solution!');
            process.exit(1);
        }

    } catch (error) {
        console.error('Error running script:', error);
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    runAdventOfCode();
}
