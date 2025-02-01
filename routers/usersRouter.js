const router = require("express").Router();
const { getUsers, getUsersByUsername } = require("../controllers");

router.get("/", getUsers);

router.get("/:username", getUsersByUsername);

module.exports = router;
