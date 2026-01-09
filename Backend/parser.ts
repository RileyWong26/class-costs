import { PDFParse } from "pdf-parse";
import { insertProgramRows} from "./supabase.js";

// Program object
export class Program {
    Name: string;
    Y1: number;
    Y2: number;
    Y3: number;
    Y4: number;
    Y5: number;
    Y1O: number;
    Y2O: number;
    Y3O: number;
    Y4O: number;
    Y5O: number;

    constructor(Name: string, Y1: number, Y2: number, Y3: number, Y4: number, Y5: number, Y1O: number, Y2O: number, Y3O: number, Y4O: number, Y5O: number,){
        this.Name = Name;
        this.Y1 = Y1;
        this.Y2 = Y2;
        this.Y3 = Y3;
        this.Y4 = Y4;
        this.Y5 = Y5;
        this.Y1O = Y1O;
        this.Y2O = Y2O;
        this.Y3O = Y3O;
        this.Y4O = Y4O;
        this.Y5O = Y5O;
        if (Y5 == 0){
            this.Y5 = Y4;
        }
        if (Y5O == 0){
            this.Y5O = Y4O;
        }
    }
}

// Hold the programsm
const arr : Array<Program> = [];

// Check a line contains the word Year
function containsYear(line: string): boolean{
    return line.toLowerCase().includes("year");
}

// Return program if a program with the same name already exists
function findProgram(name: string) : Program | undefined { 
    let p : Program | undefined = undefined;
    arr.forEach((program: Program) => {
        if(program.Name === name){
            p = program;
        }
    });
    return p;
}

// Set the values of the program tuition
function setProgram(program: Program, name : string, y1: number, y2: number, y3: number, y4: number, y5: number, y1O: number, y2O: number, y3O: number, y4O: number, y5O: number){
    if (y1 != 0 && program.Y1 == 0){
        program.Y1 = y1;
        program.Y1O = y1O;
    }
    if (y2 != 0 && program.Y2 == 0){
        program.Y2 = y2;
        program.Y2O = y2O;
    }
    if (y3 != 0 && program.Y3 == 0){
        program.Y3 = y3;
        program.Y3O = y3O;
    }
    if (y4 != 0 && program.Y4 == 0){
        program.Y4 = y4;
        program.Y4O = y4O;
    }
    if (y5 != 0 && program.Y5 == 0){
        program.Y5 = y5;
        program.Y5O = y5O;
    }
    if (y5 == 0 && program.Y5 == 0){
        program.Y5 = program.Y4;
        program.Y5O = program.Y4O;
    }
}
// Parse pdf
const url : string = "https://registrar.uwo.ca/student_finances/fees_refunds/2025-FW-UGRD-FT-Fee-Schedule-CDN4.pdf";
const parser = new PDFParse({url: url });
const result = await parser.getText({parsePageInfo: true});
const text = result.text;
await parser.destroy();

// Begin parsing line by line
result.pages.forEach((page) => {
    const out = page.text.split("\n");
    
    // Required variables
    var Name : string = "";
    var y1: number = 0;
    var y2: number = 0;
    var y3: number = 0;
    var y4: number = 0;
    var y5: number = 0;
    var y1O: number = 0;
    var y2O: number = 0;
    var y3O: number = 0;
    var y4O: number = 0;
    var y5O: number = 0;
    var flag1 : boolean = false;
    var flag2 : boolean = false;
    var flag3 : boolean = false;
    var flag4 : boolean = false;
    var flag5: boolean = false;

    out.forEach((line) => {
        // Weird parsing errors
            if (line.includes("Arts, Social Science")){
                const program : Program | undefined = findProgram("");
                if (program !== undefined) program.Name = "Arts, Social Science, Media & Communication Studies";
            }
        
        // Parse if it contains the word year
        if (containsYear(line)){
            // Break the line into an array
            const row: Array<string> = line.split(" ");
            // Word position
            var pos : number = 0;

            let notReadingYears :boolean =  row[pos] !== "Upper" && row[pos]?.toLowerCase() !== "year" && row[pos]?.toLowerCase() !== "years" && row[pos] !== "All";
            // Still adding years to a program and a new program appears.
            if (Name !== "" && notReadingYears){
                const program: Program | undefined = findProgram(Name.trim());
                // Unique program, does not already exist, so create a new program and push
                if (program === undefined){
                    const p = new Program(Name.trim(), y1, y2, y3, y4, y5, y1O, y2O, y3O, y4O, y5O);
                    arr.push(p);
                }
                else{
                    setProgram(program, Name, y1,y2, y3, y4, y5, y1O, y2O, y3O, y4O, y5O);
                }
                Name = "";
                y1 = 0;
                y2 = 0;
                y3 = 0;
                y4 = 0;
                y5 = 0;
                y1O = 0;
                y2O = 0;
                y3O = 0;
                y4O = 0;
                y5O = 0;
                flag1 = false;
                flag2 = false;
                flag3 = false;
                flag4 = false;
                flag5 = false;
            }
            // Parse a new program name
            while (notReadingYears) {
                Name = Name + row[pos] + " ";
                pos ++;
                notReadingYears = row[pos] !== "Upper" && row[pos]?.toLowerCase() !== "year" && row[pos]?.toLowerCase() !== "years" && row[pos] !== "All";
            }

            // Applicable years for this tuition
            while (!row[pos]!!.includes(",")){
                // All Years
                if (row[pos] == "All"){
                    flag1 = flag2 = flag3 = flag4 = flag5 = true;
                }
                // Upper years of a previously mentioned program
                if (row[pos] == "Upper"){
                    flag2 = flag3 = flag4 = flag5 = true;
                }
                // Year 1
                else if (row[pos] == '1'){
                    flag1 = true;
                }
                // Year 2
                else if (row[pos] == '2'){
                    flag2 = true;
                }
                // year 3
                else if (row[pos] == '3'){
                    flag3 = true;
                }
                else if (row[pos] == '4'){
                    flag4 = true;
                }
                else if (row[pos] == '5'){
                    flag5 = true;
                }
                pos ++;
            }

            // Flag for out of province students, it is the second price.
            var flagout : boolean = false;
            // flag as the first price is including all add ons (bus pass etc)
            var total: boolean = true;
            // parse the tuition, Tuition costs are in the thousands so stop at the hundreds
            while (row[pos]!!.includes(",")){
                if (!total){
                    const price : string = row[pos]!!.replace("," , "");
                    if (flag1){
                        if (flagout && y1O == 0) y1O = parseInt(price);
                        else if (y1 == 0 ) y1 = parseInt(price);
                    }
                    
                    if (flag2){
                        if (flagout && y2O == 0) y2O = parseInt(price);
                        else if (y2 == 0) y2 = parseInt(price);
                    }

                    if (flag3){
                        if (flagout && y3O == 0) y3O = parseInt(price);
                        else if (y3==0) y3 = parseInt(price);
                    }

                    if (flag4){
                        if (flagout && y4O==0) y4O = parseInt(price);
                        else if (y4==0) y4 = parseInt(price);
                    }

                    if (flag5){
                        if (flagout && y5O == 0) y5O = parseInt(price);
                        else if (y5 == 0) y5 = parseInt(price);
                    }
                    flagout = !flagout;
                }
                total = !total;
                pos ++;
            }

            // Reset
            if (flag4 || flag5){
                const program: Program | undefined = findProgram(Name.trim());
                // Unique program, does not already exist, so create a new program and push
                if (program === undefined){
                    const p = new Program(Name.trim(), y1, y2, y3, y4, y5, y1O, y2O, y3O, y4O, y5O);
                    arr.push(p);
                }
                else{
                    setProgram(program, Name, y1,y2, y3, y4, y5, y1O, y2O, y3O, y4O, y5O);
                }
                Name = "";
                y1 = 0;
                y2 = 0;
                y3 = 0;
                y4 = 0;
                y5 = 0;
                y1O = 0;
                y2O = 0;
                y3O = 0;
                y4O = 0;
                y5O = 0;
                flag1 = false;
                flag2 = false;
                flag3 = false;
                flag4 = false;
                flag5 = false;
            }
        }
    });
})
console.log(arr);
const err = insertProgramRows("Tuition", arr);







