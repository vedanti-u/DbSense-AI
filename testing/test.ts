import { dbai } from "../src/dbai";

const object = new dbai();

// object.createTable(
//   "CREATE TABLE cosmetics (brand VARCHAR(100) NOT NULL,product_type VARCHAR(100) NOT NULL,product_price NUMERIC(10, 2));"
// );

object.ask("give me Lipsticks of all brands");
