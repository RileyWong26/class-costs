import { SupabaseClient, createClient } from "@supabase/supabase-js";
import 'dotenv/config';
import { Program } from "@/features/parser/parser.tuition-costs.js";

// Fetch keys from env file
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Check keys exist
if (!supabaseKey || !supabaseUrl){
    throw new Error("URL or KEY is invalid");
}


export const supabase = createClient(supabaseUrl, supabaseKey);


// Insert into the database overwriting any already existing keys
export async function insertProgramRows(Table: string, program: Array<Program>){
    const {data, error} = await supabase
    .from(Table)
    .upsert(program);
    
    if (error) {
        throw new Error("Error inserting into the database: " + error);
    }
    else{
        console.log("Inserted Successfully");
    }
}

// Fetch the keys from a table
export async function getKeys(Table: string, keyName: string) {
    interface keyItem{
        [keyName]: any
    }
    const {data, error} : {data: keyItem[] | null , error: any} = await supabase 
        .from(Table)
        .select(keyName)
    if(error ){
        throw new Error("Error fetching the keys from the database: " + error);
    }
    else if (!data) throw new Error("There is no data in the table");

    // Extract the keys from the json format and return it as an array
    data.map((key : keyItem ) => {console.log(key[keyName])})
    return data;
}


export default supabase;