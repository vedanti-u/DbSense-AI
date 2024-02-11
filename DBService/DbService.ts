import { Client, QueryResult } from 'pg';
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


    public async generateResponseFromDB(inputQuery : string) :Promise<QueryResult<any> | undefined>{
        try{
            const result: QueryResult = await this.client.query(inputQuery);
            console.log("Query Executed Successfully !");
            console.log("Number of rows returned:", result.rowCount);
            console.log("Command type:", result.command);

            console.log("Rows:");

            for(const row of result.rows){
                console.log(row);
            }
    
            console.table(result.rows); 
            return result;
        } catch (err) {
            console.error("Error Executing Query: ", err);
        } finally {
            await this.client.end();
        }
    }
}

const object = new DBService({
    host: process.env.DB_HOST,
    port: 5432,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

object.generateResponseFromDB("Dsssssssss");
