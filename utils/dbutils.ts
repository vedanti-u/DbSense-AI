//setting up with supabase
const dotenv = require('dotenv');
dotenv.config();
const privatekey = process.env.PUBLIC_SUPABASE_PRIVATE_KEY;
const supabaseurl = process.env.PUBLIC_SUPABASE_URL;

if(!privatekey) throw new Error(`Expected env variable : PUBLIC_SUPABASE_PRIVATE_KEY`);

if(!supabaseurl) throw new Error(`Expected env variable : PUBLIC_SUPABASE_URL`);


function createTable(sqlquery : string) : void {
    
}

createTable("Create a table student with attribute name, rollno, marks")