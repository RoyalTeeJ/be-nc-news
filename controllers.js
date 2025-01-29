const {
  fetchTopics,
  fetchArticleID,
  fetchArticles,
  fetchcommentsByArticleID,
  fetchCommentRefArticleID,
  fetchPatchArticleByArticleID,
  fetchDeletedComment,
  fetchUsers,
} = require("./models");

function getTopics(request, response, next) {
  fetchTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch(next);
}

function getArticleID(request, response, next) {
  const { article_id } = request.params;
  fetchArticleID(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
}

function getArticles(request, response, next) {
  const { sort_by, order, topic } = request.query;
  fetchArticles(sort_by, order, topic)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
}

function getCommentsByArticleID(request, response, next) {
  const { article_id } = request.params;
  fetchcommentsByArticleID(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch(next);
}

function postCommentRefArticleID(request, response, next) {
  const { article_id } = request.params;
  const { username, body } = request.body;

  fetchCommentRefArticleID(username, body, article_id)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch(next);
}

function patchArticleByArticleID(request, response, next) {
  const { article_id } = request.params;
  const { inc_votes } = request.body;

  fetchPatchArticleByArticleID(inc_votes, article_id)
    .then((addedVotes) => {
      response.status(200).send({ addedVotes });
    })
    .catch(next);
}

function deleteCommentByCommentID(request, response, next) {
  const { comment_id } = request.params;

  fetchDeletedComment(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch(next);
}

function getUsers(request, response, next) {
  fetchUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch(next);
}

module.exports = {
  getTopics,
  getArticleID,
  getArticles,
  getCommentsByArticleID,
  postCommentRefArticleID,
  patchArticleByArticleID,
  deleteCommentByCommentID,
  getUsers,
};
