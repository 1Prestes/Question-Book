const sequelize = require('sequelize');

// Entre com seu usuario e senha do MySql
const connection = new sequelize('guiaperguntas', '<USER>', '<PASSWORD>', {
    dialect: 'mysql'
});

module.exports = connection;
