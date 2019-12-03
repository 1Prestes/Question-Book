const sequelize = require('sequelize');
const connection = require('../config/database');

const pergunta = connection.define('perguntas', {
    titulo: {
        type: sequelize.STRING,
        allowNull: false,
    },
    pergunta: {
        type: sequelize.TEXT,
        allowNull: false,
    },
});

pergunta.sync({ force: false }).then(() => { });

module.exports = pergunta;