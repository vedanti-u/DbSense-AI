import { resolve } from 'path';
import { Client, QueryResult } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
type dbconfig = {
   host: string | undefined;
   port: number | undefined;
   database: string | undefined;
   user: string | undefined;
   password: string | undefined;
};

export class DBService{
    private connection : dbconfig;
    private client : Client;
    constructor(connection: dbconfig){
        this.connection = connection;
        this.client = new Client(connection);
        this.connect();
    }
    
    private async connect(){
        await this.client.connect();
    }


    public async queryDatabase(inputQuery: string): Promise<QueryResult> {
        return new Promise<QueryResult>((resolve, reject) => {
            //console.log(this.client.host);
            this.client.query(inputQuery)
                .then((result: QueryResult) => {
                    console.log("Query Executed Successfully !");
                    console.log("Number of rows returned:", result.rowCount);
                    console.log("Command type:", result.command);
    
                    console.log("Rows:");
    
                    for (const row of result.rows) {
                        console.log(row);
                    }
    
                    console.table(result.rows);
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

const object = new DBService({
    host: process.env.DB_HOST,
    port: 5432,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

object.queryDatabase("select * from students").then( e => console.log(e)).catch( error => console.error(error));

