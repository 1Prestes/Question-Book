const sequelize = require('sequelize');
const connection = require('../config/database');

const resposta = connection.define('respostas', {
    corpo: {
        type: sequelize.TEXT,
        allowNull: false,
    },
    perguntaId: {
        type: sequelize.INTEGER,
        allowNull: false,
    }
});

resposta.sync({force: false});

module.exports = resposta;