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
exports.PromptService = void 0;
var fs = require("fs");
var openai_1 = require("@langchain/openai");
var openai_2 = require("@langchain/openai");
var hnswlib_1 = require("@langchain/community/vectorstores/hnswlib");
var chains_1 = require("langchain/chains");
require("dotenv/config");
var PromptService = /** @class */ (function () {
    function PromptService() {
        this.openAIEmbeddings = new openai_1.OpenAIEmbeddings();
        this.model = new openai_2.OpenAI({});
        this.vectorStorePath = "./docs/data.index";
        console.log("Current directory: ".concat(process.cwd()));
        this.rawData = fs.readFileSync("./dist/prompts.json", "utf8");
        // console.log("rawData", this.rawData);
        this.jsonData = JSON.parse(this.rawData);
        // console.log("jsonData", this.jsonData);
    }
    PromptService.prototype.createSqlQuery = function (question) {
        return __awaiter(this, void 0, void 0, function () {
            var fileExists, _a, chain, prompt_1, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.checkFileExists(this.vectorStorePath)];
                    case 1:
                        fileExists = _b.sent();
                        if (!fileExists) return [3 /*break*/, 4];
                        console.log("Loading Vector Store");
                        _a = this;
                        return [4 /*yield*/, hnswlib_1.HNSWLib.load(this.vectorStorePath, this.openAIEmbeddings)];
                    case 2:
                        _a.vectorStore = _b.sent();
                        chain = chains_1.RetrievalQAChain.fromLLM(this.model, this.vectorStore.asRetriever());
                        prompt_1 = this.parseMessage(this.jsonData.prompt_sql, question);
                        return [4 /*yield*/, chain.call({
                                query: prompt_1,
                            })];
                    case 3:
                        response = _b.sent();
                        // console.log("response before ->", response);
                        response.text = response.text.trim();
                        response.text = response.text.replace(/\n+/g, " ");
                        response.text = response.text.replace(/\s+/g, " ");
                        // console.log("response after ->", response);
                        return [2 /*return*/, {
                                response: response,
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PromptService.prototype.checkFileExists = function (filePath) {
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
    PromptService.prototype.summarizeResponse = function (question, answer) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, chain, prompt, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // console.log("Loading Vector Store for summarizer");
                        _a = this;
                        return [4 /*yield*/, hnswlib_1.HNSWLib.load(this.vectorStorePath, this.openAIEmbeddings)];
                    case 1:
                        // console.log("Loading Vector Store for summarizer");
                        _a.vectorStore = _b.sent();
                        chain = chains_1.RetrievalQAChain.fromLLM(this.model, this.vectorStore.asRetriever());
                        prompt = this.parseMessage(this.jsonData.prompt_summarize, question, JSON.stringify(answer));
                        return [4 /*yield*/, chain.call({
                                query: prompt,
                            })];
                    case 2:
                        response = _b.sent();
                        // console.log("Summarized text ->", response.text);
                        return [2 /*return*/, {
                                response: response,
                            }];
                }
            });
        });
    };
    PromptService.prototype.parseMessage = function (unformatedPrompt) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // console.log("\nUnformated Prompt :", unformatedPrompt);
        // console.log("\nthis is args", args);
        for (var index in args) {
            // console.log("\nthis is args[index]", args[index]);
            var stringToReplace = "{".concat(index, "}");
            // console.log("\nthis is stringtoreplace", stringToReplace);
            unformatedPrompt = unformatedPrompt.replace(stringToReplace, args[index]);
            // console.log("\nFormated Prompt: ", unformatedPrompt);
        }
        var formatedPrompt = unformatedPrompt;
        return formatedPrompt;
    };
    return PromptService;
}());
exports.PromptService = PromptService;
