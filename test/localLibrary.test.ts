var DbSenseAi = require("dbsense-ai");

const dbsenseai = new DbSenseAi();

(async function tester() {
  try {
    await dbsenseai.createTable(
      "CREATE TABLE Employee (emp_id SERIAL PRIMARY KEY,name VARCHAR(100) NOT NULL,designation VARCHAR(100) NOT NULL,age INT NOT NULL,salary DECIMAL(10, 2) NOT NULL,department VARCHAR(100) NOT NULL,phone_no VARCHAR(15) NOT NULL);"
    );
    let response = await dbsenseai.ask(
      "Give all details of employees in IT by salary"
    );
    console.table(response.table);
    console.log(response.summary);
  } catch (error) {
    console.error(error);
  }
})();
