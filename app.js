"use strict";

// Requires
var express = require("express");
var bodyParser = require("body-parser");

// Ejecutar express
var app = express();
// Cargar archivos de las rutas
var user_routes = require("./routes/user");
var topic_routes = require("./routes/topic");

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS

// Reescribir rutas
app.use("/api", user_routes);
app.use("/api", topic_routes);
// Realizar ruta de prueba
app.get("/prueba", (req, res) => {
  return res.status(201).send("Prueba realizada exitosamete");
});

// Exportar el modulo
module.exports = app;
