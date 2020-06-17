"use strict";

var mongoose = require("mongoose");
var mongoose_paginate = require("mongoose-paginate-v2");
var Schema = mongoose.Schema;

var CommentSchema = Schema({
  content: String,
  date: { type: Date, default: Date.now },
  user: { type: Schema.ObjectId, ref: "User" },
});
var Comment = mongoose.model("Comment", CommentSchema);

var TopicSchema = Schema({
  title: String,
  content: String,
  code: String,
  lang: String,
  date: { type: Date, default: Date.now },
  user: { type: Schema.ObjectId, ref: "User" },
  comments: [CommentSchema],
});
// cargar la paginación
TopicSchema.plugin(mongoose_paginate);

module.exports = mongoose.model("Topic", TopicSchema);
