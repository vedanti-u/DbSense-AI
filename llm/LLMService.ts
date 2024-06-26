import * as fs from "fs";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "@langchain/openai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import "dotenv/config";
import { env } from "process";

export class LLMService {
  public tables: { [key: string]: string };
  private vectorStore: HNSWLib | undefined;
  private model: OpenAI;
  private vectorStorePath: string;
  private openAIEmbeddings: OpenAIEmbeddings;

  constructor() {
    this.tables = {};
    this.openAIEmbeddings = new OpenAIEmbeddings();
    this.model = new OpenAI({});
    this.vectorStorePath = "./docs/data.index";
  }

  public async createTable(sqlQueryForTable: string) {
    //console.log("key ye hai ", env.OPENAI_API_KEY);
    sqlQueryForTable.replace(/\n|\+/g, "");
    const tableName = this.extractTableNameFromCreateQuery(sqlQueryForTable);
    if (tableName) {
      //console.log("Table name: ", tableName);
      this.tables[tableName] = sqlQueryForTable;
    } else {
      //console.log("Table name not found");
    }
    //console.log(this.tables);
    await this.deleteFile(this.vectorStorePath);
    await this.createVectorEmbeddings(
      this.tableObjToStringConvertor(this.tables)
    );
  }

  public async updateTable(sqlQueryForTable: string) {
    sqlQueryForTable.replace(/\n|\+/g, "");
    const tableName = this.extractTableNameFromUpdateQuery(sqlQueryForTable);
    if (tableName) {
      // console.log("Table name: ", tableName);
      this.tables[tableName] = sqlQueryForTable;
    } else {
      // console.log("Table name not found");
    }
    await this.deleteFile(this.vectorStorePath);
    await this.createVectorEmbeddings(
      this.tableObjToStringConvertor(this.tables)
    );
  }

  private extractTableNameFromCreateQuery(
    sqlQueryForTable: string
  ): string | null {
    const regex = /CREATE\s+TABLE\s+(\S+)/i;
    const match = sqlQueryForTable.match(regex);
    if (match && match.length > 1) {
      return match[1];
    }
    return null;
  }

  private extractTableNameFromUpdateQuery(
    sqlQueryForTable: string
  ): string | null {
    const regex = /UPDATE\s+TABLE\s+(\S+)/i;
    const match = sqlQueryForTable.match(regex);
    if (match && match.length > 1) {
      return match[1];
    }
    return null;
  }

  private tableObjToStringConvertor(tableObj: {
    [key: string]: string;
  }): string {
    let resultString = "";
    for (const key in tableObj) {
      if (Object.prototype.hasOwnProperty.call(tableObj, key)) {
        const value = tableObj[key];
        resultString += value;
      }
    }
    return resultString;
  }

  async createVectorEmbeddings(tableString: string) {
    const fileExists: boolean = await this.checkFileExists(
      this.vectorStorePath
    );

    if (fileExists) {
      //console.log("Vector Store Already Exist");
      this.vectorStore = await HNSWLib.load(
        this.vectorStorePath,
        this.openAIEmbeddings
      );
      //console.log("this is vectorStore", this.vectorStore);
    } else {
      //console.log("Creating Vector Store");

      const textSpiltter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
      });
      const docs = await textSpiltter.createDocuments([tableString]);
      this.vectorStore = await HNSWLib.fromDocuments(
        docs,
        this.openAIEmbeddings
      );
      await this.vectorStore.save(this.vectorStorePath);
      //console.log("Succesfully create vector store ");
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
  async deleteFile(filePath: string): Promise<void> {
    try {
      fs.rmSync(filePath, { recursive: true });
      //console.log("File deleted successfully.");
    } catch (error) {
      //console.error("Error deleting file:", error);
    }
  }
}
