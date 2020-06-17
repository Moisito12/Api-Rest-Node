"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "clave_para_generacion_de_tokens";
exports.auth = function (req, res, next) {
  // Comprobar si llega la autentificación
  if (!req.headers.authorization) {
    return res.status(201).send({
      message: "La petición no tiene cabecera",
    });
  }
  // Limpiar el token y quitar comillas
  var token = req.headers.authorization.replace(/['"]+g/, "");
  try {
    // Decodificar el token
    var payload = jwt.decode(token, secret);

    // Comprobar si el token ha expirado
    if (payload.exp <= moment().unix()) {
      return res.status(404).send({
        message: "El token no es válido",
      });
    }
  } catch (e) {
    return res.status(404).send({
      message: "El token no es válido",
    });
  }
  // Adjuntar usuario identificado a request
  req.user = payload;
  // Pasar a la acción
  next();
};
