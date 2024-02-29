import { Dbai } from "../index";

const dbai = new Dbai();

(async function tester() {
  try {
    await dbai.createTable(
      "CREATE TABLE cosmetics (brand VARCHAR(100) NOT NULL,product_type VARCHAR(100) NOT NULL,product_price NUMERIC(10, 2));"
    );
    let response = await dbai.ask(
      "Give me name of all brands sorted in ascending order of price"
    );
    console.table(response.table);
    console.log(response.summary);
  } catch (error) {
    console.error(error);
  }
})();
