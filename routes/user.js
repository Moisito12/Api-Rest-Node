"use strict";

var express = require("express");
var UserController = require("../controllers/user");

var router = express.Router();

// Rutas de test
router.get("/probando", UserController.probando);
router.get("/testeando", UserController.testeando);


// Rutas de usuarios
router.post("/register", UserController.register);
router.post("/login", UserController.login);


module.exports = router;
