import { PdfReader } from "pdfreader";
import { getKeys } from "@/shared/supabase.js";

// Type declarations
interface parsedTranscript{
        "years" : number,
        "plans" : string[],
};

// Parse the transcript for all available plans and current years of study.
function parser (transcript: Express.Multer.File , plans: string[], years: number) : Promise<parsedTranscript>{
    return new Promise((resolve, reject) => {
        // Create reader
        const reader = new PdfReader();

        let flag = false;
        let plan = "";

        // Begin parsing 
        reader.parseBuffer(transcript?.buffer, (err, item) => {

            // If the parsing stream exists with text
            if (item && item.text){
                const line = item.text;
                // console.log("NEW" + line);

                // Flag to begin parsing the plan
                if (line === "Plan:"){
                    flag = true
                }
                // Parse the text;
                else if (flag){
                    // Empty line done parsing the plan
                    if (line === "\n" || line === " " || line === ""){
                        flag = false;
                        plans.push(plan);
                        plan = "";
                    }
                    else{
                        plan += line;
                    }


                }
                // Parse each year and count it
                else if (line.includes("Fall/Winter")){
                    years += 1;
                }
            }
            else if (!item){
                resolve({
                    "years": years,
                    "plans": plans,
                });
            }
        });
    });
}

// Find the program 
function findTuition(programs: string[], plans : string[]): string{
    if (!plans) return "";
    // Stack
    let plan: string | undefined = plans.pop();

    // Found the most recent paid tuition
    while (plans.length > 0 && !plan?.includes("Bachelor")){
        plan = plans.pop();
    }

    // Match the plan to a program
    for (let i = 0; i<programs.length; i++){
        // if(plan?.includes())
    }
    
    return plan || "";

}


export default async function parseTranscript(transcript: Express.Multer.File | undefined){
    if (!transcript?.buffer) throw new Error("File upload failed.  No File was received");

    // Fetch keys
    const tableName = "Tuition";
    const keyName = "Name"
    const programs = getKeys(tableName, keyName)
        .then((data) => {return data; })
        .catch((err) => {console.log(err); })
    
    // Parse the number of years and list of plans
    let plans: string[] = [];
    let years: number = 0;
    const extracted : boolean  = await parser(transcript, plans, years)
        .then((res) => {
            years = res.years; 
            plans = res.plans;
            return true;
        });

    // When processed the transcript, now have to process the plans to find the tuition
    if (extracted) { 
        // const plan = findTuition(programs, plans);
        // console.log(plan);
    }
}