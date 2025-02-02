const router = require("express").Router();
const {
  getCommentsByArticleID,
  postCommentRefArticleID,
  deleteCommentByCommentID,
  patchCommentByCommentID,
} = require("../controllers");

router.delete("/:comment_id", deleteCommentByCommentID);

router.patch("/:comment_id", patchCommentByCommentID);

module.exports = router;
