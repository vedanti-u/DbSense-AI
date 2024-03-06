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
<<<<<<< Updated upstream
var DbSenseAi = require("../dist/index.js");
=======
var DbSenseAi = require("dbsense-ai");
>>>>>>> Stashed changes
const dbsenseai = new DbSenseAi();
(function tester() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield dbsenseai.createTable("CREATE TABLE cosmetics (brand VARCHAR(100) NOT NULL,product_type VARCHAR(100) NOT NULL,product_price NUMERIC(10, 2));");
            let response = yield dbsenseai.ask("Give me name of all brands sorted in ascending order of price");
            console.table(response.table);
            console.log(response.summary);
        }
        catch (error) {
            console.error(error);
        }
    });
})();
