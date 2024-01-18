function parseCSV(text) {
    // Get the lines of text
    let lines = text.replace(/\\r/g, '').split('\\n');
    return lines.map(line => {
        // For each line, get the values
        let values = line.split(',');
        return values;
    });
}

function reverseMatrix(matrix) {
    let output = [];
    // For each row
    matrix.forEach((values, row) => {
        // See the values and their position
        values.forEach((value, col) => {
            // If the position has not been created yet
            if (output[col] === undefined) output[col] = [];
            output[col][row] = value;
        });
    });
    return output;
}

function readFile(evt) {
    let file = evt.target.files[0];
    let reader = new FileReader();
    reader.onload = e => {
        // When the file is finished loading
        let lines = parseCSV(e.target.result);
        let output = reverseMatrix(lines);
        console.log(output);
    };
    // Read the contents of the selected file
    reader.readAsBinaryString(file);
}