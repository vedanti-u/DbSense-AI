import * as fs from "fs";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "@langchain/openai";
<<<<<<< Updated upstream
import { HNSWLib } from "langchain/vectorstores/hnswlib";
require('dotenv').config();

=======
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import dotenv from "dotenv";
dotenv.config();
>>>>>>> Stashed changes

export class LLMService {
  public tables: { [key: string]: string };
  private vectorStore: HNSWLib | undefined;
  private model: OpenAI;
  private vectorStorePath: string;
  private openAIEmbeddings: OpenAIEmbeddings;

  constructor() {
    this.tables = {};
    this.openAIEmbeddings =  new OpenAIEmbeddings()

    this.model = new OpenAI({});
    this.vectorStorePath = "dist/docs/data.index";
  }

  public async createTable(sqlQueryForTable: string) {
    sqlQueryForTable.replace(/\n|\+/g, "");
    const tableName = this.extractTableNameFromCreateQuery(sqlQueryForTable);
    if (tableName) {
<<<<<<< Updated upstream
     console.log("Table name: ", tableName);
=======
      // console.log("Table name: ", tableName);
>>>>>>> Stashed changes
      this.tables[tableName] = sqlQueryForTable;
    } else {
      // console.log("Table name not found");
    }
    console.log(this.tables);
    await this.deleteFile(this.vectorStorePath);
    await this.createVectorEmbeddings(
      this.tableObjToStringConvertor(this.tables)
    );
  }

  public async updateTable(sqlQueryForTable: string) {
    sqlQueryForTable.replace(/\n|\+/g, "");
    const tableName = this.extractTableNameFromUpdateQuery(sqlQueryForTable);
    if (tableName) {
<<<<<<< Updated upstream
     // console.log("Table name: ", tableName);
      this.tables[tableName] = sqlQueryForTable;
    } else {
      //console.log("Table name not found");
=======
      // console.log("Table name: ", tableName);
      this.tables[tableName] = sqlQueryForTable;
    } else {
      // console.log("Table name not found");
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
     // console.log("Vector Store Already Exist");
=======
      // console.log("Vector Store Already Exist");
>>>>>>> Stashed changes
      this.vectorStore = await HNSWLib.load(
        this.vectorStorePath,
        this.openAIEmbeddings
      );
<<<<<<< Updated upstream
      //console.log("this is vectorStore", this.vectorStore);
    } else {
      //console.log("Creating Vector Store");
=======
      // console.log("this is vectorStore", this.vectorStore);
    } else {
      // console.log("Creating Vector Store");
>>>>>>> Stashed changes

      const textSpiltter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
      });
      const docs = await textSpiltter.createDocuments([tableString]);
      this.vectorStore = await HNSWLib.fromDocuments(
        docs,
        this.openAIEmbeddings
      );
      await this.vectorStore.save(this.vectorStorePath);
<<<<<<< Updated upstream
     // console.log("Succesfully create vector store ");
=======
      // console.log("Succesfully create vector store ");
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      //console.log("File deleted successfully.");
=======
      // console.log("File deleted successfully.");
>>>>>>> Stashed changes
    } catch (error) {
      // console.error("Error deleting file:", error);
    }
  }
}
