import { SupabaseClient, createClient } from "@supabase/supabase-js";
import 'dotenv/config';
import { Program } from "./parser.js";

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
    .upsert(program)
    
    if (error) {
        throw new Error("Error inserting into the database: " + error);
    }
    else{
        console.log("Inserted Successfully");
    }
}

export default supabase;