const router = require("express").Router();
const {
  getCommentsByArticleID,
  postCommentRefArticleID,
  deleteCommentByCommentID,
  patchCommentByCommentID,
} = require("../controllers");

router.get("/:article_id/comments", getCommentsByArticleID);

router.post("/:article_id/comments", postCommentRefArticleID);

router.delete("/:comment_id", deleteCommentByCommentID);

router.patch("/:comment_id", patchCommentByCommentID);

module.exports = router;
