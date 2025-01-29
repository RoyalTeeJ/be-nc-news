const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const {
  getTopics,
  getArticleID,
  getArticles,
  getCommentsByArticleID,
  postCommentRefArticleID,
} = require("./controllers");

app.use(express.json());

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleID);
app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleID);
app.post("/api/articles/:article_id/comments", postCommentRefArticleID);

app.all("*", (request, response) => {
  response.status(404).send({ error: "Endpoint not found" });
});

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ message: "Bad Request" });
  } else if (err.code === "23503") {
    response.status(404).send({ message: "Not Found" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  const { message, status } = err;
  if (message && status) {
    response.status(status).send({ message });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err) {
    console.log(err, "<<<<<this error has not been handled");
    response.status(500).send({
      message: "Internal Server Error",
    });
  }
});

module.exports = app;
