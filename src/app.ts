import { DBService } from '../database/DBService';
import { LLMService } from '../llm/LLMService';
import { PromptService } from '../prompt/PromptService';


const dbObject = new DBService({
    host: process.env.DB_HOST,
    port: 5432,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});
const promptObject = new PromptService();
const llmObject = new LLMService();

//step 1 : create table & embeddings
llmObject.createTable("CREATE TABLE customers (customer_id SERIAL PRIMARY KEY,customer_name VARCHAR(100) NOT NULL,customer_phone VARCHAR(20),customer_dob DATE,customer_address VARCHAR(255),customer_nationality VARCHAR(100));")
    .then(() => {
        console.log("Table & Vector Embeddings created successfully!");
    })
    .catch((error) => {
        console.error("Error creating table:", error);
    });



const question : string = "give me name of all customers who are older than 40 years";
        promptObject.createSqlQuery(question)
         // Step 2: Create query after table is created
        .then((response) => {
            if (response) {
                console.log("SQL query response:", response.res);
                // Step 3 : send this query to dbservice to generate response
                dbObject.queryDatabase(response.res.text)
                    .then((result) => {
                        if(result) {
                            console.log("SQL query response:", result);
                            // Step 4 : send this response along with query for summarizer
                            promptObject.summarizeResponse(question, result.rows)
                                .then((sumResp) => {
                                    if(sumResp) {
                                        console.log("Summary:", sumResp)
                                    } else {
                                        console.log("No summary generated");
                                    }
                                })
                                .catch((error) => {
                                    console.log("Error occured while summarising:", error);
                                })
                        } else {
                            console.log("No result found !");
                        }
                    })
                    .catch((error) => {
                        console.log("Error executing SQL query:", error);
                    })
            } else {
                console.log("No response received.");
            }
        })
        .catch((error) => {
            console.error("Error creating SQL query:", error);
        });

    
//step 2 : create query


// const queryResponse = await createSqlQueryFromQuestion(prompt);
//     //console.log(typeof queryResponse);
//     if (queryResponse && queryResponse.res && queryResponse.res.text) {
//         const generatedRes : any  = await generateResponseFromDB(queryResponse.res.text);
//         await summarizeQuestionwithResponse(prompt, generatedRes.rows );
//     } else {
//         console.log("Query response is invalid");
//     }

// dbObject.queryDatabase("select * from students").then( (e: any) => console.log(e)).catch( (error: any) => console.error(error));


// promptObject.createSqlQuery("Give me name of all students");
