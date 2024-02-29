import { DBService } from "./database/DBService";
import { LLMService } from "./llm/LLMService";
import { PromptService } from "./prompt/PromptService";
import { QuestionResponse } from "./model/QuestionResponse";
export class Dbai {
  private dbService: DBService;
  private promptService: PromptService;
  private llmService: LLMService;

  constructor() {
    this.dbService = new DBService({
      host: process.env.DB_HOST,
      port: 5432,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    this.promptService = new PromptService();
    this.llmService = new LLMService();
  }

  async createTable(createQuery: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.llmService
        .createTable(createQuery)
        .then(() => {
          console.log("Table & Vector Embeddings created successfully!");
          resolve(true);
        })
        .catch((error) => {
          console.error("Error creating table:", error);
          reject(error);
        });
    });
  }
  async updateTable(updateQuery: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.llmService
        .updateTable(updateQuery)
        .then(() => {
          console.log("Table & Vector Embeddings updates successfully!");
          resolve(true);
        })
        .catch((error) => {
          console.error("Error updating table:", error);
          reject(error);
        });
    });
  }

  async ask(question: string): Promise<QuestionResponse> {
    return new Promise<QuestionResponse>(async (resolve, reject) => {
      try {
        var sqlResponse = await this.promptService.createSqlQuery(question);
        if (sqlResponse) {
          let questionRespomse: QuestionResponse = new QuestionResponse();
          var table = await this.dbService.queryDatabase(
            sqlResponse.response.text
          );
          questionRespomse.table = table.rows;
          var summary = await this.promptService.summarizeResponse(
            question,
            table.rows
          );
          questionRespomse.summary = summary.response.text;
          resolve(questionRespomse);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
module.exports = Dbai;
