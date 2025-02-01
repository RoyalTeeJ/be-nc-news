const router = require("express").Router();
const {
  getCommentsByArticleID,
  postCommentRefArticleID,
  deleteCommentByCommentID,
} = require("../controllers");

router.get("/:article_id/comments", getCommentsByArticleID);

router.post("/:article_id/comments", postCommentRefArticleID);

router.delete("/comments/:comment_id", deleteCommentByCommentID);

module.exports = router;
