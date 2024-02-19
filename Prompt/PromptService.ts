import * as fs from "fs";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "langchain/llms/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { RetrievalQAChain } from "langchain/chains";
import { ChatCompletionStream } from "openai/lib/ChatCompletionStream";
import dotenv from "dotenv";
import { raw } from "express";

dotenv.config();

export class PromptService {
  private vectorStore: HNSWLib | undefined;
  private model: OpenAI;
  private vectorStorePath: string;
  private openAIEmbeddings: OpenAIEmbeddings;
  private rawData: string;
  private jsonData: any;

  constructor() {
    this.openAIEmbeddings = new OpenAIEmbeddings();
    this.model = new OpenAI({});
    this.vectorStorePath = "./docs/data.index";
    this.rawData = fs.readFileSync("prompts.json", "utf8");
    console.log("rawData", this.rawData);
    this.jsonData = JSON.parse(this.rawData);
    console.log("jsonData", this.jsonData);
  }

  async createSqlQuery(question: string) {
    console.log("createSqlQueryFromQuestion");
    const fileExists: boolean = await this.checkFileExists(
      this.vectorStorePath
    );

    if (fileExists) {
      console.log("Loading Vector Store");
      this.vectorStore = await HNSWLib.load(
        this.vectorStorePath,
        this.openAIEmbeddings
      );
      const chain = RetrievalQAChain.fromLLM(
        this.model,
        this.vectorStore.asRetriever()
      );

      const prompt = this.parseMessage(this.jsonData.prompt_sql, question);
      console.log("THis is prompt :", prompt);
      var res = await chain.call({
        query: prompt,
      });

      console.log("response before ->", res);
      // Properly format the SQL query
      res.text = res.text.trim(); // Remove leading and trailing whitespace
      res.text = res.text.replace(/\n+/g, " "); // Replace multiple consecutive newlines with a single space
      res.text = res.text.replace(/\s+/g, " "); // Replace multiple consecutive spaces with a single space
      console.log("response after ->", res);
      return {
        res,
      };
    }
  }

  async checkFileExists(filePath: string): Promise<boolean> {
    try {
      fs.accessSync(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  async summarizeResponse(question: string, answer: any) {
    //prompt
    console.log("Loading Vector Store for summarizer");
    this.vectorStore = await HNSWLib.load(
      this.vectorStorePath,
      this.openAIEmbeddings
    );
    const chain = RetrievalQAChain.fromLLM(
      this.model,
      this.vectorStore.asRetriever()
    );
    const prompt = this.parseMessage(
      this.jsonData.prompt_summarize,
      question,
      JSON.stringify(answer)
    );
    var res = await chain.call({
      query: prompt,
    });

    console.log("Summarized text ->", res.text);
    return {
      res,
    };
  }
  parseMessage(
    unformatedPrompt: string,
    ...args: string[]
  ): string | undefined {
    console.log("\nUnformated Prompt :", unformatedPrompt);
    console.log("\nthis is args", args);
    for (var index in args) {
      console.log("\nthis is args[index]", args[index]);
      var stringToReplace = `{${index}}`;
      console.log("\nthis is stringtoreplace", stringToReplace);
      unformatedPrompt = unformatedPrompt.replace(stringToReplace, args[index]);
      console.log("\nFormated Prompt: ", unformatedPrompt);
    }
    return unformatedPrompt;
  }
}

// const object = new PromptService();
// const sqlQueryObtained = object.createSqlQuery("Give me name of all users");

//console.log(typeof queryResponse);
//parseMessage(jsonData.prompt_ask_llm,"how many students")
