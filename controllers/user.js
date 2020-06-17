"use strict";

var validator = require("validator");
var bcrypt = require("bcrypt-nodejs");
var User = require("../models/user");
var fs = require("fs");
var path = require("path");
var jwt = require("../services/jwt");

var controller = {
  probando: function (req, res) {
    return res.status(201).send({
      message: "Soy el método probando",
    });
  },

  testeando: function (req, res) {
    return res.status(201).send({
      message: "Soy el método de test",
    });
  },

  // iniciando la función de registro de usuarios
  register: function (req, res) {
    // Recojer los parámetros por la petición
    var params = req.body;

    // Realizar las validaciones
    try {
      var validate_name = !validator.isEmpty(params.name);
      var validate_surname = !validator.isEmpty(params.surname);
      var validate_email =
        !validator.isEmpty(params.email) && validator.isEmail(params.email);
      var validate_password = !validator.isEmpty(params.password);
    } catch (e) {
      return res.send(404).send({
        message: "Faltan datos por enviar, intenta de nuevo",
      });
    }

    if (
      validate_name &&
      validate_surname &&
      validate_email &&
      validate_password
    ) {
      // Crear el objeto de usuario
      var user = new User();

      // Asignar los valores al objeto
      user.name = params.name;
      user.surname = params.surname;
      user.email = params.email;
      user.image = null;
      user.role = "ROLE_USER";
      user.password = params.password;

      // Comprobar si el usuario solicitado existe
      User.findOne({ email: user.email }, (err, issetUser) => {
        if (err) {
          return res.status(500).send({
            message: "Error al comprobar la duplicidad de usuario",
          });
        }
        if (!issetUser) {
          // Cifrar la contraseña
          bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;
            // Guardar usuario
            user.save((err, userStored) => {
              if (err) {
                return res.status(500).send({
                  message: "Error al guardar el usuario",
                });
              }
              if (!userStored) {
                return res.status(500).send({
                  message: "El usuario no se ha guardado",
                });
              }
              // Devolver una respuesta
              return res
                .status(400)
                .send({ status: "succes", user: userStored });
            }); // close save
          }); // close bcrypt
        } else {
          return res.status(500).send({
            message: "el usuario ya está registrado",
          });
        }
      });
    } else {
      return res.status(500).send({
        message: "La validación de datos es incorrecta, intentelo de nuevo",
      });
    }
  },
  // finalizando la función de registro de usuario

  // Inciando el método de logueo de usuarios
  login: function (req, res) {
    // Recojer los datos por el parámetro
    var params = req.body;

    // Validar los datos
    try {
      var validator_name =
        !validator.isEmpty(params.email) && validator.isEmail(params.email);
      var validator_password = !validator.isEmpty(params.password);
    } catch (e) {
      return res.status(404).send({
        message: "Faltan datos por enviar",
      });
    }

    if (!validator_name || !validator_password) {
      return res.status(500).send({
        message: "Los datos no son correctos, mandalos de nuevo",
      });
    }
    // Buscar el email que coincida en la bd
    User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "Error al intentar realizar el registro" });
      }

      if (!user) {
        return res.status(500).send({ message: "El usuario no existe" });
      }
      // Comprobar la contraseña y el email
      bcrypt.compare(params.password, user.password, (err, check) => {
        if (check) {
          // Generar el token y devolverlo
          if (params.gettoken) {
            return res.status(200).send({
              token: jwt.createTokebn(user),
            });
          } else {
            // limpiar los datos del usuario
            user.password = undefined;

            // Devolver los datos
            return res.status(200).send({
              message: "success",
              user,
            });
          }
        } else {
          return res.status(500).send({
            message: "Las credenciales no son correctas, intentalo de nuevo",
          });
        }
      });
    });
  },
  // Finalizando el método de logueo de usuarios

  // iniciando el método de actualización de usuarios
  update: function (req, res) {
    // Recojer los datos del usuario
    var params = req.body;

    // Validar los datos
    try {
      var validate_name = !validator.isEmpty(params.name);
      var validate_surname = !validator.isEmpty(params.surname);
      var validate_email =
        !validator.isEmpty(params.email) && validator.isEmail(params.email);
    } catch (e) {
      return res.status(200).send({
        message: "Faltan datos para enviar",
      });
    }

    // eliminar las propiedades innecesarias
    delete params.password;
    var userId = req.user.sub;

    // Comprobar si el email es único
    if (req.user.email != params.email) {
      User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "Error al intentar realizar el registro" });
        }
        if (user && user.email == params.email) {
          return res
            .status(200)
            .send({ message: "El email no pudo ser modificado" });
        }
      });
    }

    // Buscar y actualizar el documento
    User.findOneAndUpdate(
      { _id: userId },
      params,
      { new: true },
      (err, userUpdated) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Error con la actualización del usuario",
          });
        }
        if (!userUpdated) {
          return res.status(500).send({
            message: "error",
            message: "No se pudo actualizar el  usuario",
          });
        }
        return res.status(200).send({
          status: "success",
          user: userUpdated,
        });
      }
    );
  }, // fin del método actualización

  // Iniciar el método para subir un avatar
  uploadAvatar: (req, res) => {
    // configurar modulo multiparty  => routes/user.js

    // Recojer el fichero de la petición
    var file_name = "Archivo no recojido";
    if (!req.files) {
      return res.status(500).send({
        message: "Es necesario mandar la imagen",
      });
    }
    // Conseguir el nombre y la extensión del arhivo
    var file_path = req.files.file0.path;
    var file_split = file_path.split("\\");
    var file_name = file_split[2];

    // Extensión del archivo
    var ext_split = file_name.split(".");
    var file_ext = ext_split[1];

    // comprobar la extensión sólo imágenes, si no es válida se elimina el fichero
    if (
      file_ext != "png" &&
      file_ext != "jpg" &&
      file_ext != "jpeg" &&
      file_ext != "gif"
    ) {
      fs.unlink(file_path, (err) => {
        // Devolve una respuesta
        return res.status(200).send({
          status: "error",
          message: "La extensión del archivo no es válida.",
        });
      });
    } else {
      // Sacar el id del usuario identificado
      var userId = req.user.sub;

      // Buscar y actualizar documento
      User.findOneAndUpdate(
        { _id: userId },
        { image: file_name },
        { new: true },
        (err, userUpdated) => {
          if (err || !userUpdated) {
            // Devolve una respuesta
            return res.status(500).send({
              status: "error",
              message: "Error al cargar la imagen",
            });
          }
          // Devolve una respuesta
          return res.status(200).send({
            status: "success",
            user: userUpdated,
          });
        }
      );
    }
  },
  // finalizando el método para subir un avatar

  // iniciando el método de devolver avatar
  getAvatar: (req, res) => {
    var fileName = req.params.fileName;
    var pathFile = "./uploads/user/" + fileName;
    fs.exists(pathFile, (exists) => {
      if (exists) {
        return res.sendFile(path.resolve(pathFile));
      } else {
        return res.status(404).send({
          status: "error",
          message: "Error al obtener la imagen",
        });
      }
    });
  },
  // finalizando el método de devolver avatar
};

module.exports = controller;
