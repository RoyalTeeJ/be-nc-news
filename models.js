const db = require("./db/connection.js");

function fetchTopics() {
  let SQLString = `SELECT * FROM topics`;
  return db.query(SQLString).then((response) => {
    return response.rows;
  });
}

function fetchArticleID(article_id) {
  let SQLString = `SELECT * FROM articles`;
  const args = [];

  if (article_id) {
    SQLString += " WHERE article_id = $1";
    args.push(article_id);
  }

  return db.query(SQLString, args).then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject({ message: "Not Found", status: 404 });
    }
    return response.rows[0];
  });
}

module.exports = {
  fetchTopics,
  fetchArticleID,
};
