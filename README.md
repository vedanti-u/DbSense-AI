<div align="center">
<a href="https://refine.dev/">
    <img alt="dbsense ai logo" src="https://github.com/vedanti-u/readme-assets/blob/main/dbsense-ai-logo.jpeg">
</a>
</div>

<br />
<br />
<div>
<div align="center">

![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=flat-square&logo=npm&logoColor=white)
![Linux](https://img.shields.io/badge/Linux-FCC624?style=flat-square&logo=linux&logoColor=black)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat-square&logo=typescript&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat-square&logo=node.js&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=flat-square&logo=postgresql&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-3FCF8E.svg?style=flat-square&logo=Supabase&logoColor=white)
![Openai](https://img.shields.io/badge/OpenAI-412991.svg?style=flat-square&logo=OpenAI&logoColor=white) ![Openai](https://img.shields.io/badge/Nodemon-76D04B.svg?style=flat-square&logo=Nodemon&logoColor=white) ![Langchain](https://img.shields.io/badge/Langchain-red?style=flat-square)
[![Open Source? Yes!](https://badgen.net/badge/Open%20Source%20%3F/Yes%21/blue?icon=github)](https://github.com/Naereen/badges/)
[![Npm package version](https://badgen.net/npm/v/dbsense-ai)](https://npmjs.com/package/dbsense-ai)
[![Npm package monthly downloads](https://badgen.net/npm/dm/dbsense-ai)](https://www.npmjs.com/package/dbsense-ai)
[![Npm package total downloads](https://badgen.net/npm/dt/dbsense-ai)](https://www.npmjs.com/package/dbsense-ai)
[![GitHub contributors](https://badgen.net/github/contributors/vedanti-u/DbSense-AI)](https://GitHub.com/vedanti-u/DbSense-AI/graphs/contributors/)

</div>

</div align="left" >

## What is DbSenseAi

**DbSenseAI** is a fast and lightweight library that simplifies chatting with your database. Unlike traditional methods, it doesn't need to embed all your database data. Instead, it focuses only on the schema, making it efficient and quick.
</br>

**Features**:

- _**Efficient Schema Embedding**: Only embeds schema, skipping the need to embed all database data._

- _**Fast Database Interaction**: Enables quick communication with your database._

- _**Resource Optimization**: Saves resources by avoiding unnecessary data embedding._

- _**Versatile Integration**: Works well with various database systems._
  </br>

## How DbSenseAi works ?

```mermaid
  sequenceDiagram
    participant User
    participant App
    participant LLM_Model
    participant Database

    User->>App: Provides data (Schema of tables)
    App->>LLM_Model: Sends schema
    LLM_Model->>App: Creates Vector Embedding
    App->>App: Stores Vector Embedding in Local File
    App->>User: Acknowledgement

    User->>App: Asks query: "All students passed with above 80 marks"
    App->>LLM_Model: Sends query with Vector Embedding
    LLM_Model->>LLM_Model: Converts to SQL
    LLM_Model->>App: Sends SQL
    App->>Database: Sends SQL
    Database->>Database: Processes SQL
    Database-->>App: Returns response
    App-->>User: Sends response

```

The sequence diagram illustrates the process flow of a system where a user provides data to DBSenseAi, which includes schema information of tables. DBSenseAi forwards this schema to the Language Model (LLM_Model), which generates Vector Embeddings. These embeddings are stored locally by DBSenseAi. When the user queries for students who passed with above 80 marks, DBSenseAi sends this query along with the embeddings to the LLM_Model, which converts it into SQL. The SQL is then forwarded to the Database, processed, and the response is sent back to DBSenseAi, which in turn delivers it to the user.

## Class Diagram

```mermaid

classDiagram
    class User {
        +ProvidesData()
        +AsksQuery()
    }
    class LLMService {
        -vectorStore: HNSWLib | undefined
        -model: OpenAI
        -vectorStorePath: string
        -openAIEmbeddings: OpenAIEmbeddings
        +createTable(sqlQueryForTable: string): void
        +updateTable(sqlQueryForTable: string): void
        -extractTableNameFromCreateQuery(sqlQueryForTable: string): string | null
        -extractTableNameFromUpdateQuery(sqlQueryForTable: string): string | null
        +createVectorEmbeddings(tableString: string): void
        -checkFileExists(filePath: string): Promise<boolean>
        -deleteFile(filePath: string): Promise<void>
    }
    class PromptService {
        -vectorStore: HNSWLib | undefined
        -model: OpenAI
        -vectorStorePath: string
        -openAIEmbeddings: OpenAIEmbeddings
        -rawData: string
        -jsonData: any
        +createSqlQuery(question: string): void
        +checkFileExists(filePath: string): Promise<boolean>
        +summarizeResponse(question: string, answer: any): void
        +parseMessage(unformatedPrompt: string, ...args: string[]): string | undefined
    }
    class DBService {
        -connection: dbconfig
        -client: Client
        +queryDatabase(inputQuery: string): Promise<QueryResult>
        +connect(): Promise<void>
    }
    class DbSenseAi {
        -dbService: DBService
        -promptService: PromptService
        -llmService: LLMService
        +createTable(createQuery: string): Promise<boolean>
        +updateTable(updateQuery: string): Promise<boolean>
        +ask(question: string): Promise<QuestionResponse>
    }

    class OpenAIEmbeddings {
        // properties and methods
    }
    class OpenAI {
        // properties and methods
    }
    class HNSWLib {
        // properties and methods
    }
    class dbconfig {
        // properties
    }
    class Client {
        // properties and methods
    }
    class QueryResult {
        // properties and methods
    }
    class QuestionResponse {
        // properties and methods
    }

    User --> DbSenseAi : Uses
    DbSenseAi --> LLMService : Uses
    DbSenseAi --> PromptService : Uses
    DbSenseAi --> DBService : Uses
    PromptService --> OpenAIEmbeddings : Uses
    PromptService --> OpenAI : Uses
    LLMService --> OpenAIEmbeddings : Uses
    LLMService --> OpenAI : Uses
    LLMService --> HNSWLib : Uses
    DBService --> dbconfig : Contains
    DBService --> Client : Contains
    DBService --> QueryResult : Returns
    DbSenseAi --> QuestionResponse : Returns




```

## ⚡ Try DbSenseAi

## Prerequisites

- **Make**

  > Install make on Linux

  ```bash
  $ sudo apt install make
  ```

  _Check version_

  ```bash
  $ make -version
  ```

- ### **G++**

  > Install G++ on Linux

  ```bash
  $ sudo apt install g++
  ```

  _Check version_

  ```bash
  $ g++ --version
  ```

  ## Installation

  ```bash
  $ npm i dbsense-ai
  ```

## Setting-up `.env` file

Your `.env` file should include

```bash
export OPENAI_API_KEY=<YOUR_OPENAI_KEY>
DB_DATABASE=<YOUR_DATABASE_NAME>
DB_HOST=<YOUR_DATABASE_HOST>
DB_PORT=<YOUR_DATABASE_PORT>
DB_USER=<YOUR_DATABASE_USER>
DB_PASSWORD=<YOUR_DATABASE_PASSWORD>
```

_Once the package is installed, you can import the library using import or require approach:_

```javascript
var DbSenseAi = require("dbsense-ai");
```

##### Instanciate the DbSenseAi class

```javascript
const dbsenseai = new DbSenseAi();
```

## Usage

Add your _create table query_ inside the createTable() function

```javascript
await dbsenseai.createTable(
  "CREATE TABLE cosmetics (brand VARCHAR(100) NOT NULL,product_type VARCHAR(100) NOT NULL,product_price NUMERIC(10, 2));"
);
```

Add _your prompt_ inside the ask() function

```javascript
let response = await dbsenseai.ask(
  "Give me name of all brands sorted in ascending order of price"
);
```

_You can get the response as table and summary_

```javascript
console.table(response.table);
console.log(response.summary);
```

</br>

# 🤝 Contributing to Library

> [!NOTE]
> Contributing Guidelines

### Dependencies

![NPM Version](https://img.shields.io/badge/npm-v10.2.4-red?style=For-the-badge)
![Node Version](https://img.shields.io/badge/node-v^20.11.17-blue?style=For-the-badge) ![NVM Version](https://img.shields.io/badge/nvm-v0.39.1-green?style=For-the-badge)
![TypeScript](https://img.shields.io/badge/typescript-v^5.3.3-yellow?style=sqaure-flat&logo=typescript&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-^8.11.0-purple?style=square-flat&logo=postgresql&logoColor=white)

### Prerequisites

> If you don't have git on your machine, [install it](https://docs.github.com/en/get-started/quickstart/set-up-git).

- #### **make**

  <details open>
    <summary>Install make on Linux</summary>

  ```bash
  $ sudo apt install make
  ```

  _Check version_

  ```bash
  $ make -version
  ```

  </details>

- #### **G++**

    <details open>
      <summary>Install G++ on Linux</summary>
      
    ```bash
    $ sudo apt install g++
    ```

  _Check version_

  ```bash
  $ g++ --version
  ```

    </details>

### Fork this repository

<details close>
  <summary>Forking</summary>
  <img align="right" width="400" src="https://github.com/vedanti-u/readme-assets/blob/main/fork-the-repo.png" alt="fork this repository" />
  <h4>Fork this repository by clicking on the fork button on the top of this page. This will create a copy of this repository in your account.
  </h4>
</details>

### Clone the repository

<details close>
  <summary>Cloning</summary>
  </br>
  <img align="right" width="200" src="https://github.com/vedanti-u/readme-assets/blob/main/copy-cloning-url.png" alt="fork this repository" />
  <img align="right" width="300" src="https://github.com/vedanti-u/readme-assets/blob/main/clone-button.png" />

  <h4>Now clone the forked repository to your machine. Go to your GitHub account, open the forked repository, click on the code button and then click the _copy to clipboard_ icon, this is the COPIED_URL.</h4>

</br>
</br>
</br>
</br>
</br>

> _Open a terminal and run the following git command:_

```git
git clone "COPIED_URL"
```

e.g : `git clone https://github.com/vedanti-u/db.ai.git`
</br>

</details>

### Install dependencies

```bash
npm install
```

---

### Create a branch

<details>
  <summary>Branch naming conviction</summary>
  Change to the repository directory on your computer (if you are not already there):

```bash
$ cd dbsense-ai
```

Now create a branch using the `git checkout` command:

```bash
$ git checkout -b new-branch-name
```

e.g : `git checkout -b llm-prompt-support`

**Name your branch according to the feature you are working on :**

e.g : you want to work on creating more llm prompt support, name your branch like `llm-prompt-support`

_(follow this naming convention i.e using "-" in between)_

</details>

### Make contribution to _Code_

#### Create a `.env` File with format

```bash
export OPENAI_API_KEY=<YOUR_OPENAI_KEY>
DB_DATABASE=<YOUR_DATABASE_NAME>
DB_HOST=<YOUR_DATABASE_HOST>
DB_PORT=<YOUR_DATABASE_PORT>
DB_USER=<YOUR_DATABASE_USER>
DB_PASSWORD=<YOUR_DATABASE_PASSWORD>
```

### Linking the library locally

```bash
rm -rf dist
tsc
npm link
npm link dbsense-ai
```

---

## Testing the library locally

```bash
node test/localLibrary.test.ts --env=.env
```

### Create a pull request

  <details>
   <summary>Creating pull requests</summary>
  </br>
  Once you have modified an existing file or added a new file to the project of your choice, you can stage it to your local repository, which we can do with the `git add` command. In our example, `filename.md`, we will type the following command.

<code>$ git add filename.md</code>

where filename is the file you have modified or created

If you are looking to add all the files you have modified in a particular directory, you can stage them all with the following command:
`git add .`

Or, alternatively, you can type `git add -all` for all new files to be staged.

<h3>Commiting the changes</h3>
<code>git commit -m "Added a new prompt in prompts.json file"</code>

<h3>To PUSH your branch to your remote main</h3>
<code>$ git push --set-upstream origin your-branch-name</code>
</br>

e.g : `$ git push --set-upstream origin optimise-binding`

<h4>Open Github</h4>
<img align="right" width="300" src="https://github.com/vedanti-u/readme-assets/blob/main/compare-and-pulll-request.png" alt="compare and pull request" />
click on compare & pull request
</br>
</br>
</br>
</br>
<img align="right" width="300" src="https://github.com/vedanti-u/readme-assets/blob/main/create-pull-request.png" alt="create pull request" />
write a description for your pull request specifing the changes you have made, title it and then, Click on create pull request

_your branch will be merged on code review_

  </details>

</br>

### :octocat: Statistics

[![Open Source Love svg2](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
![stars](https://img.shields.io/github/stars/vedanti-u/DbSense-AI.svg)
![forks](https://img.shields.io/github/forks/vedanti-u/DbSense-AI.svg)
![watchers](https://img.shields.io/github/watchers/vedanti-u/DbSense-AI.svg)
[![Open Source? Yes!](https://badgen.net/badge/Open%20Source%20%3F/Yes%21/blue?icon=github)](https://github.com/Naereen/badges/)
[![Npm](https://badgen.net/badge/icon/npm?icon=npm&label)](https://npmjs.com/)
[![Npm package version](https://badgen.net/npm/v/dbsense-ai)](https://npmjs.com/package/dbsense-ai)
[![Npm package monthly downloads](https://badgen.net/npm/dm/dbsense-ai)](https://www.npmjs.com/package/dbsense-ai)
[![Npm package total downloads](https://badgen.net/npm/dt/dbsense-ai)](https://www.npmjs.com/package/dbsense-ai)
[![GitHub contributors](https://badgen.net/github/contributors/vedanti-u/DbSense-AI)](https://GitHub.com/vedanti-u/DbSense-AI/graphs/contributors/)
[![GitHub commits](https://badgen.net/github/commits/vedanti-u/DbSense-AI)](https://GitHub.com/Naereen/StrapDown.js/commit/)
[![GitHub issues](https://img.shields.io/github/issues/vedanti-u/DbSense-AI.svg)](https://GitHub.com/vedanti-u/DbSense-AI/issues/)
[![GitHub issues-closed](https://img.shields.io/github/issues-closed/vedanti-u/DbSense-AI.svg)](https://GitHub.com/vedanti-u/DbSense-AI/issues?q=is%3Aissue+is%3Aclosed)
[![GitHub pull-requests closed](https://img.shields.io/github/issues-pr-closed/vedanti-u/DbSense-AI.svg)](https://GitHub.com/vedanti-u/DbSense-AI/pulls?q=is%3Aclosed)
[![GitHub pull-requests closed](https://badgen.net/github/closed-prs/vedanti-u/DbSense-AI)](https://GitHub.com/vedanti-u/DbSense-AI/pulls?q=is%3Aclosed)
[![GitHub pull-requests merged](https://badgen.net/github/merged-prs/vedanti-u/DbSense-AI)](https://GitHub.com/vedanti-u/DbSense-AI/pulls?q=is%3Amerged)
[![GitHub license](https://img.shields.io/github/license/vedanti-u/DbSense-AI.svg)](https://github.com/vedanti-u/DbSense-AI/blob/master/LICENSE)

![Love](https://img.shields.io/badge/Made_with_Love-pink?style=flat-square&logo=data:image/svg%2bxml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+R2l0SHViIFNwb25zb3JzIGljb248L3RpdGxlPjxwYXRoIGQ9Ik0xNy42MjUgMS40OTljLTIuMzIgMC00LjM1NCAxLjIwMy01LjYyNSAzLjAzLTEuMjcxLTEuODI3LTMuMzA1LTMuMDMtNS42MjUtMy4wM0MzLjEyOSAxLjQ5OSAwIDQuMjUzIDAgOC4yNDljMCA0LjI3NSAzLjA2OCA3Ljg0NyA1LjgyOCAxMC4yMjdhMzMuMTQgMzMuMTQgMCAwIDAgNS42MTYgMy44NzZsLjAyOC4wMTcuMDA4LjAwMy0uMDAxLjAwM2MuMTYzLjA4NS4zNDIuMTI2LjUyMS4xMjUuMTc5LjAwMS4zNTgtLjA0MS41MjEtLjEyNWwtLjAwMS0uMDAzLjAwOC0uMDAzLjAyOC0uMDE3YTMzLjE0IDMzLjE0IDAgMCAwIDUuNjE2LTMuODc2QzIwLjkzMiAxNi4wOTYgMjQgMTIuNTI0IDI0IDguMjQ5YzAtMy45OTYtMy4xMjktNi43NS02LjM3NS02Ljc1em0tLjkxOSAxNS4yNzVhMzAuNzY2IDMwLjc2NiAwIDAgMS00LjcwMyAzLjMxNmwtLjAwNC0uMDAyLS4wMDQuMDAyYTMwLjk1NSAzMC45NTUgMCAwIDEtNC43MDMtMy4zMTZjLTIuNjc3LTIuMzA3LTUuMDQ3LTUuMjk4LTUuMDQ3LTguNTIzIDAtMi43NTQgMi4xMjEtNC41IDQuMTI1LTQuNSAyLjA2IDAgMy45MTQgMS40NzkgNC41NDQgMy42ODQuMTQzLjQ5NS41OTYuNzk3IDEuMDg2Ljc5Ni40OS4wMDEuOTQzLS4zMDIgMS4wODUtLjc5Ni42My0yLjIwNSAyLjQ4NC0zLjY4NCA0LjU0NC0zLjY4NCAyLjAwNCAwIDQuMTI1IDEuNzQ2IDQuMTI1IDQuNSAwIDMuMjI1LTIuMzcgNi4yMTYtNS4wNDggOC41MjN6Ii8+PC9zdmc+)
