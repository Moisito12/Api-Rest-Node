"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var port = process.env.PORT || 3999;

mongoose.Promise = global.Promise;
mongoose.set("useFindAndModify", false);
const mongoUri = "mongodb://localhost:27017/api_rest_node";
if (!mongoUri) {
  throw new Error(`Mongo was not supplied make sure the database is on`);
}
mongoose
  .connect(mongoUri, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("Conexion succesfully");
    app.listen(port, () => {
      console.log("the server  localhost:3999 is on!!");
    });
  })
  .catch((error) => console.log(error));
