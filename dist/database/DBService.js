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
exports.DBService = void 0;
const pg_1 = require("pg");
require("dotenv/config");
class DBService {
    constructor(connection) {
        this.connection = connection;
        this.client = new pg_1.Client(connection);
        this.connect();
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.connect();
        });
    }
    queryDatabase(inputQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.client
                    .query(inputQuery)
                    .then((result) => {
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
        });
    }
}
exports.DBService = DBService;
