import { DBService } from "../database/DBService";
import { PromptService } from "../prompt/PromptService";

export class QuestionResponse {
  public summary: any;
  public table: any;
  promptObject: PromptService;
  dbObject: DBService;

  constructor() {
    this.dbObject = new DBService({
      host: process.env.DB_HOST,
      port: 5432,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    this.promptObject = new PromptService();
  }
  async queResponse(question: string, sqlQuery: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.dbObject
        .queryDatabase(sqlQuery)
        .then((tableResponse) => {
          if (tableResponse) {
            //console.log("SQL Query Response", tableResponse.rows);
            this.table = tableResponse.rows;
            this.promptObject
              .summarizeResponse(question, tableResponse.rows)
              .then((summResponse) => {
                if (summResponse) {
                  //console.log("Summary is : ", summResponse);
                  this.summary = summResponse.res.text;
                  resolve("this is resolve");
                } else {
                  console.log("No summary Generated");
                  resolve("");
                }
              })
              .catch((error) => {
                console.error("Error occured while summarising", error);
                reject("Error occurred while summarising: " + error);
              });
          } else {
            console.log("No result found !");
            reject("No result found!");
          }
        })
        .catch((error) => {
          console.log("Error executing SQL query", error);
          reject("Error executing SQL query: " + error);
        });
    });
  }
}
