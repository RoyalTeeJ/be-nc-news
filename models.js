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

function fetchArticles() {
  let SQLString = `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;`;
  return db.query(SQLString).then((response) => {
    return response.rows;
  });
}

module.exports = {
  fetchTopics,
  fetchArticleID,
  fetchArticles,
};
