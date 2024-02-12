import * as fs from 'fs';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAI } from 'langchain/llms/openai';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { RetrievalQAChain } from 'langchain/chains';
import { ChatCompletionStream } from 'openai/lib/ChatCompletionStream';
import i18next from 'i18next';
import dotenv from 'dotenv';

dotenv.config();

i18next.init({
  fallbackLng: 'en',
  fallbackNS: 'common',
  resources: {
    en: {
      translation: {
        "key": "{{what}} is {{how}}"
      }
    }
  }
});

console.log(i18next.t('key', { what: 'i18next', how: 'great' }));
export class PromptService{

    // private vectorStore : HNSWLib | undefined;
    // private model : OpenAI;
    // private vectorStorePath : string;
    // private openAIEmbeddings : OpenAIEmbeddings;

    
    // constructor() {
    //     this.openAIEmbeddings = new OpenAIEmbeddings();
    //     this.model = new OpenAI({});
    //     this.vectorStorePath ='./docs/data.index'
    // }

    // async createSqlQueryFromQuestion(question : string){ //prompt
    //     console.log("createSqlQueryFromQuestion");
    //     const fileExists : boolean = await this.checkFileExists(this.vectorStorePath);
    
    //     if(fileExists){
    //         console.log("Loading Vector Store");
    //         this.vectorStore = await HNSWLib.load(this.vectorStorePath,this.openAIEmbeddings);   
    //         const chain = RetrievalQAChain.fromLLM(this.model, this.vectorStore.asRetriever());
    //          const prompt = `
    //          Considering the schema provided
    
    //          Answer the following question using SQL:
             
    //          Question: ${question}
             
    //          Your SQL query should retrieve the requested information without any additional characters or spaces. 
    //          Remove any delimiter if present like "\n" or \n or newline character.
    //          Please ensure the query is formatted correctly and only includes the necessary components.
    //      `;
    // ;
               
    //         var res = await chain.call({
    //             query: prompt,
    //         });
            
    //         console.log("response before ->", res);
    //         // Properly format the SQL query
    //         res.text = res.text.trim(); // Remove leading and trailing whitespace
    //         res.text = res.text.replace(/\n+/g, ' '); // Replace multiple consecutive newlines with a single space
    //         res.text = res.text.replace(/\s+/g, ' '); // Replace multiple consecutive spaces with a single space
    //         console.log("response after ->", res);
    //         return {
    //           res,
    //         };
    //     }
    // }

    // async checkFileExists(filePath : string) : Promise<boolean>{
    //     try {
    //         fs.accessSync(filePath);
    //         return true;
    //     } catch (error) {
    //         return false;
    //     }
    // }

    
}