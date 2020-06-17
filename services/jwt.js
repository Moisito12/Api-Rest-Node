"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
const { unix } = require("moment");

exports.createTokebn = function (user) {
  var payload = {
    sub: user._id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: moment().unix(),
    exp: moment().add(30, "days").unix,
  };

  return jwt.encode(payload, "clave_para_generacion_de_tokens");
};