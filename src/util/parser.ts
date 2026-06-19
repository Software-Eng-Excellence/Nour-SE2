import {promises as fs} from 'fs';
import {parse as csvParse} from 'csv-parse';
import { stringify as csvStringify } from 'csv-stringify';
import { parseStringPromise } from 'xml2js';

/**
 * Read a CSV file and returns its content as a 2D array of strings
 * @param filepath The path to the CSV file
 * @returns Promise<string [][]>-
*/ 
export async function readCSVFile(filepath: string,includesHeader:boolean=false): Promise<string[][]> {
    try {
    const fileContent = await fs.readFile(filepath, 'utf-8');
    return new Promise((resolve, reject) => { 
        csvParse(fileContent,{
            trim: true,
            skip_empty_lines: true
        }, (err, records:string [][]) => {           
            if (err) reject(err);
            if(!includesHeader) records.shift();
            resolve(records);
            });
        });
    }catch (error) {
        throw new Error(`Error reading CSV file: ${error}`);
    }
}

/**
 * Write a 2D array of strings to a CSV file
 * @param filepath The path to the CSV file should be written
 * @param data The 2D array of strings to write
 * @returns Promise<void>
*/

export async function writeCsvFile(filepath: string, data: string[][]): Promise<void> {
    try{
        const csvContent = await new Promise<string>((resolve, reject) => {            
            csvStringify(data, (err, output) => {
                if (err) reject(err);
                resolve(output);
            });        });
        await fs.writeFile(filepath, csvContent, 'utf-8');
    }catch (error) {
        throw new Error(`Error writing CSV file: ${error}`);
    }
}


/**
 * Parse a CSV file and return its rows as a 2D array (no header row)
 * This is the function your index.ts expects as `parseCSV`.
 */
export async function parseCSV(filepath: string): Promise<string[][]> {
    return readCSVFile(filepath, false);
}

// ---------------------- JSON (new) ----------------------
/**
 * Parse a JSON file and return the parsed JavaScript object.
 * @param filepath Path to the JSON file
 * @returns Promise<any> (array or object)
 */
export async function parseJSON(filepath: string): Promise<any> {
    try {
        const fileContent = await fs.readFile(filepath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        throw new Error(`Error reading/parsing JSON file: ${error}`);
    }
}

// ---------------------- XML (new) ----------------------
/**
 * Parse an XML file and return a JavaScript object.
 * The structure matches what your mapping functions expect (e.g., `data.data.row`).
 * @param filepath Path to the XML file
 * @returns Promise<any> (object representation of the XML)
 */
export async function parseXML(filepath: string): Promise<any> {
    try {
        const fileContent = await fs.readFile(filepath, 'utf-8');
        const result = await parseStringPromise(fileContent, {
            explicitArray: false,   // avoid unnecessary nested arrays for single elements
            mergeAttrs: true,       // merge attributes into child objects
        });
        return result;
    } catch (error) {
        throw new Error(`Error reading/parsing XML file: ${error}`);
    }
}

