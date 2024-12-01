import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read input from input.txt in the same directory
const inputPath = join(__dirname, 'input.txt');
const input = readFileSync(inputPath, 'utf-8').trim();

// -----------------------------------------------------------------------------

/**
 * Parses a string into two arrays of numbers.
 * 
 * @description Each line of the input string represents a pair of numbers separated by whitespace.
 * @param {string} input - The input string containing number pairs
 * @returns {[number[], number[]]} A tuple containing two arrays of numbers
 */
function parseInput(input: string): [number[], number[]] {
    // Remove leading/trailing whitespace and split the input into lines
    const lines = input.trim().split('\n');

    // Initialize empty arrays to store left and right numbers
    const leftList: number[] = [];
    const rightList: number[] = [];

    // Iterate through each line of input
    for (const line of lines) {
        // Trim the line and split by whitespace
        const trimmedLine = line.trim();
        const parts = trimmedLine.split(/\s+/);

        // Convert the first part to a number for the left list
        const leftNum = Number(parts[0]);
        leftList.push(leftNum);

        // Convert the second part to a number for the right list
        const rightNum = Number(parts[1]);
        rightList.push(rightNum);
    }

    // Return the two lists of numbers
    return [leftList, rightList];
}


/**
 * Calculates the total Manhattan distance between two lists of numbers.
 * 
 * @description The Manhattan distance is the sum of absolute differences between corresponding 
 * elements in two equally-sized vectors (lists). This function first sorts the lists for easier calculation.
 * 
 * @param {string} input - Input string containing pairs of numbers
 * @returns {number} Total Manhattan distance between sorted lists
 */
function calculateDistance(input: string): number {
    const [leftList, rightList] = parseInput(input);

    //Sort using built-in sort method and spread syntax for immutability
    const sortedLeft = [...leftList].sort((a, b) => a - b);
    const sortedRight = [...rightList].sort((a, b) => a - b);

    // Calculate the total distance
    let totalDistance = 0;

    for (let i = 0; i < sortedLeft.length; i++) {
        totalDistance += Math.abs(sortedLeft[i] - sortedRight[i]);
    }

    return totalDistance;
}


/**
 * Calculates a similarity score by multiplying left list numbers with their corresponding
 * right list number occurrences.
 * 
 * @description Computes a weighted similarity metric where each number in the left list
 * is multiplied by the frequency of its value in the right list.
 * 
 * @param {string} input - Input string containing pairs of numbers
 * @returns {number} Weighted similarity score
 */
function calculateSimilarity(input: string): number {
    const [leftList, rightList] = parseInput(input);

    // Use a Map for more efficient counting of occurrences in the right list.
    const rightCounts = new Map<number, number>();

    for (const num of rightList) {
        rightCounts.set(num, (rightCounts.get(num) || 0) + 1);
    }

    // Calculate the similarity score
    let similarityScore = 0;

    for (const num of leftList) {
        const rightCount = rightCounts.get(num) || 0;
        similarityScore += num * rightCount;
    }

    return similarityScore;
}

// Calculate distance and similarity using existing functions
const distance = calculateDistance(input);
const similarity = calculateSimilarity(input);

// Display the results
console.log(`✅ Results
   Distance: ${distance}
   Similarity Score: ${similarity}`);

