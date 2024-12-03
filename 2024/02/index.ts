import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

// These lines set up the file path handling for reading our input file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const inputPath = join(__dirname, 'input.txt');
const input = readFileSync(inputPath, 'utf-8').trim();

// -----------------------------------------------------------------------------

/**
 * Checks if the difference between two adjacent numbers follows the reactor's safety rules.
 * The reactor can only handle level differences between 1 and 3 (inclusive).
 * 
 * Think of this like climbing stairs:
 * - You can step up or down 1, 2, or 3 steps at a time
 * - You can't stay on the same step (difference of 0)
 * - You can't jump more than 3 steps at once
 * 
 * Examples:
 * - isValidDifference(1, 3) => true  (difference of 2, within limits)
 * - isValidDifference(1, 5) => false (difference of 4, too big)
 * - isValidDifference(3, 3) => false (difference of 0, must change)
 * 
 * @param a - The first number in the comparison
 * @param b - The second number in the comparison
 * @returns boolean - True if the difference is valid (between 1 and 3)
 */
function isValidDifference(a: number, b: number): boolean {
    // We use Math.abs to handle both increasing and decreasing sequences
    const diff = Math.abs(a - b);
    return diff >= 1 && diff <= 3;
}

/**
 * Determines if a sequence of numbers is safe according to reactor rules.
 * A safe sequence must be consistently increasing or decreasing (monotonic)
 * and each adjacent pair must have a valid difference.
 * 
 * Think of it like plotting points on a graph:
 * - The line must always go up OR always go down (no changing direction)
 * - Each step must be between 1 and 3 units
 * 
 * Examples:
 * [1, 3, 5] => true    (consistently increasing by 2)
 * [7, 5, 2] => true    (consistently decreasing by 2-3)
 * [1, 3, 2] => false   (changes direction)
 * [1, 4, 7] => false   (step of 3 is too large)
 * 
 * @param numbers - Array of reactor level readings to check
 * @returns boolean - True if the sequence follows all safety rules
 */
function isMonotonic(numbers: number[]): boolean {
    // null means we haven't determined direction yet
    let increasing: boolean | null = null;
    
    // Check each pair of adjacent numbers
    for (let i = 1; i < numbers.length; i++) {
        const diff = numbers[i] - numbers[i - 1];
        
        // First pair determines if we're increasing or decreasing
        if (increasing === null) {
            increasing = diff > 0;
        } 
        // Subsequent pairs must maintain the same direction
        else if ((increasing && diff <= 0) || (!increasing && diff >= 0)) {
            // We changed direction, which isn't allowed
            return false;
        }
        
        // Even if direction is good, the step size must be valid
        if (!isValidDifference(numbers[i], numbers[i - 1])) {
            return false;
        }
    }
    
    // If we made it through all checks, the sequence is safe
    return true;
}

/**
 * Tests if a sequence can be made safe by removing one number (Problem Dampener).
 * The Problem Dampener can remove exactly one troublesome reading to make an
 * otherwise unsafe sequence safe.
 * 
 * Algorithm:
 * 1. First check if sequence is already safe (no removal needed)
 * 2. If not safe, try removing each number one at a time
 * 3. If any removal creates a safe sequence, return true
 * 
 * Example:
 * [1, 3, 2, 4, 5] => true because:
 * - Original sequence isn't safe (changes direction at 2)
 * - Removing the '3' gives [1, 2, 4, 5] which is safe
 * 
 * @param numbers - Array of reactor level readings to check
 * @returns boolean - True if sequence is safe or can be made safe by removing one number
 */
function canBeMadeSafe(numbers: number[]): boolean {
    // First, check if it's already safe without removing anything
    if (isMonotonic(numbers)) return true;
    
    // Try removing each number one at a time
    for (let i = 0; i < numbers.length; i++) {
        // Create new array without the current number
        // filter() creates a new array excluding the current index
        const filteredNumbers = numbers.filter((_, index) => index !== i);
        
        // Check if this removal makes the sequence safe
        if (isMonotonic(filteredNumbers)) {
            return true;  // We found a way to make it safe!
        }
    }
    
    // If we tried all removals and none worked, it can't be made safe
    return false;
}

/**
 * Parses the input string into a format we can process.
 * Converts a multi-line string of space-separated numbers into a 2D array.
 * 
 * Example input:
 * "1 2 3
 *  4 5 6"
 * 
 * Becomes:
 * [
 *   [1, 2, 3],
 *   [4, 5, 6]
 * ]
 * 
 * @param input - Raw input string from file
 * @returns number[][] - 2D array where each inner array is one line of numbers
 */
function parseInput(input: string): number[][] {
    // Split into lines and process each line
    return input.split('\n').map(line => 
        // For each line:
        // 1. Trim whitespace
        // 2. Split on spaces
        // 3. Convert strings to numbers
        line.trim().split(' ').map(Number)
    );
}

/**
 * Main solver function that processes the input and returns both puzzle answers.
 * 
 * Part 1: Count sequences that are naturally safe
 * Part 2: Count sequences that are safe OR can be made safe with Problem Dampener
 * 
 * The difference helps engineers understand how many sequences:
 * - Are naturally safe (Part 1)
 * - Can be saved by the Problem Dampener (Part 2 - Part 1)
 * - Cannot be saved at all (Total - Part 2)
 * 
 * @returns string - Formatted string containing both answers
 */
function main(): string {
    // Parse input once and reuse for both parts
    const reports = parseInput(input);
    
    // Part 1: Count naturally safe sequences
    const partOne = reports.filter(levels => isMonotonic(levels)).length;
    
    // Part 2: Count sequences that can be made safe with Problem Dampener
    const partTwo = reports.filter(levels => canBeMadeSafe(levels)).length;
    
    // Return formatted results
    return `Part 1: ${partOne}\nPart 2: ${partTwo}`;
}

// -----------------------------------------------------------------------------

console.log(main());