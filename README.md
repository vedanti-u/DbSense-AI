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

  <details open>
    <summary>Install make on Linux</summary>

  ```bash
  $ sudo apt install make
  ```

  Check version

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

      Check version

      ```bash
      $ g++ --version
      ```

  </details>
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

If you don't have git on your machine, [install it](https://docs.github.com/en/get-started/quickstart/set-up-git).

- #### **make**

  <details open>
    <summary>Install make on Linux</summary>

  ```bash
  $ sudo apt install make
  ```

  Check version

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

  Check version

  ```bash
  $ g++ --version
  ```

    </details>
  </br>

## Fork this repository

Fork this repository by clicking on the fork button on the top of this page. This will create a copy of this repository in your account.
</br>

## Clone the repository

Now clone the forked repository to your machine. Go to your GitHub account, open the forked repository, click on the code button and then click the _copy to clipboard_ icon, this is the COPIED_URL.

Open a terminal and run the following git command:

```git
git clone "COPIED_URL"
```

e.g : `git clone https://github.com/vedanti-u/db.ai.git`
</br>

---

### Install dependencies

```bash
npm install
```

</br>

---

### Create a branch

Change to the repository directory on your computer (if you are not already there):

```bash
$ cd dbsense-ai
```

Now create a branch using the `git switch` command:

```bash
$ git checkout -b new-branch-name
```

e.g : `git checkout -b llm-prompt-support`

**Name your branch according to the feature you are working on :**

e.g : you want to work on creating more llm prompt support, name your branch like `llm-prompt-support`

_(follow this naming convention i.e using "-" in between)_

### _Make necessary changes_

#### Create a `.env` File with format

```
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

## Testing the library locally

```bash
node test/localLibrary.test.ts --env=.env
```

### Create a pull request

  <details>
   <summary>How to create pull request</summary>
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
<img align="right" width="300" src="https://github.com/vedanti-u/readme-assets/blob/main/create-pull-request.png" alt="create pull request" />
write a description for your pull request specifing the changes you have made, title it and then, Click on create pull request

_your branch will be merged on code review_

  </details>
