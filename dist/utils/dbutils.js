"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs/promises"));
const openai_1 = require("langchain/embeddings/openai");
const text_splitter_1 = require("langchain/text_splitter");
const openai_2 = require("langchain/llms/openai");
const hnswlib_1 = require("langchain/vectorstores/hnswlib");
const chains_1 = require("langchain/chains");
const pg_1 = require("pg");
require("dotenv/config");
const tables = {};
let vectorStore;
const model = new openai_2.OpenAI({});
const VECTOR_STORE_PATH = "./docs/data.index";
const openAIEmbeddings = new openai_1.OpenAIEmbeddings();
function createTable(sqlQuery) {
    //llm
    sqlQuery.replace(/\n|\+/g, "");
    const tableName = extractTableName(sqlQuery);
    if (tableName) {
        console.log("Table name:", tableName);
        tables[tableName] = sqlQuery;
    }
    else {
        console.log("Table name not found.");
    }
    console.log(tables);
}
function extractTableName(sqlQuery) {
    //llm
    const regex = /CREATE\s+TABLE\s+(\S+)/i;
    const match = sqlQuery.match(regex);
    if (match && match.length > 1) {
        return match[1];
    }
    return null;
}
function tableMapToStringConvertor(jsonObj) {
    //llm
    let resultString = "";
    for (const key in jsonObj) {
        if (Object.prototype.hasOwnProperty.call(jsonObj, key)) {
            const value = jsonObj[key];
            resultString += value;
        }
    }
    return resultString;
}
function createVectorEmbeddings(tableString) {
    return __awaiter(this, void 0, void 0, function* () {
        //llm
        const fileExists = yield checkFileExists(VECTOR_STORE_PATH);
        if (fileExists) {
            console.log("Vector Store Already Exist");
            vectorStore = yield hnswlib_1.HNSWLib.load(VECTOR_STORE_PATH, openAIEmbeddings);
            console.log("this is vectorStore", vectorStore);
        }
        else {
            console.log("Creating Vector Store");
            const textSpiltter = new text_splitter_1.RecursiveCharacterTextSplitter({
                chunkSize: 1000,
            });
            const docs = yield textSpiltter.createDocuments([tableString]);
            vectorStore = yield hnswlib_1.HNSWLib.fromDocuments(docs, openAIEmbeddings);
            yield vectorStore.save(VECTOR_STORE_PATH);
            console.log("this is vectorStore", vectorStore);
            console.log("succesfully create vector store ");
        }
    });
}
function checkFileExists(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        //llm
        try {
            yield fs.access(filePath);
            return true;
        }
        catch (error) {
            return false;
        }
    });
}
function createSqlQueryFromQuestion(question) {
    return __awaiter(this, void 0, void 0, function* () {
        //prompt
        //console.log("createSqlQueryFromQuestion");
        const fileExists = yield checkFileExists(VECTOR_STORE_PATH);
        if (fileExists) {
            //console.log("Loading Vector Store");
            vectorStore = yield hnswlib_1.HNSWLib.load(VECTOR_STORE_PATH, openAIEmbeddings);
            const chain = chains_1.RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
            const prompt = `
         Considering the schema provided

         Answer the following question using SQL:
         
         Question: ${question}
         
         Your SQL query should retrieve the requested information without any additional characters or spaces. 
         Remove any delimiter if present like "\n" or \n or newline character.
         Please ensure the query is formatted correctly and only includes the necessary components.
     `;
            var res = yield chain.call({
                query: prompt,
            });
            console.log("response before ->", res);
            // Properly format the SQL query
            res.text = res.text.trim();
            res.text = res.text.replace(/\n+/g, " ");
            res.text = res.text.replace(/\s+/g, " ");
            console.log("response after ->", res);
            return {
                res,
            };
        }
    });
}
function generateResponseFromDB(query) {
    return __awaiter(this, void 0, void 0, function* () {
        //db
        const client = new pg_1.Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT),
        });
        try {
            yield client.connect();
            const result = yield client.query(query);
            console.log("Query executed successfully!");
            console.log("Number of rows returned:", result.rowCount);
            console.log("Command type:", result.command);
            console.log("Rows:");
            for (const row of result.rows) {
                console.log(row);
            }
            console.table(result.rows);
            return result;
        }
        catch (err) {
            console.error("Error executing query:", err);
        }
        finally {
            yield client.end();
        }
    });
}
function summarizeQuestionwithResponse(question, answer) {
    return __awaiter(this, void 0, void 0, function* () {
        //console.log("Loading Vector Store for summarizer");
        vectorStore = yield hnswlib_1.HNSWLib.load(VECTOR_STORE_PATH, openAIEmbeddings);
        const chain = chains_1.RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
        const prompt = `
     Consider the following question:

        Question: ${question}

        Generate a summary for the response received below:

        Response: ${JSON.stringify(answer)}
 `;
        var res = yield chain.call({
            query: prompt,
        });
        console.log("Summarized text ->", res.text);
        return {
            res,
        };
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = "Give me name of all departments who has strength less than 100";
    const queryResponse = yield createSqlQueryFromQuestion(prompt);
    if (queryResponse && queryResponse.res && queryResponse.res.text) {
        const generatedRes = yield generateResponseFromDB(queryResponse.res.text);
        yield summarizeQuestionwithResponse(prompt, generatedRes.rows);
    }
    else {
        console.log("Query response is invalid");
    }
}))();
