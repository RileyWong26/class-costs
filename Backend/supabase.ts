import { SupabaseClient, createClient } from "@supabase/supabase-js";
import 'dotenv/config';
import { Program } from "./parser.js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseKey || !supabaseUrl){
    throw new Error("URL or KEY is invalid");
}
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function insertProgramRows(Table: string, program: Array<Program>){
    const {data, error} = await supabase
    .from(Table)
    .insert(program)
    
    if (error) {
        console.log("Error " + error.message);
    }
    else{
        console.log("Inserted Successfully");
    }
}

export default supabase;