const Sequelize = require('sequelize');

const Database = require('../Structures/PostgreSQL');

const Merits = Database.db.define('Merits', {
    meritID: Sequelize.STRING,
    userID: Sequelize.STRING,
    guildID: Sequelize.STRING,
    meritBy: Sequelize.STRING,
    meritMessage: Sequelize.STRING
});

Merits.sync();

module.exports = Merits;