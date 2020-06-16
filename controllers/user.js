"use strict";

var validator = require("validator");
var bcrypt = require("bcrypt-nodejs");
var User = require("../models/user");
const { param } = require("../routes/user");

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
    var validate_name = !validator.isEmpty(params.name);
    var validate_surname = !validator.isEmpty(params.surname);
    var validate_email =
      !validator.isEmpty(params.email) && validator.isEmail(params.email);
    var validate_password = !validator.isEmpty(params.password);

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
    var validator_name =
      !validator.isEmpty(params.email) && validator.isEmail(params.email);
    var validator_password = !validator.isEmpty(params.password);

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

          // Devolver los datos
          return res.status(200).send({
            message: "success",
            user,
          });
        } else {
          return res.status(500).send({
            message: 'Las credenciales no son correctas, intentalo de nuevo'
          });
        }
      });
    });
  },

  // Finalizando el método de logueo de usuarios
};

module.exports = controller;
