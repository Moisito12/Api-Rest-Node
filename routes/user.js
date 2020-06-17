"use strict";

var express = require("express");
var UserController = require("../controllers/user");

var router = express.Router();
var md_auth = require("../middlewares/authenticated");

// Rutas de test
router.get("/probando", UserController.probando);
router.get("/testeando", UserController.testeando);

// Rutas de usuarios
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.put("/update", md_auth.auth, UserController.update);
router.post("/uploadAvatar/id",md_auth.auth, UserController.uploadAvatar);

module.exports = router;
