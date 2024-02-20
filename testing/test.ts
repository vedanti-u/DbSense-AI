import { dbai } from "../src/dbai";

const object = new dbai();

(async function tester() {
  try {
    await object.createTable(
      "CREATE TABLE cosmetics (brand VARCHAR(100) NOT NULL,product_type VARCHAR(100) NOT NULL,product_price NUMERIC(10, 2));"
    );
    let response = await object.ask("name all the cosmetics with price");
    console.table(response.table);
    console.log(response.summary);
  } catch (error) {
    console.error(error);
  }
})();
