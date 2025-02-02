const {
  fetchTopics,
  fetchArticleID,
  fetchArticles,
  fetchcommentsByArticleID,
  fetchCommentRefArticleID,
  fetchPatchArticleByArticleID,
  fetchDeletedComment,
  fetchUsers,
  fetchUsersByUsername,
  fetchPatchCommentByCommentID,
  fetchPostArticle,
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
  const { sort_by, order, topic, limit, page } = request.query;
  fetchArticles(sort_by, order, topic, limit, page)
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

function getUsersByUsername(request, response, next) {
  const { username } = request.params;
  fetchUsersByUsername(username)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch(next);
}

function patchCommentByCommentID(request, response, next) {
  const { inc_votes } = request.body;
  const { comment_id } = request.params;
  fetchPatchCommentByCommentID(inc_votes, comment_id)
    .then((comment) => {
      response.status(200).send({ comment });
    })
    .catch(next);
}

function postArticle(request, response, next) {
  const { author, title, body, topic, article_img_url } = request.body;
  fetchPostArticle(author, title, body, topic, article_img_url)
    .then((article) => {
      response.status(201).send({ article });
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
  getUsersByUsername,
  patchCommentByCommentID,
  postArticle,
};
