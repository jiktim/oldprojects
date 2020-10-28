const Sequelize = require('sequelize');

const Database = require('../Structures/PostgreSQL');

const Strike = Database.db.define('Strike', {
    strikeID: Sequelize.STRING,
    userID: Sequelize.STRING,
    guildID: Sequelize.STRING,
    strikeBy: Sequelize.STRING,
    strikeMessage: Sequelize.STRING
});

Strike.sync();

module.exports = Strike;