const express = require('express');
const bodyParser = require('body-parser');

const connection = require('./config/database');
const modelPergunta = require('./models/Pergunta');
const ModelResposta = require('./models/Resposta');
const app = express();

connection
    .authenticate()
    .then(() => {
        console.log('Conectado com o banco de dados');
    }).catch(err => {
        console.error('Falha ao se conectar com o banco de dados ERROR: ' + err);
    });

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
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
});

app.get('/perguntar', (req, res) => {
    res.render('perguntar');
});

app.post('/salvarpergunta', (req, res) => {
    const titulo = req.body.titulo;
    const pergunta = req.body.pergunta;
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
});

app.post('/responder', (req, res) => {
    const id = req.body.id;
    const corpo = req.body.corpo;
    if (!corpo) return res.redirect(`/pergunta/${id}`);;
    ModelResposta.create({
        corpo: corpo,
        perguntaId: id,
    })
        .then(() => {
            return res.redirect(`/pergunta/${id}`);
        })
        .catch(err => {
            return console.error(`DEU RUIM EM RESPONDER! ERROR: ${err}`);
        });
});

app.get('/pergunta/:id', (req, res) => {
    const id = req.params.id;

    modelPergunta.findOne({
        where: {
            id: id,
        }
    })
        .then(pergunta => {
            if (pergunta != undefined) {
                ModelResposta.findAll({
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
            console.error('DEU RUIM NA PESQUISA! ERROR: ' + err)
        })

});


app.listen(3000, function () {
    console.log('Server RUNNING');
});
