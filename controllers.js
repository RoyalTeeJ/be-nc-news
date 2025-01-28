const { fetchTopics, fetchArticleID, fetchArticles } = require("./models");

function getTopics(request, response, next) {
  fetchTopics()
    .then((topics) => {
      response.status(200).send(topics);
    })
    .catch(next);
}

function getArticleID(request, response, next) {
  const { article_id } = request.params;
  fetchArticleID(article_id)
    .then((article) => {
      response.status(200).send(article);
    })
    .catch(next);
}

function getArticles(request, response, next) {
  fetchArticles().then((article) => {
    response.status(200).send(article);
  });
}

module.exports = { getTopics, getArticleID, getArticles };
