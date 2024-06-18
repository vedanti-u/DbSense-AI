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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMService = void 0;
var fs = require("fs");
var openai_1 = require("@langchain/openai");
var text_splitter_1 = require("langchain/text_splitter");
var openai_2 = require("@langchain/openai");
var hnswlib_1 = require("@langchain/community/vectorstores/hnswlib");
require("dotenv/config");
var LLMService = /** @class */ (function () {
    function LLMService() {
        this.tables = {};
        this.openAIEmbeddings = new openai_1.OpenAIEmbeddings();
        this.model = new openai_2.OpenAI({});
        this.vectorStorePath = "./docs/data.index";
    }
    LLMService.prototype.createTable = function (sqlQueryForTable) {
        return __awaiter(this, void 0, void 0, function () {
            var tableName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sqlQueryForTable.replace(/\n|\+/g, "");
                        tableName = this.extractTableNameFromCreateQuery(sqlQueryForTable);
                        if (tableName) {
                            // console.log("Table name: ", tableName);
                            this.tables[tableName] = sqlQueryForTable;
                        }
                        else {
                            // console.log("Table name not found");
                        }
                        // console.log(this.tables);
                        return [4 /*yield*/, this.deleteFile(this.vectorStorePath)];
                    case 1:
                        // console.log(this.tables);
                        _a.sent();
                        return [4 /*yield*/, this.createVectorEmbeddings(this.tableObjToStringConvertor(this.tables))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LLMService.prototype.updateTable = function (sqlQueryForTable) {
        return __awaiter(this, void 0, void 0, function () {
            var tableName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sqlQueryForTable.replace(/\n|\+/g, "");
                        tableName = this.extractTableNameFromUpdateQuery(sqlQueryForTable);
                        if (tableName) {
                            // console.log("Table name: ", tableName);
                            this.tables[tableName] = sqlQueryForTable;
                        }
                        else {
                            // console.log("Table name not found");
                        }
                        return [4 /*yield*/, this.deleteFile(this.vectorStorePath)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.createVectorEmbeddings(this.tableObjToStringConvertor(this.tables))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LLMService.prototype.extractTableNameFromCreateQuery = function (sqlQueryForTable) {
        var regex = /CREATE\s+TABLE\s+(\S+)/i;
        var match = sqlQueryForTable.match(regex);
        if (match && match.length > 1) {
            return match[1];
        }
        return null;
    };
    LLMService.prototype.extractTableNameFromUpdateQuery = function (sqlQueryForTable) {
        var regex = /UPDATE\s+TABLE\s+(\S+)/i;
        var match = sqlQueryForTable.match(regex);
        if (match && match.length > 1) {
            return match[1];
        }
        return null;
    };
    LLMService.prototype.tableObjToStringConvertor = function (tableObj) {
        var resultString = "";
        for (var key in tableObj) {
            if (Object.prototype.hasOwnProperty.call(tableObj, key)) {
                var value = tableObj[key];
                resultString += value;
            }
        }
        return resultString;
    };
    LLMService.prototype.createVectorEmbeddings = function (tableString) {
        return __awaiter(this, void 0, void 0, function () {
            var fileExists, _a, textSpiltter, docs, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.checkFileExists(this.vectorStorePath)];
                    case 1:
                        fileExists = _c.sent();
                        if (!fileExists) return [3 /*break*/, 3];
                        // console.log("Vector Store Already Exist");
                        _a = this;
                        return [4 /*yield*/, hnswlib_1.HNSWLib.load(this.vectorStorePath, this.openAIEmbeddings)];
                    case 2:
                        // console.log("Vector Store Already Exist");
                        _a.vectorStore = _c.sent();
                        return [3 /*break*/, 7];
                    case 3:
                        console.log("Creating Vector Store");
                        textSpiltter = new text_splitter_1.RecursiveCharacterTextSplitter({
                            chunkSize: 1000,
                        });
                        return [4 /*yield*/, textSpiltter.createDocuments([tableString])];
                    case 4:
                        docs = _c.sent();
                        _b = this;
                        return [4 /*yield*/, hnswlib_1.HNSWLib.fromDocuments(docs, this.openAIEmbeddings)];
                    case 5:
                        _b.vectorStore = _c.sent();
                        return [4 /*yield*/, this.vectorStore.save(this.vectorStorePath)];
                    case 6:
                        _c.sent();
                        console.log("Succesfully create vector store ");
                        _c.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    LLMService.prototype.checkFileExists = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    fs.accessSync(filePath);
                    return [2 /*return*/, true];
                }
                catch (error) {
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
            });
        });
    };
    LLMService.prototype.deleteFile = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    fs.rmSync(filePath, { recursive: true });
                    //console.log("File deleted successfully.");
                }
                catch (error) {
                    // console.error("Error deleting file:", error);
                }
                return [2 /*return*/];
            });
        });
    };
    return LLMService;
}());
exports.LLMService = LLMService;
