const router = require("express").Router();
const {
  getArticleID,
  getArticles,
  patchArticleByArticleID,
} = require("../controllers");

router.get("/:article_id", getArticleID);

router.get("/", getArticles);

router.patch("/:article_id", patchArticleByArticleID);

module.exports = router;
