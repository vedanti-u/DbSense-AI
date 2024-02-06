const tables: { [key: string]: string } = {

};

function createTable(sqlQuery : string) : void {
    const tableName = extractTableName(sqlQuery);
    if (tableName) {
        console.log("Table name:", tableName);
        tables[tableName] = sqlQuery;
    } else {
        console.log("Table name not found.");
    }
    console.log(tables);
}

function extractTableName(sqlQuery: string): string | null {
    const regex = /CREATE\s+TABLE\s+(\S+)/i;
    const match = sqlQuery.match(regex);
    if (match && match.length > 1) {
        return match[1];
    }
    return null;
}

// Example usage:
const sqlQuery = "CREATE TABLE users (id INT, name VARCHAR(255))";


createTable("CREATE TABLE users ( id INT PRIMARY KEY, username VARCHAR(50), email VARCHAR(100) );")
createTable("CREATE TABLE products ( product_id INT PRIMARY KEY, name VARCHAR(255), price DECIMAL(10, 2) );")
createTable("CREATE TABLE orders ( order_id INT PRIMARY KEY, customer_id INT, order_date DATE, total_amount DECIMAL(10, 2) );")
//createTable("Create a table student with attribute name, rollno, marks")
createTable("CREATE TABLE users ( id INT PRIMARY KEY, username VARCHAR(100), email VARCHAR(100) );")