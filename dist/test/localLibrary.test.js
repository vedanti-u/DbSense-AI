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
//CREATE TABLE cosmetics (brand VARCHAR(100) NOT NULL,product_type VARCHAR(100) NOT NULL,product_price NUMERIC(10, 2));
//Give me name of all brands sorted in ascending order of price
// INSERT INTO Employee (name, designation, age, salary, department, phone_no) VALUES
// ('Rajesh Kumar', 'Software Engineer', 28, 75000.00, 'IT', '9876543210'),
// ('Neha Singh', 'Project Manager', 35, 95000.00, 'Product', '9876543211'),
// ('Amit Patel', 'Data Scientist', 30, 85000.00, 'IT', '9876543212'),
// ('Priya Sharma', 'HR Manager', 32, 70000.00, 'Finance', '9876543213'),
// ('Ravi Verma', 'DevOps Engineer', 27, 80000.00, 'IT', '9876543214'),
// ('Kavita Desai', 'Business Analyst', 29, 78000.00, 'Finance', '9876543215'),
// ('Vikram Joshi', 'QA Engineer', 26, 65000.00, 'IT', '9876543216'),
// ('Sneha Nair', 'Marketing Manager', 34, 90000.00, 'Sales', '9876543217'),
// ('Manish Agarwal', 'Network Engineer', 31, 72000.00, 'IT', '9876543218'),
// ('Anjali Gupta', 'UI/UX Designer', 25, 70000.00, 'Product', '9876543219'),
// ('Suresh Iyer', 'Systems Administrator', 33, 78000.00, 'IT', '9876543220'),
// ('Pooja Reddy', 'Content Writer', 27, 60000.00, 'Content', '9876543221'),
// ('Rakesh Gupta', 'Sales Manager', 36, 92000.00, 'Sales', '9876543222'),
// ('Deepa Mehta', 'Product Manager', 29, 85000.00, 'Product', '9876543223'),
// ('Arun Malhotra', 'Finance Analyst', 32, 82000.00, 'Finance', '9876543224');
