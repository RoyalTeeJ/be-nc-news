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

function fetchcommentsByArticleID(article_id) {
  let SQLString = `SELECT * FROM comments`;
  const args = [];

  if (article_id) {
    SQLString += " WHERE article_id = $1 ORDER BY created_at DESC";
    args.push(article_id);
  }

  return db.query(SQLString, args).then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject({ message: "Not Found", status: 404 });
    }
    return response.rows;
  });
}

function fetchCommentRefArticleID(username, body, article_id) {
  let SQLString = ``;
  const args = [];
  if (username && body && article_id) {
    SQLString +=
      "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;";
    args.push(username, body, article_id);
  }

  return db.query(SQLString, args).then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject({ message: "Bad Request", status: 400 });
    }
    return response.rows[0];
  });
}

function fetchPatchArticleByArticleID(inc_votes, article_id) {
  let sqlString = ``;
  const args = [];

  if (inc_votes && article_id) {
    sqlString +=
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;";
    args.push(inc_votes, article_id);
  }

  return db.query(sqlString, args).then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject({ message: "Not Found", status: 404 });
    }
    return response.rows[0];
  });
}

module.exports = {
  fetchTopics,
  fetchArticleID,
  fetchArticles,
  fetchcommentsByArticleID,
  fetchCommentRefArticleID,
  fetchPatchArticleByArticleID,
};
