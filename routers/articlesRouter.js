const router = require("express").Router();
const {
  getArticleID,
  getArticles,
  patchArticleByArticleID,
  postArticle,
  getCommentsByArticleID,
  postCommentRefArticleID,
} = require("../controllers");

router.get("/:article_id", getArticleID);

router.get("/", getArticles);

router.patch("/:article_id", patchArticleByArticleID);

router.post("/", postArticle);

router.get("/:article_id/comments", getCommentsByArticleID);

router.post("/:article_id/comments", postCommentRefArticleID);

module.exports = router;
