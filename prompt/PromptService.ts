import * as fs from "fs";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "@langchain/openai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { RetrievalQAChain } from "langchain/chains";
import "dotenv/config";

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
    // console.log(`Current directory: ${process.cwd()}`);
    const path = require("path");
    const promptsPath = path.join(__dirname, "prompts.json");
    //console.log("this is promptsPath re :", promptsPath);
    this.rawData = fs.readFileSync(promptsPath, "utf8");
    // this.rawData = fs.readFileSync("prompts.json", "utf8");
    // console.log("rawData", this.rawData);
    this.jsonData = JSON.parse(this.rawData);
    // console.log("jsonData", this.jsonData);
  }

  async createSqlQuery(question: string) {
    // console.log("createSqlQueryFromQuestion");
    const fileExists: boolean = await this.checkFileExists(
      this.vectorStorePath
    );

    if (fileExists) {
      //console.log("Loading Vector Store");
      this.vectorStore = await HNSWLib.load(
        this.vectorStorePath,
        this.openAIEmbeddings
      );
      const chain = RetrievalQAChain.fromLLM(
        this.model,
        this.vectorStore.asRetriever()
      );

      const prompt = this.parseMessage(this.jsonData.prompt_sql, question);
      // console.log("This is prompt :", prompt);
      var response = await chain.call({
        query: prompt,
      });

      // console.log("response before ->", response);
      response.text = response.text.trim();
      response.text = response.text.replace(/\n+/g, " ");
      response.text = response.text.replace(/\s+/g, " ");
      // console.log("response after ->", response);
      return {
        response,
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
    // console.log("Loading Vector Store for summarizer");
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
    var response = await chain.call({
      query: prompt,
    });

    // console.log("Summarized text ->", response.text);
    return {
      response,
    };
  }

  parseMessage(
    unformatedPrompt: string,
    ...args: string[]
  ): string | undefined {
    // console.log("\nUnformated Prompt :", unformatedPrompt);
    // console.log("\nthis is args", args);
    for (var index in args) {
      // console.log("\nthis is args[index]", args[index]);
      var stringToReplace = `{${index}}`;
      // console.log("\nthis is stringtoreplace", stringToReplace);
      unformatedPrompt = unformatedPrompt.replace(stringToReplace, args[index]);
      // console.log("\nFormated Prompt: ", unformatedPrompt);
    }
    var formatedPrompt: string = unformatedPrompt;
    return formatedPrompt;
  }
}
