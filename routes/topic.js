"use strict";

var express = require("express");
var TopicController = require("../controllers/topic");
var router = express.Router();
var md_auth = require("../middlewares/authenticated");

router.get("/testTopic", TopicController.test);
router.post("/new-topics", md_auth.auth,TopicController.save);
router.get("/topics/:pages?", TopicController.getTopics);

module.exports = router;