"use strict";

var express = require("express");
var CommentController = require("../controllers/comment");

var router = express.Router();
var md_auth = require("../middlewares/authenticated");

router.post("/comment/topic/:topicId", md_auth.auth, CommentController.add);
router.put("/comment/:commentId", md_auth.auth, CommentController.update);
router.delete("/comment/:topicId/:commentId", md_auth.auth, CommentController.delete);

module.exports = router;
