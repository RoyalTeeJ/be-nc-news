const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const topicsRouter = require("./routers/topicsRouter");
const articlesRouter = require("./routers/articlesRouter");
const commentsRouter = require("./routers/commentsRouter");
const usersRouter = require("./routers/usersRouter");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use("/api/topics", topicsRouter);

app.use("/api/articles", articlesRouter);

app.use("/api/comments", commentsRouter);

app.use("/api/users", usersRouter);

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints });
});

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
