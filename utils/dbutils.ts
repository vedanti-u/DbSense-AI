import path from 'path';
import * as fs from 'fs/promises';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAI } from 'langchain/llms/openai';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { RetrievalQAChain } from 'langchain/chains';
import dotenv from 'dotenv';
import { Client, QueryResult } from 'pg';

dotenv.config();

const tables: { [key: string]: string } = {

};

// const client = new Client({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_DATABASE,
//     password: process.env.DB_PASSWORD,
//     port: 5432,
// });

// client.connect();

let vectorStore : HNSWLib;
const model = new OpenAI({});
const VECTOR_STORE_PATH = './docs/data.index';
const openAIEmbeddings = new OpenAIEmbeddings();

function createTable(sqlQuery : string) : void { //llm
    sqlQuery.replace(/\n|\+/g, '');
    const tableName = extractTableName(sqlQuery);
    if (tableName) {
        console.log("Table name:", tableName);
        tables[tableName] = sqlQuery;
    } else {
        console.log("Table name not found.");
    }
    console.log(tables);
}
  
function extractTableName(sqlQuery: string): string | null { //llm
    const regex = /CREATE\s+TABLE\s+(\S+)/i;
    const match = sqlQuery.match(regex);
    if (match && match.length > 1) {
        return match[1];
    }
    return null;
}

function tableMapToStringConvertor(jsonObj: { [key: string]: string }): string { //llm
    let resultString = "";
    for (const key in jsonObj) {
        if (Object.prototype.hasOwnProperty.call(jsonObj, key)) {
            const value = jsonObj[key];
            resultString += value; // Adding value followed by a newline character
        }
    }
    return resultString;
}



async function createVectorEmbeddings(tableString: string){ //llm
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

async function checkFileExists(filePath : string) : Promise<boolean>{ //llm
    try{
        await fs.access(filePath);
        return true;
    } catch (error) {
        return false;
    }
}

async function createSqlQueryFromQuestion(question : string){ //prompt
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
         Remove any delimiter if present like "\n" or \n or newline character.
         Please ensure the query is formatted correctly and only includes the necessary components.
     `;
;
           
        var res = await chain.call({
            query: prompt,
        });
        
        console.log("response before ->", res);
        // Properly format the SQL query
        res.text = res.text.trim(); // Remove leading and trailing whitespace
        res.text = res.text.replace(/\n+/g, ' '); // Replace multiple consecutive newlines with a single space
        res.text = res.text.replace(/\s+/g, ' '); // Replace multiple consecutive spaces with a single space
        console.log("response after ->", res);
        return {
          res,
        };
    }
}

async function generateResponseFromDB(query: string){  //db
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: 5432,
    });

    try {
        await client.connect();

        const result: QueryResult = await client.query(query);

        console.log("Query executed successfully!");
        console.log("Number of rows returned:", result.rowCount);
        console.log("Command type:", result.command);

        console.log("Rows:");

        for(const row of result.rows){
            console.log(row);
        }

        console.table(result.rows); 
        return result;
    } catch (err) {
        console.error("Error executing query:", err);
    } finally {
        await client.end();
    }
}

async function summarizeQuestionwithResponse(question : string, answer : string){ //prompt
    console.log("Loading Vector Store for summarizer");
    vectorStore = await HNSWLib.load(VECTOR_STORE_PATH,openAIEmbeddings);   
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
     const prompt = `
     Consider the following question:

        Question: ${question}

        Generate a summary for the response received below:

        Response: ${JSON.stringify(answer)}
 `;
;
    
    var res = await chain.call({
        query: prompt,
    });

    console.log("Summarized text ->", res.text);
    return {
      res,
    };
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
//createTable("CREATE TABLE students (id SERIAL PRIMARY KEY,first_name VARCHAR(50),roll_no VARCHAR(20),dob DATE,attendance FLOAT,marks_maths INTEGER,marks_science INTEGER,marks_english INTEGER);");
//createTable("CREATE TABLE departments (id SERIAL PRIMARY KEY,dept_name VARCHAR(100),no_of_courses INTEGER,no_of_students INTEGER,dept_course VARCHAR(100),dept_hod VARCHAR(100));");
//const tableString = tableMapToStringConvertor(tables);
//createVectorEmbeddings(tableString);
//createSqlQueryFromQuestion("which department has lowest number of courses");
//createSqlQueryFromQuestion("which department has course quantum mechanics");


(async () => {
    const prompt : string = "Give me name of all departments who has strength less than 100";
    const queryResponse = await createSqlQueryFromQuestion(prompt);
    //console.log(typeof queryResponse);
    if (queryResponse && queryResponse.res && queryResponse.res.text) {
        const generatedRes : any  = await generateResponseFromDB(queryResponse.res.text);
        await summarizeQuestionwithResponse(prompt, generatedRes.rows );
    } else {
        console.log("Query response is invalid");
    }
})();


//generateResponseFromDB(queryResponse.text);