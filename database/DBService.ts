import { resolve } from "path";
import { Client, QueryResult } from "pg";
import "dotenv/config";
type dbconfig = {
  host: string | undefined;
  port: number | undefined;
  database: string | undefined;
  user: string | undefined;
  password: string | undefined;
};

export class DBService {
  private connection: dbconfig;
  private client: Client;
  constructor(connection: dbconfig) {
    this.connection = connection;
    this.client = new Client(connection);
    this.connect();
  }

  private async connect() {
    await this.client.connect();
  }

  public async queryDatabase(inputQuery: string): Promise<QueryResult> {
    return new Promise<QueryResult>((resolve, reject) => {
      this.client
        .query(inputQuery)
        .then((result: QueryResult) => {
          //console.log("Query Executed Successfully !");
          //console.log("Number of rows returned:", result.rowCount);
          //console.log("Command type:", result.command);

          //console.log("Rows:");

          // for (const row of result.rows) {
          //   console.log(row);
          // }

          //console.table(result.rows);
          resolve(result);
        })
        .catch((err) => {
          console.error("Error Executing Query: ", err);
          reject(err);
        })
        .finally(() => {
          this.client.end();
        });
    });
  }
}
