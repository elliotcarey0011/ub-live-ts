import fs from 'fs';
import path from 'path';

// Get the test file name from command line arguments
const testFileName = `${process.argv[2]}`

// Check if the test file name is provided
if (!testFileName) {
    console.error('Please provide a test file name.');
    process.exit(1);
}

// Define the path for the template and the new test file
const templatePath = path.join(process.cwd(), 'test-template.js');
const testFilePath = path.join(process.cwd(), `${testFileName}.test.tsx`);

// Read the template file
fs.readFile(templatePath, 'utf8', (err, data) => {
    if (err) throw err;

    // Replace placeholders in the template with the testFileName
    // const result = data.replace(/{{testFileName}}/g, `${testFileName}`);
    const result = data.replace(/TVtestFileNameTV/g, `${testFileName}`);



    // Write the result to the new test file
    fs.writeFile(testFilePath, result, 'utf8', (err) => {
        if (err) throw err;
        console.log(`Test file created: ${testFilePath}`);
    });
});
