"use strict";

var express = require("express");
var UserController = require("../controllers/user");

var router = express.Router();
var md_auth = require("../middlewares/authenticated");

// Configuración del módulo multipart para la subida de imágenes
var multipart = require("connect-multiparty");
var md_upload = multipart({ uploadDir: "./uploads/user" });

// Rutas de test
router.get("/probando", UserController.probando);
router.get("/testeando", UserController.testeando);

// Rutas de usuarios
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.put("/update", md_auth.auth, UserController.update);
router.post(
  "/uploadAvatar",
  [md_auth.auth, md_upload],
  UserController.uploadAvatar
);
router.get("/getAvatar/:fileName", UserController.getAvatar);
module.exports = router;
