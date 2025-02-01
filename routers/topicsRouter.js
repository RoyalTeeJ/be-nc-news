const router = require("express").Router();
const { getTopics } = require("../controllers");

router.get("/", getTopics);

module.exports = router;
