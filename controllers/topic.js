"use strict";

var validator = require("validator");
var Topic = require("../models/topic");
const topic = require("../models/topic");

var controller = {
  test: (req, res) => {
    return res.status(200).send({
      message: "Método de test de controlador de topics",
    });
  },

  // metodo para salvar un nuevo topic
  save: (req, res) => {
    //  recoger parametros
    var params = req.body;
    // validar datos
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
      var validate_lang = !validator.isEmpty(params.lang);
    } catch (e) {
      return res.status(500).send({
        message: "Faltan datos por enviar",
      });
    }

    if (validate_title && validate_content && validate_lang) {
      // crear objeto para guardar
      var topic = new Topic();
      // asignar valores
      topic.title = params.title;
      topic.content = params.content;
      topic.code = params.code;
      topic.lang = params.lang;
      topic.user = req.user.sub;
      // guardar el topic
      topic.save((err, topicStored) => {
        if (err || !topicStored) {
          return res.status(404).send({
            status: "success",
            message: "el tema no se pudo guardar",
          });
        }
        // devolver una respuesta
        return res.status(200).send({
          status: "success",
          topic: topicStored,
        });
      });
    } else {
      return res.status(200).send({
        status: "error",
        message: "Los datos son inválidos, mandalos de nuevo",
      });
    }
  }, // finalizando metodo para salvar un nuevo topic

  // inciando metodo para sacar los topics
  getTopics: (req, res) => {
    //   cargar la libreria de la clase

    // recoger la pagina actual
    if (
      !req.params.pages ||
      req.params.pages == 0 ||
      req.params.pages == undefined ||
      req.params.pages == "0" ||
      req.params.pages == 0
    ) {
      var page = 1;
    } else {
      var page = req.params.pages;
    }
    // indicar en las opciones de paginacion
    var options = {
      sort: { date: -1 },
      populate: "user",
      limit: 5,
      page: page,
    };

    // find paginado
    Topic.paginate({}, options, (err, topics) => {
      if (err) {
        return res.status(200).send({
          status: "error",
          message: "Error al recibir los docs",
        });
      }
      if (!topics) {
        return res.status(200).send({
          status: "error",
          message: "No se recibieron los topics",
        });
      }
      return res.status(200).send({
        status: "success",
        topics: topics.docs,
        totalDocs: topics.totalDocs,
        totalPages: topics.totalPages,
      });
    });
  },
  //finalizando metodo para sacar los topics

  // iniciando el método get my topics
  getMyTopics: (req, res) => {
    return res.status(200).send({
      message: 'Método de mis topics'
    })
  }
  // finalizando el método get my topics
};

module.exports = controller;
