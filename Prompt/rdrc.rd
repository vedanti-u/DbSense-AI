


import DB form ';'




Db = new DB();
db.cr4

d.awaut("sdsdsdsds)ds

async ask(question: string): Promise<QuestionResponse> {
    return new Promise<QuestionResponse>(async (resolve, reject) => {
      try {
        var sqlResponse = await this.promptObject.createSqlQuery(question);
        if (sqlResponse) {
          let questionRespone: QuestionResponse = new QuestionResponse();
          var table = this.dbObject.queryDatabase(sqlResponse.res.text);
          questionRespone.table = table;
          var summary = this.promptObject.summarizeResponse(question, table);
          questionRespone.summary = summary;
          resolve(questionRespone);
        }
      } catch (e) {
        reject(e)
      }
    });
  }