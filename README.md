<div style="font-family: 'Lucida Console', 'Courier New', monospace; font-size: 25px;  font-family: Arial, Helvetica, sans-serif;
			background: linear-gradient(to right, #f32170,
					#ff6b08, #cf23cf, #eedd44);
			-webkit-text-fill-color: transparent;
			-webkit-background-clip: text;;">DbSenseAi</div>

---

<br/>
<div align="center">
    <a href="" style="color: ;">Home Page</a> |
    <a href="">Discord</a> |
    <a href="">Blog</a> |
    <a href="">Documentation</a>
</div>
<br/>
<br/>
<div align="center"><strong>Add Here <a href="">Something</a> Add here.</strong><br>add here
<br />
<br />
<div align="center">

[![Awesome](https://github.com/refinedev/awesome-refine/raw/main/images/badge.svg)](https://github.com/refinedev/awesome-refine)
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/8101/badge)](https://www.bestpractices.dev/projects/8101)
[![npm version](https://img.shields.io/npm/v/@refinedev/core.svg)](https://www.npmjs.com/package/@refinedev/core)
[![](https://img.shields.io/github/commit-activity/m/refinedev/refine)](https://github.com/refinedev/refine/commits/master)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.0-4baaaa.svg)](CODE_OF_CONDUCT.md)
<br/>

</div>

</div align="left" >

## What is DbSenseAi

**DbSense-AI** is a **Javascript** library
</br>
</br>

## How DbSenseAi works ?

Diagramatic explaination here
</br>
</br>

## ⚡ Try DbSenseAi

### Prerequisites

- #### **make**

  Install make on Linux

  ```bash
  $ sudo apt install make
  ```

  Check Version

  ```bash
  $ make -version
  ```

- #### **G++**

  Install G++ on Linux

  ```bash
  $ sudo apt install g++
  ```

  Check Version

  ```bash
  $ g++ --version
  ```

  </br>

## Installation

```bash
$ npm i dbsense-ai
```

## Setting-up `.env`

Your `.env` file should include

```
export OPENAI_API_KEY=<YOUR_OPENAI_KEY>
DB_DATABASE=<YOUR_DATABASE_NAME>
DB_HOST=<YOUR_DATABASE_HOST>
DB_PORT=<YOUR_DATABASE_PORT>
DB_USER=<YOUR_DATABASE_USER>
DB_PASSWORD=<YOUR_DATABASE_PASSWORD>
```

Once the package is installed, you can import the library using import or require approach:

```javascript
var DbSenseAi = require("dbsense-ai");
```

Instanciate the DbSenseAi class

```javascript
const dbsenseai = new DbSenseAi();
```

## Usage

```javascript
(async function tester() {
  try {
    // Add your create table query inside the createTable() function
    await dbsenseai.createTable(
      "CREATE TABLE cosmetics (brand VARCHAR(100) NOT NULL,product_type VARCHAR(100) NOT NULL,product_price NUMERIC(10, 2));"
    );

    // Add your prompt inside the ask() function
    let response = await dbsenseai.ask(
      "Give me name of all brands sorted in ascending order of price"
    );

    // You can get the response as table and summary
    console.table(response.table);
    console.log(response.summary);
  } catch (error) {
    console.error(error);
  }
})();
```

</br>

# Contributing to Library

### Prerequisites

- #### **make**

  Install make on Linux

  ```bash
  $ sudo apt install make
  ```

  Check Version

  ```bash
  $ make -version
  ```

- #### **G++**

  Install G++ on Linux

  ```bash
  $ sudo apt install g++
  ```

  Check Version

  ```bash
  $ g++ --version
  ```

## Clone the repository

```git
git clone https://github.com/vedanti-u/db.ai.git
```

### Install dependencies

```bash
npm install
```

_Make Changes_

### Linking the library locally

```bash
rm -rf dist
tsc
npm link
npm link dbsense-ai
```

#### Create a `.env` File with format

```
export OPENAI_API_KEY=<YOUR_OPENAI_KEY>
DB_DATABASE=<YOUR_DATABASE_NAME>
DB_HOST=<YOUR_DATABASE_HOST>
DB_PORT=<YOUR_DATABASE_PORT>
DB_USER=<YOUR_DATABASE_USER>
DB_PASSWORD=<YOUR_DATABASE_PASSWORD>
```

## Testing the library locally

```bash
node test/localLibrary.test.ts --env=.env
```
