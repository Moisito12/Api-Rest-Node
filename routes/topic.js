"use strict";

var express = require("express");
var TopicController = require("../controllers/topic");
var router = express.Router();
var md_auth = require("../middlewares/authenticated");

router.get("/testTopic", TopicController.test);
router.post("/new-topics", md_auth.auth, TopicController.save);
router.get("/topics/:pages?", TopicController.getTopics);
router.get("/myTopics/:user?", TopicController.getMyTopicsByUser);
router.get("/getTopic/:id", TopicController.getTopic);
router.put("/topic/:id?", md_auth.auth, TopicController.update);
router.delete("/topic/:id?", md_auth.auth, TopicController.deletePost);
module.exports = router;
