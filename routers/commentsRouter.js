const router = require("express").Router();
const {
  deleteCommentByCommentID,
  patchCommentByCommentID,
} = require("../controllers");

router.delete("/:comment_id", deleteCommentByCommentID);

router.patch("/:comment_id", patchCommentByCommentID);

module.exports = router;
