<<<<<<< Updated upstream
var   DbSenseAi =require("dbsense-ai");
=======
var  DbSenseAi = require("dbsense-ai");
>>>>>>> Stashed changes

const dbsenseai = new DbSenseAi();

(async function tester() {
  try {
    // await dbsenseai.createTable(
    //   "CREATE TABLE cosmetics (brand VARCHAR(100) NOT NULL,product_type VARCHAR(100) NOT NULL,product_price NUMERIC(10, 2));"
    // );
    let response = await dbsenseai.ask(
      "Give me name of all brands sorted in ascending order of price"
    );
    console.table(response.table);
    console.log(response.summary);
  } catch (error) {
    console.error(error);
  }
})();
