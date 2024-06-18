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
exports.DbSenseAi = void 0;
var DBService_1 = require("./database/DBService");
var LLMService_1 = require("./llm/LLMService");
var PromptService_1 = require("./prompt/PromptService");
var QuestionResponse_1 = require("./model/QuestionResponse");
var DbSenseAi = /** @class */ (function () {
    function DbSenseAi() {
        this.dbService = new DBService_1.DBService({
            host: process.env.DB_HOST,
            port: 5432,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });
        this.promptService = new PromptService_1.PromptService();
        this.llmService = new LLMService_1.LLMService();
    }
    DbSenseAi.prototype.createTable = function (createQuery) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.llmService
                            .createTable(createQuery)
                            .then(function () {
                            console.log("Table & Vector Embeddings created successfully!");
                            resolve(true);
                        })
                            .catch(function (error) {
                            console.error("Error creating table:", error);
                            reject(error);
                        });
                    })];
            });
        });
    };
    DbSenseAi.prototype.updateTable = function (updateQuery) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.llmService
                            .updateTable(updateQuery)
                            .then(function () {
                            console.log("Table & Vector Embeddings updates successfully!");
                            resolve(true);
                        })
                            .catch(function (error) {
                            console.error("Error updating table:", error);
                            reject(error);
                        });
                    })];
            });
        });
    };
    DbSenseAi.prototype.ask = function (question) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var sqlResponse, questionRespomse, table, summary, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 5, , 6]);
                                    return [4 /*yield*/, this.promptService.createSqlQuery(question)];
                                case 1:
                                    sqlResponse = _a.sent();
                                    if (!sqlResponse) return [3 /*break*/, 4];
                                    questionRespomse = new QuestionResponse_1.QuestionResponse();
                                    return [4 /*yield*/, this.dbService.queryDatabase(sqlResponse.response.text)];
                                case 2:
                                    table = _a.sent();
                                    questionRespomse.table = table.rows;
                                    return [4 /*yield*/, this.promptService.summarizeResponse(question, table.rows)];
                                case 3:
                                    summary = _a.sent();
                                    questionRespomse.summary = summary.response.text;
                                    resolve(questionRespomse);
                                    _a.label = 4;
                                case 4: return [3 /*break*/, 6];
                                case 5:
                                    error_1 = _a.sent();
                                    reject(error_1);
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    return DbSenseAi;
}());
exports.DbSenseAi = DbSenseAi;
module.exports = DbSenseAi;
