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
  getMyTopicsByUser: (req, res) => {
    // Conseguir el id del usuario
    var userId = req.params.user;

    // Find con una condición de usuario
    Topic.find({ user: userId })
      .sort([["date", "descending"]])
      .exec((err, topics) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Error en los topics por usuario",
          });
        }
        if (topics == "") {
          return res.status(404).send({
            status: "error",
            message: "No se recibieron los topics",
          });
        }
        return res.status(200).send({
          status: "success",
          topics,
        });
      });
  },
  // finalizando el método get my topics

  // iniciando el método del detalle del topic
  getTopic: (req, res) => {
    // saca el id del topic por la url
    var topicId = req.params.id;
    // find del topic por id
    Topic.findById(topicId)
      .populate("user")
      .exec((err, topic) => {
        if (err) {
          return res.status(505).send({
            status: "error",
            message: "error al conseguir los topic",
          });
        }
        if (topic == "") {
          return res.status(404).send({
            status: "error",
            message: "No se encontraron los posts solicitados",
          });
        }
        return res.status(404).send({
          status: "success",
          topic,
        });
      });
  },
  // finalizando el método del detalle del topic

  // iniciando el método de actualización de topics
  update: (req, res) => {
    //  recojer el id del topic
    var topicId = req.params.id;
    // recojer los datos que llegan del post
    var params = req.body;
    // validar los datos
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
      var validate_lang = !validator.isEmpty(params.lang);
    } catch (e) {
      return res.status(200).send({
        status: "error",
        message: "No se mandaron los datos correctos intenta de nuevo",
      });
    }
    if (validate_title && validate_content && validate_lang) {
      // montar un json con los datos modificables
      var update = {
        title: params.title,
        content: params.content,
        lang: params.lang,
      };
      // find and update del topic por id y por un usuario id
      Topic.findOneAndUpdate(
        { _id: topicId, user: req.user.sub },
        update,
        { new: true },
        (err, updateTopic) => {
          if (err) {
            return res.status(500).send({
              status: "error",
              message: "Error en la petición de actualización",
            });
          }
          if (!updateTopic) {
            return res.status(404).send({
              status: "error",
              message: "No se encontró el topic a editar",
            });
          }
          // Devolver una respuesta
          return res.status(200).send({
            status: "success",
            topic: updateTopic,
          });
        }
      );
    } else {
      return res.status(200).send({
        status: "error",
        message: "Los datos no son correctos intenta de nuevo",
      });
    }
  },
  // finalizando el método de actualización de topics

  // iniciando el método de eliminar los topics
  deletePost: (req, res) => {
    // sacar el id de la topic por el url
    var topicId = req.params.id;
    // find and delete por topicId y por userId
    Topic.findOneAndDelete(
      { _id: topicId, user: req.user.sub },
      (err, topicRemove) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Se presentó erro al eliminar el topic",
          });
        }
        if (!topicRemove) {
          return res.status(404).send({
            status: "error",
            message: "No se encontró el topic a eliminar",
          });
        }
        // devolver una respuesta
        return res.status(200).send({
          status: "success",
          topic: topicRemove,
        });
      }
    );
  },
  // finalizando el método de eliminar los topics

  // Inciando el método de búsqueda de topics
  search: (req, res) => {
    // sacar el string a buscar por la url
    var searchString = req.params.search;

    // find or
    Topic.find({
      $or: [
        { title: { $regex: searchString, $options: "i" } },
        { content: { $regex: searchString, $options: "i" } },
        { code: { $regex: searchString, $options: "i" } },
        { lang: { $regex: searchString, $options: "i" } },
      ],
    }).exec((err, topics) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error al recibir los docs",
        });
      }
      if (!topics) {
        return res.status(404).send({
          status: "error",
          message: "0 resultados en la búsqueda",
        });
      }
      return res.status(400).send({
        status: "success",
        topics,
      });
    });
  },
  // finalizando el método de búsqueda de topics
};

module.exports = controller;
