"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.LLMService = void 0;
const fs = __importStar(require("fs"));
const openai_1 = require("langchain/embeddings/openai");
const text_splitter_1 = require("langchain/text_splitter");
const openai_2 = require("@langchain/openai");
const hnswlib_1 = require("langchain/vectorstores/hnswlib");
require('dotenv').config();
class LLMService {
    constructor() {
        this.tables = {};
        this.openAIEmbeddings = new openai_1.OpenAIEmbeddings();
        this.model = new openai_2.OpenAI({});
        this.vectorStorePath = "dist/docs/data.index";
    }
    createTable(sqlQueryForTable) {
        return __awaiter(this, void 0, void 0, function* () {
            sqlQueryForTable.replace(/\n|\+/g, "");
            const tableName = this.extractTableNameFromCreateQuery(sqlQueryForTable);
            if (tableName) {
                console.log("Table name: ", tableName);
                this.tables[tableName] = sqlQueryForTable;
            }
            else {
                console.log("Table name not found");
            }
            console.log(this.tables);
            yield this.deleteFile(this.vectorStorePath);
            yield this.createVectorEmbeddings(this.tableObjToStringConvertor(this.tables));
        });
    }
    updateTable(sqlQueryForTable) {
        return __awaiter(this, void 0, void 0, function* () {
            sqlQueryForTable.replace(/\n|\+/g, "");
            const tableName = this.extractTableNameFromUpdateQuery(sqlQueryForTable);
            if (tableName) {
                // console.log("Table name: ", tableName);
                this.tables[tableName] = sqlQueryForTable;
            }
            else {
                //console.log("Table name not found");
            }
            yield this.deleteFile(this.vectorStorePath);
            yield this.createVectorEmbeddings(this.tableObjToStringConvertor(this.tables));
        });
    }
    extractTableNameFromCreateQuery(sqlQueryForTable) {
        const regex = /CREATE\s+TABLE\s+(\S+)/i;
        const match = sqlQueryForTable.match(regex);
        if (match && match.length > 1) {
            return match[1];
        }
        return null;
    }
    extractTableNameFromUpdateQuery(sqlQueryForTable) {
        const regex = /UPDATE\s+TABLE\s+(\S+)/i;
        const match = sqlQueryForTable.match(regex);
        if (match && match.length > 1) {
            return match[1];
        }
        return null;
    }
    tableObjToStringConvertor(tableObj) {
        let resultString = "";
        for (const key in tableObj) {
            if (Object.prototype.hasOwnProperty.call(tableObj, key)) {
                const value = tableObj[key];
                resultString += value;
            }
        }
        return resultString;
    }
    createVectorEmbeddings(tableString) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileExists = yield this.checkFileExists(this.vectorStorePath);
            if (fileExists) {
                // console.log("Vector Store Already Exist");
                this.vectorStore = yield hnswlib_1.HNSWLib.load(this.vectorStorePath, this.openAIEmbeddings);
                //console.log("this is vectorStore", this.vectorStore);
            }
            else {
                //console.log("Creating Vector Store");
                const textSpiltter = new text_splitter_1.RecursiveCharacterTextSplitter({
                    chunkSize: 1000,
                });
                const docs = yield textSpiltter.createDocuments([tableString]);
                this.vectorStore = yield hnswlib_1.HNSWLib.fromDocuments(docs, this.openAIEmbeddings);
                yield this.vectorStore.save(this.vectorStorePath);
                // console.log("Succesfully create vector store ");
            }
        });
    }
    checkFileExists(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                fs.accessSync(filePath);
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    deleteFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                fs.rmSync(filePath, { recursive: true });
                //console.log("File deleted successfully.");
            }
            catch (error) {
                console.error("Error deleting file:", error);
            }
        });
    }
}
exports.LLMService = LLMService;
