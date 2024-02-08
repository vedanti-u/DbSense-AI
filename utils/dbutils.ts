import path from 'path';
import * as fs from 'fs/promises';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAI } from 'langchain/llms/openai';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { RetrievalQAChain } from 'langchain/chains';
import dotenv from 'dotenv';
dotenv.config();

const tables: { [key: string]: string } = {

};

let vectorStore : HNSWLib;
const model = new OpenAI({});
const VECTOR_STORE_PATH = './docs/data.index';
const openAIEmbeddings = new OpenAIEmbeddings();

function createTable(sqlQuery : string) : void {
    const tableName = extractTableName(sqlQuery);
    if (tableName) {
        console.log("Table name:", tableName);
        tables[tableName] = sqlQuery;
    } else {
        console.log("Table name not found.");
    }
    console.log(tables);
}
  
function extractTableName(sqlQuery: string): string | null {
    const regex = /CREATE\s+TABLE\s+(\S+)/i;
    const match = sqlQuery.match(regex);
    if (match && match.length > 1) {
        return match[1];
    }
    return null;
}

function tableMapToStringConvertor(jsonObj: { [key: string]: string }): string {
    let resultString = "";
    for (const key in jsonObj) {
        if (Object.prototype.hasOwnProperty.call(jsonObj, key)) {
            const value = jsonObj[key];
            resultString += value + "\n\n"; // Adding value followed by a newline character
        }
    }
    return resultString;
}



async function createVectorEmbeddings(tableString: string){
    const fileExists : boolean = await checkFileExists(VECTOR_STORE_PATH);

    if(fileExists){
        console.log("Vector Store Already Exist");
        vectorStore = await HNSWLib.load(VECTOR_STORE_PATH,openAIEmbeddings);   
        console.log("this is vectorStore", vectorStore);
    } else {
        console.log("Creating Vector Store");
        
        const textSpiltter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
        })
        const docs = await textSpiltter.createDocuments([tableString]);
        vectorStore = await HNSWLib.fromDocuments(docs, openAIEmbeddings);
        await vectorStore.save(VECTOR_STORE_PATH);
        console.log("this is vectorStore", vectorStore);
        console.log("succesfully create vector store ");
    }
}

async function checkFileExists(filePath : string) : Promise<boolean>{
    try{
        await fs.access(filePath);
        return true;
    } catch (error) {
        return false;
    }
}

async function createSqlQueryFromQuestion(question : string){
    console.log("createSqlQueryFromQuestion");
    const fileExists : boolean = await checkFileExists(VECTOR_STORE_PATH);

    if(fileExists){
        console.log("Loading Vector Store");
        vectorStore = await HNSWLib.load(VECTOR_STORE_PATH,openAIEmbeddings);   
        const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
         const prompt = `
         Considering the schema provided

         Answer the following question using SQL:
         
         Question: ${question}
         
         Your SQL query should retrieve the requested information without any additional characters or spaces. 
         Remove any delimeter if present like "\n" or \n or newline character.
         Please ensure the query is formatted correctly and only includes the necessary components.
     `;
;
        
        var res = await chain.call({
            query: prompt,
        });
        
        console.log("response before ->", res);
        const regex = /^\s*|\s*\\n\s*|\s*$/g;
        res.text = res.text.replace(regex, '');
        console.log("response after ->", res);
        return {
          res,
        };
    }
}

//const sqlQuery = "CREATE TABLE users (id INT, name VARCHAR(255))";


//createTable("CREATE TABLE users ( id INT PRIMARY KEY, username VARCHAR(50), email VARCHAR(100) );")
//createTable("CREATE TABLE products ( product_id INT PRIMARY KEY, name VARCHAR(255), price DECIMAL(10, 2) );")
//createTable("CREATE TABLE orders ( order_id INT PRIMARY KEY, customer_id INT, order_date DATE, total_amount DECIMAL(10, 2) );")
//createTable("Create a table student with attribute name, rollno, marks")
//createTable("CREATE TABLE users ( id INT PRIMARY KEY, username VARCHAR(100), email VARCHAR(100) );")

//console.log(tableMapToStringConvertor(tables))

//const tableString = tableMapToStringConvertor(tables);

//createVectorEmbeddings(tableString);
//createSqlQueryFromQuestion("Give me username of all users");
createTable(`CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    roll_no VARCHAR(20),
    dob DATE,
    attendance FLOAT,
    marks_maths INTEGER,
    marks_science INTEGER,
    marks_english INTEGER
);
`);
createTable(`CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    dept_name VARCHAR(100),
    no_of_courses INTEGER,
    no_of_students INTEGER,
    dept_course VARCHAR(100),
    dept_hod VARCHAR(100)
);
`);
