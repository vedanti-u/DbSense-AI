import path from "path";
import * as fs from "fs/promises";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "langchain/llms/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { RetrievalQAChain } from "langchain/chains";
import dotenv from "dotenv";
import { Client, QueryResult } from "pg";

require('dotenv').config();

const tables: { [key: string]: string } = {};

let vectorStore: HNSWLib;
const model = new OpenAI({});
const VECTOR_STORE_PATH = "dist/docs/data.index";
const openAIEmbeddings = new OpenAIEmbeddings();

function createTable(sqlQuery: string): void {
  //llm
  sqlQuery.replace(/\n|\+/g, "");
  const tableName = extractTableName(sqlQuery);
  if (tableName) {
    // console.log("Table name:", tableName);
    tables[tableName] = sqlQuery;
  } else {
    // console.log("Table name not found.");
  }
  // console.log(tables);
}

function extractTableName(sqlQuery: string): string | null {
  //llm
  const regex = /CREATE\s+TABLE\s+(\S+)/i;
  const match = sqlQuery.match(regex);
  if (match && match.length > 1) {
    return match[1];
  }
  return null;
}

function tableMapToStringConvertor(jsonObj: { [key: string]: string }): string {
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

async function createVectorEmbeddings(tableString: string) {
  //llm
  const fileExists: boolean = await checkFileExists(VECTOR_STORE_PATH);

  if (fileExists) {
    // console.log("Vector Store Already Exist");
    vectorStore = await HNSWLib.load(VECTOR_STORE_PATH, openAIEmbeddings);
    // console.log("this is vectorStore", vectorStore);
  } else {
    // console.log("Creating Vector Store");

    const textSpiltter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    const docs = await textSpiltter.createDocuments([tableString]);
    vectorStore = await HNSWLib.fromDocuments(docs, openAIEmbeddings);
    await vectorStore.save(VECTOR_STORE_PATH);
    // console.log("this is vectorStore", vectorStore);
    // console.log("succesfully create vector store ");
  }
}

async function checkFileExists(filePath: string): Promise<boolean> {
  //llm
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

async function createSqlQueryFromQuestion(question: string) {
  //prompt
  // console.log("createSqlQueryFromQuestion");
  const fileExists: boolean = await checkFileExists(VECTOR_STORE_PATH);

  if (fileExists) {
    // console.log("Loading Vector Store");
    vectorStore = await HNSWLib.load(VECTOR_STORE_PATH, openAIEmbeddings);
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
    const prompt = `
         Considering the schema provided

         Answer the following question using SQL:
         
         Question: ${question}
         
         Your SQL query should retrieve the requested information without any additional characters or spaces. 
         Remove any delimiter if present like "\n" or \n or newline character.
         Please ensure the query is formatted correctly and only includes the necessary components.
     `;
    var res = await chain.call({
      query: prompt,
    });

    // console.log("response before ->", res);
    // Properly format the SQL query
    res.text = res.text.trim();
    res.text = res.text.replace(/\n+/g, " ");
    res.text = res.text.replace(/\s+/g, " ");
    // console.log("response after ->", res);
    return {
      res,
    };
  }
}



async function summarizeQuestionwithResponse(question: string, answer: string) {
  // console.log("Loading Vector Store for summarizer");
  vectorStore = await HNSWLib.load(VECTOR_STORE_PATH, openAIEmbeddings);
  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
  const prompt = `
     Consider the following question:

        Question: ${question}

        Generate a summary for the response received below:

        Response: ${JSON.stringify(answer)}
 `;
  var res = await chain.call({
    query: prompt,
  });

  // console.log("Summarized text ->", res.text);
  return {
    res,
  };
}

console.log=function(){}
