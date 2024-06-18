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
var DbSenseAi = require("dbsense-ai");
const dbsenseai = new DbSenseAi();
(function tester() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield dbsenseai.createTable("CREATE TABLE Employee (emp_id SERIAL PRIMARY KEY,name VARCHAR(100) NOT NULL,designation VARCHAR(100) NOT NULL,age INT NOT NULL,salary DECIMAL(10, 2) NOT NULL,department VARCHAR(100) NOT NULL,phone_no VARCHAR(15) NOT NULL);");
            let response = yield dbsenseai.ask("Give all details of employees in IT by salary");
            console.table(response.table);
            console.log(response.summary);
        }
        catch (error) {
            console.error(error);
        }
    });
})();
