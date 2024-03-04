"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbSenseAi = void 0;
const DBService_1 = require("./database/DBService");
const LLMService_1 = require("./llm/LLMService");
const PromptService_1 = require("./prompt/PromptService");
const QuestionResponse_1 = require("./model/QuestionResponse");
class DbSenseAi {
    constructor() {
        this.dbService = new DBService_1.DBService({
            host: process.env.DB_HOST,
            port: 5432,
            database: process.env.DB_TYPE,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });
        this.promptService = new PromptService_1.PromptService();
        this.llmService = new LLMService_1.LLMService();
    }
    createTable(createQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('1');
            return new Promise((resolve, reject) => {
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
        });
    }
    updateTable(updateQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
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
        });
    }
    ask(question) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    var sqlResponse = yield this.promptService.createSqlQuery(question);
                    if (sqlResponse) {
                        let questionRespomse = new QuestionResponse_1.QuestionResponse();
                        var table = yield this.dbService.queryDatabase(sqlResponse.response.text);
                        questionRespomse.table = table.rows;
                        var summary = yield this.promptService.summarizeResponse(question, table.rows);
                        questionRespomse.summary = summary.response.text;
                        resolve(questionRespomse);
                    }
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
}
exports.DbSenseAi = DbSenseAi;
module.exports = DbSenseAi;
