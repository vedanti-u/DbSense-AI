"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptService = void 0;
const fs = __importStar(require("fs"));
const openai_1 = require("@langchain/openai");
const openai_2 = require("@langchain/openai");
const hnswlib_1 = require("@langchain/community/vectorstores/hnswlib");
const chains_1 = require("langchain/chains");
require("dotenv/config");
class PromptService {
  constructor() {
    this.openAIEmbeddings = new openai_1.OpenAIEmbeddings();
    this.model = new openai_2.OpenAI({});
    this.vectorStorePath = "./docs/data.index";
    // console.log(`Current directory: ${process.cwd()}`);
    const path = require("path");
    const promptsPath = path.join(__dirname, "prompts.json");
    //console.log("this is promptsPath re :", promptsPath);
    this.rawData = fs.readFileSync(promptsPath, "utf8");
    // this.rawData = fs.readFileSync("prompts.json", "utf8");
    // console.log("rawData", this.rawData);
    this.jsonData = JSON.parse(this.rawData);
    // console.log("jsonData", this.jsonData);
  }
  createSqlQuery(question) {
    return __awaiter(this, void 0, void 0, function* () {
      // console.log("createSqlQueryFromQuestion");
      const fileExists = yield this.checkFileExists(this.vectorStorePath);
      if (fileExists) {
        //console.log("Loading Vector Store");
        this.vectorStore = yield hnswlib_1.HNSWLib.load(
          this.vectorStorePath,
          this.openAIEmbeddings
        );
        const chain = chains_1.RetrievalQAChain.fromLLM(
          this.model,
          this.vectorStore.asRetriever()
        );
        const prompt = this.parseMessage(this.jsonData.prompt_sql, question);
        // console.log("This is prompt :", prompt);
        var response = yield chain.call({
          query: prompt,
        });
        // console.log("response before ->", response);
        response.text = response.text.trim();
        response.text = response.text.replace(/\n+/g, " ");
        response.text = response.text.replace(/\s+/g, " ");
        // console.log("response after ->", response);
        return {
          response,
        };
      }
    });
  }
  checkFileExists(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        fs.accessSync(filePath);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
  summarizeResponse(question, answer) {
    return __awaiter(this, void 0, void 0, function* () {
      // console.log("Loading Vector Store for summarizer");
      this.vectorStore = yield hnswlib_1.HNSWLib.load(
        this.vectorStorePath,
        this.openAIEmbeddings
      );
      const chain = chains_1.RetrievalQAChain.fromLLM(
        this.model,
        this.vectorStore.asRetriever()
      );
      const prompt = this.parseMessage(
        this.jsonData.prompt_summarize,
        question,
        JSON.stringify(answer)
      );
      var response = yield chain.call({
        query: prompt,
      });
      // console.log("Summarized text ->", response.text);
      return {
        response,
      };
    });
  }
  parseMessage(unformatedPrompt, ...args) {
    // console.log("\nUnformated Prompt :", unformatedPrompt);
    // console.log("\nthis is args", args);
    for (var index in args) {
      // console.log("\nthis is args[index]", args[index]);
      var stringToReplace = `{${index}}`;
      // console.log("\nthis is stringtoreplace", stringToReplace);
      unformatedPrompt = unformatedPrompt.replace(stringToReplace, args[index]);
      // console.log("\nFormated Prompt: ", unformatedPrompt);
    }
    var formatedPrompt = unformatedPrompt;
    return formatedPrompt;
  }
}
exports.PromptService = PromptService;
