const router = require("express").Router();
const { getTopics, postTopics } = require("../controllers");

router.get("/", getTopics);

router.post("/", postTopics);

module.exports = router;
