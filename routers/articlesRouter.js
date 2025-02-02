const router = require("express").Router();
const {
  getArticleID,
  getArticles,
  patchArticleByArticleID,
  postArticle,
  getCommentsByArticleID,
  postCommentRefArticleID,
  deleteArticle,
} = require("../controllers");

router.delete("/:article_id", deleteArticle);

router.get("/:article_id", getArticleID);

router.get("/", getArticles);

router.patch("/:article_id", patchArticleByArticleID);

router.post("/", postArticle);

router.get("/:article_id/comments", getCommentsByArticleID);

router.post("/:article_id/comments", postCommentRefArticleID);

module.exports = router;
