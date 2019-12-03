const express = require('express');
const routes = express.Router();
const questionController = require('./controllers/question.controller');

routes.get('/', questionController.index);
routes.get('/perguntar', questionController.ask);
routes.post('/salvarpergunta', questionController.create);
routes.post('/responder', questionController.reply);
routes.get('/pergunta/:id', questionController.show);

module.exports = routes;
