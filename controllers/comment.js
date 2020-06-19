"use strict";
var Topic = require("../models/topic");
var validator = require("validator");

var controller = {
  // inciando el método de agregar comentarios a los topics
  add: (req, res) => {
    // Recojer el id del topic por la url
    var topicId = req.params.topicId;
    // find del topic por id
    Topic.findById(topicId).exec((err, topic) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error con el adimiento del comentario",
        });
      }
      if (!topic) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró el tema",
        });
      }
      // comprobar el objeto usuario y validar los datos
      if (req.body.content) {
        try {
          var validate_content = !validator.isEmpty(req.body.content);
        } catch (e) {
          return res.status(400).send({
            status: "error",
            message: "Los datos validados son incorrectos, intentalo de nuevo",
          });
        }
        if (validate_content) {
          var comment = {
            user: req.user.sub,
            content: req.body.content,
          };
          // en la propiedad comments del objeto resultante realizar un push
          topic.comments.push(comment);

          // guardar el topic completo
          topic.save((err) => {
            if (err) {
              return res.status(500).send({
                status: "error",
                message: "Error con el adimiento del comentario",
              });
            }
            return res.status(200).send({
              status: "success",
              topic,
            });
          });
        } else {
          return res.status(200).send({
            status: "error",
            message: "No se pudieron valir los datos, intentalo de nuevo",
          });
        }
      }
    });
  },
  // finalizando el método de agregar comentarios a los topics

  // inciando el método de actualizar el comentario

  update: (req, res) => {
    // conseguir el id del comentario
    var commentId = req.params.commentId;
    // recoger los datos y validar
    var params = req.body;

    // validación de los datos
    try {
      var validate_comment = !validator.isEmpty(params.content);
    } catch (err) {
      return res.status(200).send({
        status: "error",
        message: "No se encontró el comentario a editar",
      });
    }

    if (validate_comment) {
      // find and update del subdocumenrto
      Topic.findOneAndUpdate(
        { "comments._id": commentId },
        { $set: { "comments.$.content": params.content } },
        { new: true },
        (err, topicUpdate) => {
          if (err) {
            return res.status(500).send({
              status: "error",
              message: "Error con el adimiento del comentario",
            });
          }
          if (!topicUpdate) {
            return res.status(404).send({
              status: "error",
              message: "No se encontró el tema",
            });
          }
          // devolver los datos
          return res.status(200).send({
            status: "success",
            topicUpdate,
          });
        }
      );
    }
  },
  // Finalizando el método de actualizar el comentario

  // inciando el método de eliminar el comentario
  delete: (req, res) => {
    // sacar el id del topic  del comentario a borrar
    var topicId = req.params.topicId;
    var commentId = req.params.commentId;
    // Buscar el topic
    Topic.findById(topicId, (err, topic) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error con el adimiento del comentario",
        });
      }
      if (!topic) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró el tema",
        });
      }
      //  Seleccionar el subdocumento (comentario)
      var comment = topic.comments.id(commentId);
      // borrar el comentario
      if (comment) {
        comment.remove();
        // Guardar el topic
        topic.save((err) => {
          if (err) {
            return res.status(500).send({
              message: "Erro con el topic",
            });
          }
        });
        // Devolver una respuesta
        return res.status(200).send({
          status: 'success',
          topic
        });
      } else {
        return res.status(404).send({
          status: "error",
          message: "No se encontró el comentario",
        });
      }
    });
  },
  // Finalizando el método de eliminar el comentario
};

module.exports = controller;
