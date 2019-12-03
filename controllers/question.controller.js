const sequelize = require('sequelize');
const modelPergunta = require('../models/Pergunta');
const modelResposta = require('../models/Resposta');

module.exports = {
  index(req, res) {
    modelPergunta.findAll({
      raw: true, order: [['createdAt', 'DESC']]
    })
      .then(perguntas => {
        res.render('index', {
          perguntas: perguntas,
        });
      })
      .catch(err => {
        console.error('DEU RUIM NA CONSUlTA AO BANCO ERROR: ' + err);
      });
  },

  ask(req, res) {
    res.render('perguntar');
  },

  create(req, res) {
    const titulo = req.body.titulo;
    const pergunta = req.body.pergunta;
    if (!titulo || !pergunta) return res.render('perguntar');

    modelPergunta.create({
      titulo: titulo,
      pergunta: pergunta,
    })
      .then(() => {
        return res.redirect('/');
      })
      .catch(err => {
        return console.error('DEU RUIM NO BANCO DE DADOS ERROR: ' + err);
      });
  },

  reply(req, res) {
    const id = req.body.id;
    const corpo = req.body.corpo;
    if (!corpo) return res.redirect(`/pergunta/${id}`);
    modelResposta.create({
      corpo: corpo,
      perguntaId: id,
    })
      .then(() => {
        return res.redirect(`/pergunta/${id}`);
      })
      .catch(err => {
        return console.error(`DEU RUIM EM RESPONDER! ERROR: ${err}`);
      });
  },

  show(req, res) {
    const id = req.params.id;

    modelPergunta.findOne({
      where: {
        id: id,
      }
    })
      .then(pergunta => {
        if (pergunta != undefined) {
          modelResposta.findAll({
            where: { perguntaId: pergunta.id, },
            order: [['createdAt', 'DESC']],
          })
            .then(respostas => {
              res.render('pergunta', { pergunta, respostas });
            })
            .catch(err => {
              console.error('DEU RUIM EM RESPOSTAS! ERROR: ' + err);
            });

        } else {
          res.redirect('/');
        }
      })
      .catch(err => {
        console.error('DEU RUIM NA PESQUISA! ERROR: ' + err);
      });
  },

};