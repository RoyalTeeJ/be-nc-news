const db = require("./db/connection.js");

function fetchTopics() {
  let sqlString = `SELECT * FROM topics`;
  return db.query(sqlString).then((response) => {
    return response.rows;
  });
}

function fetchArticleID(article_id) {
  let sqlString = `
    SELECT articles.article_id, articles.author, articles.title, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id
  `;
  const args = [];

  if (article_id) {
    args.push(article_id);
  }

  return db.query(sqlString, args).then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject({ message: "Not Found", status: 404 });
    }
    const article = response.rows[0];
    article.comment_count = Number(article.comment_count);
    return article;
  });
}

function fetchArticles(sort_by = "created_at", order = "DESC", topic) {
  let sortedBy = ``;
  let orderBy = ``;
  let sqlTopic = ``;

  if (topic) {
    const greenList = ["paper", "cats", "mitch"];
    if (greenList.includes(topic.toLowerCase())) {
      sqlTopic = `WHERE topic = '${topic}' `;
    } else {
      return Promise.reject({ message: "Invalid topic", status: 400 });
    }
  }

  if (sort_by) {
    const greenList = [
      "article_id",
      "title",
      "author",
      "topic",
      "created_at",
      "votes",
    ];
    if (greenList.includes(sort_by)) {
      sortedBy = `${sort_by}`;
    } else {
      return Promise.reject({ message: "Invalid sort column", status: 400 });
    }
  }

  if (order) {
    const greenList = ["ASC", "DESC"];
    if (greenList.includes(order.toUpperCase())) {
      orderBy = `${order}`;
    } else {
      return Promise.reject({ message: "Invalid order", status: 400 });
    }
  }

  let sqlString = `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id ${sqlTopic}GROUP BY articles.article_id ORDER BY articles.${sortedBy} ${orderBy};`;

  return db.query(sqlString).then((response) => {
    return response.rows;
  });
}

function fetchcommentsByArticleID(article_id) {
  let sqlString = `SELECT * FROM comments`;
  const args = [];

  if (article_id) {
    sqlString += " WHERE article_id = $1 ORDER BY created_at DESC";
    args.push(article_id);
  }

  return db.query(sqlString, args).then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject({ message: "Not Found", status: 404 });
    }
    return response.rows;
  });
}

function fetchCommentRefArticleID(username, body, article_id) {
  let sqlString = ``;
  const args = [];
  if (username && body && article_id) {
    sqlString +=
      "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;";
    args.push(username, body, article_id);
  }

  return db.query(sqlString, args).then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject({ message: "Bad Request", status: 400 });
    }
    return response.rows[0];
  });
}

function fetchPatchArticleByArticleID(inc_votes, article_id) {
  let sqlString = ``;
  const args = [];
  if (inc_votes === undefined) {
    return Promise.reject({ message: "Bad Request", status: 400 });
  }
  if (inc_votes && article_id) {
    sqlString +=
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;";
    args.push(inc_votes, article_id);
  }

  return db.query(sqlString, args).then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject({ message: "Article Not Found", status: 404 });
    }
    return response.rows[0];
  });
}

function fetchDeletedComment(comment_id) {
  let sqlString = ``;
  const args = [];
  if (comment_id) {
    sqlString += "DELETE FROM comments WHERE comment_id = $1";
    args.push(comment_id);
  }

  return db.query(sqlString, args).then((response) => {
    if (response.rowCount === 0) {
      return Promise.reject({ message: "Comment Not Found", status: 404 });
    }
  });
}

function fetchUsers() {
  let sqlString = `SELECT * FROM users`;

  return db.query(sqlString).then((response) => {
    return response.rows;
  });
}

module.exports = {
  fetchTopics,
  fetchArticleID,
  fetchArticles,
  fetchcommentsByArticleID,
  fetchCommentRefArticleID,
  fetchPatchArticleByArticleID,
  fetchDeletedComment,
  fetchUsers,
};
