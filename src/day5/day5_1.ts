import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("./src/day5/input.txt"))

var line: string;

reader.on("line", (l: string) => {
    line = l;
    // console.log(line.length);

})


reader.on("close", () => {
    let result = cleanString(line, 0);
    console.log('Result: ' + result.length);
})

function cleanString(line: string, i: number): string {

    // console.log('Elab: ' + line);

    if (i == -1) {
        i = 0;
    }

    let actual = line[i];

    if (i + 1 >= line.length) {
        return line;
    }

    let next = line[i + 1];

    // console.log("Check: " + i + " " + actual + " " + next);
    if (checkSimilar(actual, next) && checkReact(actual, next)) {
        console.log('**React: ' + actual + " " + next);
        line = removeIndex(i, line);
        i--;
    } else {
        i++;
    }

    return cleanString(line, i);
}

function removeIndex(index: number, line: string) {
    let end = index + 2 < line.length ? index + 2 : line.length;
    return line.substring(0, index) + line.substring(end, line.length);
}
function checkIsUpper(char: string): boolean {
    return char === char.toUpperCase();
}

function checkIsLower(char: string): boolean {
    return char === char.toLowerCase();
}

function checkSimilar(char: string, next: string) {
    return char.toLowerCase() === next.toLowerCase();
}

function checkReact(line: string, next: string) {
    return (checkIsUpper(line) && checkIsLower(next)) ||
        (checkIsLower(line) && checkIsUpper(next));
}