"use strict";

// Requires
var express = require("express");
var bodyParser = require("body-parser");

// Ejecutar express
var app = express();
// Cargar archivos de las rutas
var user_routes = require("./routes/user");
var topic_routes = require("./routes/topic");
var comment_routes = require("./routes/comment");

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
// Reescribir rutas
app.use("/api", user_routes);
app.use("/api", topic_routes);
app.use("/api", comment_routes);
// Realizar ruta de prueba
app.get("/prueba", (req, res) => {
  return res.status(201).send("Prueba realizada exitosamete");
});

// Exportar el modulo
module.exports = app;
