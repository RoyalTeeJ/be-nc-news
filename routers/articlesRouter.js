const router = require("express").Router();
const {
  getArticleID,
  getArticles,
  patchArticleByArticleID,
  postArticle,
} = require("../controllers");

router.get("/:article_id", getArticleID);

router.get("/", getArticles);

router.patch("/:article_id", patchArticleByArticleID);

router.post("/", postArticle);

module.exports = router;
